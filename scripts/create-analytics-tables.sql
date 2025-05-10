-- Create tables for tracking project and blog post views

-- Table for tracking project views
CREATE TABLE IF NOT EXISTS project_views (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  project_slug TEXT NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  user_agent TEXT,
  ip_hash TEXT,
  referrer TEXT
);

-- Table for tracking blog post views
CREATE TABLE IF NOT EXISTS blog_post_views (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES blog_posts(id) ON DELETE CASCADE,
  post_slug TEXT NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  user_agent TEXT,
  ip_hash TEXT,
  referrer TEXT
);

-- Add view_count column to projects table if it doesn't exist
ALTER TABLE projects ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- Create function to increment project view count
CREATE OR REPLACE FUNCTION increment_project_view_count(project_id INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE projects
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = project_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to increment blog post view count
CREATE OR REPLACE FUNCTION increment_blog_post_view_count(post_id INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE blog_posts
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- Create index on viewed_at for better performance on time-based queries
CREATE INDEX IF NOT EXISTS project_views_viewed_at_idx ON project_views(viewed_at);
CREATE INDEX IF NOT EXISTS blog_post_views_viewed_at_idx ON blog_post_views(viewed_at);

-- Create index on project_id and post_id for better performance on filtering
CREATE INDEX IF NOT EXISTS project_views_project_id_idx ON project_views(project_id);
CREATE INDEX IF NOT EXISTS blog_post_views_post_id_idx ON blog_post_views(post_id);
