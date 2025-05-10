-- Insert sample research projects
INSERT INTO public.research_projects (
  title, 
  slug, 
  description, 
  long_description, 
  completion, 
  start_date, 
  end_date, 
  days_remaining, 
  priority, 
  category, 
  image_url, 
  next_milestone, 
  is_active
) VALUES 
(
  'Neural Network-Based UAV Navigation System',
  'neural-network-uav-navigation',
  'Developing an advanced neural network architecture for real-time UAV navigation in GPS-denied environments with obstacle avoidance capabilities.',
  'This project aims to create a robust navigation system for unmanned aerial vehicles that can operate effectively in environments where GPS signals are unavailable or unreliable. The system uses a combination of computer vision, sensor fusion, and deep learning to enable real-time decision making and path planning. The neural network architecture is designed to process high-resolution imagery and sensor data to detect obstacles, identify landmarks, and maintain accurate positioning.',
  75,
  '2023-09-14',
  '2024-06-29',
  42,
  'high',
  'Aerospace',
  '/placeholder.svg?height=400&width=600&query=UAV%20navigation%20system',
  'Complete training on synthetic dataset by April 15',
  true
),
(
  'Quantum-Inspired Optimization Algorithm',
  'quantum-inspired-optimization',
  'Implementing a novel optimization approach inspired by quantum computing principles to solve complex aerospace engineering problems more efficiently.',
  'This research project explores how quantum computing concepts can be applied to classical optimization problems in aerospace engineering. The algorithm mimics quantum superposition and entanglement to explore solution spaces more efficiently than traditional methods. Initial benchmarks show a 40% reduction in computation time for complex structural optimization problems compared to genetic algorithms.',
  45,
  '2023-10-31',
  '2024-08-14',
  88,
  'medium',
  'Quantum',
  '/quantum-computing-visualization.png',
  'Complete algorithm prototype by May 20',
  true
),
(
  'Sustainable Energy Forecasting System',
  'sustainable-energy-forecasting',
  'Creating an AI-powered forecasting system that predicts renewable energy production and optimizes grid distribution based on weather patterns and consumption trends.',
  'This project combines weather data, historical energy production records, and consumption patterns to create accurate forecasts for renewable energy sources like solar and wind. The system uses ensemble machine learning models to predict energy production up to 72 hours in advance with over 85% accuracy. An optimization layer then suggests the most efficient energy distribution across the grid to minimize waste and reduce reliance on non-renewable sources.',
  62,
  '2024-01-15',
  '2024-11-30',
  196,
  'high',
  'Energy',
  '/renewable-energy-forecasting.png',
  'Deploy beta version for testing with partner utility company by May 30',
  true
);

-- Insert tags for the first project
INSERT INTO public.research_project_tags (research_project_id, name) VALUES 
(1, 'Neural Networks'),
(1, 'Computer Vision'),
(1, 'UAV'),
(1, 'TensorFlow'),
(1, 'Sensor Fusion');

-- Insert tags for the second project
INSERT INTO public.research_project_tags (research_project_id, name) VALUES 
(2, 'Quantum Computing'),
(2, 'Optimization'),
(2, 'Python'),
(2, 'Research'),
(2, 'Aerospace Engineering');

-- Insert tags for the third project
INSERT INTO public.research_project_tags (research_project_id, name) VALUES 
(3, 'Renewable Energy'),
(3, 'Machine Learning'),
(3, 'Forecasting'),
(3, 'Python'),
(3, 'Time Series Analysis');

-- Insert challenges for the first project
INSERT INTO public.research_project_challenges (research_project_id, description) VALUES 
(1, 'Processing high-resolution imagery in real-time on edge devices'),
(1, 'Optimizing model size while maintaining accuracy'),
(1, 'Handling diverse environmental conditions and lighting changes');

-- Insert challenges for the second project
INSERT INTO public.research_project_challenges (research_project_id, description) VALUES 
(2, 'Mathematical formulation of quantum-inspired operators'),
(2, 'Benchmarking against classical methods'),
(2, 'Scaling to high-dimensional problems');

-- Insert challenges for the third project
INSERT INTO public.research_project_challenges (research_project_id, description) VALUES 
(3, 'Handling the inherent variability of weather patterns'),
(3, 'Integrating diverse data sources with different temporal resolutions'),
(3, 'Optimizing for both accuracy and computational efficiency');

-- Insert updates for the first project
INSERT INTO public.research_project_updates (research_project_id, date, text) VALUES 
(1, '2024-03-28', 'Completed initial obstacle detection module with 92% accuracy'),
(1, '2024-03-15', 'Integrated sensor fusion algorithm for improved positioning');

-- Insert updates for the second project
INSERT INTO public.research_project_updates (research_project_id, date, text) VALUES 
(2, '2024-03-25', 'Implemented quantum-inspired mutation operator'),
(2, '2024-03-10', 'Completed literature review and theoretical framework');

-- Insert updates for the third project
INSERT INTO public.research_project_updates (research_project_id, date, text) VALUES 
(3, '2024-03-30', 'Completed integration with weather API services'),
(3, '2024-03-22', 'Improved forecast accuracy by 7% using ensemble methods');

-- Insert team members for the first project
INSERT INTO public.research_project_team_members (research_project_id, name, is_lead) VALUES 
(1, 'Ahmad Firas', true),
(1, 'Sarah Chen', false),
(1, 'Michael Rodriguez', false);

-- Insert team members for the second project
INSERT INTO public.research_project_team_members (research_project_id, name, is_lead) VALUES 
(2, 'Ahmad Firas', false),
(2, 'Dr. Quantum Jones', true),
(2, 'Elena Schmidt', false);

-- Insert team members for the third project
INSERT INTO public.research_project_team_members (research_project_id, name, is_lead) VALUES 
(3, 'Ahmad Firas', false),
(3, 'Priya Sharma', true),
(3, 'Thomas Green', false);

-- Insert resources for the first project
INSERT INTO public.research_project_resources (research_project_id, name, url) VALUES 
(1, 'Project Repository', 'https://github.com/example/uav-navigation'),
(1, 'Research Paper', 'https://example.com/papers/neural-uav-navigation');

-- Insert resources for the second project
INSERT INTO public.research_project_resources (research_project_id, name, url) VALUES 
(2, 'Research Paper Draft', 'https://example.com/papers/quantum-optimization'),
(2, 'Algorithm Documentation', 'https://example.com/docs/quantum-algorithm');

-- Insert resources for the third project
INSERT INTO public.research_project_resources (research_project_id, name, url) VALUES 
(3, 'Project Dashboard', 'https://example.com/dashboard/energy-forecasting'),
(3, 'Technical Documentation', 'https://example.com/docs/energy-forecasting');
