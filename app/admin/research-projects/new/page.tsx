import { ResearchProjectForm } from "../_components/research-project-form"
import { createServerSupabaseClient } from "@/lib/supabase"
import { redirect } from "next/navigation"

export const metadata = {
  title: "Create Research Project | Admin",
  description: "Create a new research and development project",
}

export default async function NewResearchProjectPage() {
  const supabase = createServerSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  async function createResearchProject(formData: FormData) {
    "use server"

    const supabase = createServerSupabaseClient()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return redirect("/login")
    }

    // Extract project data
    const title = formData.get("title") as string
    const slug = formData.get("slug") as string
    const description = formData.get("description") as string
    const longDescription = formData.get("long_description") as string
    const completion = Number.parseInt(formData.get("completion") as string)
    const startDate = formData.get("start_date") as string
    const endDate = (formData.get("end_date") as string) || null
    const daysRemaining = Number.parseInt(formData.get("days_remaining") as string) || 0
    const priority = formData.get("priority") as string
    const category = formData.get("category") as string
    const imageUrl = formData.get("image_url") as string
    const nextMilestone = formData.get("next_milestone") as string

    // Insert the main project data
    const { data: project, error } = await supabase
      .from("research_projects")
      .insert({
        title,
        slug,
        description,
        long_description: longDescription,
        completion,
        start_date: startDate,
        end_date: endDate,
        days_remaining: daysRemaining,
        priority,
        category,
        image_url: imageUrl,
        next_milestone: nextMilestone,
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating research project:", error)
      throw new Error("Failed to create research project")
    }

    const projectId = project.id

    // Process tags
    const tags = formData.getAll("tags") as string[]

    if (tags.length > 0) {
      const tagData = tags.map((tag) => ({
        research_project_id: projectId,
        name: tag,
      }))

      await supabase.from("research_project_tags").insert(tagData)
    }

    // Process challenges
    const challenges = formData.getAll("challenges") as string[]

    if (challenges.length > 0) {
      const challengeData = challenges.map((description) => ({
        research_project_id: projectId,
        description,
      }))

      await supabase.from("research_project_challenges").insert(challengeData)
    }

    // Process updates
    const updateDates = formData.getAll("update_dates") as string[]
    const updateTexts = formData.getAll("update_texts") as string[]

    if (updateDates.length > 0 && updateDates.length === updateTexts.length) {
      const updateData = updateDates.map((date, index) => ({
        research_project_id: projectId,
        date,
        text: updateTexts[index],
      }))

      await supabase.from("research_project_updates").insert(updateData)
    }

    // Process team members
    const teamMembers = formData.getAll("team_members") as string[]

    if (teamMembers.length > 0) {
      const teamData = teamMembers.map((member) => {
        const isLead = member.includes("(Lead)")
        const name = isLead ? member.replace(" (Lead)", "") : member

        return {
          research_project_id: projectId,
          name,
          is_lead: isLead,
        }
      })

      await supabase.from("research_project_team_members").insert(teamData)
    }

    // Process resources
    const resourceNames = formData.getAll("resource_names") as string[]
    const resourceUrls = formData.getAll("resource_urls") as string[]

    if (resourceNames.length > 0 && resourceNames.length === resourceUrls.length) {
      const resourceData = resourceNames.map((name, index) => ({
        research_project_id: projectId,
        name,
        url: resourceUrls[index],
      }))

      await supabase.from("research_project_resources").insert(resourceData)
    }

    redirect("/admin/research-projects")
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Create New Research Project</h1>

      <ResearchProjectForm action={createResearchProject} />
    </div>
  )
}
