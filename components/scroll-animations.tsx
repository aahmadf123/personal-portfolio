"use client"

import { useEffect, useState } from "react"
import { motion, useScroll, useSpring, useMotionValueEvent } from "framer-motion"
import { ArrowUp } from "lucide-react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

export function ScrollAnimations() {
  const [isVisible, setIsVisible] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  // Scroll progress indicator
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  // Back to top button visibility
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest !== undefined) {
      setIsVisible(latest > 0.1) // Show after scrolling 10% of the page
    }
  })

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Add smooth scrolling to all internal links
  useEffect(() => {
    if (prefersReducedMotion) return

    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest("a")

      if (!link) return

      const href = link.getAttribute("href")

      // Only handle internal anchor links
      if (!href || !href.startsWith("#")) return

      const targetId = href.substring(1)
      const targetElement = document.getElementById(targetId)

      if (!targetElement) return

      e.preventDefault()

      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })

      // Update URL without reload
      window.history.pushState(null, "", href)
    }

    document.addEventListener("click", handleLinkClick)

    return () => {
      document.removeEventListener("click", handleLinkClick)
    }
  }, [prefersReducedMotion])

  if (prefersReducedMotion) {
    return null
  }

  return (
    <>
      {/* Scroll progress indicator */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left" style={{ scaleX }} />

      {/* Back to top button */}
      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: isVisible ? 1 : 0,
          y: isVisible ? 0 : 20,
          pointerEvents: isVisible ? "auto" : "none",
        }}
        transition={{ duration: 0.3 }}
        aria-label="Back to top"
      >
        <ArrowUp className="h-5 w-5" />
      </motion.button>
    </>
  )
}
