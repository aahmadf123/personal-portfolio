"use client"

import { useEffect, useState } from "react"
import { motion, useScroll, useSpring } from "framer-motion"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

export function ScrollAnimations() {
  const prefersReducedMotion = useReducedMotion()
  const [mounted, setMounted] = useState(false)

  // Only run animations after component is mounted on the client
  useEffect(() => {
    setMounted(true)
  }, [])

  // If user prefers reduced motion or component isn't mounted yet, don't render animations
  if (prefersReducedMotion || !mounted) {
    return null
  }

  return (
    <>
      <ScrollProgressIndicator />
      <ScrollToTopButton />
    </>
  )
}

function ScrollProgressIndicator() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary origin-left z-50"
      style={{ scaleX }}
    />
  )
}

function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false)
  const { scrollYProgress } = useScroll()

  useEffect(() => {
    // Safety check for browser environment
    if (typeof window === "undefined") return

    const unsubscribe = scrollYProgress.on("change", (latest) => {
      // Show button when scrolled down 20% of the page
      setIsVisible(latest > 0.2)
    })

    return () => unsubscribe()
  }, [scrollYProgress])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-primary/90 text-white shadow-lg hover:bg-primary transition-colors"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Scroll to top"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m18 15-6-6-6 6" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  )
}

// Import AnimatePresence for the ScrollToTopButton
import { AnimatePresence } from "framer-motion"
