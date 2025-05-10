"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Save, Plus, Trash } from "lucide-react"
import { slugify } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  details: z.string().optional(),
  summary: z.string().optional(),
  thumbnail_url: z.string().optional().nullable(),
  main_image_url: z.string().optional().nullable(),
  github_url: z.string().optional().nullable(),
  demo_url: z.string().optional().nullable(),
  video_url: z.string().optional().nullable(),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  is_featured: z.boolean().default(false),
  is_ongoing: z.boolean().default(false),
  order_index: z.coerce.number().int().default(0),
  status: z.string().default("completed"),
  client: z.string().optional().nullable(),
})

type ProjectFormValues = z.infer<typeof projectSchema>

interface Technology {
  id?: number
  name: string
  icon?: string
  version?: string
  category?: string
}

interface Milestone {
  id?: number
  title: string
  description?: string
  date?: string
  status?: string
}

interface Challenge {
  id?: number
  title: string
  description: string
  solution?: string
}

interface ProjectImage {
  id?: number
  url: string
  alt_text?: string
  caption?: string
  order_index?: number
}

interface ProjectEditorProps {
  projectId?: string
  isNew?: boolean
}

export function ProjectEditor({ projectId, isNew = false }: ProjectEditorProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [technologies, setTechnologies] = useState<Technology[]>([])
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [projectImages, setProjectImages] = useState<ProjectImage[]>([])
  const [newTechnology, setNewTechnology] = useState<Technology>({ name: "" })
  const [newMilestone, setNewMilestone] = useState<Milestone>({ title: "" })
  const [newChallenge, setNewChallenge] = useState<Challenge>({ title: "", description: "" })
  const [newProjectImage, setNewProjectImage] = useState<ProjectImage>({ url: "" })
  const router = useRouter()

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      details: "",
      summary: "",
      thumbnail_url: "",
      main_image_url: "",
      github_url: "",
      demo_url: "",
      video_url: "",
      start_date: "",
      end_date: "",
      is_featured: false,
      is_ongoing: false,
      order_index: 0,
      status: "completed",
      client: "",
    },
  })

  // Fetch project data if editing
  useEffect(() => {
    if (!projectId || isNew) return

    const fetchProjectData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/admin/projects/${projectId}`)
        if (!response.ok) throw new Error("Failed to fetch project")

        const project = await response.json()
        form.reset(project)

        // Fetch related data
        await Promise.all([fetchTechnologies(), fetchMilestones(), fetchChallenges(), fetchProjectImages()])
      } catch (error) {
        console.error("Error fetching project:", error)
        toast({
          title: "Error",
          description: "Failed to load project data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjectData()
  }, [projectId, isNew, form])

  const fetchTechnologies = async () => {
    try {
      const response = await fetch(`/api/admin/projects/${projectId}/technologies`)
      if (response.ok) {
        const data = await response.json()
        setTechnologies(data)
      }
    } catch (error) {
      console.error("Error fetching technologies:", error)
    }
  }

  const fetchMilestones = async () => {
    try {
      const response = await fetch(`/api/admin/projects/${projectId}/milestones`)
      if (response.ok) {
        const data = await response.json()
        setMilestones(data)
      }
    } catch (error) {
      console.error("Error fetching milestones:", error)
    }
  }

  const fetchChallenges = async () => {
    try {
      const response = await fetch(`/api/admin/projects/${projectId}/challenges`)
      if (response.ok) {
        const data = await response.json()
        setChallenges(data)
      }
    } catch (error) {
      console.error("Error fetching challenges:", error)
    }
  }

  const fetchProjectImages = async () => {
    try {
      const response = await fetch(`/api/admin/projects/${projectId}/images`)
      if (response.ok) {
        const data = await response.json()
        setProjectImages(data)
      }
    } catch (error) {
      console.error("Error fetching project images:", error)
    }
  }

  const onSubmit = async (values: ProjectFormValues) => {
    try {
      setIsLoading(true)

      const url = isNew ? "/api/admin/projects" : `/api/admin/projects/${projectId}`

      const method = isNew ? "POST" : "PUT"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) throw new Error("Failed to save project")

      const savedProject = await response.json()

      // If this is a new project, save the related data
      if (isNew && savedProject.id) {
        await saveRelatedData(savedProject.id)
      } else if (!isNew && projectId) {
        await saveRelatedData(Number.parseInt(projectId))
      }

      toast({
        title: "Success",
        description: `Project ${isNew ? "created" : "updated"} successfully`,
      })

      router.push("/admin/project-management")
    } catch (error) {
      console.error("Error saving project:", error)
      toast({
        title: "Error",
        description: "Failed to save project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const saveRelatedData = async (projectId: number) => {
    // Save technologies
    if (technologies.length > 0) {
      try {
        await fetch(`/api/admin/projects/${projectId}/technologies`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(technologies),
        })
      } catch (error) {
        console.error("Error saving technologies:", error)
      }
    }

    // Save milestones
    if (milestones.length > 0) {
      try {
        await fetch(`/api/admin/projects/${projectId}/milestones`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(milestones),
        })
      } catch (error) {
        console.error("Error saving milestones:", error)
      }
    }

    // Save challenges
    if (challenges.length > 0) {
      try {
        await fetch(`/api/admin/projects/${projectId}/challenges`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(challenges),
        })
      } catch (error) {
        console.error("Error saving challenges:", error)
      }
    }

    // Save project images
    if (projectImages.length > 0) {
      try {
        await fetch(`/api/admin/projects/${projectId}/images`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(projectImages),
        })
      } catch (error) {
        console.error("Error saving project images:", error)
      }
    }
  }

  const handleGenerateSlug = () => {
    const title = form.getValues("title")
    if (title) {
      const slug = slugify(title)
      form.setValue("slug", slug)
    }
  }

  const addTechnology = () => {
    if (newTechnology.name.trim()) {
      setTechnologies([...technologies, { ...newTechnology }])
      setNewTechnology({ name: "" })
    }
  }

  const removeTechnology = (index: number) => {
    setTechnologies(technologies.filter((_, i) => i !== index))
  }

  const addMilestone = () => {
    if (newMilestone.title.trim()) {
      setMilestones([...milestones, { ...newMilestone }])
      setNewMilestone({ title: "" })
    }
  }

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index))
  }

  const addChallenge = () => {
    if (newChallenge.title.trim() && newChallenge.description.trim()) {
      setChallenges([...challenges, { ...newChallenge }])
      setNewChallenge({ title: "", description: "" })
    }
  }

  const removeChallenge = (index: number) => {
    setChallenges(challenges.filter((_, i) => i !== index))
  }

  const addProjectImage = () => {
    if (newProjectImage.url.trim()) {
      setProjectImages([
        ...projectImages,
        {
          ...newProjectImage,
          order_index: projectImages.length,
        },
      ])
      setNewProjectImage({ url: "" })
    }
  }

  const removeProjectImage = (index: number) => {
    setProjectImages(projectImages.filter((_, i) => i !== index))
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Project title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4 items-end">
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="project-slug" {...field} />
                    </FormControl>
                    <FormDescription>Used in the URL</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="button" variant="outline" onClick={handleGenerateSlug}>
                Generate Slug
              </Button>
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Brief description of the project" className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormDescription>A short description that appears in project listings</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Summary</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Project summary"
                      className="min-h-[100px]"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>A summary of the project's goals and outcomes</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Details</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed description of the project"
                      className="min-h-[200px]"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>Full details of the project (supports Markdown)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Tabs defaultValue="technologies">
              <TabsList>
                <TabsTrigger value="technologies">Technologies</TabsTrigger>
                <TabsTrigger value="milestones">Milestones</TabsTrigger>
                <TabsTrigger value="challenges">Challenges</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
              </TabsList>

              <TabsContent value="technologies" className="pt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Technologies Used</h3>

                      <div className="space-y-4">
                        {technologies.map((tech, index) => (
                          <div key={index} className="flex items-center gap-2 p-3 border rounded-md">
                            <div className="flex-1">
                              <div className="font-medium">{tech.name}</div>
                              {tech.version && (
                                <div className="text-sm text-muted-foreground">Version: {tech.version}</div>
                              )}
                              {tech.category && (
                                <div className="text-sm text-muted-foreground">Category: {tech.category}</div>
                              )}
                            </div>
                            <Button type="button" variant="ghost" size="sm" onClick={() => removeTechnology(index)}>
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <div className="grid grid-cols-3 gap-2">
                          <Input
                            placeholder="Technology name"
                            value={newTechnology.name}
                            onChange={(e) =>
                              setNewTechnology({
                                ...newTechnology,
                                name: e.target.value,
                              })
                            }
                          />
                          <Input
                            placeholder="Version (optional)"
                            value={newTechnology.version || ""}
                            onChange={(e) =>
                              setNewTechnology({
                                ...newTechnology,
                                version: e.target.value,
                              })
                            }
                          />
                          <Input
                            placeholder="Category (optional)"
                            value={newTechnology.category || ""}
                            onChange={(e) =>
                              setNewTechnology({
                                ...newTechnology,
                                category: e.target.value,
                              })
                            }
                          />
                        </div>
                        <Button type="button" onClick={addTechnology} disabled={!newTechnology.name.trim()}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Technology
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="milestones" className="pt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Project Milestones</h3>

                      <div className="space-y-4">
                        {milestones.map((milestone, index) => (
                          <div key={index} className="flex items-center gap-2 p-3 border rounded-md">
                            <div className="flex-1">
                              <div className="font-medium">{milestone.title}</div>
                              {milestone.date && (
                                <div className="text-sm text-muted-foreground">
                                  Date: {format(new Date(milestone.date), "MMM d, yyyy")}
                                </div>
                              )}
                              {milestone.description && <div className="text-sm mt-1">{milestone.description}</div>}
                            </div>
                            <Button type="button" variant="ghost" size="sm" onClick={() => removeMilestone(index)}>
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            placeholder="Milestone title"
                            value={newMilestone.title}
                            onChange={(e) =>
                              setNewMilestone({
                                ...newMilestone,
                                title: e.target.value,
                              })
                            }
                          />
                          <Input
                            type="date"
                            placeholder="Date"
                            value={newMilestone.date || ""}
                            onChange={(e) =>
                              setNewMilestone({
                                ...newMilestone,
                                date: e.target.value,
                              })
                            }
                          />
                        </div>
                        <Textarea
                          placeholder="Description (optional)"
                          value={newMilestone.description || ""}
                          onChange={(e) =>
                            setNewMilestone({
                              ...newMilestone,
                              description: e.target.value,
                            })
                          }
                        />
                        <Button type="button" onClick={addMilestone} disabled={!newMilestone.title.trim()}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Milestone
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="challenges" className="pt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Project Challenges</h3>

                      <div className="space-y-4">
                        {challenges.map((challenge, index) => (
                          <div key={index} className="flex items-start gap-2 p-3 border rounded-md">
                            <div className="flex-1">
                              <div className="font-medium">{challenge.title}</div>
                              <div className="text-sm mt-1">{challenge.description}</div>
                              {challenge.solution && (
                                <div className="text-sm mt-2">
                                  <span className="font-medium">Solution:</span> {challenge.solution}
                                </div>
                              )}
                            </div>
                            <Button type="button" variant="ghost" size="sm" onClick={() => removeChallenge(index)}>
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <Input
                          placeholder="Challenge title"
                          value={newChallenge.title}
                          onChange={(e) =>
                            setNewChallenge({
                              ...newChallenge,
                              title: e.target.value,
                            })
                          }
                        />
                        <Textarea
                          placeholder="Challenge description"
                          value={newChallenge.description}
                          onChange={(e) =>
                            setNewChallenge({
                              ...newChallenge,
                              description: e.target.value,
                            })
                          }
                        />
                        <Textarea
                          placeholder="Solution (optional)"
                          value={newChallenge.solution || ""}
                          onChange={(e) =>
                            setNewChallenge({
                              ...newChallenge,
                              solution: e.target.value,
                            })
                          }
                        />
                        <Button
                          type="button"
                          onClick={addChallenge}
                          disabled={!newChallenge.title.trim() || !newChallenge.description.trim()}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Challenge
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="images" className="pt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Project Images</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {projectImages.map((image, index) => (
                          <div key={index} className="flex flex-col gap-2 p-3 border rounded-md">
                            <div className="relative h-40 w-full overflow-hidden rounded-md">
                              <img
                                src={image.url || "/placeholder.svg"}
                                alt={image.alt_text || "Project image"}
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <div className="flex-1">
                              {image.alt_text && (
                                <div className="text-sm text-muted-foreground">Alt: {image.alt_text}</div>
                              )}
                              {image.caption && (
                                <div className="text-sm text-muted-foreground">Caption: {image.caption}</div>
                              )}
                            </div>
                            <Button type="button" variant="ghost" size="sm" onClick={() => removeProjectImage(index)}>
                              <Trash className="h-4 w-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <Input
                          placeholder="Image URL"
                          value={newProjectImage.url}
                          onChange={(e) =>
                            setNewProjectImage({
                              ...newProjectImage,
                              url: e.target.value,
                            })
                          }
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            placeholder="Alt text (optional)"
                            value={newProjectImage.alt_text || ""}
                            onChange={(e) =>
                              setNewProjectImage({
                                ...newProjectImage,
                                alt_text: e.target.value,
                              })
                            }
                          />
                          <Input
                            placeholder="Caption (optional)"
                            value={newProjectImage.caption || ""}
                            onChange={(e) =>
                              setNewProjectImage({
                                ...newProjectImage,
                                caption: e.target.value,
                              })
                            }
                          />
                        </div>
                        <Button type="button" onClick={addProjectImage} disabled={!newProjectImage.url.trim()}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Image
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Button type="submit" disabled={isLoading} className="w-full">
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <Save className="mr-2 h-4 w-4" />
                      Save Project
                    </Button>
                  </div>

                  <FormField
                    control={form.control}
                    name="is_featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Featured</FormLabel>
                          <FormDescription>Show this project in featured sections</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_ongoing"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Ongoing</FormLabel>
                          <FormDescription>Mark this project as still in progress</FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={(value) => {
                              field.onChange(value)
                              if (value) {
                                form.setValue("status", "in-progress")
                              } else {
                                form.setValue("status", "completed")
                              }
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="planned">Planned</SelectItem>
                            <SelectItem value="on-hold">On Hold</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={form.control}
                      name="start_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="end_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              value={field.value || ""}
                              disabled={form.getValues("is_ongoing")}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="client"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client</FormLabel>
                        <FormControl>
                          <Input placeholder="Client name (optional)" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="thumbnail_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thumbnail URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} value={field.value || ""} />
                        </FormControl>
                        <FormDescription>Small image for project listings</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="main_image_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Main Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} value={field.value || ""} />
                        </FormControl>
                        <FormDescription>Featured image for project details</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="github_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GitHub URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://github.com/..." {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="demo_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Demo URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="video_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Video URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://youtube.com/..." {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="order_index"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Order</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} {...field} />
                        </FormControl>
                        <FormDescription>Lower numbers appear first</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  )
}
