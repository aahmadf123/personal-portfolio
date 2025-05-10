import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getPostsByCategory } from "@/lib/blog-service"
import { BlogPostList } from "@/components/blog-post-list"
import type { Metadata } from "next"

interface CategoryPageProps {
  params: {
    slug: string
  }
  searchParams: {
    page?: string
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await getPostsByCategory(params.slug)

  if (!category) {
    return {
      title: "Category Not Found",
      description: "The requested category could not be found.",
    }
  }

  return {
    title: `${category.name} | Blog Categories`,
    description: category.description || `Browse all articles in the ${category.name} category.`,
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const page = searchParams.page ? Number.parseInt(searchParams.page) : 1
  const limit = 9

  const { posts, total, category } = await getPostsByCategory(params.slug, page, limit)

  if (!category) {
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
            <div
              className={`mx-auto mb-4 inline-block rounded-full bg-gradient-to-r ${category.color} px-4 py-2 text-white`}
            >
              <h1 className="text-2xl font-bold">{category.name}</h1>
            </div>

            {category.description && <p className="mx-auto max-w-2xl text-lg text-gray-600">{category.description}</p>}
          </div>

          <BlogPostList
            initialPosts={posts}
            totalPosts={total}
            initialPage={page}
            postsPerPage={limit}
            apiPath={`/api/blog/category/${params.slug}`}
          />
        </div>
      </section>

      <Footer />
    </main>
  )
}
