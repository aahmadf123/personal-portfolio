"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ImageUploader } from "@/components/admin/image-uploader"
import type { Project } from "@/types/projects"

interface ProjectFormProps {
  project?: Project
  isNew?: boolean
}

export function ProjectForm({ project, isNew = false }: ProjectFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<Partial<Project>>(
    project || {
      title: "",
      slug: "",
      description: "",
      content: "",
      image: "",
      github: "",
      demo: "",
      featured: false,
      published: false,
      category: "web",
      tags: [],
    },
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string) => (checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (url: string) => {
    setFormData((prev) => ({ ...prev, image: url }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const endpoint = isNew ? "/api/admin/projects" : `/api/admin/projects/${project?.id}`

      const method = isNew ? "POST" : "PUT"

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to save project")
      }

      router.push("/admin/projects")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{isNew ? "Create New Project" : "Edit Project"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="bg-red-50 p-4 rounded-md text-red-500 mb-4">{error}</div>}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" value={formData.title || ""} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" name="slug" value={formData.slug || ""} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content (Markdown)</Label>
            <Textarea id="content" name="content" value={formData.content || ""} onChange={handleChange} rows={10} />
          </div>

          <div className="space-y-2">
            <Label>Featured Image</Label>
            <ImageUploader currentImage={formData.image} onImageSelected={handleImageChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="github">GitHub URL</Label>
            <Input id="github" name="github" value={formData.github || ""} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="demo">Demo URL</Label>
            <Input id="demo" name="demo" value={formData.demo || ""} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category || "web"} onValueChange={handleSelectChange("category")}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="web">Web Development</SelectItem>
                <SelectItem value="mobile">Mobile Development</SelectItem>
                <SelectItem value="ai">AI & Machine Learning</SelectItem>
                <SelectItem value="data">Data Science</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={formData.featured || false}
              onCheckedChange={handleCheckboxChange("featured")}
            />
            <Label htmlFor="featured">Featured Project</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="published"
              checked={formData.published || false}
              onCheckedChange={handleCheckboxChange("published")}
            />
            <Label htmlFor="published">Published</Label>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/projects")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Project"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
