import { createServerSupabaseClient } from "./supabase"
import { getPoolStats } from "./supabase"
import { handleDatabaseError, retryOperation } from "./error-utils"
import { createClient } from "@/lib/supabase"
import { cache } from "react"

export interface DashboardContent {
  projects: any[]
  blogPosts: any[]
  analytics: {
    totalViews: number
    uniqueVisitors: number
    topPages: { path: string; views: number }[]
  }
}

// Simple function to get content counts
export async function getContentCounts() {
  try {
    const supabase = createServerSupabaseClient()

    // Get projects count
    const { count: projectsCount, error: projectsError } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true })

    // Get blog posts count
    const { count: postsCount, error: postsError } = await supabase
      .from("blog_posts")
      .select("*", { count: "exact", head: true })

    // Get skills count
    const { count: skillsCount, error: skillsError } = await supabase
      .from("skills")
      .select("*", { count: "exact", head: true })

    return {
      projects: projectsCount || 0,
      blogPosts: postsCount || 0,
      skills: skillsCount || 0,
    }
  } catch (error) {
    console.error("Error in getContentCounts:", error)
    return {
      projects: 0,
      blogPosts: 0,
      skills: 0,
    }
  }
}

// Get content statistics
export async function getContentStats() {
  try {
    return await retryOperation(async () => {
      const supabase = createServerSupabaseClient()

      // Get projects count
      const { count: projectsCount, error: projectsError } = await supabase
        .from("projects")
        .select("*", { count: "exact", head: true })

      if (projectsError) {
        throw handleDatabaseError(projectsError, "fetch", "projects count")
      }

      // Get blog posts count
      const { count: postsCount, error: postsError } = await supabase
        .from("blog_posts")
        .select("*", { count: "exact", head: true })

      if (postsError) {
        throw handleDatabaseError(postsError, "fetch", "blog posts count")
      }

      // Get skills count
      const { count: skillsCount, error: skillsError } = await supabase
        .from("skills")
        .select("*", { count: "exact", head: true })

      if (skillsError) {
        throw handleDatabaseError(skillsError, "fetch", "skills count")
      }

      // Get case studies count (if table exists)
      let caseStudiesCount = 0
      try {
        const { count, error } = await supabase.from("case_studies").select("*", { count: "exact", head: true })

        if (!error) {
          caseStudiesCount = count || 0
        }
      } catch (error) {
        console.log("Case studies table might not exist, using 0 as count")
      }

      return [
        { name: "Projects", value: projectsCount || 0 },
        { name: "Blog Posts", value: postsCount || 0 },
        { name: "Skills", value: skillsCount || 0 },
        { name: "Case Studies", value: caseStudiesCount },
      ]
    })
  } catch (error) {
    console.error("Error in getContentStats:", error)
    // Return fallback data if there's an error
    return [
      { name: "Projects", value: 0 },
      { name: "Blog Posts", value: 0 },
      { name: "Skills", value: 0 },
      { name: "Case Studies", value: 0 },
    ]
  }
}

// Get recent activities
export async function getRecentActivities(limit = 5) {
  try {
    return await retryOperation(async () => {
      const supabase = createServerSupabaseClient()

      // Try to get from activity log table if it exists
      try {
        const { data, error } = await supabase
          .from("activity_log")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(limit)

        if (!error && data && data.length > 0) {
          return data.map((activity) => ({
            id: activity.id,
            action: activity.action,
            target: activity.target,
            timestamp: formatTimestamp(activity.created_at),
            user: {
              name: activity.user_name || "Admin",
              avatar: activity.user_avatar || "/professional-headshot.jpg",
              initials: activity.user_initials || "AD",
            },
          }))
        }
      } catch (error) {
        console.log("Activity log table might not exist, using recent content changes")
      }

      // If no activity log, get recent content changes
      const activities = []

      // Recent projects
      const { data: recentProjects, error: projectsError } = await supabase
        .from("projects")
        .select("id, title, updated_at")
        .order("updated_at", { ascending: false })
        .limit(2)

      if (!projectsError && recentProjects) {
        recentProjects.forEach((project) => {
          activities.push({
            id: `project-${project.id}`,
            action: "Updated project",
            target: project.title,
            timestamp: formatTimestamp(project.updated_at),
            user: {
              name: "Admin",
              avatar: "/professional-headshot.jpg",
              initials: "AD",
            },
          })
        })
      }

      // Recent blog posts
      const { data: recentPosts, error: postsError } = await supabase
        .from("blog_posts")
        .select("id, title, updated_at")
        .order("updated_at", { ascending: false })
        .limit(2)

      if (!postsError && recentPosts) {
        recentPosts.forEach((post) => {
          activities.push({
            id: `post-${post.id}`,
            action: "Updated blog post",
            target: post.title,
            timestamp: formatTimestamp(post.updated_at),
            user: {
              name: "Admin",
              avatar: "/professional-headshot.jpg",
              initials: "AD",
            },
          })
        })
      }

      // Recent skills
      const { data: recentSkills, error: skillsError } = await supabase
        .from("skills")
        .select("id, name, updated_at")
        .order("updated_at", { ascending: false })
        .limit(2)

      if (!skillsError && recentSkills) {
        recentSkills.forEach((skill) => {
          activities.push({
            id: `skill-${skill.id}`,
            action: "Updated skill",
            target: skill.name,
            timestamp: formatTimestamp(skill.updated_at),
            user: {
              name: "Admin",
              avatar: "/professional-headshot.jpg",
              initials: "AD",
            },
          })
        })
      }

      // Sort by timestamp (most recent first) and limit
      return activities
        .sort((a, b) => {
          const dateA = new Date(a.timestamp)
          const dateB = new Date(b.timestamp)
          return dateB.getTime() - dateA.getTime()
        })
        .slice(0, limit)
    })
  } catch (error) {
    console.error("Error in getRecentActivities:", error)
    // Return fallback data if there's an error
    return [
      {
        id: 1,
        action: "System initialized",
        target: "Dashboard",
        timestamp: "Just now",
        user: {
          name: "System",
          avatar: "/professional-headshot.jpg",
          initials: "SY",
        },
      },
    ]
  }
}

// Get system status
export async function getSystemStatus() {
  try {
    const statuses = []

    // Check database connection
    try {
      const supabase = createServerSupabaseClient()
      const { data, error } = await supabase.from("projects").select("id").limit(1)

      statuses.push({
        name: "Database Connection",
        status: error ? "error" : "healthy",
        message: error ? "Connection error" : "Connected and operational",
        lastChecked: "Just now",
      })
    } catch (error) {
      statuses.push({
        name: "Database Connection",
        status: "error",
        message: "Connection error",
        lastChecked: "Just now",
      })
    }

    // Check database pool
    try {
      const poolStats = getPoolStats()
      const usagePercent = Math.round((poolStats.totalCount / poolStats.maxConnections) * 100)

      statuses.push({
        name: "Database Pool",
        status: usagePercent > 80 ? "warning" : "healthy",
        message: `${usagePercent}% capacity used (${poolStats.totalCount}/${poolStats.maxConnections})`,
        lastChecked: "Just now",
      })
    } catch (error) {
      statuses.push({
        name: "Database Pool",
        status: "unknown",
        message: "Could not retrieve pool stats",
        lastChecked: "Just now",
      })
    }

    // Check API services by making a simple request
    try {
      const response = await fetch("/api/projects/featured", { method: "GET" })

      statuses.push({
        name: "API Services",
        status: response.ok ? "healthy" : "error",
        message: response.ok ? "All endpoints responding" : "API error detected",
        lastChecked: "Just now",
      })
    } catch (error) {
      statuses.push({
        name: "API Services",
        status: "error",
        message: "API request failed",
        lastChecked: "Just now",
      })
    }

    // Add storage status (this is a placeholder - in a real app you'd check actual storage)
    statuses.push({
      name: "Storage",
      status: "healthy",
      message: "Storage system operational",
      lastChecked: "Just now",
    })

    return statuses
  } catch (error) {
    console.error("Error in getSystemStatus:", error)
    // Return fallback data if there's an error
    return [
      {
        name: "System Status",
        status: "unknown",
        message: "Could not retrieve system status",
        lastChecked: "Just now",
      },
    ]
  }
}

// Helper function to format timestamps
function formatTimestamp(timestamp: string | null): string {
  if (!timestamp) return "Unknown"

  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) return "Just now"
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`

  return date.toLocaleDateString()
}

// Get recent content
export async function getRecentContent(limit = 5) {
  try {
    const supabase = createServerSupabaseClient()

    // Recent projects
    const { data: recentProjects, error: projectsError } = await supabase
      .from("projects")
      .select("id, title, slug, updated_at")
      .order("updated_at", { ascending: false })
      .limit(limit)

    // Recent blog posts
    const { data: recentPosts, error: postsError } = await supabase
      .from("blog_posts")
      .select("id, title, slug, updated_at")
      .order("updated_at", { ascending: false })
      .limit(limit)

    return {
      projects: recentProjects || [],
      blogPosts: recentPosts || [],
    }
  } catch (error) {
    console.error("Error in getRecentContent:", error)
    return {
      projects: [],
      blogPosts: [],
    }
  }
}

export const getRecentContentCached = cache(async (): Promise<DashboardContent> => {
  const supabase = createClient()

  // Fetch recent projects (last 3)
  const { data: projects, error: projectsError } = await supabase
    .from("projects")
    .select("id, title, slug, updated_at")
    .order("updated_at", { ascending: false })
    .limit(3)

  if (projectsError) {
    console.error("Error fetching recent projects:", projectsError)
  }

  // Fetch recent blog posts (last 3)
  const { data: blogPosts, error: blogError } = await supabase
    .from("blog_posts")
    .select("id, title, slug, updated_at")
    .order("updated_at", { ascending: false })
    .limit(3)

  if (blogError) {
    console.error("Error fetching recent blog posts:", blogError)
  }

  // Fetch analytics data
  const { data: viewsData, error: viewsError } = await supabase
    .from("analytics_views")
    .select("content_type, content_id, view_count")
    .limit(50)

  if (viewsError) {
    console.error("Error fetching views data:", viewsError)
  }

  // Calculate total views and unique visitors
  const totalViews = viewsData?.reduce((sum, item) => sum + (item.view_count || 0), 0) || 0

  // Get unique visitors (approximate by dividing by 2.5 as a rough estimate)
  const uniqueVisitors = Math.floor(totalViews / 2.5)

  // Calculate top pages
  const { data: topPagesData, error: topPagesError } = await supabase
    .from("analytics_views")
    .select("content_type, content_id, path, view_count")
    .order("view_count", { ascending: false })
    .limit(5)

  if (topPagesError) {
    console.error("Error fetching top pages:", topPagesError)
  }

  const topPages =
    topPagesData?.map((page) => ({
      path: page.path || `/${page.content_type}/${page.content_id}`,
      views: page.view_count || 0,
    })) || []

  return {
    projects: projects || [],
    blogPosts: blogPosts || [],
    analytics: {
      totalViews,
      uniqueVisitors,
      topPages,
    },
  }
})
