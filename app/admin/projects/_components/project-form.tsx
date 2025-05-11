"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUploader } from "@/components/admin/image-uploader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type {
  Project,
  ProjectChallenge,
  ProjectMilestone,
  Tag,
} from "@/types/projects";
import { LoadingButton } from "@/components/ui/loading-button";

interface ProjectFormProps {
  project?: Project;
  tags: Tag[];
  selectedTagIds: number[];
  challenges: ProjectChallenge[];
  milestones: ProjectMilestone[];
  action: (formData: FormData) => Promise<void>;
}

export function ProjectForm({
  project,
  tags,
  selectedTagIds,
  challenges,
  milestones,
  action,
}: ProjectFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [newChallenges, setNewChallenges] = useState<string[]>([]);
  const [newMilestones, setNewMilestones] = useState<
    { description: string; due_date: Date | null; completed: boolean }[]
  >([]);
  const [imageUrl, setImageUrl] = useState<string>(project?.image_url || "");
  const [isFeatured, setIsFeatured] = useState(project?.is_featured || false);

  const handleAddChallenge = () => {
    setNewChallenges([...newChallenges, ""]);
  };

  const handleChallengeChange = (index: number, value: string) => {
    const updated = [...newChallenges];
    updated[index] = value;
    setNewChallenges(updated);
  };

  const handleRemoveChallenge = (index: number) => {
    const updated = [...newChallenges];
    updated.splice(index, 1);
    setNewChallenges(updated);
  };

  const handleAddMilestone = () => {
    setNewMilestones([
      ...newMilestones,
      { description: "", due_date: null, completed: false },
    ]);
  };

  const handleMilestoneChange = (index: number, field: string, value: any) => {
    const updated = [...newMilestones];
    updated[index] = { ...updated[index], [field]: value };
    setNewMilestones(updated);
  };

  const handleRemoveMilestone = (index: number) => {
    const updated = [...newMilestones];
    updated.splice(index, 1);
    setNewMilestones(updated);
  };

  const handleImageSelected = (url: string) => {
    setImageUrl(url);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    // Add is_featured field if checked
    if (isFeatured) {
      formData.set("is_featured", "true");
    } else {
      formData.set("is_featured", "false");
    }

    // Add image URL to form data
    formData.set("image_url", imageUrl);

    // Add new challenges to form data
    newChallenges.forEach((challenge, index) => {
      if (challenge.trim()) {
        formData.append("new_challenge", challenge);
      }
    });

    // Add new milestones to form data
    newMilestones.forEach((milestone, index) => {
      if (milestone.description.trim()) {
        formData.append("new_milestone_description", milestone.description);
        formData.append(
          "new_milestone_due_date",
          milestone.due_date ? format(milestone.due_date, "yyyy-MM-dd") : ""
        );
        formData.append(
          "new_milestone_completed",
          milestone.completed ? "true" : "false"
        );
      }
    });

    try {
      // Submit the form data
      await action(formData);

      // Revalidate the projects data to ensure both featured and regular projects are updated
      try {
        await fetch("/api/projects/revalidate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("Projects data revalidated successfully");
      } catch (revalidateError) {
        console.error("Error revalidating projects data:", revalidateError);
        // Continue with the flow even if revalidation fails
      }

      // Navigate to the projects admin page
      router.push("/admin/projects");
      router.refresh();
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="details">Basic Details</TabsTrigger>
          <TabsTrigger value="content">Content & Media</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
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
                  <Input
                    id="title"
                    name="title"
                    defaultValue={project?.title || ""}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    name="slug"
                    defaultValue={project?.slug || ""}
                    required
                  />
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
                  <Select
                    name="priority"
                    defaultValue={project?.priority || "medium"}
                  >
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
                  <Label htmlFor="team_size">Team Size</Label>
                  <Input
                    id="team_size"
                    name="team_size"
                    type="number"
                    min="1"
                    defaultValue={project?.team_size || 1}
                  />
                </div>
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
                          !project?.start_date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {project?.start_date
                          ? format(new Date(project.start_date), "PPP")
                          : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        initialFocus
                        defaultMonth={
                          project?.start_date
                            ? new Date(project.start_date)
                            : undefined
                        }
                        selected={
                          project?.start_date
                            ? new Date(project.start_date)
                            : undefined
                        }
                        onSelect={(date) => {
                          const input = document.createElement("input");
                          input.type = "hidden";
                          input.name = "start_date";
                          input.value = date ? format(date, "yyyy-MM-dd") : "";
                          document
                            .getElementById("hidden-inputs")
                            ?.appendChild(input);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  {project?.start_date && (
                    <input
                      type="hidden"
                      name="start_date"
                      defaultValue={format(
                        new Date(project.start_date),
                        "yyyy-MM-dd"
                      )}
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
                          !project?.end_date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {project?.end_date
                          ? format(new Date(project.end_date), "PPP")
                          : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        initialFocus
                        defaultMonth={
                          project?.end_date
                            ? new Date(project.end_date)
                            : undefined
                        }
                        selected={
                          project?.end_date
                            ? new Date(project.end_date)
                            : undefined
                        }
                        onSelect={(date) => {
                          const input = document.createElement("input");
                          input.type = "hidden";
                          input.name = "end_date";
                          input.value = date ? format(date, "yyyy-MM-dd") : "";
                          document
                            .getElementById("hidden-inputs")
                            ?.appendChild(input);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  {project?.end_date && (
                    <input
                      type="hidden"
                      name="end_date"
                      defaultValue={format(
                        new Date(project.end_date),
                        "yyyy-MM-dd"
                      )}
                    />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {tags.map((tag) => (
                    <div key={tag.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tag-${tag.id}`}
                        name="tags"
                        value={tag.id}
                        defaultChecked={selectedTagIds.includes(tag.id)}
                      />
                      <Label htmlFor={`tag-${tag.id}`} className="font-normal">
                        {tag.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2 mt-4 border-t pt-4">
                <Checkbox
                  id="is_featured"
                  checked={isFeatured}
                  onCheckedChange={setIsFeatured}
                />
                <Label
                  htmlFor="is_featured"
                  className="font-medium cursor-pointer"
                >
                  Featured Project (will appear in Featured Projects section)
                </Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>External Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="github_url">GitHub URL</Label>
                  <Input
                    id="github_url"
                    name="github_url"
                    defaultValue={project?.github_url || ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="demo_url">Demo URL</Label>
                  <Input
                    id="demo_url"
                    name="demo_url"
                    defaultValue={project?.demo_url || ""}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Your Role</Label>
                <Input
                  id="role"
                  name="role"
                  defaultValue={project?.role || ""}
                />
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
                <Label htmlFor="detailed_description">
                  Detailed Description (Markdown)
                </Label>
                <Textarea
                  id="detailed_description"
                  name="detailed_description"
                  defaultValue={project?.detailed_description || ""}
                  rows={10}
                />
              </div>

              <div className="space-y-2">
                <Label>Featured Image</Label>
                <div className="border rounded-md p-4">
                  <ImageUploader
                    currentImage={imageUrl}
                    onImageSelected={handleImageSelected}
                    folder="projects"
                  />
                  <input type="hidden" name="image_url" value={imageUrl} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Key Achievements (one per line)</Label>
                <Textarea
                  name="key_achievements"
                  defaultValue={project?.key_achievements?.join("\n") || ""}
                  rows={4}
                  placeholder="• Increased performance by 40%
• Reduced error rates by 25%
• Implemented CI/CD pipeline"
                />
              </div>

              <div className="space-y-2">
                <Label>Technologies (comma separated)</Label>
                <Input
                  name="technologies"
                  defaultValue={project?.technologies?.join(", ") || ""}
                  placeholder="React, TypeScript, Node.js, PostgreSQL"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Challenges</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {challenges.map((challenge, index) => (
                <div key={challenge.id} className="space-y-2">
                  <Label htmlFor={`challenge-${challenge.id}`}>
                    Challenge {index + 1}
                  </Label>
                  <div className="flex gap-2">
                    <Textarea
                      id={`challenge-${challenge.id}`}
                      name="challenge_description"
                      defaultValue={challenge.description}
                      rows={2}
                    />
                    <input
                      type="hidden"
                      name="challenge_id"
                      value={challenge.id}
                    />
                  </div>
                </div>
              ))}

              {newChallenges.map((challenge, index) => (
                <div key={`new-${index}`} className="space-y-2">
                  <Label htmlFor={`new-challenge-${index}`}>
                    New Challenge {index + 1}
                  </Label>
                  <div className="flex gap-2">
                    <Textarea
                      id={`new-challenge-${index}`}
                      name="new_challenge"
                      value={challenge}
                      onChange={(e) =>
                        handleChallengeChange(index, e.target.value)
                      }
                      rows={2}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => handleRemoveChallenge(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                onClick={handleAddChallenge}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Challenge
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Milestones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.id}
                  className="space-y-2 border-b pb-4 mb-4 last:border-0"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor={`milestone-${milestone.id}`}>
                        Milestone {index + 1}
                      </Label>
                      <Textarea
                        id={`milestone-${milestone.id}`}
                        name="milestone_description"
                        defaultValue={milestone.description}
                        rows={2}
                      />
                      <input
                        type="hidden"
                        name="milestone_id"
                        value={milestone.id}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Due Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !milestone.due_date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {milestone.due_date
                              ? format(new Date(milestone.due_date), "PPP")
                              : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            initialFocus
                            defaultMonth={
                              milestone.due_date
                                ? new Date(milestone.due_date)
                                : undefined
                            }
                            selected={
                              milestone.due_date
                                ? new Date(milestone.due_date)
                                : undefined
                            }
                            onSelect={(date) => {
                              const input = document.createElement("input");
                              input.type = "hidden";
                              input.name = "milestone_due_date";
                              input.value = date
                                ? format(date, "yyyy-MM-dd")
                                : "";
                              document
                                .getElementById("hidden-inputs")
                                ?.appendChild(input);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      {milestone.due_date && (
                        <input
                          type="hidden"
                          name="milestone_due_date"
                          defaultValue={format(
                            new Date(milestone.due_date),
                            "yyyy-MM-dd"
                          )}
                        />
                      )}

                      <div className="flex items-center space-x-2 mt-2">
                        <Checkbox
                          id={`milestone-completed-${milestone.id}`}
                          name="milestone_completed"
                          value="true"
                          defaultChecked={milestone.completed}
                        />
                        <Label
                          htmlFor={`milestone-completed-${milestone.id}`}
                          className="font-normal"
                        >
                          Completed
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {newMilestones.map((milestone, index) => (
                <div
                  key={`new-milestone-${index}`}
                  className="space-y-2 border-b pb-4 mb-4 last:border-0"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor={`new-milestone-${index}`}>
                        New Milestone {index + 1}
                      </Label>
                      <div className="flex gap-2">
                        <Textarea
                          id={`new-milestone-${index}`}
                          name="new_milestone_description"
                          value={milestone.description}
                          onChange={(e) =>
                            handleMilestoneChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          rows={2}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => handleRemoveMilestone(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Due Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !milestone.due_date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {milestone.due_date
                              ? format(milestone.due_date, "PPP")
                              : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            initialFocus
                            selected={milestone.due_date}
                            onSelect={(date) =>
                              handleMilestoneChange(index, "due_date", date)
                            }
                          />
                        </PopoverContent>
                      </Popover>
                      <input
                        type="hidden"
                        name="new_milestone_due_date"
                        value={
                          milestone.due_date
                            ? format(milestone.due_date, "yyyy-MM-dd")
                            : ""
                        }
                      />

                      <div className="flex items-center space-x-2 mt-2">
                        <Checkbox
                          id={`new-milestone-completed-${index}`}
                          name="new_milestone_completed"
                          value="true"
                          checked={milestone.completed}
                          onCheckedChange={(checked) =>
                            handleMilestoneChange(
                              index,
                              "completed",
                              checked === true
                            )
                          }
                        />
                        <Label
                          htmlFor={`new-milestone-completed-${index}`}
                          className="font-normal"
                        >
                          Completed
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                onClick={handleAddMilestone}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Milestone
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div id="hidden-inputs"></div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/projects")}
        >
          Cancel
        </Button>
        <LoadingButton
          type="submit"
          loading={isSubmitting}
          loadingText="Saving..."
          className="ml-auto"
        >
          Save
        </LoadingButton>
      </div>
    </form>
  );
}
