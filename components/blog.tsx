"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import styles from "./blog.module.css"
import { RefreshButton } from "@/components/ui/refresh-button"

interface Category {
  id: number
  name: string
  slug: string
}

interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  image_url?: string
  published: boolean
  featured: boolean
  category_id?: number
  categories?: Category
}

export function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/blog/featured?limit=3")

      if (!response.ok) {
        throw new Error(`Failed to fetch blog posts: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setPosts(Array.isArray(data) ? data : [])
      setLastUpdated(new Date())
    } catch (error) {
      console.error("Error fetching blog posts:", error)
      setError(error instanceof Error ? error.message : "Unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  return (
    <section id="blog" className={styles.blogSection}>
      <div className="container px-4 md:px-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className={styles.sectionTitle}>Latest Articles</h2>
          <div className="flex items-center gap-2">
            <RefreshButton contentType="blog" onSuccess={fetchPosts} label="Refresh Articles" />
            {lastUpdated && (
              <span className="text-xs text-gray-500">Last updated: {lastUpdated.toLocaleTimeString()}</span>
            )}
          </div>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className={styles.blogGrid}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.blogSkeleton}></div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className={styles.blogGrid}>
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className={styles.emptyMessage}>No articles available at the moment.</p>
        )}

        <div className={styles.viewAllContainer}>
          <Link href="/blog" className={styles.viewAllLink}>
            View All Articles
            <ArrowRight className={styles.blogLinkIcon} />
          </Link>
        </div>
      </div>
    </section>
  )
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className={styles.blogCard}>
      <div className={styles.blogImageContainer}>
        <Image
          src={post.image_url || "/placeholder.svg?height=400&width=600&query=blog post"}
          alt={post.title}
          fill
          className="object-cover"
        />
      </div>
      <div className={styles.blogContent}>
        <h3 className={styles.blogTitle}>{post.title}</h3>
        {post.categories && (
          <div>
            <span className={styles.categoryBadge}>{post.categories.name}</span>
          </div>
        )}
        <p className={styles.blogExcerpt}>{post.excerpt}</p>
        <div className={styles.blogLink}>
          Read Article
          <ArrowRight className={styles.blogLinkIcon} />
        </div>
      </div>
    </Link>
  )
}
