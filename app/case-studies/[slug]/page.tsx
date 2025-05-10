import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getCaseStudyBySlug, getAllCaseStudies } from "@/lib/case-study-service"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export async function generateStaticParams() {
  const caseStudies = await getAllCaseStudies()
  return caseStudies.map((caseStudy) => ({
    slug: caseStudy.slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const caseStudy = await getCaseStudyBySlug(params.slug)

  if (!caseStudy) {
    return {
      title: "Case Study Not Found",
      description: "The requested case study could not be found.",
    }
  }

  return {
    title: `${caseStudy.title} | Case Studies`,
    description: caseStudy.summary,
  }
}

export default async function CaseStudyPage({ params }: { params: { slug: string } }) {
  const caseStudy = await getCaseStudyBySlug(params.slug)

  if (!caseStudy) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[#0a1218] text-white">
      <Header />

      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/case-studies"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Case Studies
            </Link>
          </div>

          <div className="relative aspect-video w-full max-h-[500px] overflow-hidden rounded-lg mb-8">
            <Image
              src={caseStudy.image_url || "/placeholder.svg?height=600&width=1200&query=case study visualization"}
              alt={caseStudy.title}
              fill
              className="object-cover"
            />
          </div>

          <h1 className="text-4xl font-bold mb-6">{caseStudy.title}</h1>

          <p className="text-xl text-muted-foreground mb-8">{caseStudy.summary}</p>

          {caseStudy.metrics && caseStudy.metrics.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {caseStudy.metrics.map((metric) => (
                <div key={metric.id} className="bg-card/30 backdrop-blur-sm rounded-lg p-4 text-center">
                  <p className={`text-3xl font-bold mb-1 text-${metric.color}`}>{metric.value}</p>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                </div>
              ))}
            </div>
          )}

          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-bold mt-8 mb-4">The Challenge</h2>
            <p>{caseStudy.challenge}</p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Approach</h2>
            <p>{caseStudy.approach}</p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Results</h2>
            <p>{caseStudy.results}</p>
          </div>

          {caseStudy.tags && caseStudy.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t border-border">
              <h3 className="text-sm font-medium mb-2">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {caseStudy.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center justify-center h-6 px-3 rounded-full bg-muted text-muted-foreground text-xs"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
