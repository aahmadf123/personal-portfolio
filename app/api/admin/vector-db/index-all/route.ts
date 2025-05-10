import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { chunkText, storeDocument, deleteDocument } from "@/lib/vector-database"

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || ""
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: NextRequest) {
  try {
    // First, clear existing records (optional, can be commented out if you want to keep existing records)
    const { data: existingRecords } = await supabase.from("vector_store").select("id")

    if (existingRecords && existingRecords.length > 0) {
      for (const record of existingRecords) {
        await deleteDocument(record.id)
      }
    }

    let totalIndexed = 0

    // Index blog posts
    const { data: blogPosts, error: blogError } = await supabase
      .from("blog_posts")
      .select("id, title, content, excerpt, slug, category_id")
      .eq("published", true)

    if (blogError) {
      console.error("Error fetching blog posts:", blogError)
    } else if (blogPosts) {
      for (const post of blogPosts) {
        const fullContent = `${post.title}\n\n${post.excerpt || ""}\n\n${post.content || ""}`
        const chunks = chunkText(fullContent)

        for (let i = 0; i < chunks.length; i++) {
          await storeDocument(`blog-${post.id}-chunk-${i}`, chunks[i], {
            type: "blog",
            title: post.title,
            slug: post.slug,
            url: `/blog/${post.slug}`,
            category_id: post.category_id,
          })
          totalIndexed++
        }
      }
    }

    // Index projects
    const { data: projects, error: projectsError } = await supabase
      .from("projects")
      .select("id, title, description, long_description, slug, technologies")

    if (projectsError) {
      console.error("Error fetching projects:", projectsError)
    } else if (projects) {
      for (const project of projects) {
        const fullContent = `${project.title}\n\n${project.description || ""}\n\n${project.long_description || ""}\n\nTechnologies: ${
          Array.isArray(project.technologies) ? project.technologies.join(", ") : project.technologies || ""
        }`
        const chunks = chunkText(fullContent)

        for (let i = 0; i < chunks.length; i++) {
          await storeDocument(`project-${project.id}-chunk-${i}`, chunks[i], {
            type: "project",
            title: project.title,
            slug: project.slug,
            url: `/projects/${project.slug}`,
          })
          totalIndexed++
        }
      }
    }

    // Index case studies
    const { data: caseStudies, error: caseStudiesError } = await supabase
      .from("case_studies")
      .select("id, title, summary, challenge, approach, results, slug")

    if (caseStudiesError) {
      console.error("Error fetching case studies:", caseStudiesError)
    } else if (caseStudies) {
      for (const study of caseStudies) {
        const fullContent = `${study.title}\n\n${study.summary || ""}\n\nChallenge: ${study.challenge || ""}\n\nApproach: ${
          study.approach || ""
        }\n\nResults: ${study.results || ""}`
        const chunks = chunkText(fullContent)

        for (let i = 0; i < chunks.length; i++) {
          await storeDocument(`case-study-${study.id}-chunk-${i}`, chunks[i], {
            type: "case_study",
            title: study.title,
            slug: study.slug,
            url: `/case-studies/${study.slug}`,
          })
          totalIndexed++
        }
      }
    }

    // Index skills
    const { data: skills, error: skillsError } = await supabase
      .from("skills")
      .select("id, name, description, category, proficiency")

    if (skillsError) {
      console.error("Error fetching skills:", skillsError)
    } else if (skills) {
      for (const skill of skills) {
        const fullContent = `${skill.name}\n\nCategory: ${skill.category || ""}\n\nProficiency: ${
          skill.proficiency || ""
        }\n\n${skill.description || ""}`

        await storeDocument(`skill-${skill.id}`, fullContent, {
          type: "skill",
          title: skill.name,
          category: skill.category,
          url: `/skills#${skill.name.toLowerCase().replace(/\s+/g, "-")}`,
        })
        totalIndexed++
      }
    }

    // Add more content types as needed

    return NextResponse.json({ success: true, count: totalIndexed })
  } catch (error) {
    console.error("Error indexing content:", error)
    return NextResponse.json({ error: "Failed to index content" }, { status: 500 })
  }
}
