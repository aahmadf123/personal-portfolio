"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Logo } from "@/components/logo"
import { LogoShowcase } from "@/components/logo-showcase"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Breadcrumb, type BreadcrumbItem } from "@/components/breadcrumb"
import { useState, useEffect } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function ExtraPage() {
  const [concepts, setConcepts] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("quantum")
  const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbItem[]>([
    { label: "Extra", href: "/extra" },
    { label: "Quantum Concepts" },
  ])

  // Detect small screens
  const isSmallScreen = useMediaQuery("(max-width: 480px)")

  useEffect(() => {
    // Fetch quantum concepts
    const fetchConcepts = async () => {
      try {
        const response = await fetch("/api/quantum-concepts")
        if (response.ok) {
          const data = await response.json()
          setConcepts(data)
        }
      } catch (error) {
        console.error("Error fetching quantum concepts:", error)
        setConcepts([])
      }
    }

    fetchConcepts()
  }, [])

  // Update breadcrumb when tab changes
  useEffect(() => {
    const tabLabel = activeTab === "quantum" ? "Quantum Concepts" : "Logo Design"
    setBreadcrumbItems([{ label: "Extra", href: "/extra" }, { label: tabLabel }])
  }, [activeTab])

  return (
    <main className="min-h-screen bg-[#0a1218] text-white">
      <Header />

      <section className="py-12 md:py-16 lg:py-24">
        <div className="container px-3 sm:px-4 md:px-6">
          <Breadcrumb items={breadcrumbItems} className="mb-4 md:mb-6" maxItems={isSmallScreen ? 2 : 3} />

          <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8">Extra Content</h1>

          <Tabs defaultValue="quantum" className="w-full" onValueChange={(value) => setActiveTab(value)}>
            <TabsList className="grid w-full grid-cols-2 mb-6 sm:mb-8">
              <TabsTrigger value="quantum">Quantum Concepts</TabsTrigger>
              <TabsTrigger value="logo">Logo Design</TabsTrigger>
            </TabsList>

            <TabsContent value="quantum" className="mt-0">
              <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Quantum Computing Concepts</h2>
                <p className="text-muted-foreground max-w-3xl mb-8 sm:mb-12">
                  Explore fundamental concepts in quantum computing explained in an accessible way. These educational
                  resources aim to demystify quantum mechanics and its applications in computing.
                </p>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {concepts.map((concept) => (
                    <ConceptCard key={concept.id} concept={concept} />
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="logo" className="mt-0">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4">Logo Design</h2>
                <p className="text-muted-foreground max-w-3xl mx-auto mb-12">
                  Exploring visual identities that represent the intersection of AI/ML, Aerospace Engineering, and
                  Quantum Computing
                </p>

                <div className="flex justify-center mb-16">
                  <div className="p-8 rounded-full bg-black inline-block">
                    <Logo size={200} variant="default" animated={true} />
                  </div>
                </div>

                <div className="max-w-3xl mx-auto">
                  <h3 className="text-2xl font-bold mb-4">Design Concept</h3>
                  <p className="text-muted-foreground mb-6">
                    This logo represents the convergence of three cutting-edge fields: Artificial Intelligence,
                    Aerospace Engineering, and Quantum Computing. The design incorporates:
                  </p>

                  <ul className="text-left space-y-4 mb-8">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>
                        <strong className="text-primary">Neural Network Nodes:</strong> The interconnected nodes
                        represent AI and machine learning, showing how data flows through neural pathways.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-secondary mr-2">•</span>
                      <span>
                        <strong className="text-secondary">Orbital Paths:</strong> The elliptical orbits symbolize
                        aerospace engineering, flight paths, and space exploration.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent mr-2">•</span>
                      <span>
                        <strong className="text-accent">Quantum Elements:</strong> The pulsing particles and
                        superposition states represent quantum computing's fundamental principles.
                      </span>
                    </li>
                  </ul>

                  <p className="text-muted-foreground">
                    The animated elements bring the logo to life, showing the dynamic nature of these technologies and
                    how they interact with each other to create innovative solutions.
                  </p>
                </div>
              </div>

              <LogoShowcase />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </main>
  )
}

function ConceptCard({ concept }: { concept: any }) {
  return (
    <Link
      href={`/quantum-concepts/${concept.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:border-primary/50"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-20"></div>
        <Image
          src={concept.image_url || "/placeholder.svg?height=400&width=600&query=quantum computing visualization"}
          alt={concept.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-col justify-between p-6 flex-1">
        <div>
          <h3 className="text-xl font-bold group-hover:text-primary transition-colors mb-2">{concept.title}</h3>
          <p className="text-sm text-muted-foreground">{concept.short_description}</p>
        </div>

        <div className="inline-flex items-center text-sm font-medium text-primary group-hover:text-primary/80 transition-colors mt-4">
          Learn More
          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  )
}
