"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Plus, Search, Filter, MoreHorizontal, ArrowUpDown, CheckCircle2, XCircle, Star } from "lucide-react"
import { RefreshButton } from "@/components/ui/refresh-button"
import { createClientSupabaseClient } from "@/lib/supabase"

export default function ResearchProjectsAdminClient({
  searchParams,
}: {
  searchParams: { q?: string; status?: string; sort?: string }
}) {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState(searchParams.q || "")
  const [statusFilter, setStatusFilter] = useState(searchParams.status || "all")
  const [sortBy, setSortBy] = useState(searchParams.sort || "updated_at")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date())
  const [authError, setAuthError] = useState(false)
  const router = useRouter()
  const supabase = createClientSupabaseClient()

  // Fetch research projects
  const fetchProjects = async () => {
    try {
      setLoading(true)

      let query = supabase.from("research_projects").select("*")

      if (searchParams.q) {
        query = query.ilike("title", `%${searchParams.q}%`)
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

      const { data, error } = await query

      if (error) throw error

      setProjects(data || [])
    } catch (err) {
      console.error("Error fetching research projects:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects()
  }, [searchParams])

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()

    if (searchQuery) params.set("q", searchQuery)
    if (searchParams.status) params.set("status", searchParams.status)
    if (searchParams.sort) params.set("sort", searchParams.sort)

    router.push(`/admin/research-projects?${params.toString()}`)
  }

  // Handle status filter change
  const handleStatusChange = (value: string) => {
    setStatusFilter(value)
    const params = new URLSearchParams(searchParams)

    if (value !== "all") {
      params.set("status", value)
    } else {
      params.delete("status")
    }

    router.push(`/admin/research-projects?${params.toString()}`)
  }

  // Handle sort change
  const handleSortChange = (column: string) => {
    const newDirection = sortBy === column && sortDirection === "desc" ? "asc" : "desc"
    setSortBy(column)
    setSortDirection(newDirection)

    const params = new URLSearchParams(searchParams)
    params.set("sort", column)

    router.push(`/admin/research-projects?${params.toString()}`)
  }

  // Filter and sort projects
  const filteredProjects = projects
    .filter((project) => {
      // Search filter
      if (searchQuery && !project.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }

      // Status filter
      if (statusFilter === "completed" && project.completion < 100) {
        return false
      }
      if (statusFilter === "in-progress" && project.completion >= 100) {
        return false
      }
      if (statusFilter === "featured" && !project.featured) {
        return false
      }

      return true
    })
    .sort((a, b) => {
      // Sort by selected column
      if (sortBy === "title") {
        return sortDirection === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
      }

      if (sortBy === "completion") {
        return sortDirection === "asc" ? a.completion - b.completion : b.completion - a.completion
      }

      if (sortBy === "priority") {
        const priorityOrder = { high: 0, medium: 1, low: 2 }
        return sortDirection === "asc"
          ? priorityOrder[a.priority as keyof typeof priorityOrder] -
              priorityOrder[b.priority as keyof typeof priorityOrder]
          : priorityOrder[b.priority as keyof typeof priorityOrder] -
              priorityOrder[a.priority as keyof typeof priorityOrder]
      }

      // Default sort by updated_at
      return sortDirection === "asc"
        ? new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
        : new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    })

  // Handle delete project
  const handleDeleteProject = async (id: number) => {
    if (!confirm("Are you sure you want to delete this research project? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/research-projects/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete research project")
      }

      toast({
        title: "Success",
        description: "Research project deleted successfully",
      })

      // Refresh the list
      fetchProjects()
    } catch (err) {
      console.error("Error deleting research project:", err)
      toast({
        title: "Error",
        description: "Failed to delete research project",
        variant: "destructive",
      })
    }
  }

  // Handle move to projects
  const handleMoveToProjects = async (id: number) => {
    if (
      !confirm(
        "Are you sure you want to move this research project to the main projects section? This will mark it as completed.",
      )
    ) {
      return
    }

    try {
      const response = await fetch(`/api/research-projects/${id}/move-to-projects`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to move research project to projects")
      }

      toast({
        title: "Success",
        description: "Research project moved to projects successfully",
      })

      // Refresh the list
      fetchProjects()
    } catch (err) {
      console.error("Error moving research project to projects:", err)
      toast({
        title: "Error",
        description: "Failed to move research project to projects",
        variant: "destructive",
      })
    }
  }

  // Handle toggle featured
  const handleToggleFeatured = async (id: number, currentFeatured: boolean) => {
    try {
      const response = await fetch(`/api/research-projects/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          featured: !currentFeatured,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update featured status")
      }

      toast({
        title: "Success",
        description: `Research project ${currentFeatured ? "removed from" : "added to"} featured projects`,
      })

      // Refresh the list
      fetchProjects()
    } catch (err) {
      console.error("Error updating featured status:", err)
      toast({
        title: "Error",
        description: "Failed to update featured status",
        variant: "destructive",
      })
    }
  }

  // Handle refresh
  const handleRefresh = () => {
    fetchProjects()
  }

  if (authError) {
    return (
      <div className="container py-10">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>You need to be logged in to access this page</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/login")}>Go to Login</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Research Projects</h1>
          <p className="text-muted-foreground mt-1">Manage your ongoing research and development projects</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <span className="text-sm text-muted-foreground mr-2">
              Last updated: {lastRefreshed.toLocaleTimeString()}
            </span>
            <RefreshButton onClick={handleRefresh} />
          </div>

          <Button asChild>
            <Link href="/admin/research-projects/new">
              <Plus className="mr-2 h-4 w-4" />
              New Research Project
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Research Projects</CardTitle>
          <CardDescription>
            View and manage all your research and development projects. Completed projects can be moved to the main
            projects section.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search projects..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="featured">Featured</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No research projects found</p>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">
                      <button className="flex items-center gap-1" onClick={() => handleSortChange("title")}>
                        Title
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>
                      <button className="flex items-center gap-1" onClick={() => handleSortChange("priority")}>
                        Priority
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </TableHead>
                    <TableHead>
                      <button className="flex items-center gap-1" onClick={() => handleSortChange("completion")}>
                        Completion
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{project.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            project.priority === "high"
                              ? "destructive"
                              : project.priority === "medium"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full ${
                                project.completion >= 100
                                  ? "bg-green-500"
                                  : project.completion >= 70
                                    ? "bg-blue-500"
                                    : project.completion >= 30
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                              }`}
                              style={{ width: `${project.completion}%` }}
                            ></div>
                          </div>
                          <span className="text-xs">{project.completion}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleFeatured(project.id, project.featured)}
                          className={project.featured ? "text-yellow-500" : "text-muted-foreground"}
                        >
                          <Star className="h-4 w-4" fill={project.featured ? "currentColor" : "none"} />
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/research-projects/${project.id}`}>View</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/research-projects/${project.id}/edit`}>Edit</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleMoveToProjects(project.id)}
                              className="text-green-600"
                            >
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Move to Projects
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDeleteProject(project.id)} className="text-red-600">
                              <XCircle className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
