-- Create Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id                  SERIAL PRIMARY KEY,
  title               TEXT NOT NULL,
  description         TEXT NOT NULL,
  organization        TEXT,
  award_date          DATE NOT NULL,
  expiry_date         DATE,
  award_url           TEXT,
  image_url           TEXT,
  achievement_type    TEXT NOT NULL,
  location            TEXT,
  is_featured         BOOLEAN DEFAULT FALSE,
  tags                TEXT[],
  order_index         INTEGER DEFAULT 0,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Create trigger for updated_at timestamp
CREATE TRIGGER update_achievements_updated_at
BEFORE UPDATE ON achievements
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Create vector index for achievements if vector extension exists
DO $vector_setup$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_extension WHERE extname = 'vector'
  ) THEN
    -- Create a function to update achievement vector embeddings
    CREATE OR REPLACE FUNCTION update_achievement_embedding()
    RETURNS TRIGGER AS $$
    DECLARE
      embedding_text TEXT;
      vector_id TEXT;
    BEGIN
      -- Combine relevant fields for embedding
      embedding_text := NEW.title || ' ' || NEW.description || ' ' || 
                       COALESCE(NEW.organization, '') || ' ' || 
                       COALESCE(NEW.achievement_type, '') || ' ' ||
                       COALESCE(array_to_string(NEW.tags, ' '), '');
      
      -- Create a unique ID for the vector store
      vector_id := 'achievement_' || NEW.id::TEXT;
      
      -- Check if record exists in vector_store
      IF EXISTS (SELECT 1 FROM vector_store WHERE id = vector_id) THEN
        -- Update existing vector
        UPDATE vector_store
        SET 
          content = embedding_text,
          metadata = jsonb_build_object(
            'id', NEW.id,
            'title', NEW.title,
            'type', 'achievement',
            'date', NEW.award_date
          ),
          updated_at = NOW()
        WHERE id = vector_id;
      ELSE
        -- Insert new vector (actual embedding will be added by external process)
        INSERT INTO vector_store (
          id, content, metadata, created_at, updated_at
        ) VALUES (
          vector_id,
          embedding_text,
          jsonb_build_object(
            'id', NEW.id,
            'title', NEW.title,
            'type', 'achievement',
            'date', NEW.award_date
          ),
          NOW(), NOW()
        );
      END IF;
      
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    -- Create trigger to update vector store on achievement changes
    CREATE TRIGGER achievements_vector_update
    AFTER INSERT OR UPDATE ON achievements
    FOR EACH ROW
    EXECUTE FUNCTION update_achievement_embedding();
    
    -- Delete vector when achievement is deleted
    CREATE OR REPLACE FUNCTION delete_achievement_embedding()
    RETURNS TRIGGER AS $$
    BEGIN
      DELETE FROM vector_store
      WHERE id = 'achievement_' || OLD.id::TEXT;
      RETURN OLD;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER achievements_vector_delete
    AFTER DELETE ON achievements
    FOR EACH ROW
    EXECUTE FUNCTION delete_achievement_embedding();
  END IF;
END
$vector_setup$;

-- Create indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_achievements_award_date ON achievements(award_date DESC);
CREATE INDEX IF NOT EXISTS idx_achievements_achievement_type ON achievements(achievement_type);
CREATE INDEX IF NOT EXISTS idx_achievements_is_featured ON achievements(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_achievements_order_index ON achievements(order_index);

-- Create GIN index for tag search
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_achievements_tags ON achievements USING GIN(tags);

-- Create composite index for filtering by type and date
CREATE INDEX IF NOT EXISTS idx_achievements_type_date ON achievements(achievement_type, award_date DESC);

-- Add function to create achievement with tags
CREATE OR REPLACE FUNCTION create_achievement(
  p_title TEXT,
  p_description TEXT,
  p_organization TEXT,
  p_award_date DATE,
  p_achievement_type TEXT,
  p_tags TEXT[] DEFAULT NULL,
  p_is_featured BOOLEAN DEFAULT FALSE
) RETURNS JSONB AS $$
DECLARE
  achievement_id INTEGER;
BEGIN
  INSERT INTO achievements (
    title, description, organization, 
    award_date, achievement_type, tags, is_featured
  )
  VALUES (
    p_title, p_description, p_organization,
    p_award_date, p_achievement_type, p_tags, p_is_featured
  )
  RETURNING id INTO achievement_id;
  
  RETURN jsonb_build_object(
    'success', TRUE,
    'achievement_id', achievement_id,
    'message', 'Achievement created successfully'
  );
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', FALSE,
    'error', SQLERRM,
    'message', 'Failed to create achievement'
  );
END;
$$ LANGUAGE plpgsql; 