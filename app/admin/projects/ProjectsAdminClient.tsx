"use client"

import type React from "react"

import { createServerSupabaseClient, createClientSupabaseClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, Filter, RefreshCw } from "lucide-react"
import { useState, useEffect, useTransition } from "react"
import { deleteProject } from "./actions"
import type { ActionResponse } from "@/lib/server-action-utils"
import { ActionResponseHandler } from "@/components/ui/action-response-handler"
import { toast } from "@/components/ui/use-toast"

export default function ProjectsAdminClient({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; status?: string; sort?: string }
}) {
  const [projects, setProjects] = useState<any[]>([])
  const [uniqueStatuses, setUniqueStatuses] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [actionResponse, setActionResponse] = useState<ActionResponse | null>(null)
  const [isPending, startTransition] = useTransition()
  const [authError, setAuthError] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState(searchParams.q || "")
  const router = useRouter()
  const supabase = createClientSupabaseClient()

  // Get query parameters
  const query = searchParams.q || ""
  const statusFilter = searchParams.status || "all"
  const sort = searchParams.sort || "newest"

  const fetchProjects = async () => {
    try {
      setLoading(true)

      let query = supabase.from("projects").select(`
          *,
          project_tags(name),
          project_technologies(name, category)
        `)

      if (searchParams.q) {
        query = query.or(`title.ilike.%${searchParams.q}%, description.ilike.%${searchParams.q}%`)
      }

      if (searchParams.category) {
        query = query.eq("category", searchParams.category)
      }

      if (searchParams.status) {
        query = query.eq("status", searchParams.status)
      }

      if (searchParams.sort) {
        const [column, order] = searchParams.sort.split(".")
        query = query.order(column, { ascending: order === "asc" })
      } else {
        query = query.order("created_at", { ascending: false })
      }

      const { data: projectsData, error } = await query

      if (error) throw error

      setProjects(projectsData || [])

      // Get project statuses for filter
      const { data: statuses } = await supabase.from("projects").select("status").not("status", "is", null)

      const uniqueStatuses = Array.from(new Set(statuses?.map((s) => s.status) || []))
      setUniqueStatuses(uniqueStatuses)
    } catch (err) {
      console.error("Error fetching projects:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
      toast({
        title: "Error",
        description: "Failed to load projects. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const supabase = createServerSupabaseClient()

        // Check if user is authenticated
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          // Instead of redirecting, set an auth error state
          setAuthError(true)
          setLoading(false)
          return
        }

        // Build the query
        let projectsQuery = supabase.from("projects").select(`
          *,
          project_tags(name),
          project_technologies(name, category)
        `)

        // Apply search filter
        if (query) {
          projectsQuery = projectsQuery.or(`title.ilike.%${query}%, description.ilike.%${query}%`)
        }

        // Apply status filter
        if (statusFilter !== "all") {
          projectsQuery = projectsQuery.eq("status", statusFilter)
        }

        // Apply sorting
        if (sort === "newest") {
          projectsQuery = projectsQuery.order("created_at", { ascending: false })
        } else if (sort === "oldest") {
          projectsQuery = projectsQuery.order("created_at", { ascending: true })
        } else if (sort === "a-z") {
          projectsQuery = projectsQuery.order("title", { ascending: true })
        } else if (sort === "z-a") {
          projectsQuery = projectsQuery.order("title", { ascending: false })
        } else if (sort === "featured") {
          projectsQuery = projectsQuery
            .order("is_featured", { ascending: false })
            .order("created_at", { ascending: false })
        }

        // Execute the query
        const { data: projectsData, error } = await projectsQuery

        if (error) {
          console.error("Error fetching projects:", error)
          toast({
            title: "Error",
            description: "Failed to load projects. Please try again.",
            variant: "destructive",
          })
        }

        setProjects(projectsData || [])

        // Get project statuses for filter
        const { data: statuses } = await supabase.from("projects").select("status").not("status", "is", null)

        const uniqueStatuses = Array.from(new Set(statuses?.map((s) => s.status) || []))
        setUniqueStatuses(uniqueStatuses)
      } catch (error) {
        console.error("Error in fetchData:", error)
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [searchParams, query, statusFilter, sort])

  useEffect(() => {
    fetchProjects()
  }, [searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()

    if (searchQuery) params.set("q", searchQuery)
    if (searchParams.category) params.set("category", searchParams.category)
    if (searchParams.status) params.set("status", searchParams.status)
    if (searchParams.sort) params.set("sort", searchParams.sort)

    router.push(`/admin/projects?${params.toString()}`)
  }

  // If auth error, show login button
  if (authError) {
    return (
      <div className="container py-10">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>You need to be logged in to access this page</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/login")} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Handle project deletion with enhanced error handling
  async function handleDeleteProject(formData: FormData) {
    if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      return
    }

    startTransition(async () => {
      const response = await deleteProject(formData)
      setActionResponse(response)

      if (response.success) {
        // Optimistically update UI by removing the deleted project
        const projectId = formData.get("id") as string
        setProjects((prev) => (prev ? prev.filter((p) => p.id.toString() !== projectId) : null))
      }
    })
  }

  return (
    <div className="container py-10">
      <ActionResponseHandler response={actionResponse} onSuccess={() => setActionResponse(null)} />

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage your projects</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchProjects} variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button asChild>
            <Link href="/admin/projects/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : projects.length > 0 ? (
        <div className="bg-card rounded-lg border shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-3 px-4">Title</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Featured</th>
                  <th className="text-left py-3 px-4">Created</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="font-medium">{project.title}</div>
                      <div className="text-sm text-muted-foreground">{project.slug}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {project.status || "Published"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {project.is_featured ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-500">
                          Featured
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400">
                          Not Featured
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">{new Date(project.created_at).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/projects/${project.slug}`}>View</Link>
                        </Button>
                        <Button asChild size="sm">
                          <Link href={`/admin/projects/${project.id}/edit`}>Edit</Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/20 rounded-lg border">
          <h3 className="text-lg font-medium mb-2">No projects found</h3>
          <p className="text-muted-foreground mb-4">Get started by creating your first project.</p>
          <Button asChild>
            <Link href="/admin/projects/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
