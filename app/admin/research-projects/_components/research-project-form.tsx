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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { ImageUploader } from "@/components/admin/image-uploader"
import { LoadingButton } from "@/components/ui/loading-button"
import type { ResearchProject } from "@/types/research-projects"

interface ResearchProjectFormProps {
  project?: ResearchProject
  action: (formData: FormData) => Promise<void>
}

export function ResearchProjectForm({ project, action }: ResearchProjectFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [imageUrl, setImageUrl] = useState<string>(project?.image_url || "")
  const [featured, setFeatured] = useState<boolean>(project?.featured || false)

  // State for dynamic fields
  const [tags, setTags] = useState<string[]>(project?.tags || [])
  const [newTag, setNewTag] = useState("")

  const [challenges, setChallenges] = useState<{ id?: number; description: string }[]>(project?.challenges || [])

  const [updates, setUpdates] = useState<{ date: Date; text: string }[]>(
    project?.recentUpdates?.map((update) => ({
      date: new Date(update.date),
      text: update.text,
    })) || [],
  )

  const [teamMembers, setTeamMembers] = useState<string[]>(project?.teamMembers || [])
  const [newTeamMember, setNewTeamMember] = useState("")

  const [resources, setResources] = useState<{ name: string; url: string }[]>(project?.resources || [])

  // Handle image selection
  const handleImageSelected = (url: string) => {
    setImageUrl(url)
  }

  // Handle adding a tag
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  // Handle removing a tag
  const handleRemoveTag = (index: number) => {
    const newTags = [...tags]
    newTags.splice(index, 1)
    setTags(newTags)
  }

  // Handle adding a challenge
  const handleAddChallenge = () => {
    setChallenges([...challenges, { description: "" }])
  }

  // Handle updating a challenge
  const handleUpdateChallenge = (index: number, description: string) => {
    const newChallenges = [...challenges]
    newChallenges[index].description = description
    setChallenges(newChallenges)
  }

  // Handle removing a challenge
  const handleRemoveChallenge = (index: number) => {
    const newChallenges = [...challenges]
    newChallenges.splice(index, 1)
    setChallenges(newChallenges)
  }

  // Handle adding an update
  const handleAddUpdate = () => {
    setUpdates([...updates, { date: new Date(), text: "" }])
  }

  // Handle updating an update
  const handleUpdateUpdate = (index: number, field: "date" | "text", value: Date | string) => {
    const newUpdates = [...updates]
    newUpdates[index][field] = value as any
    setUpdates(newUpdates)
  }

  // Handle removing an update
  const handleRemoveUpdate = (index: number) => {
    const newUpdates = [...updates]
    newUpdates.splice(index, 1)
    setUpdates(newUpdates)
  }

  // Handle adding a team member
  const handleAddTeamMember = () => {
    if (newTeamMember.trim() && !teamMembers.includes(newTeamMember.trim())) {
      setTeamMembers([...teamMembers, newTeamMember.trim()])
      setNewTeamMember("")
    }
  }

  // Handle removing a team member
  const handleRemoveTeamMember = (index: number) => {
    const newTeamMembers = [...teamMembers]
    newTeamMembers.splice(index, 1)
    setTeamMembers(newTeamMembers)
  }

  // Handle adding a resource
  const handleAddResource = () => {
    setResources([...resources, { name: "", url: "" }])
  }

  // Handle updating a resource
  const handleUpdateResource = (index: number, field: "name" | "url", value: string) => {
    const newResources = [...resources]
    newResources[index][field] = value
    setResources(newResources)
  }

  // Handle removing a resource
  const handleRemoveResource = (index: number) => {
    const newResources = [...resources]
    newResources.splice(index, 1)
    setResources(newResources)
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const form = e.currentTarget
      const formData = new FormData(form)

      // Add image URL to form data
      formData.set("image_url", imageUrl)

      // Add featured flag to form data
      formData.set("featured", featured.toString())

      // Add tags to form data
      formData.delete("tags")
      tags.forEach((tag) => {
        formData.append("tags", tag)
      })

      // Add challenges to form data
      formData.delete("challenges")
      challenges.forEach((challenge) => {
        formData.append("challenges", challenge.description)
      })

      // Add updates to form data
      formData.delete("updates")
      updates.forEach((update) => {
        formData.append("update_dates", format(update.date, "yyyy-MM-dd"))
        formData.append("update_texts", update.text)
      })

      // Add team members to form data
      formData.delete("team_members")
      teamMembers.forEach((member) => {
        formData.append("team_members", member)
      })

      // Add resources to form data
      formData.delete("resources")
      resources.forEach((resource) => {
        formData.append("resource_names", resource.name)
        formData.append("resource_urls", resource.url)
      })

      await action(formData)

      toast({
        title: "Success",
        description: `Research project ${project ? "updated" : "created"} successfully`,
      })

      router.push("/admin/research-projects")
      router.refresh()
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: `Failed to ${project ? "update" : "create"} research project`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Calculate days remaining
  const calculateDaysRemaining = (endDate: string) => {
    const end = new Date(endDate)
    const today = new Date()
    const diffTime = end.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="details">Basic Details</TabsTrigger>
          <TabsTrigger value="content">Content & Media</TabsTrigger>
          <TabsTrigger value="challenges">Challenges & Updates</TabsTrigger>
          <TabsTrigger value="team">Team & Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title</Label>
                  <Input id="title" name="title" defaultValue={project?.title || ""} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input id="slug" name="slug" defaultValue={project?.slug || ""} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Short Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={project?.description || ""}
                  required
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="completion">Completion (%)</Label>
                  <Input
                    id="completion"
                    name="completion"
                    type="number"
                    min="0"
                    max="100"
                    defaultValue={project?.completion || 0}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select name="priority" defaultValue={project?.priority || "medium"}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select name="category" defaultValue={project?.category || ""} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AI">AI</SelectItem>
                      <SelectItem value="Machine Learning">Machine Learning</SelectItem>
                      <SelectItem value="Aerospace">Aerospace</SelectItem>
                      <SelectItem value="Quantum">Quantum</SelectItem>
                      <SelectItem value="Robotics">Robotics</SelectItem>
                      <SelectItem value="Data Science">Data Science</SelectItem>
                      <SelectItem value="Software">Software</SelectItem>
                      <SelectItem value="Research">Research</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Energy">Energy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={featured}
                  onCheckedChange={(checked) => setFeatured(checked as boolean)}
                />
                <Label htmlFor="featured">Featured Project</Label>
                <input type="hidden" name="featured" value={featured ? "true" : "false"} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !project?.startDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {project?.startDate ? format(new Date(project.startDate), "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        initialFocus
                        defaultMonth={project?.startDate ? new Date(project.startDate) : undefined}
                        selected={project?.startDate ? new Date(project.startDate) : undefined}
                        onSelect={(date) => {
                          const input = document.createElement("input")
                          input.type = "hidden"
                          input.name = "start_date"
                          input.value = date ? format(date, "yyyy-MM-dd") : ""
                          document.getElementById("hidden-inputs")?.appendChild(input)
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  {project?.startDate && (
                    <input
                      type="hidden"
                      name="start_date"
                      defaultValue={format(new Date(project.startDate), "yyyy-MM-dd")}
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label>End Date (leave empty for ongoing)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !project?.endDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {project?.endDate ? format(new Date(project.endDate), "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        initialFocus
                        defaultMonth={project?.endDate ? new Date(project.endDate) : undefined}
                        selected={project?.endDate ? new Date(project.endDate) : undefined}
                        onSelect={(date) => {
                          const input = document.createElement("input")
                          input.type = "hidden"
                          input.name = "end_date"
                          input.value = date ? format(date, "yyyy-MM-dd") : ""
                          document.getElementById("hidden-inputs")?.appendChild(input)

                          // Calculate days remaining
                          if (date) {
                            const daysInput = document.createElement("input")
                            daysInput.type = "hidden"
                            daysInput.name = "days_remaining"
                            daysInput.value = calculateDaysRemaining(format(date, "yyyy-MM-dd")).toString()
                            document.getElementById("hidden-inputs")?.appendChild(daysInput)
                          }
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  {project?.endDate && (
                    <>
                      <input
                        type="hidden"
                        name="end_date"
                        defaultValue={format(new Date(project.endDate), "yyyy-MM-dd")}
                      />
                      <input type="hidden" name="days_remaining" defaultValue={project.daysRemaining.toString()} />
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(index)}
                        className="ml-2 text-muted-foreground hover:text-destructive"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                    className="flex-1"
                  />
                  <Button type="button" onClick={handleAddTag} size="sm">
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="long_description">Detailed Description</Label>
                <Textarea
                  id="long_description"
                  name="long_description"
                  defaultValue={project?.longDescription || ""}
                  rows={10}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="next_milestone">Next Milestone</Label>
                <Textarea
                  id="next_milestone"
                  name="next_milestone"
                  defaultValue={project?.nextMilestone || ""}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Featured Image</Label>
                <div className="border rounded-md p-4">
                  <ImageUploader
                    currentImage={imageUrl}
                    onImageSelected={handleImageSelected}
                    folder="research-projects"
                  />
                  <input type="hidden" name="image_url" value={imageUrl} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Challenges & Updates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Challenges</Label>
                  <Button type="button" onClick={handleAddChallenge} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Challenge
                  </Button>
                </div>

                {challenges.map((challenge, index) => (
                  <div key={index} className="flex gap-2">
                    <Textarea
                      value={challenge.description}
                      onChange={(e) => handleUpdateChallenge(index, e.target.value)}
                      placeholder="Describe the challenge"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={() => handleRemoveChallenge(index)}
                      size="icon"
                      variant="destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                {challenges.length === 0 && <p className="text-sm text-muted-foreground">No challenges added yet.</p>}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Recent Updates</Label>
                  <Button type="button" onClick={handleAddUpdate} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Update
                  </Button>
                </div>

                {updates.map((update, index) => (
                  <div key={index} className="space-y-2 border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Label>Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {format(update.date, "PPP")}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={update.date}
                              onSelect={(date) => date && handleUpdateUpdate(index, "date", date)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <Button
                        type="button"
                        onClick={() => handleRemoveUpdate(index)}
                        size="icon"
                        variant="destructive"
                        className="mt-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div>
                      <Label>Update Text</Label>
                      <Textarea
                        value={update.text}
                        onChange={(e) => handleUpdateUpdate(index, "text", e.target.value)}
                        placeholder="Describe the update"
                      />
                    </div>
                  </div>
                ))}

                {updates.length === 0 && <p className="text-sm text-muted-foreground">No updates added yet.</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Team & Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Team Members</Label>
                  <div className="text-sm text-muted-foreground">Add "(Lead)" after name to mark as lead</div>
                </div>

                <div className="flex flex-wrap gap-2 mb-2">
                  {teamMembers.map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm"
                    >
                      <span>{member}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTeamMember(index)}
                        className="ml-2 text-muted-foreground hover:text-destructive"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    value={newTeamMember}
                    onChange={(e) => setNewTeamMember(e.target.value)}
                    placeholder="Add a team member"
                    className="flex-1"
                  />
                  <Button type="button" onClick={handleAddTeamMember} size="sm">
                    Add
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Resources</Label>
                  <Button type="button" onClick={handleAddResource} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Resource
                  </Button>
                </div>

                {resources.map((resource, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <Input
                        value={resource.name}
                        onChange={(e) => handleUpdateResource(index, "name", e.target.value)}
                        placeholder="Resource name"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={resource.url}
                        onChange={(e) => handleUpdateResource(index, "url", e.target.value)}
                        placeholder="Resource URL"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        onClick={() => handleRemoveResource(index)}
                        size="icon"
                        variant="destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {resources.length === 0 && <p className="text-sm text-muted-foreground">No resources added yet.</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div id="hidden-inputs"></div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/research-projects")}>
          Cancel
        </Button>
        <LoadingButton type="submit" loading={isSubmitting} loadingText="Saving..." className="ml-auto">
          {project ? "Update" : "Create"} Research Project
        </LoadingButton>
      </div>
    </form>
  )
}
