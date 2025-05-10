"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { EnhancedDataTable, type Column } from "./enhanced-data-table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { toast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  published: boolean
  featured: boolean
  category_id: number | null
  category_name?: string
  created_at: string
  updated_at: string
  view_count: number
}

export function BlogPostManager() {
  const [posts, setPosts] = useState<BlogPost[]>()
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const router = useRouter()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/blog-posts")
      if (!response.ok) throw new Error("Failed to fetch blog posts")

      const data = await response.json()

      // Enhance the data with category names
      const postsWithCategories = await Promise.all(
        data.map(async (post: BlogPost) => {
          if (post.category_id) {
            try {
              const categoryRes = await fetch(`/api/admin/categories/${post.category_id}`)
              if (categoryRes.ok) {
                const category = await categoryRes.json()
                return { ...post, category_name: category.name }
              }
            } catch (error) {
              console.error("Error fetching category:", error)
            }
          }
          return post
        }),
      )

      setPosts(postsWithCategories)
    } catch (error) {
      console.error("Error fetching blog posts:", error)
      toast({
        title: "Error",
        description: "Failed to load blog posts. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string | number) => {
    try {
      const response = await fetch(`/api/admin/blog-posts/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete blog post")

      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      })

      // Refresh the posts list
      fetchPosts()
    } catch (error) {
      console.error("Error deleting blog post:", error)
      toast({
        title: "Error",
        description: "Failed to delete blog post. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (id: string | number) => {
    router.push(`/admin/blog-management/edit/${id}`)
  }

  const columns: Column<BlogPost>[] = [
    {
      id: "title",
      header: "Title",
      cell: (post) => post.title,
      sortable: true,
      searchable: true,
    },
    {
      id: "slug",
      header: "Slug",
      cell: (post) => post.slug,
      sortable: true,
      searchable: true,
    },
    {
      id: "status",
      header: "Status",
      cell: (post) => (
        <Badge variant={post.published ? "default" : "secondary"}>{post.published ? "Published" : "Draft"}</Badge>
      ),
      sortable: true,
    },
    {
      id: "featured",
      header: "Featured",
      cell: (post) => (
        <Badge variant={post.featured ? "default" : "outline"}>{post.featured ? "Featured" : "Regular"}</Badge>
      ),
      sortable: true,
    },
    {
      id: "category",
      header: "Category",
      cell: (post) => post.category_name || "Uncategorized",
      sortable: true,
      searchable: true,
    },
    {
      id: "views",
      header: "Views",
      cell: (post) => post.view_count.toString(),
      sortable: true,
    },
    {
      id: "updated",
      header: "Last Updated",
      cell: (post) => format(new Date(post.updated_at), "MMM d, yyyy"),
      sortable: true,
    },
  ]

  const filteredPosts = {
    all: posts,
    published: posts?.filter((post) => post.published),
    drafts: posts?.filter((post) => !post.published),
    featured: posts?.filter((post) => post.featured),
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="pt-4">
          <EnhancedDataTable
            data={filteredPosts.all}
            columns={columns}
            isLoading={isLoading}
            createHref="/admin/blog-management/create"
            createLabel="Create New Post"
            onDelete={handleDelete}
            onEdit={handleEdit}
            getItemId={(post) => post.id}
            searchPlaceholder="Search blog posts..."
            emptyMessage="No blog posts found"
          />
        </TabsContent>
        <TabsContent value="published" className="pt-4">
          <EnhancedDataTable
            data={filteredPosts.published}
            columns={columns}
            isLoading={isLoading}
            createHref="/admin/blog-management/create"
            createLabel="Create New Post"
            onDelete={handleDelete}
            onEdit={handleEdit}
            getItemId={(post) => post.id}
            searchPlaceholder="Search published posts..."
            emptyMessage="No published posts found"
          />
        </TabsContent>
        <TabsContent value="drafts" className="pt-4">
          <EnhancedDataTable
            data={filteredPosts.drafts}
            columns={columns}
            isLoading={isLoading}
            createHref="/admin/blog-management/create"
            createLabel="Create New Post"
            onDelete={handleDelete}
            onEdit={handleEdit}
            getItemId={(post) => post.id}
            searchPlaceholder="Search draft posts..."
            emptyMessage="No draft posts found"
          />
        </TabsContent>
        <TabsContent value="featured" className="pt-4">
          <EnhancedDataTable
            data={filteredPosts.featured}
            columns={columns}
            isLoading={isLoading}
            createHref="/admin/blog-management/create"
            createLabel="Create New Post"
            onDelete={handleDelete}
            onEdit={handleEdit}
            getItemId={(post) => post.id}
            searchPlaceholder="Search featured posts..."
            emptyMessage="No featured posts found"
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
