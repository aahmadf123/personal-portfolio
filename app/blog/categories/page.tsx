import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getBlogCategories, getBlogPosts } from "@/lib/notion-blog"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowRight } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog Categories | Ahmad's Portfolio",
  description: "Browse all blog categories and discover content that interests you.",
}

export const revalidate = 3600 // Revalidate every hour

export default async function CategoriesPage() {
  const [categories, postsData] = await Promise.all([getBlogCategories(), getBlogPosts({ limit: 100 })])

  return (
    <main className="min-h-screen bg-[#0a1218] text-white">
      <Header />

      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <Link href="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to blog
          </Link>

          <h1 className="text-4xl font-bold mb-4">Blog Categories</h1>
          <p className="text-muted-foreground max-w-3xl mb-12">
            Browse all categories and discover content that interests you.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const postCount = postsData.posts.filter((post) => post.category_id === category.id).length

              return (
                <Link
                  key={category.id}
                  href={`/blog/category/${category.slug}`}
                  className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:border-primary/50"
                >
                  <div className="relative h-40 w-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-background/20 z-10"></div>
                    <Image
                      src={
                        category.image_url || `/placeholder.svg?height=400&width=600&query=${category.name} category`
                      }
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute bottom-4 left-4 right-4 z-20">
                      <div className={`h-1.5 w-12 rounded-full bg-gradient-to-r ${category.color} mb-3`}></div>
                      <h2 className="text-xl font-bold group-hover:text-primary transition-colors">{category.name}</h2>
                      <p className="text-sm text-muted-foreground mt-1">{postCount} articles</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {category.description || `Explore articles about ${category.name}`}
                    </p>
                    <div className="inline-flex items-center text-sm font-medium text-primary group-hover:text-primary/80 transition-colors">
                      Browse Category
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
