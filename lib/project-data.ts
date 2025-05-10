import type { Project } from "@/types/projects"

// Fallback project data based on Ahmad's resume
const fallbackProjects: Project[] = [
  {
    id: 1,
    title: "Homeowner Loss History Prediction Project",
    slug: "homeowner-loss-history-prediction",
    description:
      "Senior design project focused on predicting homeowner insurance claims using machine learning techniques. Orchestrated collaboration between the Mathematics & Statistics department and an insurance company, enhancing claim predictions by 25% using Machine Learning and informing risk-based premium adjustments.",
    completion: 75,
    priority: "high",
    start_date: "2024-08-01",
    end_date: "2025-05-01",
    image_url: "/homeowner-loss-prediction.png",
    tags: [
      "Machine Learning",
      "XGBoost",
      "Data Science",
      "Insurance",
      "Senior Design",
      "Python",
      "Data Pipelines",
      "CI/CD",
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    challenges: [
      {
        id: 1,
        project_id: 1,
        description: "Developing accurate prediction models with limited historical data",
        created_at: new Date().toISOString(),
      },
      {
        id: 2,
        project_id: 1,
        description: "Implementing human-in-the-loop validation while maintaining automation",
        created_at: new Date().toISOString(),
      },
    ],
    milestones: [
      {
        id: 1,
        project_id: 1,
        description: "Developed 5 XGBoost models with optimized EDA and feature engineering",
        due_date: "2024-09-15",
        completed: true,
        created_at: new Date().toISOString(),
      },
      {
        id: 2,
        project_id: 1,
        description: "Engineered end-to-end data pipelines with self-healing protocols",
        due_date: "2024-10-30",
        completed: true,
        created_at: new Date().toISOString(),
      },
      {
        id: 3,
        project_id: 1,
        description: "Constructed CI/CD pipeline with Bayesian optimization",
        due_date: "2024-12-15",
        completed: true,
        created_at: new Date().toISOString(),
      },
    ],
    detailed_description: `Orchestrated collaboration between the Mathematics & Statistics department and an insurance company, enhancing claim predictions by 25% using Machine Learning and informing risk-based premium adjustments.

Developed 5 XGBoost models, optimizing EDA, feature engineering, and hyperparameter tuning to improve predictive accuracy.

Engineered end-to-end data pipelines incorporating human-in-the-loop validation and self-healing protocols, improving model stability by 60% and slashing model retraining frequency by 40% through automated hyperparameter optimization.

Constructed a resilient CI/CD pipeline leveraging Bayesian optimization and data drift detection; decreased manual intervention by 75% and accelerated model retraining cycles from weekly to daily.`,
    key_achievements: [
      "Enhanced claim predictions by 25% using Machine Learning",
      "Improved model stability by 60% through self-healing protocols",
      "Decreased manual intervention by 75% with automated CI/CD pipeline",
      "Accelerated model retraining cycles from weekly to daily",
    ],
    team_size: 4,
    role: "Lead Data Scientist",
    technologies: ["Python", "XGBoost", "Pandas", "NumPy", "CI/CD", "Bayesian Optimization"],
  },
  {
    id: 2,
    title: "Security Data Tool (SDT) Project",
    slug: "security-data-tool",
    description:
      "Database team project focused on enhancing security data management and incident response. Established data governance framework across Active Directory, Cisco AMP, Microsoft Defender, and Rapid7; enhanced incident response times by 15% through centralized security database implementation.",
    completion: 100,
    priority: "high",
    start_date: "2023-05-01",
    end_date: "2023-08-01",
    image_url: "/security-database-visualization.png",
    tags: ["PostgreSQL", "Security", "Database", "Data Governance", "SQL", "Disaster Recovery"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    challenges: [
      {
        id: 3,
        project_id: 2,
        description: "Integrating disparate security systems with different data formats",
        created_at: new Date().toISOString(),
      },
      {
        id: 4,
        project_id: 2,
        description: "Ensuring compliance with security regulations while maintaining usability",
        created_at: new Date().toISOString(),
      },
    ],
    milestones: [
      {
        id: 4,
        project_id: 2,
        description: "Established data governance framework across multiple security systems",
        due_date: "2023-06-01",
        completed: true,
        created_at: new Date().toISOString(),
      },
      {
        id: 5,
        project_id: 2,
        description: "Implemented comprehensive data validation rules in PostgreSQL",
        due_date: "2023-07-01",
        completed: true,
        created_at: new Date().toISOString(),
      },
      {
        id: 6,
        project_id: 2,
        description: "Revamped disaster recovery testing regime with quarterly simulations",
        due_date: "2023-08-01",
        completed: true,
        created_at: new Date().toISOString(),
      },
    ],
    detailed_description: `Established data governance framework across Active Directory, Cisco AMP, Microsoft Defender, and Rapid7; enhanced incident response times by 15% through centralized security database implementation and help data accessibility.

Implemented comprehensive data validation rules within the PostgreSQL database, catching 95% of non-compliant data entries and ensuring adherence to industry regulations, this boost data accuracy for security reporting.

Revamped disaster recovery testing regime, conducting quarterly simulations to identify vulnerabilities, leading to zero data loss incidents during simulated events, and better security for the entire organization.`,
    key_achievements: [
      "Enhanced incident response times by 15% through centralized database",
      "Caught 95% of non-compliant data entries with validation rules",
      "Achieved zero data loss during simulated disaster recovery events",
      "Improved security reporting accuracy by standardizing data formats",
    ],
    team_size: 3,
    role: "Database Engineer",
    technologies: ["PostgreSQL", "SQL", "Data Validation", "Security Systems Integration"],
  },
  {
    id: 3,
    title: "ChemE Car Project",
    slug: "cheme-car-project",
    description:
      "Led the development of a chemically-powered vehicle for the AIChE ChemE Car Competition. Designed and built an autonomous car powered by a chemical reaction, optimizing for precision stopping distance and payload requirements.",
    completion: 100,
    priority: "high",
    start_date: "2023-09-01",
    end_date: "2023-12-01",
    image_url: "/cheme-car-team.jpeg",
    tags: ["Chemical Engineering", "Mechanical Design", "Team Leadership", "Competition", "Autonomous Systems"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    challenges: [
      {
        id: 5,
        project_id: 3,
        description: "Developing a reliable chemical timing mechanism for precise stopping",
        created_at: new Date().toISOString(),
      },
      {
        id: 6,
        project_id: 3,
        description: "Optimizing the car design for both speed and payload capacity",
        created_at: new Date().toISOString(),
      },
    ],
    milestones: [
      {
        id: 7,
        project_id: 3,
        description: "Completed initial prototype design and testing",
        due_date: "2023-10-01",
        completed: true,
        created_at: new Date().toISOString(),
      },
      {
        id: 8,
        project_id: 3,
        description: "Optimized chemical reaction timing mechanism",
        due_date: "2023-11-15",
        completed: true,
        created_at: new Date().toISOString(),
      },
      {
        id: 9,
        project_id: 3,
        description: "Participated in regional AIChE ChemE Car Competition",
        due_date: "2023-12-01",
        completed: true,
        created_at: new Date().toISOString(),
      },
    ],
    detailed_description: `Led a team of 12 chemical engineering students in designing and building an autonomous car powered by a chemical reaction for the AIChE ChemE Car Competition.

Developed an innovative hydrogen fuel cell system that provided consistent power output while meeting all safety requirements and competition guidelines.

Engineered a precise iodine clock reaction timing mechanism that allowed the car to stop within 10% of the target distance, significantly improving upon previous team performances.

Coordinated interdisciplinary collaboration between chemical, mechanical, and electrical engineering aspects of the project, resulting in a cohesive and reliable final design.

The team successfully placed in the top 5 at the regional competition, qualifying for the national competition.`,
    key_achievements: [
      "Designed an innovative hydrogen fuel cell power system",
      "Achieved stopping accuracy within 10% of target distance",
      "Led team to top 5 placement at regional competition",
      "Successfully integrated chemical, mechanical, and electrical systems",
    ],
    team_size: 12,
    role: "Team Leader & Chemical Systems Designer",
    technologies: ["Hydrogen Fuel Cell", "CAD Design", "Chemical Reaction Kinetics", "Mechanical Engineering"],
  },
  {
    id: 4,
    title: "AI-Powered Portfolio Website",
    slug: "ai-powered-portfolio",
    description:
      "Personal portfolio website with AI-powered features including content generation, chat assistance, and dynamic visualizations. Built with Next.js, React, and Supabase to showcase projects and skills in an interactive format.",
    completion: 100,
    priority: "high",
    start_date: "2023-09-01",
    end_date: "2023-12-01",
    image_url: "/ai-portfolio-website.png",
    tags: ["Next.js", "React", "Supabase", "AI", "Portfolio", "TypeScript", "Tailwind CSS"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    challenges: [
      {
        id: 7,
        project_id: 4,
        description: "Optimizing performance while maintaining rich visual elements",
        created_at: new Date().toISOString(),
      },
      {
        id: 8,
        project_id: 4,
        description: "Implementing responsive design across all device types",
        created_at: new Date().toISOString(),
      },
    ],
    milestones: [
      {
        id: 10,
        project_id: 4,
        description: "Designed and implemented core portfolio structure",
        due_date: "2023-10-01",
        completed: true,
        created_at: new Date().toISOString(),
      },
      {
        id: 11,
        project_id: 4,
        description: "Integrated AI-powered content generation features",
        due_date: "2023-11-15",
        completed: true,
        created_at: new Date().toISOString(),
      },
      {
        id: 12,
        project_id: 4,
        description: "Added interactive visualizations and animations",
        due_date: "2023-12-01",
        completed: true,
        created_at: new Date().toISOString(),
      },
    ],
    detailed_description: `Personal portfolio website with AI-powered features including content generation, chat assistance, and dynamic visualizations. Built with Next.js, React, and Supabase to showcase projects and skills in an interactive format.

The site features responsive design that works across all device types, optimized performance while maintaining rich visual elements, and accessibility features for all users.

Integrated AI-powered content generation to dynamically create and update portfolio content, implemented interactive visualizations to showcase skills and projects, and added animations to enhance user experience.`,
    key_achievements: [
      "Built fully responsive portfolio with Next.js and React",
      "Integrated AI-powered content generation features",
      "Created interactive visualizations for skills and projects",
      "Implemented performance optimizations for fast loading",
    ],
    team_size: 1,
    role: "Full Stack Developer",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "AI Integration"],
  },
]

// Function to get featured projects - client-safe version
export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
  try {
    // For now, just return the fallback projects to avoid API issues
    return fallbackProjects.slice(0, limit)
  } catch (error) {
    console.error("Error in getFeaturedProjects:", error)
    return fallbackProjects.slice(0, limit)
  }
}

// Function to get all projects - client-safe version
export async function getAllProjects(): Promise<Project[]> {
  try {
    // For now, just return the fallback projects to avoid API issues
    return fallbackProjects
  } catch (error) {
    console.error("Error in getAllProjects:", error)
    return fallbackProjects
  }
}

// Function to get a project by slug - client-safe version
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    // For now, just return the fallback project with the matching slug
    const fallbackProject = fallbackProjects.find((p) => p.slug === slug)
    return fallbackProject || null
  } catch (error) {
    console.error(`Error in getProjectBySlug for slug ${slug}:`, error)
    // Return the fallback project with the matching slug
    const fallbackProject = fallbackProjects.find((p) => p.slug === slug)
    return fallbackProject || null
  }
}

// Export fallback projects for use in API routes
export { fallbackProjects }
