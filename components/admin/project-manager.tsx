"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { EnhancedDataTable, type Column } from "./enhanced-data-table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { toast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Project {
  id: number
  title: string
  slug: string
  description: string
  thumbnail_url: string | null
  github_url: string | null
  demo_url: string | null
  is_featured: boolean
  is_ongoing: boolean
  status: string
  start_date: string | null
  end_date: string | null
  created_at: string
  updated_at: string
  view_count: number
}

export function ProjectManager() {
  const [projects, setProjects] = useState<Project[]>()
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [authError, setAuthError] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/projects")

      if (!response.ok) {
        if (response.status === 401) {
          setAuthError(true)
          return
        }
        throw new Error("Failed to fetch projects")
      }

      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error("Error fetching projects:", error)
      toast({
        title: "Error",
        description: "Failed to load projects. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string | number) => {
    try {
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete project")

      toast({
        title: "Success",
        description: "Project deleted successfully",
      })

      // Refresh the projects list
      fetchProjects()
    } catch (error) {
      console.error("Error deleting project:", error)
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (id: string | number) => {
    router.push(`/admin/project-management/edit/${id}`)
  }

  const columns: Column<Project>[] = [
    {
      id: "thumbnail",
      header: "Thumbnail",
      cell: (project) => (
        <div className="relative h-12 w-16 overflow-hidden rounded-md">
          {project.thumbnail_url ? (
            <Image
              src={project.thumbnail_url || "/placeholder.svg"}
              alt={project.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
              No image
            </div>
          )}
        </div>
      ),
    },
    {
      id: "title",
      header: "Title",
      cell: (project) => (
        <div>
          <div className="font-medium">{project.title}</div>
          <div className="text-sm text-muted-foreground">{project.slug}</div>
        </div>
      ),
      sortable: true,
      searchable: true,
    },
    {
      id: "status",
      header: "Status",
      cell: (project) => {
        let variant: "default" | "secondary" | "outline" = "default"

        if (project.status === "completed") {
          variant = "default"
        } else if (project.status === "in-progress") {
          variant = "secondary"
        } else {
          variant = "outline"
        }

        return <Badge variant={variant}>{project.status.charAt(0).toUpperCase() + project.status.slice(1)}</Badge>
      },
      sortable: true,
    },
    {
      id: "featured",
      header: "Featured",
      cell: (project) => (
        <Badge variant={project.is_featured ? "default" : "outline"}>
          {project.is_featured ? "Featured" : "Regular"}
        </Badge>
      ),
      sortable: true,
    },
    {
      id: "dates",
      header: "Timeline",
      cell: (project) => (
        <div className="text-sm">
          {project.start_date && <div>Start: {format(new Date(project.start_date), "MMM yyyy")}</div>}
          {project.end_date ? (
            <div>End: {format(new Date(project.end_date), "MMM yyyy")}</div>
          ) : (
            <div className="text-muted-foreground">Ongoing</div>
          )}
        </div>
      ),
    },
    {
      id: "links",
      header: "Links",
      cell: (project) => (
        <div className="flex space-x-2">
          {project.github_url && (
            <Link
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </Link>
          )}
          {project.demo_url && (
            <Link
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="sr-only">Demo</span>
            </Link>
          )}
        </div>
      ),
    },
    {
      id: "views",
      header: "Views",
      cell: (project) => project.view_count.toString(),
      sortable: true,
    },
    {
      id: "updated",
      header: "Last Updated",
      cell: (project) => format(new Date(project.updated_at), "MMM d, yyyy"),
      sortable: true,
    },
  ]

  const filteredProjects = {
    all: projects,
    featured: projects?.filter((project) => project.is_featured),
    ongoing: projects?.filter((project) => project.is_ongoing),
    completed: projects?.filter((project) => project.status === "completed"),
  }

  if (authError) {
    return (
      <div className="space-y-4">
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
    <div className="space-y-4">
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Projects</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="pt-4">
          <EnhancedDataTable
            data={filteredProjects.all}
            columns={columns}
            isLoading={isLoading}
            createHref="/admin/project-management/create"
            createLabel="Create New Project"
            onDelete={handleDelete}
            onEdit={handleEdit}
            getItemId={(project) => project.id}
            searchPlaceholder="Search projects..."
            emptyMessage="No projects found"
          />
        </TabsContent>
        <TabsContent value="featured" className="pt-4">
          <EnhancedDataTable
            data={filteredProjects.featured}
            columns={columns}
            isLoading={isLoading}
            createHref="/admin/project-management/create"
            createLabel="Create New Project"
            onDelete={handleDelete}
            onEdit={handleEdit}
            getItemId={(project) => project.id}
            searchPlaceholder="Search featured projects..."
            emptyMessage="No featured projects found"
          />
        </TabsContent>
        <TabsContent value="ongoing" className="pt-4">
          <EnhancedDataTable
            data={filteredProjects.ongoing}
            columns={columns}
            isLoading={isLoading}
            createHref="/admin/project-management/create"
            createLabel="Create New Project"
            onDelete={handleDelete}
            onEdit={handleEdit}
            getItemId={(project) => project.id}
            searchPlaceholder="Search ongoing projects..."
            emptyMessage="No ongoing projects found"
          />
        </TabsContent>
        <TabsContent value="completed" className="pt-4">
          <EnhancedDataTable
            data={filteredProjects.completed}
            columns={columns}
            isLoading={isLoading}
            createHref="/admin/project-management/create"
            createLabel="Create New Project"
            onDelete={handleDelete}
            onEdit={handleEdit}
            getItemId={(project) => project.id}
            searchPlaceholder="Search completed projects..."
            emptyMessage="No completed projects found"
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
