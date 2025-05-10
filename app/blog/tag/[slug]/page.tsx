import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getPostsByTag } from "@/lib/blog-service"
import { BlogPostList } from "@/components/blog-post-list"
import type { Metadata } from "next"

interface TagPageProps {
  params: {
    slug: string
  }
  searchParams: {
    page?: string
  }
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await getPostsByTag(params.slug)

  if (!tag) {
    return {
      title: "Tag Not Found",
      description: "The requested tag could not be found.",
    }
  }

  return {
    title: `${tag.name} | Blog Tags`,
    description: `Browse all articles tagged with ${tag.name}.`,
  }
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const page = searchParams.page ? Number.parseInt(searchParams.page) : 1
  const limit = 9

  const { posts, total, tag } = await getPostsByTag(params.slug, page, limit)

  if (!tag) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[#0a1218] text-white">
      <Header />

      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <Link href="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8">
            <span className="mr-2">←</span>
            Back to Blog
          </Link>

          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold">
              Posts tagged with <span className="text-blue-600">#{tag.name}</span>
            </h1>
          </div>

          <BlogPostList
            initialPosts={posts}
            totalPosts={total}
            initialPage={page}
            postsPerPage={limit}
            apiPath={`/api/blog/tag/${params.slug}`}
          />
        </div>
      </section>

      <Footer />
    </main>
  )
}
