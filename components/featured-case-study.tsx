"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function FeaturedCaseStudy() {
  const [caseStudy, setCaseStudy] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchFeaturedCaseStudy() {
      try {
        const response = await fetch("/api/case-studies/featured")

        if (!response.ok) {
          throw new Error("Failed to fetch featured case study")
        }

        const data = await response.json()
        setCaseStudy(data.caseStudy || null)
      } catch (err) {
        console.error("Error fetching featured case study:", err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeaturedCaseStudy()
  }, [])

  if (isLoading) {
    return <CaseStudySkeleton />
  }

  if (error || !caseStudy) {
    return null // Don't show anything if there's an error or no case study
  }

  return (
    <Card className="overflow-hidden border-border bg-card/50 backdrop-blur-sm">
      <CardContent className="p-0">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative h-64 md:h-auto">
            <Image
              src={caseStudy.image_url || "/placeholder.svg?height=600&width=800&query=case study visualization"}
              alt={caseStudy.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary mb-4">
                Featured Case Study
              </div>
              <h3 className="text-2xl font-bold mb-2">{caseStudy.title}</h3>
              <p className="text-muted-foreground mb-6">{caseStudy.summary}</p>
            </div>
            <Button asChild>
              <Link href={`/case-studies/${caseStudy.slug}`}>
                Read Case Study
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CaseStudySkeleton() {
  return (
    <Card className="overflow-hidden border-border bg-card/50 backdrop-blur-sm">
      <CardContent className="p-0">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative h-64 md:h-auto bg-muted"></div>
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="w-32 h-6 bg-muted rounded-full mb-4"></div>
              <div className="w-3/4 h-8 bg-muted rounded mb-2"></div>
              <div className="w-full h-4 bg-muted rounded mb-2"></div>
              <div className="w-full h-4 bg-muted rounded mb-2"></div>
              <div className="w-2/3 h-4 bg-muted rounded mb-6"></div>
            </div>
            <div className="w-40 h-10 bg-muted rounded"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
