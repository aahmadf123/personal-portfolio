import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import {
  revalidateProjects,
  revalidateBlog,
  revalidateSkills,
  revalidateResearchProjects,
} from "@/lib/revalidation-utils"

// Change from export const dynamic = "force-dynamic" to configuration object
export const dynamic = "force-dynamic"

export async function POST(request: Request, { params }: { params: { contentType: string } }) {
  try {
    const { contentType } = params
    const data = await request.json()
    const supabase = createServerSupabaseClient()

    let result

    switch (contentType) {
      case "projects":
        const { data: projectData, error: projectError } = await supabase
          .from("projects")
          .insert(data)
          .select()
          .single()

        if (projectError) throw projectError
        result = projectData
        await revalidateProjects()
        break

      case "blog-posts":
        const { data: blogData, error: blogError } = await supabase.from("blog_posts").insert(data).select().single()

        if (blogError) throw blogError
        result = blogData
        await revalidateBlog()
        break

      case "skills":
        const { data: skillData, error: skillError } = await supabase.from("skills").insert(data).select().single()

        if (skillError) throw skillError
        result = skillData
        await revalidateSkills()
        break

      case "research-projects":
        const { data: researchData, error: researchError } = await supabase
          .from("research_projects")
          .insert(data)
          .select()
          .single()

        if (researchError) throw researchError
        result = researchData
        await revalidateResearchProjects()
        break

      default:
        return NextResponse.json({ error: `Unsupported content type: ${contentType}` }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error(`Error in ${params.contentType} API:`, error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "An error occurred" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { contentType: string } }) {
  try {
    const { contentType } = params
    const data = await request.json()
    const { id, ...updateData } = data

    if (!id) {
      return NextResponse.json({ error: "ID is required for updates" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    let result

    switch (contentType) {
      case "projects":
        const { data: projectData, error: projectError } = await supabase
          .from("projects")
          .update(updateData)
          .eq("id", id)
          .select()
          .single()

        if (projectError) throw projectError
        result = projectData
        await revalidateProjects()
        break

      case "blog-posts":
        const { data: blogData, error: blogError } = await supabase
          .from("blog_posts")
          .update(updateData)
          .eq("id", id)
          .select()
          .single()

        if (blogError) throw blogError
        result = blogData
        await revalidateBlog()
        break

      case "skills":
        const { data: skillData, error: skillError } = await supabase
          .from("skills")
          .update(updateData)
          .eq("id", id)
          .select()
          .single()

        if (skillError) throw skillError
        result = skillData
        await revalidateSkills()
        break

      case "research-projects":
        const { data: researchData, error: researchError } = await supabase
          .from("research_projects")
          .update(updateData)
          .eq("id", id)
          .select()
          .single()

        if (researchError) throw researchError
        result = researchData
        await revalidateResearchProjects()
        break

      default:
        return NextResponse.json({ error: `Unsupported content type: ${contentType}` }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error(`Error in ${params.contentType} API:`, error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "An error occurred" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { contentType: string } }) {
  try {
    const { contentType } = params
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID is required for deletion" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    let result

    switch (contentType) {
      case "projects":
        const { data: projectData, error: projectError } = await supabase
          .from("projects")
          .delete()
          .eq("id", id)
          .select()
          .single()

        if (projectError) throw projectError
        result = projectData
        await revalidateProjects()
        break

      case "blog-posts":
        const { data: blogData, error: blogError } = await supabase
          .from("blog_posts")
          .delete()
          .eq("id", id)
          .select()
          .single()

        if (blogError) throw blogError
        result = blogData
        await revalidateBlog()
        break

      case "skills":
        const { data: skillData, error: skillError } = await supabase
          .from("skills")
          .delete()
          .eq("id", id)
          .select()
          .single()

        if (skillError) throw skillError
        result = skillData
        await revalidateSkills()
        break

      case "research-projects":
        const { data: researchData, error: researchError } = await supabase
          .from("research_projects")
          .delete()
          .eq("id", id)
          .select()
          .single()

        if (researchError) throw researchError
        result = researchData
        await revalidateResearchProjects()
        break

      default:
        return NextResponse.json({ error: `Unsupported content type: ${contentType}` }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error(`Error in ${params.contentType} API:`, error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "An error occurred" }, { status: 500 })
  }
}
