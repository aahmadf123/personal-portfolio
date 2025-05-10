"use client"

import { useState, useEffect } from "react"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Skills } from "@/components/skills"
import { Projects } from "@/components/projects"
import { Contact } from "@/components/contact"
import { Organizations } from "@/components/organizations"
import { TimelineSection } from "@/components/timeline-section"
import { Blog } from "@/components/blog"
import { BackToTop } from "@/components/back-to-top"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { FadeSection } from "@/components/fade-section"
import { PerformanceOptimizedSection } from "@/components/performance-optimized-section"
import { useMediaQuery } from "@/hooks/use-media-query"
import { FallbackBackground } from "@/components/fallback-background"
import { SimpleNeuralBackground } from "@/components/simple-neural-background"
import { HeroParticles } from "@/components/hero-particles"
import { FloatingParticles } from "@/components/floating-particles"
import { NeuralNetworkAnimation } from "@/components/neural-network-animation"
import { SimpleChatButton } from "@/components/simple-chat-button"
import { FeaturedBlogPosts } from "@/components/featured-blog-posts"
import { FeaturedResearchProjects } from "@/components/featured-research-projects"

export function HomeClient({ featuredProjects = [], featuredCaseStudies = [], featuredPosts = [] }) {
  const prefersReducedMotion = useReducedMotion()
  const isDesktop = useMediaQuery("(min-width: 1024px)")
  const [showHeavyAnimations, setShowHeavyAnimations] = useState(false)
  const [backgroundType, setBackgroundType] = useState("simple")

  useEffect(() => {
    // Only enable heavy animations if user doesn't prefer reduced motion and is on desktop
    if (!prefersReducedMotion && isDesktop) {
      // Delay loading heavy animations for better initial load performance
      const timer = setTimeout(() => {
        setShowHeavyAnimations(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [prefersReducedMotion, isDesktop])

  // Determine which background to show
  const renderBackground = () => {
    if (prefersReducedMotion) return <FallbackBackground />

    switch (backgroundType) {
      case "neural":
        return showHeavyAnimations ? <NeuralNetworkAnimation /> : <SimpleNeuralBackground />
      case "particles":
        return showHeavyAnimations ? <FloatingParticles /> : <SimpleNeuralBackground />
      case "simple":
      default:
        return <SimpleNeuralBackground />
    }
  }

  return (
    <>
      {renderBackground()}

      <div className="relative z-10">
        <section id="hero" className="relative">
          {!prefersReducedMotion && <HeroParticles />}
          <Hero />
        </section>

        <FadeSection>
          <About />
        </FadeSection>

        <PerformanceOptimizedSection>
          <Skills />
        </PerformanceOptimizedSection>

        <FadeSection>
          <Projects featuredProjects={featuredProjects} />
        </FadeSection>

        <FadeSection>
          <FeaturedResearchProjects />
        </FadeSection>

        <FadeSection>
          <TimelineSection />
        </FadeSection>

        <FadeSection>
          <Organizations />
        </FadeSection>

        <FadeSection>
          <FeaturedBlogPosts />
        </FadeSection>

        <FadeSection>
          <Blog featuredPosts={featuredPosts} />
        </FadeSection>

        <FadeSection>
          <Contact />
        </FadeSection>
      </div>

      <BackToTop />
      <SimpleChatButton />
    </>
  )
}
