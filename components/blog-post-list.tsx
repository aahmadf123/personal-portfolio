"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { BlogPost } from "@/lib/notion-blog"
import { formatDate } from "@/lib/utils"
import { BlogPostGridSkeleton } from "./skeleton/blog-post-skeleton"
import type { BlogPost as BlogPostType } from "@/types/blog"

interface BlogPostListProps {
  posts?: BlogPost[]
  loading?: boolean
  showFeatured?: boolean
  limit?: number
  showCategory?: boolean
  showTags?: boolean
  className?: string
}

export function BlogPostList({
  posts: initialPosts = [],
  loading: initialLoading = false,
  showFeatured = true,
  limit,
  showCategory = true,
  showTags = true,
  className = "",
}: BlogPostListProps) {
  const [posts, setPosts] = useState<BlogPostType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [displayPosts, setDisplayPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch("/api/blog")

        if (!response.ok) {
          throw new Error(`Failed to fetch blog posts: ${response.status}`)
        }

        const data = await response.json()
        setPosts(data)
      } catch (err) {
        console.error("Error fetching blog posts:", err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlogPosts()
  }, [])

  useEffect(() => {
    let filteredPosts = [...posts]

    // Apply limit if specified
    if (limit && limit > 0) {
      filteredPosts = filteredPosts.slice(0, limit)
    }

    setDisplayPosts(filteredPosts)
  }, [posts, limit])

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Blog</h2>
        <BlogPostGridSkeleton />
      </section>
    )
  }

  if (error) {
    return (
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Blog</h2>
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md text-red-800 dark:text-red-200 text-center">
          <p>Failed to load blog posts: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-800 rounded-md hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </section>
    )
  }

  if (displayPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">No blog posts found</h3>
        <p className="text-gray-500">Check back later for new content!</p>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {displayPosts.map((post) => (
        <Card
          key={post.id}
          className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow duration-300"
        >
          <div className="relative w-full h-48 overflow-hidden">
            {post.coverImage ? (
              <Image
                src={post.coverImage || "/placeholder.svg"}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 hover:scale-105"
                priority={showFeatured && post.featured}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                <span className="text-white text-lg font-medium">{post.title.charAt(0)}</span>
              </div>
            )}
            {showFeatured && post.featured && (
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="bg-amber-500 text-white hover:bg-amber-600">
                  Featured
                </Badge>
              </div>
            )}
          </div>

          <CardHeader>
            {showCategory && post.categoryName && (
              <div className="mb-2">
                <Badge variant="outline" className="text-xs">
                  {post.categoryName}
                </Badge>
              </div>
            )}
            <CardTitle className="line-clamp-2">{post.title}</CardTitle>
            <CardDescription>{formatDate(post.date)}</CardDescription>
          </CardHeader>

          <CardContent className="flex-grow">
            <p className="text-gray-600 line-clamp-3">{post.description}</p>

            {showTags && post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {post.tags.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="secondary"
                    className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    {tag.name}
                  </Badge>
                ))}
                {post.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                    +{post.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </CardContent>

          <CardFooter>
            <Link href={`/blog/${post.slug}`} className="w-full">
              <Button variant="outline" className="w-full">
                Read More
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
