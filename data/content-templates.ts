export interface ContentCategory {
  id: string
  name: string
  description: string
  color: string
  isDefault?: boolean
}

export interface ContentTemplate {
  id: string
  name: string
  description: string
  category: string
  categoryIds: string[] // Support multiple categories
  template: string
}

// Default categories
export const defaultCategories: ContentCategory[] = [
  {
    id: "project",
    name: "Projects",
    description: "Templates for project documentation and showcases",
    color: "#3b82f6", // blue
    isDefault: true,
  },
  {
    id: "blog",
    name: "Blog Posts",
    description: "Templates for various types of blog content",
    color: "#10b981", // green
    isDefault: true,
  },
  {
    id: "case-study",
    name: "Case Studies",
    description: "Templates for detailed case studies",
    color: "#8b5cf6", // purple
    isDefault: true,
  },
  {
    id: "skill",
    name: "Skills",
    description: "Templates for skill descriptions and showcases",
    color: "#f59e0b", // amber
    isDefault: true,
  },
  {
    id: "about",
    name: "About",
    description: "Templates for personal and professional bios",
    color: "#ec4899", // pink
    isDefault: true,
  },
  {
    id: "research",
    name: "Research",
    description: "Templates for research papers and summaries",
    color: "#6366f1", // indigo
    isDefault: true,
  },
]

// Custom categories (will be stored in localStorage)
export const getInitialCustomCategories = (): ContentCategory[] => {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem("customCategories")
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch (e) {
      console.error("Failed to parse custom categories", e)
      return []
    }
  }
  return []
}

export const contentTemplates: ContentTemplate[] = [
  {
    id: "project-standard",
    name: "Standard Project",
    description: "A comprehensive project description with goals, technologies, and outcomes",
    category: "project", // For backward compatibility
    categoryIds: ["project"],
    template: `# [Project Name]

## Overview
A brief 2-3 sentence description of the project, its purpose, and its primary value proposition.

## Problem Statement
Describe the problem this project aims to solve. What challenges existed that prompted this work?

## Technologies Used
- [Primary Technology/Language]
- [Framework/Library]
- [Database/Storage]
- [Other Key Technologies]

## Key Features
- **[Feature Name]**: Brief description of this feature and its value
- **[Feature Name]**: Brief description of this feature and its value
- **[Feature Name]**: Brief description of this feature and its value

## Implementation Details
Describe the technical approach, architecture decisions, and any interesting engineering challenges that were overcome.

## Results & Impact
Outline the outcomes of the project. Include metrics, user feedback, or business impact where applicable.

## Future Enhancements
- [Potential enhancement or feature]
- [Potential enhancement or feature]

## Links
- [GitHub Repository](url)
- [Live Demo](url) (if applicable)
- [Documentation](url) (if applicable)`,
  },
  {
    id: "project-research",
    name: "Research Project",
    description: "A template for academic or research-oriented projects",
    category: "project",
    categoryIds: ["project", "research"],
    template: `# [Research Project Title]

## Abstract
A concise summary of the research project, its methodology, and key findings (150-200 words).

## Introduction
Provide context for the research, including the gap in existing knowledge this work addresses.

## Research Questions
- [Primary research question]
- [Secondary research question] (if applicable)
- [Tertiary research question] (if applicable)

## Methodology
Describe the research approach, data collection methods, and analytical techniques employed.

## Key Findings
- **[Finding 1]**: Explanation and significance
- **[Finding 2]**: Explanation and significance
- **[Finding 3]**: Explanation and significance

## Implications
Discuss the theoretical and/or practical implications of the research findings.

## Future Research Directions
Outline potential avenues for future research building on this work.

## Publications & Citations
- [Publication details] (if applicable)
- [Citation information] (if applicable)

## Acknowledgments
Recognize collaborators, funding sources, or institutions that supported this research.`,
  },
  {
    id: "blog-technical",
    name: "Technical Blog Post",
    description: "A detailed technical blog post with code examples and explanations",
    category: "blog",
    categoryIds: ["blog"],
    template: `# [Technical Blog Post Title]

## Introduction
Hook the reader with a compelling introduction to the technical topic. Why should they care about this? What problem does it solve?

## Prerequisites
- [Prerequisite knowledge/tool]
- [Prerequisite knowledge/tool]
- [Prerequisite knowledge/tool]

## Understanding the Concept
Provide a clear explanation of the core concept or technology being discussed. Use analogies or simplified examples where helpful.

## Step-by-Step Implementation

### Step 1: [First Step Title]
\`\`\`[language]
// Code example for step 1
\`\`\`
Explanation of what the code does and why it's important.

### Step 2: [Second Step Title]
\`\`\`[language]
// Code example for step 2
\`\`\`
Explanation of what the code does and why it's important.

### Step 3: [Third Step Title]
\`\`\`[language]
// Code example for step 3
\`\`\`
Explanation of what the code does and why it's important.

## Common Challenges and Solutions
- **[Challenge 1]**: How to overcome it
- **[Challenge 2]**: How to overcome it
- **[Challenge 3]**: How to overcome it

## Best Practices
Outline recommended approaches and patterns when working with this technology.

## Performance Considerations
Discuss any performance implications or optimization techniques.

## Conclusion
Summarize the key takeaways and encourage readers to experiment with the technology.

## Further Resources
- [Resource 1](url)
- [Resource 2](url)
- [Resource 3](url)`,
  },
  {
    id: "blog-tutorial",
    name: "Step-by-Step Tutorial",
    description: "A comprehensive tutorial with clear instructions and examples",
    category: "blog",
    categoryIds: ["blog"],
    template: `# [Tutorial Title]: A Step-by-Step Guide

## Introduction
Briefly explain what this tutorial will teach and what the reader will be able to accomplish by the end.

## What You'll Need
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

## Setting Up Your Environment
Instructions for preparing the development environment or tools needed for this tutorial.

## Tutorial Steps

### 1. [First Step]
Detailed instructions for completing the first step.

![Step 1 Screenshot/Diagram]

\`\`\`[language]
// Code for step 1
\`\`\`

### 2. [Second Step]
Detailed instructions for completing the second step.

![Step 2 Screenshot/Diagram]

\`\`\`[language]
// Code for step 2
\`\`\`

### 3. [Third Step]
Detailed instructions for completing the third step.

![Step 3 Screenshot/Diagram]

\`\`\`[language]
// Code for step 3
\`\`\`

## Troubleshooting
Common issues you might encounter and how to resolve them:

- **[Issue 1]**: Solution
- **[Issue 2]**: Solution
- **[Issue 3]**: Solution

## Next Steps
Suggestions for how to build upon what was learned in this tutorial.

## Complete Code
\`\`\`[language]
// The complete code for the tutorial
\`\`\`

## Conclusion
Summarize what was learned and encourage readers to share their results or ask questions.`,
  },
  {
    id: "case-study-standard",
    name: "Standard Case Study",
    description: "A comprehensive case study showcasing a project from problem to solution",
    category: "case-study",
    categoryIds: ["case-study"],
    template: `# [Client/Project Name] Case Study

## Executive Summary
A concise overview of the case study, highlighting the key challenge, approach, and results (2-3 sentences).

## Client Background
Brief description of the client or project context. Include industry, size, and relevant background information.

## The Challenge
Detailed explanation of the problem that needed to be solved. What were the pain points? What was at stake?

## Goals & Objectives
- [Primary goal]
- [Secondary goal]
- [Tertiary goal]

## Approach & Methodology
Describe the strategic and tactical approach taken to address the challenge. Include:

1. **Discovery Phase**: How requirements were gathered and analyzed
2. **Strategy Development**: The plan formulated to address the challenge
3. **Implementation**: How the solution was executed
4. **Testing & Refinement**: How the solution was validated and improved

## The Solution
Detailed description of the solution that was implemented, including:

- **Technical Architecture**: Overview of the technical components
- **Key Features**: The most important aspects of the solution
- **Innovation Points**: What made this solution unique or particularly effective

## Results & Impact
Quantifiable outcomes and qualitative benefits of the solution:

- **Metric 1**: [Result] (e.g., 40% increase in conversion rate)
- **Metric 2**: [Result] (e.g., $1.2M in cost savings)
- **Metric 3**: [Result] (e.g., 25% reduction in development time)

Include client testimonials if available.

## Lessons Learned
Insights gained from the project that could be valuable for similar initiatives.

## Conclusion
Final thoughts on the project's significance and lasting impact.`,
  },
  {
    id: "skill-detailed",
    name: "Detailed Skill Description",
    description: "A comprehensive description of a technical skill or expertise area",
    category: "skill",
    categoryIds: ["skill"],
    template: `# [Skill Name]

## Proficiency Level
[Beginner/Intermediate/Advanced/Expert]

## Overview
A concise description of the skill and its importance in your professional toolkit.

## Experience
- **Years of Experience**: [Number] years
- **Projects Completed**: [Number] projects

## Core Competencies
- [Competency 1]
- [Competency 2]
- [Competency 3]
- [Competency 4]
- [Competency 5]

## Notable Projects
1. **[Project Name]**: Brief description of how this skill was applied
2. **[Project Name]**: Brief description of how this skill was applied
3. **[Project Name]**: Brief description of how this skill was applied

## Tools & Technologies
- [Related tool/technology]
- [Related tool/technology]
- [Related tool/technology]

## Certifications & Training
- [Certification/Course Name] ([Year])
- [Certification/Course Name] ([Year])

## Continuous Learning
How you stay current with developments in this skill area.

## Teaching & Mentoring
Any experience sharing this knowledge with others (if applicable).`,
  },
  {
    id: "about-professional",
    name: "Professional Bio",
    description: "A professional biography highlighting your career and expertise",
    category: "about",
    categoryIds: ["about"],
    template: `# About [Your Name]

## Professional Summary
A compelling 2-3 sentence overview of your professional identity, core expertise, and what drives your work.

## Areas of Expertise
- [Primary Expertise Area]
- [Secondary Expertise Area]
- [Tertiary Expertise Area]

## Professional Journey
A narrative description of your career path, highlighting pivotal experiences and how they've shaped your professional development.

## Education & Credentials
- **[Degree]** in [Field of Study] from [Institution] ([Year])
- **[Certification]** from [Issuing Organization] ([Year])
- **[Certification]** from [Issuing Organization] ([Year])

## Professional Philosophy
Your approach to your work and the principles that guide your professional decisions.

## Current Focus
What you're currently working on and passionate about in your professional life.

## Beyond Work
A brief glimpse into your interests outside of your professional life (optional).

## Connect
- [LinkedIn Profile]
- [GitHub Profile]
- [Professional Twitter]
- [Email Address]`,
  },
  {
    id: "research-summary",
    name: "Research Summary",
    description: "A concise summary of a research project or paper",
    category: "research",
    categoryIds: ["research"],
    template: `# [Research Title]

## Abstract
A concise summary of the research, its methodology, findings, and significance (150-200 words).

## Introduction
The context and background of the research area, leading to the specific focus of this work.

## Research Objectives
- [Primary objective]
- [Secondary objective]
- [Tertiary objective]

## Methodology
A description of the research approach, data collection methods, and analytical techniques.

## Key Findings
1. **[Finding 1]**: Explanation and significance
2. **[Finding 2]**: Explanation and significance
3. **[Finding 3]**: Explanation and significance

## Theoretical Contributions
How this research advances theoretical understanding in the field.

## Practical Implications
The real-world applications or impacts of this research.

## Limitations
Acknowledged constraints or limitations of the research.

## Future Research Directions
Potential avenues for extending or building upon this research.

## Publications
- [Publication details] (if applicable)
- [Publication details] (if applicable)

## Funding & Acknowledgments
Recognition of funding sources and collaborators (if applicable).`,
  },
  {
    id: "quantum-concept",
    name: "Quantum Computing Concept",
    description: "An explanation of a quantum computing concept or algorithm",
    category: "research",
    categoryIds: ["research"],
    template: `# [Quantum Concept/Algorithm Name]

## Conceptual Overview
A high-level explanation of the quantum concept or algorithm in accessible terms.

## Mathematical Foundation
The mathematical principles underlying this quantum concept.

\`\`\`
[Mathematical notation or equation]
\`\`\`

## Quantum Mechanical Principles
The quantum mechanical properties or phenomena that this concept leverages.

## Implementation
How this concept is implemented in quantum circuits or algorithms.

\`\`\`
[Circuit diagram or pseudocode]
\`\`\`

## Applications
- **[Application Area 1]**: How this concept is applied
- **[Application Area 2]**: How this concept is applied
- **[Application Area 3]**: How this concept is applied

## Advantages & Limitations
- **Advantages**: The benefits or improvements this quantum approach offers
- **Limitations**: Current constraints or challenges

## Comparison to Classical Approaches
How this quantum concept compares to classical computing approaches for similar problems.

## Current Research
Recent developments or ongoing research related to this quantum concept.

## Resources for Further Learning
- [Resource 1](url)
- [Resource 2](url)
- [Resource 3](url)`,
  },
]

// Helper functions for category management
export const saveCustomCategories = (categories: ContentCategory[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("customCategories", JSON.stringify(categories))
  }
}

export const getAllCategories = (): ContentCategory[] => {
  const customCategories = getInitialCustomCategories()
  return [...defaultCategories, ...customCategories]
}
