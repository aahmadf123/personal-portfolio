import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Briefcase,
  FileText,
  Award,
  Clock,
  BookOpen,
  Plus,
  ArrowRight,
  Settings,
  ImageIcon,
  Database,
} from "lucide-react"
import { createServerSupabaseClient } from "@/lib/supabase"

export const metadata = {
  title: "Admin Dashboard | Portfolio",
  description: "Admin dashboard for managing your portfolio content",
}

export default async function AdminDashboard() {
  // Fetch basic stats directly
  const supabase = createServerSupabaseClient()

  // Get projects count
  const { count: projectCount, error: projectsError } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })

  // Get blog posts count
  const { count: blogCount, error: blogError } = await supabase
    .from("blog_posts")
    .select("*", { count: "exact", head: true })

  // Get skills count
  const { count: skillCount, error: skillsError } = await supabase
    .from("skills")
    .select("*", { count: "exact", head: true })

  // Get case studies count (if table exists)
  let caseStudyCount = 0
  try {
    const { count, error } = await supabase.from("case_studies").select("*", { count: "exact", head: true })

    if (!error) {
      caseStudyCount = count || 0
    }
  } catch (error) {
    console.log("Case studies table might not exist, using 0 as count")
  }

  // Get timeline entries count (if table exists)
  let timelineCount = 0
  try {
    const { count, error } = await supabase.from("timeline").select("*", { count: "exact", head: true })

    if (!error) {
      timelineCount = count || 0
    }
  } catch (error) {
    console.log("Timeline table might not exist, using 0 as count")
  }

  const stats = [
    { name: "Projects", count: projectCount || 0, icon: Briefcase, href: "/admin/projects", color: "bg-blue-500" },
    { name: "Blog Posts", count: blogCount || 0, icon: BookOpen, href: "/admin/blog", color: "bg-rose-500" },
    { name: "Skills", count: skillCount || 0, icon: Award, href: "/admin/skills", color: "bg-purple-500" },
    {
      name: "Case Studies",
      count: caseStudyCount,
      icon: FileText,
      href: "/admin/case-studies",
      color: "bg-green-500",
    },
    {
      name: "Timeline Entries",
      count: timelineCount,
      icon: Clock,
      href: "/admin/timeline",
      color: "bg-amber-500",
    },
  ]

  const quickLinks = [
    { name: "Upload Images", icon: ImageIcon, href: "/admin/images", color: "bg-indigo-500" },
    { name: "Database Schema", icon: Database, href: "/admin/database-schema", color: "bg-emerald-500" },
    { name: "Settings", icon: Settings, href: "/admin/settings", color: "bg-gray-500" },
  ]

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage and update your portfolio content</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button asChild>
            <Link href="/admin/blog/new">
              <Plus className="mr-2 h-4 w-4" />
              New Blog Post
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/projects/new">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <Link href={stat.href} key={stat.name}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                    <p className="text-3xl font-bold">{stat.count}</p>
                  </div>
                  <div
                    className={`${stat.color} text-white p-3 rounded-full w-12 h-12 flex items-center justify-center`}
                  >
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 border-t">
                <div className="flex items-center text-sm text-primary">
                  <span>View all</span>
                  <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {quickLinks.map((link) => (
          <Link href={link.href} key={link.name}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`${link.color} text-white p-3 rounded-full w-12 h-12 flex items-center justify-center`}
                  >
                    <link.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-medium">{link.name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
