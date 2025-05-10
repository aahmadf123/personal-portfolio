import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Search, Filter, ArrowRight } from "lucide-react"
import { getAllCategories, getPublishedPosts } from "@/lib/blog-service"
import { FeaturedBlogPost } from "@/components/featured-blog-post"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog | Ahmad's Portfolio",
  description:
    "Explore my thoughts, tutorials, and insights on artificial intelligence, aerospace engineering, quantum computing, and more.",
}

export const revalidate = 3600 // Revalidate every hour

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const page = searchParams.page ? Number.parseInt(searchParams.page) : 1
  const limit = 9

  const [categories, { posts, total }] = await Promise.all([getAllCategories(), getPublishedPosts(page, limit)])

  return (
    <main className="min-h-screen bg-[#0a1218] text-white">
      <Header />

      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-muted-foreground max-w-3xl mb-12">
            Explore my thoughts, tutorials, and insights on artificial intelligence, aerospace engineering, quantum
            computing, and more.
          </p>

          <div className="flex flex-col md:flex-row gap-4 mb-12">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search articles..." className="pl-10" />
            </div>
            <Button asChild variant="outline" className="flex items-center gap-2">
              <Link href="/blog/categories">
                <Filter className="h-4 w-4 mr-2" />
                Browse Categories
              </Link>
            </Button>
            <div className="hidden md:flex gap-2">
              <Button variant="ghost" size="sm">
                All
              </Button>
              {categories.slice(0, 3).map((category) => (
                <Button key={category.id} variant="ghost" size="sm" asChild>
                  <Link href={`/blog/category/${category.slug}`}>{category.name.split(" ")[0]}</Link>
                </Button>
              ))}
            </div>
          </div>

          <FeaturedBlogPost />

          {categories.length > 0 && (
            <div className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Popular Categories</h2>
                <Link href="/blog/categories" className="text-sm text-primary hover:text-primary/80 flex items-center">
                  View All Categories
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.slice(0, 4).map((category) => (
                  <Link
                    key={category.id}
                    href={`/blog/category/${category.slug}`}
                    className="group flex flex-col p-4 rounded-lg border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,229,255,0.2)]"
                  >
                    <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${category.color} mb-3`}></div>
                    <h3 className="font-medium group-hover:text-primary transition-colors">{category.name}</h3>
                    <span className="text-xs text-muted-foreground">
                      {posts.filter((post) => post.category_id === category.id).length} articles
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <h2 className="text-2xl font-bold mb-6">All Articles</h2>

          {posts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-blue-500/10 rounded-lg border border-blue-500/20 mb-12">
              <h3 className="text-xl mb-4">No Blog Posts Found</h3>
              <p>No blog posts were found. You can add posts through the admin interface.</p>
            </div>
          )}

          {total > limit && (
            <div className="flex justify-center">
              <Button variant="outline" className="mr-2" disabled={page <= 1} asChild>
                <Link href={`/blog?page=${page - 1}`}>Previous</Link>
              </Button>
              <Button variant="outline" disabled={page * limit >= total} asChild>
                <Link href={`/blog?page=${page + 1}`}>Next</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

function BlogCard({ post }: { post: any }) {
  const formattedDate = new Date(post.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:border-primary/50">
      <div className="relative h-48 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10"></div>
        <img
          src={post.image_url || "/placeholder.svg?height=400&width=600&query=tech blog"}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 z-20">
          <span className="inline-flex items-center rounded-full bg-primary/90 px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
            {post.category?.name || "Uncategorized"}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-6">
        <div className="flex-1">
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
            <div className="flex items-center">
              <span className="mr-1">📅</span>
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center">
              <span className="mr-1">⏱️</span>
              <span>{post.read_time || "5 min read"}</span>
            </div>
          </div>

          <h3 className="text-lg font-bold leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>

          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{post.excerpt}</p>
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
  )
}
