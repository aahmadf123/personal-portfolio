import type { Project } from "../types/projects";
import { transformStorageUrl } from "./storage-utils";

// This service returns detailed project data
export async function getProjectDetails(slug: string): Promise<Project | null> {
  const projects: Record<string, Project> = {
    "homeowner-loss-history-prediction": {
      id: 1,
      title: "Homeowner Loss History Prediction Project",
      slug: "homeowner-loss-history-prediction",
      description:
        "Predicting insurance claims using machine learning models to inform risk-based premium adjustments.",
      detailed_description: `## Project Overview

This senior design project represents a collaborative effort between the Mathematics & Statistics department and a leading insurance company. The primary objective was to develop sophisticated machine learning models capable of predicting homeowner insurance claims with high accuracy.

## Technical Approach

Our approach involved several key technical components:

1. **Data Preprocessing & Feature Engineering**
   - Implemented advanced feature engineering techniques to extract meaningful patterns from complex insurance data
   - Developed custom data cleaning pipelines to handle missing values and outliers
   - Created synthetic features to capture temporal patterns in claim history

2. **Model Development**
   - Built an ensemble of 5 XGBoost models with different hyperparameter configurations
   - Implemented cross-validation strategies specifically designed for imbalanced datasets
   - Utilized Bayesian optimization for hyperparameter tuning to maximize model performance

3. **Pipeline Automation**
   - Constructed end-to-end data pipelines with self-healing protocols
   - Implemented human-in-the-loop validation for critical predictions
   - Developed automated monitoring systems to detect data drift and model degradation

## Results & Impact

By leveraging advanced data science techniques, our team successfully enhanced claim predictions by 25%, providing the insurance company with valuable insights for risk-based premium adjustments. This project demonstrates the practical application of machine learning in the insurance industry, showcasing how data-driven approaches can transform traditional business models.

The automated pipeline we developed decreased manual intervention by 75% and accelerated model retraining cycles from weekly to daily, significantly improving operational efficiency.`,
      completion: 100,
      start_date: "2024-08-01",
      end_date: "2025-05-01",
      priority: "high",
      image_url: transformStorageUrl(
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Homeowner_Loss_History-shHA6AKU04c0mesyToBcbntBQT0P2i.png"
      ),
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2023-01-01T00:00:00Z",
      technologies: [
        "Python",
        "XGBoost",
        "Scikit-learn",
        "Pandas",
        "NumPy",
        "Matplotlib",
        "Seaborn",
        "PostgreSQL",
        "Docker",
        "Git",
        "GitHub Actions",
        "AWS",
      ],
      key_achievements: [
        "Orchestrated collaboration between the Mathematics & Statistics department and an insurance company, enhancing claim predictions by 25% using Machine Learning",
        "Developed 5 XGBoost models, optimizing EDA, feature engineering, and hyperparameter tuning to improve predictive accuracy",
        "Engineered end-to-end data pipelines incorporating human-in-the-loop validation and self-healing protocols, improving model stability by 60%",
        "Slashed model retraining frequency by 40% through automated hyperparameter optimization",
        "Constructed a resilient CI/CD pipeline leveraging Bayesian optimization and data drift detection",
        "Decreased manual intervention by 75% and accelerated model retraining cycles from weekly to daily",
      ],
      team_size: 4,
      role: "Machine Learning Engineer & Project Lead",
      github_url: "https://github.com/username/homeowner-prediction",
      demo_url: null,
      challenges: [
        {
          id: 1,
          project_id: 1,
          description: "Handling imbalanced datasets with rare claim events",
          created_at: "2023-01-01T00:00:00Z",
        },
        {
          id: 2,
          project_id: 1,
          description:
            "Implementing effective feature engineering for complex insurance data",
          created_at: "2023-01-01T00:00:00Z",
        },
        {
          id: 3,
          project_id: 1,
          description:
            "Ensuring model interpretability for business stakeholders",
          created_at: "2023-01-01T00:00:00Z",
        },
        {
          id: 4,
          project_id: 1,
          description:
            "Developing automated pipelines for model retraining and validation",
          created_at: "2023-01-01T00:00:00Z",
        },
        {
          id: 5,
          project_id: 1,
          description:
            "Balancing model complexity with performance requirements",
          created_at: "2023-01-01T00:00:00Z",
        },
      ],
      milestones: [
        {
          id: 1,
          project_id: 1,
          description: "Initial data exploration and cleaning",
          due_date: "2024-09-15",
          completed: true,
          created_at: "2023-01-01T00:00:00Z",
        },
        {
          id: 2,
          project_id: 1,
          description: "Feature engineering and selection",
          due_date: "2024-10-01",
          completed: true,
          created_at: "2023-01-01T00:00:00Z",
        },
        {
          id: 3,
          project_id: 1,
          description: "Model development and hyperparameter tuning",
          due_date: "2024-11-01",
          completed: true,
          created_at: "2023-01-01T00:00:00Z",
        },
        {
          id: 4,
          project_id: 1,
          description: "Pipeline automation and CI/CD implementation",
          due_date: "2024-12-01",
          completed: true,
          created_at: "2023-01-01T00:00:00Z",
        },
        {
          id: 5,
          project_id: 1,
          description: "Final presentation and handover",
          due_date: "2025-01-15",
          completed: true,
          created_at: "2023-01-01T00:00:00Z",
        },
      ],
      tags: [
        { id: 1, name: "Machine Learning", created_at: "2023-01-01T00:00:00Z" },
        { id: 2, name: "Data Science", created_at: "2023-01-01T00:00:00Z" },
        { id: 3, name: "XGBoost", created_at: "2023-01-01T00:00:00Z" },
        { id: 4, name: "Insurance", created_at: "2023-01-01T00:00:00Z" },
        {
          id: 5,
          name: "Predictive Modeling",
          created_at: "2023-01-01T00:00:00Z",
        },
        { id: 6, name: "Python", created_at: "2023-01-01T00:00:00Z" },
        { id: 7, name: "CI/CD", created_at: "2023-01-01T00:00:00Z" },
        { id: 8, name: "Data Pipelines", created_at: "2023-01-01T00:00:00Z" },
      ],
    },
    "security-data-tool": {
      id: 2,
      title: "Security Data Tool (SDT) Project",
      slug: "security-data-tool",
      description:
        "Centralized security database implementation for enhanced incident response across multiple security platforms.",
      detailed_description: `## Project Overview

The Security Data Tool (SDT) Project was developed to address the critical need for a centralized security database that could integrate data from multiple security platforms including Active Directory, Cisco AMP, Microsoft Defender, and Rapid7.

## Technical Approach

1. **Database Architecture & Design**
   - Designed a normalized PostgreSQL database schema optimized for security data
   - Implemented advanced indexing strategies to ensure fast query performance
   - Created a comprehensive data dictionary and entity-relationship model

2. **Data Integration & Validation**
   - Developed ETL processes to extract and transform data from disparate security systems
   - Implemented robust data validation rules to ensure data quality and compliance
   - Created automated data quality checks and reporting mechanisms

3. **Disaster Recovery & Security**
   - Designed and implemented a comprehensive disaster recovery strategy
   - Conducted quarterly simulations to test recovery procedures
   - Implemented row-level security and encryption for sensitive data

## Results & Impact

As a member of the Database Team, I played a key role in establishing a robust data governance framework that significantly enhanced incident response capabilities. By implementing a centralized security database, we were able to improve incident response times by 15%, providing security teams with faster access to critical information during security events.

A major focus of the project was ensuring data quality and compliance. I implemented comprehensive data validation rules within the PostgreSQL database that successfully caught 95% of non-compliant data entries, ensuring that all security data adhered to industry regulations and standards. This improvement in data accuracy directly translated to more reliable security reporting and analysis.

Additionally, I contributed to revamping the disaster recovery testing regime by conducting quarterly simulations to identify potential vulnerabilities. This proactive approach resulted in zero data loss incidents during simulated events, significantly enhancing the overall security posture of the organization.`,
      completion: 100,
      start_date: "2023-05-01",
      end_date: "2023-08-31",
      priority: "high",
      image_url: "/security-database-visualization.png",
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2023-01-01T00:00:00Z",
      technologies: [
        "PostgreSQL",
        "SQL",
        "Data Validation",
        "Active Directory",
        "Cisco AMP",
        "Microsoft Defender",
        "Rapid7",
        "Data Governance",
        "ETL",
        "Python",
        "Bash",
        "PowerShell",
      ],
      key_achievements: [
        "Established data governance framework across Active Directory, Cisco AMP, Microsoft Defender, and Rapid7",
        "Enhanced incident response times by 15% through centralized security database implementation",
        "Implemented comprehensive data validation rules within the PostgreSQL database, catching 95% of non-compliant data entries",
        "Ensured adherence to industry regulations, boosting data accuracy for security reporting",
        "Revamped disaster recovery testing regime, conducting quarterly simulations to identify vulnerabilities",
        "Achieved zero data loss incidents during simulated events, enhancing security for the entire organization",
      ],
      team_size: 5,
      role: "Database Developer",
      github_url: "https://github.com/username/security-data-tool",
      demo_url: null,
      challenges: [
        {
          id: 5,
          project_id: 2,
          description:
            "Integrating disparate data sources with varying schemas and formats",
          created_at: "2023-01-01T00:00:00Z",
        },
        {
          id: 6,
          project_id: 2,
          description:
            "Ensuring data consistency and integrity across multiple security platforms",
          created_at: "2023-01-01T00:00:00Z",
        },
        {
          id: 7,
          project_id: 2,
          description:
            "Implementing robust data validation rules without impacting system performance",
          created_at: "2023-01-01T00:00:00Z",
        },
        {
          id: 8,
          project_id: 2,
          description:
            "Designing effective disaster recovery protocols for security-critical data",
          created_at: "2023-01-01T00:00:00Z",
        },
        {
          id: 9,
          project_id: 2,
          description:
            "Balancing security requirements with usability and performance",
          created_at: "2023-01-01T00:00:00Z",
        },
      ],
      milestones: [
        {
          id: 6,
          project_id: 2,
          description: "Database schema design and implementation",
          due_date: "2023-05-15",
          completed: true,
          created_at: "2023-01-01T00:00:00Z",
        },
        {
          id: 7,
          project_id: 2,
          description: "Data integration from security platforms",
          due_date: "2023-06-15",
          completed: true,
          created_at: "2023-01-01T00:00:00Z",
        },
        {
          id: 8,
          project_id: 2,
          description: "Data validation rules implementation",
          due_date: "2023-07-01",
          completed: true,
          created_at: "2023-01-01T00:00:00Z",
        },
        {
          id: 9,
          project_id: 2,
          description: "Disaster recovery testing and optimization",
          due_date: "2023-08-01",
          completed: true,
          created_at: "2023-01-01T00:00:00Z",
        },
        {
          id: 10,
          project_id: 2,
          description: "Final deployment and documentation",
          due_date: "2023-08-31",
          completed: true,
          created_at: "2023-01-01T00:00:00Z",
        },
      ],
      tags: [
        { id: 6, name: "Database", created_at: "2023-01-01T00:00:00Z" },
        { id: 7, name: "Security", created_at: "2023-01-01T00:00:00Z" },
        { id: 8, name: "PostgreSQL", created_at: "2023-01-01T00:00:00Z" },
        { id: 9, name: "Data Governance", created_at: "2023-01-01T00:00:00Z" },
        {
          id: 10,
          name: "Disaster Recovery",
          created_at: "2023-01-01T00:00:00Z",
        },
        { id: 11, name: "ETL", created_at: "2023-01-01T00:00:00Z" },
        { id: 12, name: "SQL", created_at: "2023-01-01T00:00:00Z" },
      ],
    },
    "ai-powered-portfolio": {
      id: 3,
      title: "AI-Powered Portfolio Website",
      slug: "ai-powered-portfolio",
      description:
        "Personal portfolio website with AI-enhanced features including content generation and interactive visualizations.",
      detailed_description: `## Project Overview

This AI-powered portfolio website represents a fusion of modern web development technologies and artificial intelligence capabilities. Built using Next.js, React, and Tailwind CSS, the website serves as both a showcase of my technical skills and a practical demonstration of AI integration in web applications.

## Technical Approach

1. **Frontend Architecture**
   - Implemented a responsive design using Tailwind CSS and custom components
   - Created reusable React components with TypeScript for type safety
   - Utilized Next.js App Router for optimized routing and server-side rendering

2. **AI Integration**
   - Developed a neural network visualization that responds to user interactions
   - Implemented an AI-powered chat assistant using OpenAI's API
   - Created dynamic content generation that adapts to visitor preferences

3. **Performance Optimization**
   - Implemented code splitting and lazy loading for improved initial load times
   - Utilized Next.js Image component for optimized image loading
   - Implemented caching strategies for API responses

## Results & Impact

The website features several AI-enhanced components, including a neural network visualization that responds to user interactions, an AI-powered chat assistant that can answer questions about my projects and skills, and dynamically generated content that adapts to visitor preferences.

From a technical perspective, the project implements server-side rendering for optimal performance and SEO, responsive design principles for seamless viewing across devices, and accessibility features to ensure inclusivity. The codebase is structured following best practices for maintainability and scalability.

This project not only showcases my web development skills but also demonstrates my ability to integrate AI technologies into practical applications, creating an engaging and interactive user experience.`,
      completion: 100,
      start_date: "2023-09-01",
      end_date: "2023-12-01",
      priority: "high",
      image_url: "/ai-portfolio-website.png",
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2023-01-01T00:00:00Z",
      technologies: [
        "Next.js",
        "React",
        "TypeScript",
        "Tailwind CSS",
        "TensorFlow.js",
        "OpenAI API",
        "Supabase",
        "Vercel",
        "Framer Motion",
        "Three.js",
        "Recharts",
        "Markdown",
      ],
      key_achievements: [
        "Developed a responsive, accessible portfolio website with modern web technologies",
        "Implemented interactive neural network visualizations using TensorFlow.js",
        "Created an AI-powered chat assistant to engage visitors and answer questions",
        "Designed and implemented a content management system for easy updates",
        "Optimized performance with server-side rendering and image optimization",
        "Integrated analytics to track user engagement and improve user experience",
      ],
      team_size: 1,
      role: "Full-Stack Developer",
      github_url: "https://github.com/username/portfolio",
      demo_url: "https://portfolio.example.com",
      challenges: [
        {
          id: 9,
          project_id: 3,
          description:
            "Optimizing neural network visualizations for performance across devices",
          created_at: "2023-01-01T00:00:00Z",
        },
        {
          id: 10,
          project_id: 3,
          description:
            "Implementing responsive design for complex interactive components",
          created_at: "2023-01-01T00:00:00Z",
        },
        {
          id: 11,
          project_id: 3,
          description:
            "Balancing aesthetic design with performance considerations",
          created_at: "2023-01-01T00:00:00Z",
        },
        {
          id: 12,
          project_id: 3,
          description: "Ensuring accessibility for interactive AI components",
          created_at: "2023-01-01T00:00:00Z",
        },
        {
          id: 13,
          project_id: 3,
          description:
            "Managing API rate limits and costs for AI-powered features",
          created_at: "2023-01-01T00:00:00Z",
        },
      ],
      milestones: [
        {
          id: 11,
          project_id: 3,
          description: "Initial design and architecture",
          due_date: "2023-09-15",
          completed: true,
          created_at: "2023-01-01T00:00:00Z",
        },
        {
          id: 12,
          project_id: 3,
          description: "Core components and responsive layout",
          due_date: "2023-10-01",
          completed: true,
          created_at: "2023-01-01T00:00:00Z",
        },
        {
          id: 13,
          project_id: 3,
          description: "AI features integration",
          due_date: "2023-10-15",
          completed: true,
          created_at: "2023-01-01T00:00:00Z",
        },
        {
          id: 14,
          project_id: 3,
          description: "Content management system",
          due_date: "2023-11-01",
          completed: true,
          created_at: "2023-01-01T00:00:00Z",
        },
        {
          id: 15,
          project_id: 3,
          description: "Performance optimization and testing",
          due_date: "2023-11-15",
          completed: true,
          created_at: "2023-01-01T00:00:00Z",
        },
      ],
      tags: [
        { id: 11, name: "Web Development", created_at: "2023-01-01T00:00:00Z" },
        { id: 12, name: "AI", created_at: "2023-01-01T00:00:00Z" },
        { id: 13, name: "React", created_at: "2023-01-01T00:00:00Z" },
        { id: 14, name: "Next.js", created_at: "2023-01-01T00:00:00Z" },
        { id: 15, name: "TensorFlow.js", created_at: "2023-01-01T00:00:00Z" },
        { id: 16, name: "TypeScript", created_at: "2023-01-01T00:00:00Z" },
        { id: 17, name: "Tailwind CSS", created_at: "2023-01-01T00:00:00Z" },
        { id: 18, name: "Supabase", created_at: "2023-01-01T00:00:00Z" },
      ],
    },
    "cheme-car-competition-project": {
      id: 4,
      title: "ChemE Car Competition Project",
      slug: "cheme-car-competition-project",
      description:
        "Interdisciplinary project developing a chemically powered car for the AIChE ChemE Car Competition.",
      detailed_description: `## Project Overview

As a member of the American Institute of Chemical Engineers (AIChE) student chapter, I actively participated in the ChemE Car Competition project, an interdisciplinary endeavor that challenges teams to design and construct a car powered by chemical reactions. This project provided a unique opportunity to apply computer science and engineering principles in a chemical engineering context.

## Technical Approach

1. **Control Systems Development**
   - Designed and implemented Arduino-based control systems for precise timing and measurement
   - Created custom sensor arrays to monitor chemical reactions in real-time
   - Developed data acquisition tools to collect and analyze performance data

2. **Interdisciplinary Collaboration**
   - Worked closely with chemical engineering students to understand reaction mechanisms
   - Translated chemical requirements into electronic control parameters
   - Participated in iterative design sessions to optimize performance

3. **Testing and Optimization**
   - Conducted extensive testing under various conditions to ensure reliability
   - Analyzed performance data to identify optimization opportunities
   - Implemented improvements based on data-driven insights

## Results & Impact

My contribution to the team focused on developing control systems and data acquisition tools that enhanced the precision and reliability of our car's performance. By implementing sensors and real-time monitoring capabilities, we were able to collect valuable data during test runs and make data-driven adjustments to optimize our design.

The project involved close collaboration with chemical engineering students, creating a rich interdisciplinary learning environment. This experience significantly broadened my understanding of how computer science can be applied across different engineering disciplines and reinforced the importance of effective teamwork in technical projects.

Our team's dedication and technical innovations led to successful qualification for both regional and national conferences, representing a significant achievement for our university's AIChE chapter.`,
      completion: 100,
      start_date: "2023-10-01",
      end_date: "2024-04-30",
      priority: "medium",
      image_url: "/cheme-car-project.png",
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2023-01-01T00:00:00Z",
      technologies: [
        "Arduino",
        "Sensors",
        "Data Acquisition",
        "Chemical Reactions",
        "Control Systems",
        "CAD",
        "3D Printing",
        "C++",
        "Python",
        "Data Analysis",
      ],
      key_achievements: [
        "Contributed to the team's advancement to regional and national conferences through technical engagement",
        "Developed data acquisition systems to monitor and optimize car performance",
        "Implemented sensor arrays for precise control of chemical reactions",
        "Collaborated effectively in an interdisciplinary team environment",
        "Applied computer science principles to solve chemical engineering challenges",
        "Gained practical experience in control systems and real-time data processing",
      ],
      team_size: 8,
      role: "Computer Systems Specialist",
      github_url: "https://github.com/username/cheme-car",
      demo_url: null,
      challenges: [
        {
          id: 13,
          project_id: 4,
          description:
            "Designing robust sensor systems for a chemically reactive environment",
          created_at: "2023-01-01T00:00:00Z",
        },
        {
          id: 14,
          project_id: 4,
          description:
            "Implementing precise timing mechanisms for chemical reactions",
          created_at: "2023-01-01T00:00:00Z",
        },
        {
          id: 15,
          project_id: 4,
          description:
            "Ensuring reliability of electronic components in varying conditions",
          created_at: "2023-01-01T00:00:00Z",
        },
        {
          id: 16,
          project_id: 4,
          description:
            "Balancing weight constraints with necessary control systems",
          created_at: "2023-01-01T00:00:00Z",
        },
        {
          id: 17,
          project_id: 4,
          description:
            "Coordinating interdisciplinary requirements between chemical and computer systems",
          created_at: "2023-01-01T00:00:00Z",
        },
      ],
      milestones: [
        {
          id: 16,
          project_id: 4,
          description: "Initial design and concept development",
          due_date: "2023-10-31",
          completed: true,
          created_at: "2023-01-01T00:00:00Z",
        },
        {
          id: 17,
          project_id: 4,
          description: "Prototype construction and testing",
          due_date: "2023-12-15",
          completed: true,
          created_at: "2023-01-01T00:00:00Z",
        },
        {
          id: 18,
          project_id: 4,
          description: "Control system implementation",
          due_date: "2024-01-31",
          completed: true,
          created_at: "2023-01-01T00:00:00Z",
        },
        {
          id: 19,
          project_id: 4,
          description: "Regional competition preparation",
          due_date: "2024-03-15",
          completed: true,
          created_at: "2023-01-01T00:00:00Z",
        },
        {
          id: 20,
          project_id: 4,
          description: "National competition",
          due_date: "2024-04-30",
          completed: true,
          created_at: "2023-01-01T00:00:00Z",
        },
      ],
      tags: [
        {
          id: 16,
          name: "Chemical Engineering",
          created_at: "2023-01-01T00:00:00Z",
        },
        { id: 17, name: "Arduino", created_at: "2023-01-01T00:00:00Z" },
        { id: 18, name: "Sensors", created_at: "2023-01-01T00:00:00Z" },
        { id: 19, name: "Control Systems", created_at: "2023-01-01T00:00:00Z" },
        {
          id: 20,
          name: "Interdisciplinary",
          created_at: "2023-01-01T00:00:00Z",
        },
        { id: 21, name: "AIChE", created_at: "2023-01-01T00:00:00Z" },
        { id: 22, name: "Competition", created_at: "2023-01-01T00:00:00Z" },
        {
          id: 23,
          name: "Data Acquisition",
          created_at: "2023-01-01T00:00:00Z",
        },
      ],
    },
  };

  return projects[slug] || null;
}

export async function getAllProjectSlugs(): Promise<string[]> {
  return [
    "homeowner-loss-history-prediction",
    "security-data-tool",
    "ai-powered-portfolio",
    "cheme-car-competition-project",
  ];
}
