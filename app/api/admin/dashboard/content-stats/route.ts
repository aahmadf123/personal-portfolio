import { createClient } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createClient()

    // Get counts for various content types
    const promises = [
      supabase.from("projects").select("id", { count: "exact", head: true }),
      supabase.from("blog_posts").select("id", { count: "exact", head: true }),
      supabase.from("skills").select("id", { count: "exact", head: true }),
      supabase.from("case_studies").select("id", { count: "exact", head: true }),
      supabase.from("timeline").select("id", { count: "exact", head: true }),
    ]

    const [projectsResponse, blogResponse, skillsResponse, caseStudiesResponse, timelineResponse] =
      await Promise.all(promises)

    const data = [
      { name: "Projects", value: projectsResponse.count || 0 },
      { name: "Blog Posts", value: blogResponse.count || 0 },
      { name: "Skills", value: skillsResponse.count || 0 },
      { name: "Case Studies", value: caseStudiesResponse.count || 0 },
      { name: "Timeline", value: timelineResponse.count || 0 },
    ]

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching content stats:", error)
    return NextResponse.json(
      [
        { name: "Projects", value: 0 },
        { name: "Blog Posts", value: 0 },
        { name: "Skills", value: 0 },
        { name: "Case Studies", value: 0 },
        { name: "Timeline", value: 0 },
      ],
      { status: 500 },
    )
  }
}
