"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { EnhancedEditor } from "@/components/admin/enhanced-editor"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PostPreview } from "./post-preview"
import { slugify } from "@/lib/utils"
import type { BlogPost, Category, Tag } from "@/types/blog"

interface LivePostEditorProps {
  post?: BlogPost
  categories: Category[]
  tags: Tag[]
  selectedTagIds?: number[]
  action: (formData: FormData) => Promise<void>
}

export function LivePostEditor({ post, categories, tags, selectedTagIds = [], action }: LivePostEditorProps) {
  const router = useRouter()
  const [title, setTitle] = useState(post?.title || "")
  const [slug, setSlug] = useState(post?.slug || "")
  const [excerpt, setExcerpt] = useState(post?.excerpt || "")
  const [content, setContent] = useState(post?.content || "")
  const [imageUrl, setImageUrl] = useState(post?.image_url || "")
  const [readTime, setReadTime] = useState(post?.read_time || "5 min")
  const [categoryId, setCategoryId] = useState<string>(post?.category_id?.toString() || "")
  const [published, setPublished] = useState(post?.published || false)
  const [featured, setFeatured] = useState(post?.featured || false)
  const [selectedTags, setSelectedTags] = useState<number[]>(selectedTagIds || [])
  const [activeTab, setActiveTab] = useState("edit")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Auto-generate slug from title
  useEffect(() => {
    if (title && !post) {
      setSlug(slugify(title))
    }
  }, [title, post])

  // Auto-calculate read time based on content length
  useEffect(() => {
    if (content) {
      const words = content.trim().split(/\s+/).length
      const minutes = Math.max(1, Math.ceil(words / 200))
      setReadTime(`${minutes} min${minutes !== 1 ? "s" : ""}`)
    }
  }, [content])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      await action(formData)
    } catch (error) {
      console.error("Error submitting form:", error)
      setIsSubmitting(false)
    }
  }

  const handleTagToggle = (tagId: number) => {
    setSelectedTags((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="edit" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>

              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" name="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
              </div>

              <div>
                <Label htmlFor="image_url">Featured Image URL</Label>
                <Input
                  id="image_url"
                  name="image_url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <Label htmlFor="category_id">Category</Label>
                <Select value={categoryId} onValueChange={(value) => setCategoryId(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input type="hidden" name="category_id" value={categoryId} />
              </div>

              <div>
                <Label htmlFor="read_time">Read Time</Label>
                <Input id="read_time" name="read_time" value={readTime} onChange={(e) => setReadTime(e.target.value)} />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="published"
                  checked={published}
                  onCheckedChange={(checked) => setPublished(checked as boolean)}
                />
                <Label htmlFor="published">Published</Label>
                <input type="hidden" name="published" value={published ? "true" : "false"} />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={featured}
                  onCheckedChange={(checked) => setFeatured(checked as boolean)}
                />
                <Label htmlFor="featured">Featured</Label>
                <input type="hidden" name="featured" value={featured ? "true" : "false"} />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full min-h-[100px] p-2 border rounded-md"
                  placeholder="Brief summary of the post..."
                />
              </div>

              <div>
                <Label>Tags</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {tags.map((tag) => (
                    <div key={tag.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tag-${tag.id}`}
                        checked={selectedTags.includes(tag.id)}
                        onCheckedChange={() => handleTagToggle(tag.id)}
                      />
                      <Label htmlFor={`tag-${tag.id}`}>{tag.name}</Label>
                      {selectedTags.includes(tag.id) && <input type="hidden" name="tags" value={tag.id} />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="content">Content</Label>
            <EnhancedEditor
              initialValue={content}
              onChange={setContent}
              height="500px"
              placeholder="Write your blog post content here..."
            />
            <input type="hidden" name="content" value={content} />
          </div>
        </TabsContent>

        <TabsContent value="preview" className="pt-4">
          <Card>
            <CardContent className="p-6">
              <PostPreview
                post={{
                  id: post?.id || 0,
                  title,
                  slug,
                  excerpt,
                  content,
                  image_url: imageUrl,
                  read_time: readTime,
                  published,
                  featured,
                  created_at: post?.created_at || new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                  category_id: Number.parseInt(categoryId) || 0,
                  categories: categories.find((c) => c.id.toString() === categoryId) || null,
                  tags: tags.filter((tag) => selectedTags.includes(tag.id)),
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Post"}
        </Button>
      </div>
    </form>
  )
}
