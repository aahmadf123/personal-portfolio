import { createClient } from "@/lib/supabase"

export async function trackProjectView(
  projectId: number,
  projectSlug: string,
  userAgent: string | null = null,
  ipHash: string | null = null,
  referrer: string | null = null,
) {
  try {
    const supabase = createClient()

    // First, update the view count in the projects table
    const { error: updateError } = await supabase.rpc("increment_project_view_count", {
      project_id: projectId,
    })

    if (updateError) {
      console.error("Error incrementing project view count:", updateError)
    }

    // Then, log the view in the project_views table
    const { error: logError } = await supabase.from("project_views").insert({
      project_id: projectId,
      project_slug: projectSlug,
      viewed_at: new Date().toISOString(),
      user_agent: userAgent,
      ip_hash: ipHash,
      referrer: referrer,
    })

    if (logError) {
      console.error("Error logging project view:", logError)
    }

    return { success: true }
  } catch (error) {
    console.error("Error tracking project view:", error)
    return { success: false, error }
  }
}

export async function trackBlogPostView(
  postId: number,
  postSlug: string,
  userAgent: string | null = null,
  ipHash: string | null = null,
  referrer: string | null = null,
) {
  try {
    const supabase = createClient()

    // First, update the view count in the blog_posts table
    const { error: updateError } = await supabase.rpc("increment_blog_post_view_count", {
      post_id: postId,
    })

    if (updateError) {
      console.error("Error incrementing blog post view count:", updateError)
    }

    // Then, log the view in the blog_post_views table
    const { error: logError } = await supabase.from("blog_post_views").insert({
      post_id: postId,
      post_slug: postSlug,
      viewed_at: new Date().toISOString(),
      user_agent: userAgent,
      ip_hash: ipHash,
      referrer: referrer,
    })

    if (logError) {
      console.error("Error logging blog post view:", logError)
    }

    return { success: true }
  } catch (error) {
    console.error("Error tracking blog post view:", error)
    return { success: false, error }
  }
}

export async function getProjectViewStats(projectId?: number, days = 30) {
  try {
    const supabase = createClient()
    const now = new Date()
    const startDate = new Date(now)
    startDate.setDate(now.getDate() - days)

    let query = supabase
      .from("project_views")
      .select("project_id, project_slug, viewed_at")
      .gte("viewed_at", startDate.toISOString())

    if (projectId) {
      query = query.eq("project_id", projectId)
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    // Process the data to get view counts by day
    const viewsByDay: Record<string, number> = {}
    const viewsByProject: Record<number, number> = {}

    // Initialize all days in the range
    for (let i = 0; i < days; i++) {
      const date = new Date(now)
      date.setDate(now.getDate() - i)
      const dateString = date.toISOString().split("T")[0]
      viewsByDay[dateString] = 0
    }

    data.forEach((view) => {
      const date = new Date(view.viewed_at).toISOString().split("T")[0]
      viewsByDay[date] = (viewsByDay[date] || 0) + 1

      if (view.project_id) {
        viewsByProject[view.project_id] = (viewsByProject[view.project_id] || 0) + 1
      }
    })

    // Get project details for the most viewed projects
    const projectIds = Object.keys(viewsByProject).map(Number)
    let projectDetails: any[] = []

    if (projectIds.length > 0) {
      const { data: projects } = await supabase
        .from("projects")
        .select("id, title, slug, image_url")
        .in("id", projectIds)

      projectDetails = projects || []
    }

    return {
      total: data.length,
      viewsByDay,
      viewsByProject,
      projectDetails,
      recentViews: data.slice(-10).reverse(),
    }
  } catch (error) {
    console.error("Error getting project view stats:", error)
    return {
      total: 0,
      viewsByDay: {},
      viewsByProject: {},
      projectDetails: [],
      recentViews: [],
    }
  }
}

export async function getBlogPostViewStats(postId?: number, days = 30) {
  try {
    const supabase = createClient()
    const now = new Date()
    const startDate = new Date(now)
    startDate.setDate(now.getDate() - days)

    let query = supabase
      .from("blog_post_views")
      .select("post_id, post_slug, viewed_at")
      .gte("viewed_at", startDate.toISOString())

    if (postId) {
      query = query.eq("post_id", postId)
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    // Process the data to get view counts by day
    const viewsByDay: Record<string, number> = {}
    const viewsByPost: Record<number, number> = {}

    // Initialize all days in the range
    for (let i = 0; i < days; i++) {
      const date = new Date(now)
      date.setDate(now.getDate() - i)
      const dateString = date.toISOString().split("T")[0]
      viewsByDay[dateString] = 0
    }

    data.forEach((view) => {
      const date = new Date(view.viewed_at).toISOString().split("T")[0]
      viewsByDay[date] = (viewsByDay[date] || 0) + 1

      if (view.post_id) {
        viewsByPost[view.post_id] = (viewsByPost[view.post_id] || 0) + 1
      }
    })

    // Get post details for the most viewed posts
    const postIds = Object.keys(viewsByPost).map(Number)
    let postDetails: any[] = []

    if (postIds.length > 0) {
      const { data: posts } = await supabase.from("blog_posts").select("id, title, slug, image_url").in("id", postIds)

      postDetails = posts || []
    }

    return {
      total: data.length,
      viewsByDay,
      viewsByPost,
      postDetails,
      recentViews: data.slice(-10).reverse(),
    }
  } catch (error) {
    console.error("Error getting blog post view stats:", error)
    return {
      total: 0,
      viewsByDay: {},
      viewsByPost: {},
      postDetails: [],
      recentViews: [],
    }
  }
}

export async function getTotalViewStats(days = 30) {
  try {
    const projectStats = await getProjectViewStats(undefined, days)
    const blogStats = await getBlogPostViewStats(undefined, days)

    // Combine the data
    const viewsByDay: Record<string, { projects: number; blog: number; total: number }> = {}

    // Initialize all days in the range
    const now = new Date()
    for (let i = 0; i < days; i++) {
      const date = new Date(now)
      date.setDate(now.getDate() - i)
      const dateString = date.toISOString().split("T")[0]
      viewsByDay[dateString] = {
        projects: projectStats.viewsByDay[dateString] || 0,
        blog: blogStats.viewsByDay[dateString] || 0,
        total: (projectStats.viewsByDay[dateString] || 0) + (blogStats.viewsByDay[dateString] || 0),
      }
    }

    return {
      totalViews: projectStats.total + blogStats.total,
      projectViews: projectStats.total,
      blogViews: blogStats.total,
      viewsByDay,
      topProjects: projectStats.projectDetails
        .map((project) => ({
          ...project,
          views: projectStats.viewsByProject[project.id] || 0,
        }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 5),
      topPosts: blogStats.postDetails
        .map((post) => ({
          ...post,
          views: blogStats.viewsByPost[post.id] || 0,
        }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 5),
    }
  } catch (error) {
    console.error("Error getting total view stats:", error)
    return {
      totalViews: 0,
      projectViews: 0,
      blogViews: 0,
      viewsByDay: {},
      topProjects: [],
      topPosts: [],
    }
  }
}
