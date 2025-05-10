import { createClient } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createClient()

    // Get a combination of recently edited content
    const { data: recentProjects, error: projectsError } = await supabase
      .from("projects")
      .select("id, title, updated_at")
      .order("updated_at", { ascending: false })
      .limit(2)

    if (projectsError) throw projectsError

    const { data: recentBlogPosts, error: blogError } = await supabase
      .from("blog_posts")
      .select("id, title, updated_at")
      .order("updated_at", { ascending: false })
      .limit(2)

    if (blogError) throw blogError

    const { data: recentSkills, error: skillsError } = await supabase
      .from("skills")
      .select("id, name, updated_at")
      .order("updated_at", { ascending: false })
      .limit(1)

    if (skillsError) throw skillsError

    // Combine and format the data
    const activities = [
      ...recentProjects.map((project) => ({
        id: `project-${project.id}`,
        action: `Updated project "${project.title}"`,
        target: "Projects",
        timestamp: project.updated_at,
        user: {
          name: "Admin",
          avatar: "/professional-headshot.jpg",
          initials: "A",
        },
      })),
      ...recentBlogPosts.map((post) => ({
        id: `blog-${post.id}`,
        action: `Updated blog post "${post.title}"`,
        target: "Blog",
        timestamp: post.updated_at,
        user: {
          name: "Admin",
          avatar: "/professional-headshot.jpg",
          initials: "A",
        },
      })),
      ...recentSkills.map((skill) => ({
        id: `skill-${skill.id}`,
        action: `Updated skill "${skill.name}"`,
        target: "Skills",
        timestamp: skill.updated_at,
        user: {
          name: "Admin",
          avatar: "/professional-headshot.jpg",
          initials: "A",
        },
      })),
    ]

    // Sort by timestamp
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return NextResponse.json(activities.slice(0, 5))
  } catch (error) {
    console.error("Error fetching recent activities:", error)
    return NextResponse.json([], { status: 500 })
  }
}
