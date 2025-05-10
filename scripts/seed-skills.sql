-- Seed data for skills table
INSERT INTO skills (name, category, proficiency, description, is_featured, order_index)
VALUES
  -- Programming Languages
  ('JavaScript', 'Programming Languages', 9, 'Modern JavaScript including ES6+ features', true, 1),
  ('TypeScript', 'Programming Languages', 8.5, 'Type-safe JavaScript development', true, 2),
  ('Python', 'Programming Languages', 9, 'Data science, automation, and backend development', true, 3),
  ('Java', 'Programming Languages', 7, 'Enterprise application development', false, 4),
  ('C++', 'Programming Languages', 6, 'System-level programming and optimization', false, 5),
  ('Go', 'Programming Languages', 6.5, 'High-performance backend services', false, 6),
  
  -- Web Development
  ('React', 'Web Development', 9, 'Component-based UI development', true, 1),
  ('Next.js', 'Web Development', 8.5, 'React framework for production', true, 2),
  ('Node.js', 'Web Development', 8, 'JavaScript runtime for backend development', true, 3),
  ('HTML/CSS', 'Web Development', 9, 'Semantic markup and styling', false, 4),
  ('Tailwind CSS', 'Web Development', 8.5, 'Utility-first CSS framework', false, 5),
  ('GraphQL', 'Web Development', 7, 'API query language and runtime', false, 6),
  ('REST API Design', 'Web Development', 8, 'RESTful service architecture', false, 7),
  
  -- AI & Machine Learning
  ('TensorFlow', 'AI & Machine Learning', 8, 'Deep learning framework', true, 1),
  ('PyTorch', 'AI & Machine Learning', 7.5, 'Deep learning research and development', true, 2),
  ('Computer Vision', 'AI & Machine Learning', 8, 'Image processing and analysis', false, 3),
  ('NLP', 'AI & Machine Learning', 7, 'Natural language processing', false, 4),
  ('Scikit-learn', 'AI & Machine Learning', 8, 'Machine learning algorithms', false, 5),
  ('Pandas', 'AI & Machine Learning', 8.5, 'Data manipulation and analysis', false, 6),
  
  -- Database Technologies
  ('SQL', 'Database Technologies', 8, 'Relational database querying', true, 1),
  ('PostgreSQL', 'Database Technologies', 8, 'Advanced relational database', false, 2),
  ('MongoDB', 'Database Technologies', 7.5, 'NoSQL document database', false, 3),
  ('Redis', 'Database Technologies', 6.5, 'In-memory data structure store', false, 4),
  ('Supabase', 'Database Technologies', 7.5, 'Open source Firebase alternative', true, 5),
  
  -- Cloud & DevOps
  ('AWS', 'Cloud & DevOps', 7, 'Amazon Web Services ecosystem', true, 1),
  ('Docker', 'Cloud & DevOps', 7.5, 'Containerization platform', false, 2),
  ('CI/CD', 'Cloud & DevOps', 7, 'Continuous integration and deployment', false, 3),
  ('Vercel', 'Cloud & DevOps', 8, 'Frontend deployment platform', true, 4),
  ('GitHub Actions', 'Cloud & DevOps', 7.5, 'Workflow automation', false, 5),
  
  -- Data Science & Analytics
  ('Data Visualization', 'Data Science & Analytics', 8, 'Creating insightful visual representations', true, 1),
  ('Statistical Analysis', 'Data Science & Analytics', 7.5, 'Quantitative data analysis', false, 2),
  ('Jupyter Notebooks', 'Data Science & Analytics', 8, 'Interactive computing environment', false, 3),
  ('Tableau', 'Data Science & Analytics', 6.5, 'Business intelligence tool', false, 4),
  ('Power BI', 'Data Science & Analytics', 6, 'Business analytics service', false, 5);
