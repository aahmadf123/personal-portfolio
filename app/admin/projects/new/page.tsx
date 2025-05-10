import { createServerSupabaseClient } from "@/lib/supabase"
import { redirect } from "next/navigation"
import { ProjectForm } from "../_components/project-form"

export default async function NewProjectPage() {
  const supabase = createServerSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Get all tags
  const { data: tags } = await supabase.from("tags").select("*").order("name")

  async function createProject(formData: FormData) {
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
    const completion = Number.parseInt(formData.get("completion") as string)
    const start_date = formData.get("start_date") as string
    const end_date = (formData.get("end_date") as string) || null
    const priority = formData.get("priority") as string
    const image_url = formData.get("image_url") as string
    const github_url = formData.get("github_url") as string
    const demo_url = formData.get("demo_url") as string
    const role = formData.get("role") as string
    const team_size = Number.parseInt(formData.get("team_size") as string) || 1
    const detailed_description = formData.get("detailed_description") as string

    // Process arrays
    const key_achievements = formData.get("key_achievements") as string
    const technologies = formData.get("technologies") as string

    const key_achievements_array = key_achievements
      ? key_achievements.split("\n").filter((item) => item.trim() !== "")
      : []

    const technologies_array = technologies
      ? technologies
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item !== "")
      : []

    // Create project
    const { data: project } = await supabase
      .from("projects")
      .insert({
        title,
        slug,
        description,
        completion,
        start_date,
        end_date,
        priority,
        image_url,
        github_url,
        demo_url,
        role,
        team_size,
        detailed_description,
        key_achievements: key_achievements_array,
        technologies: technologies_array,
      })
      .select()
      .single()

    if (!project) {
      throw new Error("Failed to create project")
    }

    // Handle tags
    const selectedTags = formData.getAll("tags") as string[]
    if (selectedTags.length > 0) {
      const projectTags = selectedTags.map((tagId) => ({
        project_id: project.id,
        tag_id: Number.parseInt(tagId),
      }))

      await supabase.from("project_tags").insert(projectTags)
    }

    // Handle challenges
    const challenges = formData.getAll("new_challenge") as string[]
    const projectChallenges = challenges
      .filter((desc) => desc.trim() !== "")
      .map((description) => ({
        project_id: project.id,
        description,
      }))

    if (projectChallenges.length > 0) {
      await supabase.from("project_challenges").insert(projectChallenges)
    }

    // Handle milestones
    const descriptions = formData.getAll("new_milestone_description") as string[]
    const dueDates = formData.getAll("new_milestone_due_date") as string[]
    const completed = formData.getAll("new_milestone_completed") as string[]

    const milestones = []
    for (let i = 0; i < descriptions.length; i++) {
      if (descriptions[i].trim() !== "") {
        milestones.push({
          project_id: project.id,
          description: descriptions[i],
          due_date: dueDates[i] || null,
          completed: completed[i] === "true",
        })
      }
    }

    if (milestones.length > 0) {
      await supabase.from("project_milestones").insert(milestones)
    }

    redirect("/admin/projects")
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Create New Project</h1>

      <ProjectForm tags={tags || []} selectedTagIds={[]} challenges={[]} milestones={[]} action={createProject} />
    </div>
  )
}
