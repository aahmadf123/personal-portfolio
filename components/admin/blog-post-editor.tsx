"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Save } from "lucide-react"
import { slugify } from "@/lib/utils"

interface Category {
  id: number
  name: string
}

interface Tag {
  id: number
  name: string
}

const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  image_url: z.string().optional(),
  read_time: z.coerce.number().int().min(1).optional(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  category_id: z.coerce.number().optional(),
  tags: z.array(z.coerce.number()).optional(),
})

type BlogPostFormValues = z.infer<typeof blogPostSchema>

interface BlogPostEditorProps {
  postId?: string
  isNew?: boolean
}

export function BlogPostEditor({ postId, isNew = false }: BlogPostEditorProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedTags, setSelectedTags] = useState<number[]>([])
  const [previewHtml, setPreviewHtml] = useState<string>("")
  const router = useRouter()

  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      image_url: "",
      read_time: 5,
      published: false,
      featured: false,
      category_id: undefined,
      tags: [],
    },
  })

  // Fetch post data if editing
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/admin/categories")
        if (!response.ok) throw new Error("Failed to fetch categories")
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error("Error fetching categories:", error)
        toast({
          title: "Error",
          description: "Failed to load categories. Please try again.",
          variant: "destructive",
        })
      }
    }

    const fetchTags = async () => {
      try {
        const response = await fetch("/api/admin/blog-tags")
        if (!response.ok) throw new Error("Failed to fetch tags")
        const data = await response.json()
        setTags(data)
      } catch (error) {
        console.error("Error fetching tags:", error)
        toast({
          title: "Error",
          description: "Failed to load tags. Please try again.",
          variant: "destructive",
        })
      }
    }

    const fetchPostData = async () => {
      if (!postId || isNew) return

      try {
        setIsLoading(true)
        const response = await fetch(`/api/admin/blog-posts/${postId}`)
        if (!response.ok) throw new Error("Failed to fetch post")

        const post = await response.json()

        // Fetch post tags
        const tagsResponse = await fetch(`/api/admin/blog-posts/${postId}/tags`)
        if (tagsResponse.ok) {
          const tagsData = await tagsResponse.json()
          const tagIds = tagsData.map((tag: any) => tag.id)
          setSelectedTags(tagIds)
          post.tags = tagIds
        }

        form.reset(post)
        updatePreview(post.content)
      } catch (error) {
        console.error("Error fetching post:", error)
        toast({
          title: "Error",
          description: "Failed to load post data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
    fetchTags()
    fetchPostData()
  }, [postId, isNew, form])

  const updatePreview = async (content: string) => {
    try {
      const response = await fetch("/api/admin/markdown-preview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ markdown: content }),
      })

      if (!response.ok) throw new Error("Failed to generate preview")

      const data = await response.json()
      setPreviewHtml(data.html)
    } catch (error) {
      console.error("Error generating preview:", error)
    }
  }

  const onSubmit = async (values: BlogPostFormValues) => {
    try {
      setIsLoading(true)

      // Include selected tags
      values.tags = selectedTags

      const url = isNew ? "/api/admin/blog-posts" : `/api/admin/blog-posts/${postId}`

      const method = isNew ? "POST" : "PUT"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) throw new Error("Failed to save blog post")

      toast({
        title: "Success",
        description: `Blog post ${isNew ? "created" : "updated"} successfully`,
      })

      router.push("/admin/blog-management")
    } catch (error) {
      console.error("Error saving blog post:", error)
      toast({
        title: "Error",
        description: "Failed to save blog post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value
    form.setValue("content", content)
    updatePreview(content)
  }

  const handleGenerateSlug = () => {
    const title = form.getValues("title")
    if (title) {
      const slug = slugify(title)
      form.setValue("slug", slug)
    }
  }

  const handleTagChange = (tagId: number) => {
    setSelectedTags((prev) => {
      if (prev.includes(tagId)) {
        return prev.filter((id) => id !== tagId)
      } else {
        return [...prev, tagId]
      }
    })
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
                    <Input placeholder="Post title" {...field} />
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
                      <Input placeholder="post-slug" {...field} />
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
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Brief summary of the post" className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormDescription>A short summary that appears in blog listings</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Tabs defaultValue="write">
              <TabsList>
                <TabsTrigger value="write">Write</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="write" className="pt-4">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write your post content in Markdown..."
                          className="min-h-[400px] font-mono"
                          {...field}
                          onChange={handleContentChange}
                        />
                      </FormControl>
                      <FormDescription>Supports Markdown formatting</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              <TabsContent value="preview" className="pt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div
                      className="prose dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: previewHtml }}
                    />
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
                      Save {form.getValues("published") ? "& Publish" : "Draft"}
                    </Button>
                  </div>

                  <FormField
                    control={form.control}
                    name="published"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Published</FormLabel>
                          <FormDescription>Make this post visible to visitors</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Featured</FormLabel>
                          <FormDescription>Show this post in featured sections</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id.toString()}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <FormLabel>Tags</FormLabel>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge
                          key={tag.id}
                          variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => handleTagChange(tag.id)}
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="image_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Featured Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormDescription>URL to the main image for this post</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="read_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Read Time (minutes)</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} {...field} />
                        </FormControl>
                        <FormDescription>Estimated reading time in minutes</FormDescription>
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
