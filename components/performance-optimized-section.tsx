"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"
import { usePerformance } from "@/contexts/performance-context"

interface PerformanceOptimizedSectionProps {
  children: React.ReactNode
  priority?: "high" | "medium" | "low"
  id?: string
  className?: string
  threshold?: number
  rootMargin?: string
}

export function PerformanceOptimizedSection({
  children,
  priority = "medium",
  id,
  className = "",
  threshold = 0.1,
  rootMargin = "200px 0px",
}: PerformanceOptimizedSectionProps) {
  const { performanceMode } = usePerformance()
  const [shouldRender, setShouldRender] = useState(false)
  const [ref, inView] = useInView({
    threshold,
    rootMargin,
    triggerOnce: true,
  })
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // High priority sections or high performance mode - render immediately
    if (priority === "high" || performanceMode === "high") {
      setShouldRender(true)
      return
    }

    // Medium priority sections render immediately in medium+ performance mode
    if (priority === "medium" && performanceMode !== "low") {
      setShouldRender(true)
      return
    }

    // Otherwise, render when in view
    if (inView) {
      setShouldRender(true)
    }
  }, [inView, performanceMode, priority])

  return (
    <section ref={ref} id={id} className={className}>
      <div ref={sectionRef}>
        {shouldRender ? (
          children
        ) : (
          <div className="min-h-[200px] flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </section>
  )
}
