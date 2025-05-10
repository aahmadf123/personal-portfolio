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
DO $ext$
BEGIN
  IF NOT extension_exists('uuid-ossp') THEN
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  END IF;

  IF extension_exists('pg_available_extensions') THEN
    IF EXISTS (
      SELECT 1 FROM pg_available_extensions WHERE name = 'vector'
    ) THEN
      CREATE EXTENSION IF NOT EXISTS vector;
    ELSE
      RAISE NOTICE
        'Vector extension not available on this Supabase tier; vector search will be unavailable';
    END IF;
  END IF;
END
$ext$;

-- Timestamp auto-update trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
  RETURNS TRIGGER
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Fallback for pgvector
DO $vector_fallback$
BEGIN
  IF NOT extension_exists('vector') THEN
    -- Fallback table
    CREATE TABLE IF NOT EXISTS vector_store_fallback (
      id           SERIAL PRIMARY KEY,
      reference_id TEXT    NOT NULL,
      content      TEXT    NOT NULL,
      metadata     JSONB,
      embedding    TEXT,                    -- base64
      created_at   TIMESTAMPTZ DEFAULT NOW(),
      updated_at   TIMESTAMPTZ DEFAULT NOW()
    );

    -- Simple text-similarity function
    CREATE OR REPLACE FUNCTION text_similarity(query TEXT, content TEXT)
      RETURNS FLOAT
    AS $ts$
    DECLARE
      words_a           TEXT[];
      words_b           TEXT[];
      common_count      INTEGER := 0;
      total_unique_words INTEGER;
    BEGIN
      words_a := regexp_split_to_array(lower(query), '\\s+');
      words_b := regexp_split_to_array(lower(content), '\\s+');

      SELECT COUNT(*) INTO common_count
      FROM (
        SELECT unnest(words_a) AS word
        INTERSECT
        SELECT unnest(words_b) AS word
      ) sub;

      SELECT COUNT(*) INTO total_unique_words
      FROM (
        SELECT unnest(words_a) AS word
        UNION
        SELECT unnest(words_b) AS word
      ) sub2;

      IF total_unique_words = 0 THEN
        RETURN 0;
      ELSE
        RETURN common_count::FLOAT / total_unique_words::FLOAT;
      END IF;
    END;
    $ts$ LANGUAGE plpgsql IMMUTABLE;
  END IF;
END
$vector_fallback$;

-- USERS & SESSIONS
CREATE TABLE IF NOT EXISTS users (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email          TEXT UNIQUE NOT NULL,
  password_hash  TEXT NOT NULL,
  name           TEXT NOT NULL,
  role           TEXT NOT NULL DEFAULT 'admin',
  avatar_url     TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS user_sessions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  token       TEXT NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- CATEGORIES & BLOG
CREATE TABLE IF NOT EXISTS categories (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  description TEXT,
  color       TEXT,
  icon        TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id           SERIAL PRIMARY KEY,
  title        TEXT NOT NULL,
  slug         TEXT UNIQUE NOT NULL,
  excerpt      TEXT NOT NULL,
  content      TEXT NOT NULL,
  image_url    TEXT,
  read_time    INTEGER,
  published    BOOLEAN DEFAULT FALSE,
  featured     BOOLEAN DEFAULT FALSE,
  view_count   INTEGER DEFAULT 0,
  category_id  INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  author_id    UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blog_tags (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL UNIQUE,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blog_post_tags (
  blog_post_id INTEGER REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id       INTEGER REFERENCES blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (blog_post_id, tag_id)
);

CREATE TABLE IF NOT EXISTS blog_comments (
  id            SERIAL PRIMARY KEY,
  blog_post_id  INTEGER REFERENCES blog_posts(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  content       TEXT NOT NULL,
  approved      BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- PROJECTS & RELATED
CREATE TABLE IF NOT EXISTS projects (
  id              SERIAL PRIMARY KEY,
  title           TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  description     TEXT NOT NULL,
  details         TEXT,
  summary         TEXT,
  thumbnail_url   TEXT,
  main_image_url  TEXT,
  github_url      TEXT,
  demo_url        TEXT,
  video_url       TEXT,
  start_date      DATE,
  end_date        DATE,
  is_featured     BOOLEAN DEFAULT FALSE,
  is_ongoing      BOOLEAN DEFAULT FALSE,
  order_index     INTEGER DEFAULT 0,
  status          TEXT DEFAULT 'completed',
  client          TEXT,
  view_count      INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_tags (
  id         SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  name       TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS project_technologies (
  id         SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  icon       TEXT,
  version    TEXT,
  category   TEXT
);

CREATE TABLE IF NOT EXISTS project_milestones (
  id          SERIAL PRIMARY KEY,
  project_id  INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  date        DATE,
  status      TEXT DEFAULT 'completed'
);

CREATE TABLE IF NOT EXISTS project_challenges (
  id          SERIAL PRIMARY KEY,
  project_id  INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  solution    TEXT
);

CREATE TABLE IF NOT EXISTS project_images (
  id          SERIAL PRIMARY KEY,
  project_id  INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  alt_text    TEXT,
  caption     TEXT,
  order_index INTEGER DEFAULT 0
);

-- SKILLS, EXPERIENCE, EDUCATION, CERTIFICATIONS, CONTACT, PORTFOLIO, SEO, SETTINGS...
CREATE TABLE IF NOT EXISTS skills (
  id           SERIAL PRIMARY KEY,
  name         TEXT NOT NULL,
  category     TEXT NOT NULL,
  icon         TEXT,
  proficiency  INTEGER CHECK (proficiency BETWEEN 1 AND 10),
  is_featured  BOOLEAN DEFAULT FALSE,
  order_index  INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS experience (
  id           SERIAL PRIMARY KEY,
  company      TEXT NOT NULL,
  position     TEXT NOT NULL,
  start_date   DATE NOT NULL,
  end_date     DATE,
  description  TEXT,
  logo_url     TEXT,
  location     TEXT,
  is_featured  BOOLEAN DEFAULT FALSE,
  order_index  INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS education (
  id            SERIAL PRIMARY KEY,
  institution   TEXT NOT NULL,
  degree        TEXT NOT NULL,
  field_of_study TEXT,
  start_date    DATE NOT NULL,
  end_date      DATE,
  description   TEXT,
  logo_url      TEXT,
  location      TEXT,
  gpa           TEXT,
  order_index   INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS certifications (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  issuer        TEXT NOT NULL,
  issue_date    DATE NOT NULL,
  expiry_date   DATE,
  credential_id TEXT,
  credential_url TEXT,
  description   TEXT,
  logo_url      TEXT,
  order_index   INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_submissions (
  id           SERIAL PRIMARY KEY,
  name         TEXT NOT NULL,
  email        TEXT NOT NULL,
  subject      TEXT,
  message      TEXT NOT NULL,
  read         BOOLEAN DEFAULT FALSE,
  ip_address   TEXT,
  user_agent   TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS portfolio_sections (
  id           SERIAL PRIMARY KEY,
  title        TEXT NOT NULL,
  slug         TEXT UNIQUE NOT NULL,
  content      TEXT,
  is_visible   BOOLEAN DEFAULT TRUE,
  order_index  INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS seo_metadata (
  id           SERIAL PRIMARY KEY,
  page_path    TEXT UNIQUE NOT NULL,
  title        TEXT,
  description  TEXT,
  keywords     TEXT,
  og_image_url TEXT,
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_settings (
  id            SERIAL PRIMARY KEY,
  setting_key   TEXT UNIQUE NOT NULL,
  setting_value JSONB,
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- pgvector table + search function
CREATE TABLE IF NOT EXISTS vector_store (
  id         TEXT PRIMARY KEY,
  content    TEXT NOT NULL,
  metadata   JSONB,
  embedding  VECTOR(1536),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION match_vectors(
  query_embedding VECTOR(1536),
  match_threshold FLOAT,
  match_count    INT,
  filter_object  JSONB DEFAULT NULL
)
RETURNS TABLE (
  id         TEXT,
  content    TEXT,
  metadata   JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql STABLE AS $$
BEGIN
  IF filter_object IS NULL THEN
    RETURN QUERY
      SELECT
        id, content, metadata,
        1 - (embedding <=> query_embedding) AS similarity
      FROM vector_store
      WHERE 1 - (embedding <=> query_embedding) > match_threshold
      ORDER BY similarity DESC
      LIMIT match_count;
  ELSE
    RETURN QUERY
      SELECT
        id, content, metadata,
        1 - (embedding <=> query_embedding) AS similarity
      FROM vector_store
      WHERE
        1 - (embedding <=> query_embedding) > match_threshold
        AND metadata @> filter_object
      ORDER BY similarity DESC
      LIMIT match_count;
  END IF;
END;
$$;

-- Media metadata + index
CREATE TABLE IF NOT EXISTS media_metadata (
  id          SERIAL PRIMARY KEY,
  blob_id     TEXT NOT NULL UNIQUE,
  metadata    JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_media_metadata_blob_id ON media_metadata(blob_id);

-- Create update-timestamp triggers
DO $trigger_setup$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN
    SELECT unnest(ARRAY[
      'users','categories','blog_posts','blog_comments','projects',
      'skills','experience','education','certifications','portfolio_sections',
      'site_settings','seo_metadata','vector_store','project_milestones',
      'project_challenges','project_images','media_metadata'
    ])
  LOOP
    IF NOT EXISTS (
      SELECT 1
        FROM pg_trigger
       WHERE tgname = 'update_' || tbl || '_updated_at'
    ) THEN
      EXECUTE format(
        'CREATE TRIGGER update_%I_updated_at
           BEFORE UPDATE ON %I
           FOR EACH ROW
           EXECUTE FUNCTION update_updated_at()',
        tbl, tbl
      );
    END IF;
  END LOOP;
END
$trigger_setup$;


-- Transactional project-creation function
DROP FUNCTION IF EXISTS create_project_with_relations CASCADE;
CREATE FUNCTION create_project_with_relations(
  project_data     JSONB,
  technologies_data JSONB DEFAULT '[]',
  tags_data        JSONB DEFAULT '[]',
  challenges_data  JSONB DEFAULT '[]',
  milestones_data  JSONB DEFAULT '[]',
  images_data      JSONB DEFAULT '[]'
) RETURNS JSONB
LANGUAGE plpgsql AS $$
BEGIN
  RETURN (
    WITH project_insert AS (
      INSERT INTO projects (
        title, slug, description, details, summary,
        thumbnail_url, main_image_url, github_url, demo_url, video_url,
        start_date, end_date, is_featured, is_ongoing, status,
        order_index, client, created_at, updated_at
      )
      VALUES (
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
        NOW(), NOW()
      )
      RETURNING id
    ),
    tech_insert AS (
      INSERT INTO project_technologies (project_id, name, icon, category)
      SELECT
        (SELECT id FROM project_insert),
        t->>'name', t->>'icon', t->>'category'
      FROM jsonb_array_elements(technologies_data) AS t
    ),
    tag_insert AS (
      INSERT INTO project_tags (project_id, name)
      SELECT
        (SELECT id FROM project_insert),
        t->>'name'
      FROM jsonb_array_elements(tags_data) AS t
    ),
    challenge_insert AS (
      INSERT INTO project_challenges (project_id, title, description, solution)
      SELECT
        (SELECT id FROM project_insert),
        c->>'title', c->>'description', c->>'solution'
      FROM jsonb_array_elements(challenges_data) AS c
    ),
    milestone_insert AS (
      INSERT INTO project_milestones (project_id, title, description, date, status)
      SELECT
        (SELECT id FROM project_insert),
        m->>'title', m->>'description', (m->>'date')::DATE,
        COALESCE(m->>'status', 'completed')
      FROM jsonb_array_elements(milestones_data) AS m
    ),
    image_insert AS (
      INSERT INTO project_images (project_id, url, alt_text, caption, order_index)
      SELECT
        (SELECT id FROM project_insert),
        i->>'url', i->>'alt_text', i->>'caption',
        COALESCE((i->>'order_index')::INTEGER, 0)
      FROM jsonb_array_elements(images_data) AS i
    )
    SELECT jsonb_build_object(
      'success',     true,
      'project_id',  id,
      'message',     'Project created successfully'
    ) FROM project_insert
  );
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'error',   SQLERRM,
    'message', 'Failed to create project: '||SQLERRM
  );
END;
$$;

-- Simple project-creation helper
DROP FUNCTION IF EXISTS create_project_simple CASCADE;
CREATE OR REPLACE FUNCTION create_project_simple(
  p_title       TEXT,
  p_slug        TEXT,
  p_description TEXT
) RETURNS JSONB AS $$
BEGIN
  RETURN (
    WITH np AS (
      INSERT INTO projects (title, slug, description, created_at, updated_at)
      VALUES (p_title, p_slug, p_description, NOW(), NOW())
      RETURNING id
    )
    SELECT jsonb_build_object(
      'success',    true,
      'project_id', id,
      'message',    'Simple project created'
    ) FROM np
  );
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql;
