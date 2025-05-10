"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Calendar, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { FallbackImage } from "./fallback-image"

interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  image_url?: string
  created_at: string
  updated_at: string
  read_time?: string
  category?: {
    id: number
    name: string
    slug: string
    color?: string
  }
  tags?: {
    id: number
    name: string
    slug: string
  }[]
}

export function FeaturedBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/blog/featured?limit=3")

        if (!response.ok) {
          throw new Error(`Failed to fetch featured posts: ${response.status}`)
        }

        const data = await response.json()
        setPosts(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Error fetching featured posts:", error)
        setError(error instanceof Error ? error.message : "Unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedPosts()
  }, [])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  if (loading) {
    return (
      <div className="py-16">
        <div className="container px-4 mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Articles</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl bg-gray-800/50 animate-pulse h-[400px]"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-16">
        <div className="container px-4 mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Articles</h2>
          </div>
          <div className="p-4 bg-red-900/30 border border-red-800 rounded-lg text-red-400">
            <p>{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (posts.length === 0) {
    return null // Don't show the section if there are no featured posts
  }

  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
      <div className="container px-4 mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
            Featured Articles
          </h2>
          <Link href="/blog" className="text-blue-400 hover:text-blue-300 flex items-center text-sm font-medium">
            View All Articles
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <motion.div
          className="grid md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} variants={itemVariants} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function BlogCard({ post, variants }: { post: BlogPost; variants: any }) {
  const formattedDate = new Date(post.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <motion.div
      className="group flex flex-col h-full overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-500/50"
      variants={variants}
    >
      <div className="relative h-48 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent opacity-60 z-10"></div>
        {post.image_url ? (
          <FallbackImage
            src={post.image_url}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            fallbackSrc="/broken-image-icon.png"
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <span className="text-gray-500">No image</span>
          </div>
        )}
        {post.category && (
          <div className="absolute top-4 left-4 z-20">
            <Link href={`/blog/category/${post.category.slug}`}>
              <span
                className={`inline-flex items-center rounded-full bg-blue-500/20 px-2.5 py-0.5 text-xs font-medium text-blue-400 border border-blue-500/30`}
              >
                {post.category.name}
              </span>
            </Link>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            <span>{post.read_time || "5 min read"}</span>
          </div>
        </div>

        <h3 className="text-xl font-bold mb-2 text-white group-hover:text-blue-400 transition-colors line-clamp-2">
          {post.title}
        </h3>

        <p className="text-gray-400 mb-4 line-clamp-3">{post.excerpt}</p>

        <div className="mt-auto">
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            Read Article
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
