import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getAllCaseStudies } from "@/lib/case-study-service"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

export const metadata = {
  title: "Case Studies | Personal Portfolio",
  description: "Explore detailed case studies of my most significant projects and their impact.",
}

export default async function CaseStudiesPage() {
  const caseStudies = await getAllCaseStudies()

  return (
    <main className="min-h-screen">
      <Header />

      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <h1 className="text-4xl font-bold mb-4">Case Studies</h1>
          <p className="text-muted-foreground max-w-3xl mb-12">
            Explore detailed case studies of my most significant projects. Each case study provides an in-depth look at
            the challenges, solutions, and impact of the work.
          </p>

          {caseStudies.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {caseStudies.map((caseStudy) => (
                <CaseStudyCard key={caseStudy.id} caseStudy={caseStudy} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-border rounded-lg bg-card/30">
              <h3 className="text-xl font-medium mb-2">No Case Studies Available</h3>
              <p className="text-muted-foreground">Case studies will be added soon. Please check back later.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}

function CaseStudyCard({ caseStudy }: { caseStudy: any }) {
  return (
    <Link
      href={`/case-studies/${caseStudy.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:border-primary/50"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-20"></div>
        <Image
          src={caseStudy.image_url || "/placeholder.svg?height=400&width=600&query=project case study"}
          alt={caseStudy.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-col justify-between p-6 flex-1">
        <div>
          <h3 className="text-xl font-bold group-hover:text-primary transition-colors mb-2">{caseStudy.title}</h3>
          <p className="text-sm text-muted-foreground">{caseStudy.summary}</p>
        </div>

        <div className="inline-flex items-center text-sm font-medium text-primary group-hover:text-primary/80 transition-colors mt-4">
          Read Case Study
          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  )
}
