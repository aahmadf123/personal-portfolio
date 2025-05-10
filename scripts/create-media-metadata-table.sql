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
