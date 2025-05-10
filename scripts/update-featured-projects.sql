-- Update the is_featured column for projects
-- This ensures that the featured flag is properly set for projects

-- First, make sure the column exists
ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Set featured flag for specific projects (replace with your actual project IDs)
UPDATE projects SET is_featured = true WHERE id IN (1, 2, 3);

-- You can also set by slug if you prefer
-- UPDATE projects SET is_featured = true WHERE slug IN ('ai-enhanced-portfolio-website', 'security-database-visualization-tool', 'cheme-car-competition-project');
