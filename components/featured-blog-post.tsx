import Link from "next/link"
import Image from "next/image"
import { getFeaturedPosts } from "@/lib/blog-service"
import { formatDate } from "@/lib/utils"

export async function FeaturedBlogPost() {
  const featuredPosts = await getFeaturedPosts(1)
  const post = featuredPosts[0]

  if (!post) {
    return null
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Featured Article</h2>
      <div className="relative overflow-hidden rounded-lg border border-border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:border-primary/50">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative h-64 md:h-full w-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent z-10 md:hidden"></div>
            <Image
              src={post.image_url || "/placeholder.svg?height=600&width=800&query=featured tech blog"}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="relative p-6 md:p-8 flex flex-col justify-center">
            <div className="mb-4">
              {post.category && (
                <Link
                  href={`/blog/category/${post.category.slug}`}
                  className={`inline-flex items-center rounded-full bg-gradient-to-r ${post.category.color} px-2.5 py-0.5 text-xs font-medium text-primary-foreground hover:bg-primary/80 transition-colors`}
                >
                  {post.category.name}
                </Link>
              )}
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4 hover:text-primary transition-colors">
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h3>
            <p className="text-muted-foreground mb-6 line-clamp-3">{post.excerpt}</p>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {formatDate(post.created_at)} • {post.read_time || "5 min read"}
              </div>
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Read Article
                <span className="ml-1">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
