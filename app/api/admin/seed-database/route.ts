import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function POST() {
  try {
    const supabase = createServerSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: "Failed to create Supabase client" }, { status: 500 })
    }

    // Seed categories
    const categories = [
      { name: "Web Development", slug: "web-development", description: "Articles about web development" },
      { name: "Machine Learning", slug: "machine-learning", description: "Articles about machine learning" },
      { name: "Quantum Computing", slug: "quantum-computing", description: "Articles about quantum computing" },
    ]

    for (const category of categories) {
      const { error: categoryError } = await supabase.from("categories").upsert({ ...category }, { onConflict: "slug" })

      if (categoryError) {
        console.error("Error seeding category:", categoryError)
      }
    }

    // Get category IDs
    const { data: categoryData } = await supabase.from("categories").select("id, slug")
    const categoryMap =
      categoryData?.reduce((acc, cat) => {
        acc[cat.slug] = cat.id
        return acc
      }, {}) || {}

    // Seed blog posts
    const blogPosts = [
      {
        title: "Introduction to Web Development",
        slug: "introduction-to-web-development",
        excerpt: "Learn the basics of web development including HTML, CSS, and JavaScript.",
        content:
          "# Introduction to Web Development\n\nWeb development is the process of building and maintaining websites...",
        image_url: "/web-development-concept.png",
        published: true,
        featured: true,
        category_id: categoryMap["web-development"],
      },
      {
        title: "Machine Learning Fundamentals",
        slug: "machine-learning-fundamentals",
        excerpt: "An overview of machine learning concepts and applications.",
        content: "# Machine Learning Fundamentals\n\nMachine learning is a subset of artificial intelligence...",
        image_url: "/machine-learning-concept.png",
        published: true,
        featured: true,
        category_id: categoryMap["machine-learning"],
      },
      {
        title: "Quantum Computing Explained",
        slug: "quantum-computing-explained",
        excerpt: "Understanding the principles of quantum computing and its potential.",
        content:
          "# Quantum Computing Explained\n\nQuantum computing is a type of computation that harnesses quantum mechanics...",
        image_url: "/quantum-computing-concept.png",
        published: true,
        featured: true,
        category_id: categoryMap["quantum-computing"],
      },
    ]

    for (const post of blogPosts) {
      const { error: postError } = await supabase.from("blog_posts").upsert({ ...post }, { onConflict: "slug" })

      if (postError) {
        console.error("Error seeding blog post:", postError)
      }
    }

    // Seed projects
    const projects = [
      {
        title: "Portfolio Website",
        slug: "portfolio-website",
        description: "A personal portfolio website built with Next.js and Tailwind CSS.",
        summary: "A modern, responsive portfolio website showcasing my projects and skills.",
        thumbnail_url: "/portfolio-website-showcase.png",
        github_url: "https://github.com/username/portfolio",
        demo_url: "https://portfolio.example.com",
        is_featured: true,
        status: "completed",
      },
      {
        title: "Machine Learning Dashboard",
        slug: "machine-learning-dashboard",
        description: "A dashboard for visualizing machine learning model performance.",
        summary: "Interactive dashboard for monitoring and analyzing ML model metrics.",
        thumbnail_url: "/machine-learning-dashboard.png",
        github_url: "https://github.com/username/ml-dashboard",
        demo_url: "https://ml-dashboard.example.com",
        is_featured: true,
        status: "completed",
      },
      {
        title: "Quantum Algorithm Simulator",
        slug: "quantum-algorithm-simulator",
        description: "A simulator for quantum algorithms using Qiskit.",
        summary: "Web-based simulator for testing and visualizing quantum algorithms.",
        thumbnail_url: "/quantum-computing-concept.png",
        github_url: "https://github.com/username/quantum-simulator",
        demo_url: "https://quantum-simulator.example.com",
        is_featured: true,
        status: "in-progress",
      },
    ]

    for (const project of projects) {
      const { error: projectError } = await supabase.from("projects").upsert({ ...project }, { onConflict: "slug" })

      if (projectError) {
        console.error("Error seeding project:", projectError)
      }
    }

    // Seed skills
    const skills = [
      { name: "JavaScript", category: "Programming", proficiency: 9, is_featured: true, order_index: 1 },
      { name: "TypeScript", category: "Programming", proficiency: 8, is_featured: true, order_index: 2 },
      { name: "React", category: "Frontend", proficiency: 9, is_featured: true, order_index: 1 },
      { name: "Next.js", category: "Frontend", proficiency: 8, is_featured: true, order_index: 2 },
      { name: "Node.js", category: "Backend", proficiency: 8, is_featured: true, order_index: 1 },
      { name: "Python", category: "Programming", proficiency: 7, is_featured: true, order_index: 3 },
      { name: "Machine Learning", category: "Data Science", proficiency: 7, is_featured: true, order_index: 1 },
      { name: "SQL", category: "Database", proficiency: 8, is_featured: true, order_index: 1 },
    ]

    for (const skill of skills) {
      const { error: skillError } = await supabase
        .from("skills")
        .upsert({ ...skill }, { onConflict: ["name", "category"] })

      if (skillError) {
        console.error("Error seeding skill:", skillError)
      }
    }

    return NextResponse.json({ success: true, message: "Database seeded successfully" })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json({ success: false, error: "Failed to seed database" }, { status: 500 })
  }
}
