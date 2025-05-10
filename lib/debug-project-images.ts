import { createServerSupabaseClient } from "./supabase"

export async function debugProjectImages(projectSlug = "cheme-car-project") {
  const supabase = createServerSupabaseClient()

  console.log(`Debugging image for project: ${projectSlug}`)

  try {
    // Get the specific project
    const { data: project, error } = await supabase
      .from("projects")
      .select(`
        id, 
        title, 
        slug, 
        thumbnail_url, 
        main_image_url, 
        image_url,
        project_images (*)
      `)
      .eq("slug", projectSlug)
      .single()

    if (error) {
      console.error(`Error fetching project ${projectSlug}:`, error)
      return null
    }

    console.log(`Project found: ${project.title} (ID: ${project.id})`)
    console.log(`Image URLs:`)
    console.log(`- thumbnail_url: ${project.thumbnail_url || "none"}`)
    console.log(`- main_image_url: ${project.main_image_url || "none"}`)
    console.log(`- image_url: ${project.image_url || "none"}`)

    if (project.project_images && project.project_images.length > 0) {
      console.log(`Project images (${project.project_images.length}):`)
      project.project_images.forEach((img, i) => {
        console.log(`  ${i + 1}. ${img.url || "no URL"} (is_main: ${img.is_main || false})`)
      })
    } else {
      console.log(`No project_images found`)
    }

    return project
  } catch (error) {
    console.error(`Error in debugProjectImages:`, error)
    return null
  }
}

export async function getProjectWithImages() {
  try {
    const supabase = createServerSupabaseClient()

    // Get all projects with image URLs
    const { data: projects, error } = await supabase
      .from("projects")
      .select(`
        id, 
        title, 
        slug, 
        thumbnail_url, 
        main_image_url, 
        image_url,
        is_featured
      `)
      .order("id")

    if (error) {
      console.error("Error fetching projects:", error)
      return []
    }

    console.log(`Found ${projects.length} projects:`)
    projects.forEach((p) => {
      console.log(`- ${p.title} (${p.slug}):`)
      console.log(`  Featured: ${p.is_featured}`)
      console.log(`  Image URLs:`)
      console.log(`    thumbnail_url: ${p.thumbnail_url || "none"}`)
      console.log(`    main_image_url: ${p.main_image_url || "none"}`)
      console.log(`    image_url: ${p.image_url || "none"}`)
    })

    return projects
  } catch (error) {
    console.error("Error in getProjectWithImages:", error)
    return []
  }
}
