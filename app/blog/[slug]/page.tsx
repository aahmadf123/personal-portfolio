import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getPostBySlug } from "@/lib/blog-service"
import { formatDate } from "@/lib/utils"
import Markdown from "react-markdown"
import { ViewTracker } from "@/components/analytics/view-tracker"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    }
  }

  return {
    title: `${post.title} | Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
      images: [
        {
          url: post.image_url,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[#0a1218] text-white">
      <Header />

      {/* Track the view */}
      <ViewTracker type="blog" id={post.id} slug={post.slug} />

      <article className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8"
            >
              <span className="mr-2">←</span>
              Back to all articles
            </Link>

            <div className="mb-6">
              {post.category && (
                <Link
                  href={`/blog/category/${post.category.slug}`}
                  className={`inline-flex items-center rounded-full bg-gradient-to-r ${post.category.color} px-2.5 py-0.5 text-xs font-medium text-primary-foreground hover:bg-primary/80 transition-colors`}
                >
                  {post.category.name}
                </Link>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">{post.title}</h1>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
              <div className="flex items-center">
                <span className="mr-1">📅</span>
                <span>{formatDate(post.created_at)}</span>
              </div>
              <div className="flex items-center">
                <span className="mr-1">⏱️</span>
                <span>{post.read_time || "5 min read"}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 rounded-full overflow-hidden">
                  <Image src="/professional-headshot.png" alt="Author" fill className="object-cover" />
                </div>
                <div>
                  <div className="font-medium">Ahmad</div>
                  <div className="text-xs text-muted-foreground">AI & Aerospace Engineer</div>
                </div>
              </div>
            </div>

            <div className="relative h-[300px] md:h-[400px] lg:h-[500px] w-full rounded-lg overflow-hidden mb-8">
              <Image
                src={post.image_url || "/placeholder.svg?height=800&width=1200&query=tech blog"}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="prose prose-invert max-w-none mb-12">
              <Markdown>{post.content}</Markdown>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag) => (
                  <Link href={`/blog/tag/${tag.slug}`} key={tag.id}>
                    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs hover:bg-muted/80 transition-colors">
                      <span className="mr-1">🏷️</span>
                      {tag.name}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </article>

      <Footer />
    </main>
  )
}
