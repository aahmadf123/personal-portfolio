"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClientSupabaseClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Filter, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function BlogAdminClient({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; status?: string; sort?: string }
}) {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState(searchParams.q || "")
  const router = useRouter()
  const supabase = createClientSupabaseClient()

  const fetchPosts = async () => {
    try {
      setLoading(true)

      let query = supabase.from("blog_posts").select(`
          *,
          categories:category_id(id, name)
        `)

      if (searchParams.q) {
        query = query.ilike("title", `%${searchParams.q}%`)
      }

      if (searchParams.category) {
        query = query.eq("category_id", searchParams.category)
      }

      if (searchParams.status) {
        if (searchParams.status === "published") {
          query = query.eq("published", true)
        } else if (searchParams.status === "draft") {
          query = query.eq("published", false)
        }
      }

      if (searchParams.sort) {
        const [column, order] = searchParams.sort.split(".")
        query = query.order(column, { ascending: order === "asc" })
      } else {
        query = query.order("created_at", { ascending: false })
      }

      const { data, error } = await query

      if (error) throw error

      setPosts(data || [])
    } catch (err) {
      console.error("Error fetching blog posts:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()

    if (searchQuery) params.set("q", searchQuery)
    if (searchParams.category) params.set("category", searchParams.category)
    if (searchParams.status) params.set("status", searchParams.status)
    if (searchParams.sort) params.set("sort", searchParams.sort)

    router.push(`/admin/blog?${params.toString()}`)
  }

  if (loading) {
    return (
      <div className="container py-10 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Blog Posts</h1>
          <p className="text-muted-foreground">Manage your blog content</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchPosts} variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button asChild>
            <Link href="/admin/blog/new">
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
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
      ) : posts.length > 0 ? (
        <div className="bg-card rounded-lg border shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-3 px-4">Title</th>
                  <th className="text-left py-3 px-4">Category</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Created</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="font-medium">{post.title}</div>
                      <div className="text-sm text-muted-foreground">{post.slug}</div>
                    </td>
                    <td className="py-3 px-4">{post.categories?.name || "Uncategorized"}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          post.published
                            ? "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-500"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-500"
                        }`}
                      >
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="py-3 px-4">{new Date(post.created_at).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/blog/${post.slug}`}>View</Link>
                        </Button>
                        <Button asChild size="sm">
                          <Link href={`/admin/blog/${post.id}/edit`}>Edit</Link>
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
          <h3 className="text-lg font-medium mb-2">No blog posts found</h3>
          <p className="text-muted-foreground mb-4">Get started by creating your first blog post.</p>
          <Button asChild>
            <Link href="/admin/blog/new">
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
