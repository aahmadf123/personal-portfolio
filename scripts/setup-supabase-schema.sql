-- Drop related functions
DROP FUNCTION IF EXISTS match_vectors CASCADE;
DROP FUNCTION IF EXISTS update_updated_at CASCADE;

-- Helper to check if extension exists
CREATE OR REPLACE FUNCTION extension_exists(ext_name TEXT) RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM pg_extension WHERE extname = ext_name
  );
END;
$$ LANGUAGE plpgsql;

-- Enable extensions
DO $$ 
BEGIN 
  IF NOT extension_exists('uuid-ossp') THEN
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  END IF;
  
  -- Only try to create vector extension if available (requires Supabase Enterprise)
  IF extension_exists('pg_available_extensions') THEN 
    IF EXISTS (
      SELECT 1 FROM pg_available_extensions WHERE name = 'vector'
    ) THEN
      CREATE EXTENSION IF NOT EXISTS vector;
    ELSE
      RAISE NOTICE 'Vector extension not available on this Supabase tier, vector search will be unavailable';
    END IF;
  END IF;
END $$;

-- Timestamp auto-update function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a simpler alternative to pgvector when not available
DO $$ 
BEGIN
  IF NOT extension_exists('vector') THEN
    CREATE TABLE IF NOT EXISTS vector_store_fallback (
      id SERIAL PRIMARY KEY,
      reference_id TEXT NOT NULL,
      content TEXT NOT NULL,
      metadata JSONB,
      embedding TEXT, -- Store as base64 encoded text
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Create a function that will serve as a simplified version for text similarity
    CREATE OR REPLACE FUNCTION text_similarity(query TEXT, content TEXT)
    RETURNS FLOAT AS $$
    DECLARE
      words_a TEXT[];
      words_b TEXT[];
      common_count INTEGER := 0;
      total_unique_words INTEGER;
    BEGIN
      -- Simple word tokenization and matching for text similarity
      words_a := regexp_split_to_array(lower(query), '\\s+');
      words_b := regexp_split_to_array(lower(content), '\\s+');
      
      -- Count common words
      SELECT COUNT(*) INTO common_count
      FROM (
        SELECT unnest(words_a) AS word
        INTERSECT
        SELECT unnest(words_b) AS word
      ) common_words;
      
      -- Count total unique words
      SELECT COUNT(*) INTO total_unique_words
      FROM (
        SELECT unnest(words_a) AS word
        UNION
        SELECT unnest(words_b) AS word
      ) all_words;
      
      -- Return Jaccard similarity: intersection / union
      IF total_unique_words = 0 THEN
        RETURN 0;
      ELSE
        RETURN common_count::FLOAT / total_unique_words::FLOAT;
      END IF;
    END;
    $$ LANGUAGE plpgsql IMMUTABLE;
  END IF;
END $$;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- User sessions
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  read_time INTEGER,
  published BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog tags and mapping
CREATE TABLE IF NOT EXISTS blog_tags (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blog_post_tags (
  blog_post_id INTEGER REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (blog_post_id, tag_id)
);

-- Blog comments
CREATE TABLE IF NOT EXISTS blog_comments (
  id SERIAL PRIMARY KEY,
  blog_post_id INTEGER REFERENCES blog_posts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  content TEXT NOT NULL,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  details TEXT,
  summary TEXT,
  thumbnail_url TEXT,
  main_image_url TEXT,
  github_url TEXT,
  demo_url TEXT,
  video_url TEXT,
  start_date DATE,
  end_date DATE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_ongoing BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,
  status TEXT DEFAULT 'completed',
  client TEXT,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project tags
CREATE TABLE IF NOT EXISTS project_tags (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL
);

-- Project technologies
CREATE TABLE IF NOT EXISTS project_technologies (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT,
  version TEXT,
  category TEXT
);

-- Project milestones
CREATE TABLE IF NOT EXISTS project_milestones (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  date DATE,
  status TEXT DEFAULT 'completed'
);

-- Project challenges
CREATE TABLE IF NOT EXISTS project_challenges (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  solution TEXT
);

-- Project images
CREATE TABLE IF NOT EXISTS project_images (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  caption TEXT,
  order_index INTEGER DEFAULT 0
);

-- Skills
CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  icon TEXT,
  proficiency INTEGER CHECK (proficiency BETWEEN 1 AND 10),
  is_featured BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Experience
CREATE TABLE IF NOT EXISTS experience (
  id SERIAL PRIMARY KEY,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  description TEXT,
  logo_url TEXT,
  location TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Education
CREATE TABLE IF NOT EXISTS education (
  id SERIAL PRIMARY KEY,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  description TEXT,
  logo_url TEXT,
  location TEXT,
  gpa TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Certifications
CREATE TABLE IF NOT EXISTS certifications (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date DATE NOT NULL,
  expiry_date DATE,
  credential_id TEXT,
  credential_url TEXT,
  description TEXT,
  logo_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Portfolio sections
CREATE TABLE IF NOT EXISTS portfolio_sections (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  is_visible BOOLEAN DEFAULT TRUE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SEO metadata
CREATE TABLE IF NOT EXISTS seo_metadata (
  id SERIAL PRIMARY KEY,
  page_path TEXT UNIQUE NOT NULL,
  title TEXT,
  description TEXT,
  keywords TEXT,
  og_image_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site settings
CREATE TABLE IF NOT EXISTS site_settings (
  id SERIAL PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vector store
CREATE TABLE IF NOT EXISTS vector_store (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  metadata JSONB,
  embedding VECTOR(1536),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Match function for vector search
CREATE OR REPLACE FUNCTION match_vectors(
  query_embedding VECTOR(1536),
  match_threshold FLOAT,
  match_count INT,
  filter_object JSONB DEFAULT NULL
)
RETURNS TABLE (
  id TEXT,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql STABLE AS $$
BEGIN
  IF filter_object IS NULL THEN
    RETURN QUERY
    SELECT id, content, metadata,
           1 - (embedding <=> query_embedding) AS similarity
    FROM vector_store
    WHERE 1 - (embedding <=> query_embedding) > match_threshold
    ORDER BY similarity DESC
    LIMIT match_count;
  ELSE
    RETURN QUERY
    SELECT id, content, metadata,
           1 - (embedding <=> query_embedding) AS similarity
    FROM vector_store
    WHERE 1 - (embedding <=> query_embedding) > match_threshold
      AND metadata @> filter_object
    ORDER BY similarity DESC
    LIMIT match_count;
  END IF;
END;
$$;

-- Create media_metadata table to store metadata for media files
CREATE TABLE IF NOT EXISTS media_metadata (
  id SERIAL PRIMARY KEY,
  blob_id TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(blob_id)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_media_metadata_blob_id ON media_metadata(blob_id);

-- Create triggers
-- Skip triggers if they already exist
DO $$
BEGIN
  -- Only create triggers if they don't exist
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
    CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_categories_updated_at') THEN
    CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_blog_posts_updated_at') THEN
    CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_blog_comments_updated_at') THEN
    CREATE TRIGGER update_blog_comments_updated_at BEFORE UPDATE ON blog_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_projects_updated_at') THEN
    CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_skills_updated_at') THEN
    CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_experience_updated_at') THEN
    CREATE TRIGGER update_experience_updated_at BEFORE UPDATE ON experience FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_education_updated_at') THEN
    CREATE TRIGGER update_education_updated_at BEFORE UPDATE ON education FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_certifications_updated_at') THEN
    CREATE TRIGGER update_certifications_updated_at BEFORE UPDATE ON certifications FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_portfolio_sections_updated_at') THEN
    CREATE TRIGGER update_portfolio_sections_updated_at BEFORE UPDATE ON portfolio_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_site_settings_updated_at') THEN
    CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_seo_metadata_updated_at') THEN
    CREATE TRIGGER update_seo_metadata_updated_at BEFORE UPDATE ON seo_metadata FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_vector_store_updated_at') THEN
    CREATE TRIGGER update_vector_store_updated_at BEFORE UPDATE ON vector_store FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_project_milestones_updated_at') THEN
    CREATE TRIGGER update_project_milestones_updated_at BEFORE UPDATE ON project_milestones FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_project_challenges_updated_at') THEN
    CREATE TRIGGER update_project_challenges_updated_at BEFORE UPDATE ON project_challenges FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_project_images_updated_at') THEN
    CREATE TRIGGER update_project_images_updated_at BEFORE UPDATE ON project_images FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_media_metadata_updated_at') THEN
    CREATE TRIGGER update_media_metadata_updated_at BEFORE UPDATE ON media_metadata FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;

-- Create function for transactional project creation
CREATE OR REPLACE FUNCTION create_project_with_relations(
  project_data JSONB,
  technologies_data JSONB DEFAULT '[]',
  tags_data JSONB DEFAULT '[]',
  challenges_data JSONB DEFAULT '[]',
  milestones_data JSONB DEFAULT '[]',
  images_data JSONB DEFAULT '[]'
) RETURNS JSONB AS $$
DECLARE
  new_project_id INTEGER;
  tech_record JSONB;
  tag_record JSONB;
  challenge_record JSONB;
  milestone_record JSONB;
  image_record JSONB;
  result JSONB;
BEGIN
  -- Insert the project and get its ID
  INSERT INTO projects (
    title, slug, description, details, summary, 
    thumbnail_url, main_image_url, github_url, demo_url, video_url,
    start_date, end_date, is_featured, is_ongoing, status, 
    order_index, client, created_at, updated_at
  ) VALUES (
    project_data->>'title',
    project_data->>'slug',
    project_data->>'description',
    project_data->>'details',
    project_data->>'summary',
    project_data->>'thumbnail_url',
    project_data->>'main_image_url',
    project_data->>'github_url',
    project_data->>'demo_url',
    project_data->>'video_url',
    (project_data->>'start_date')::DATE,
    (project_data->>'end_date')::DATE,
    (project_data->>'is_featured')::BOOLEAN,
    (project_data->>'is_ongoing')::BOOLEAN,
    project_data->>'status',
    COALESCE((project_data->>'order_index')::INTEGER, 0),
    project_data->>'client',
    NOW(),
    NOW()
  ) RETURNING id INTO new_project_id;
  
  -- Insert technologies
  IF jsonb_array_length(technologies_data) > 0 THEN
    FOR tech_record IN SELECT * FROM jsonb_array_elements(technologies_data) LOOP
      INSERT INTO project_technologies (project_id, name, icon, category)
      VALUES (
        new_project_id,
        tech_record->>'name',
        tech_record->>'icon',
        tech_record->>'category'
      );
    END LOOP;
  END IF;
  
  -- Insert tags
  IF jsonb_array_length(tags_data) > 0 THEN
    FOR tag_record IN SELECT * FROM jsonb_array_elements(tags_data) LOOP
      INSERT INTO project_tags (project_id, name)
      VALUES (
        new_project_id,
        tag_record->>'name'
      );
    END LOOP;
  END IF;
  
  -- Insert challenges
  IF jsonb_array_length(challenges_data) > 0 THEN
    FOR challenge_record IN SELECT * FROM jsonb_array_elements(challenges_data) LOOP
      INSERT INTO project_challenges (project_id, title, description, solution)
      VALUES (
        new_project_id,
        challenge_record->>'title',
        challenge_record->>'description',
        challenge_record->>'solution'
      );
    END LOOP;
  END IF;
  
  -- Insert milestones
  IF jsonb_array_length(milestones_data) > 0 THEN
    FOR milestone_record IN SELECT * FROM jsonb_array_elements(milestones_data) LOOP
      INSERT INTO project_milestones (project_id, title, description, date, status)
      VALUES (
        new_project_id,
        milestone_record->>'title',
        milestone_record->>'description',
        (milestone_record->>'date')::DATE,
        COALESCE(milestone_record->>'status', 'completed')
      );
    END LOOP;
  END IF;
  
  -- Insert images
  IF jsonb_array_length(images_data) > 0 THEN
    FOR image_record IN SELECT * FROM jsonb_array_elements(images_data) LOOP
      INSERT INTO project_images (project_id, url, alt_text, caption, order_index)
      VALUES (
        new_project_id,
        image_record->>'url',
        image_record->>'alt_text',
        image_record->>'caption',
        COALESCE((image_record->>'order_index')::INTEGER, 0)
      );
    END LOOP;
  END IF;
  
  -- Return success with project ID
  result := jsonb_build_object(
    'success', true,
    'project_id', new_project_id,
    'message', 'Project created successfully'
  );
  
  RETURN result;
EXCEPTION WHEN OTHERS THEN
  -- Handle errors and return an error object
  result := jsonb_build_object(
    'success', false,
    'error', SQLERRM,
    'message', 'Failed to create project: ' || SQLERRM
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql; 