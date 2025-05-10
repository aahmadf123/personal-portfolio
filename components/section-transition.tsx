"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

interface SectionTransitionProps {
  variant?: "primary-to-secondary" | "secondary-to-tertiary" | "tertiary-to-quaternary" | "quaternary-to-primary"
  height?: number
}

export function SectionTransition({ variant = "primary-to-secondary", height = 120 }: SectionTransitionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  const getGradient = () => {
    switch (variant) {
      case "primary-to-secondary":
        return "from-neutral/15 via-primary/5 to-secondary/15"
      case "secondary-to-tertiary":
        return "from-secondary/15 via-neutral/5 to-tertiary/15"
      case "tertiary-to-quaternary":
        return "from-tertiary/15 via-neutral/5 to-quaternary/15"
      case "quaternary-to-primary":
        return "from-quaternary/15 via-neutral/5 to-primary/15"
      default:
        return "from-neutral/15 via-primary/5 to-secondary/15"
    }
  }

  return (
    <div ref={ref} className="relative w-full overflow-hidden" style={{ height: `${height}px` }}>
      <motion.div
        className={`absolute inset-0 bg-gradient-to-b ${getGradient()}`}
        style={{ opacity, scale }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 backdrop-blur-[2px]"></div>

        {/* Decorative elements */}
        <div className="absolute w-full h-full overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-16 h-16 rounded-full bg-primary/10 blur-xl"></div>
          <div className="absolute top-1/3 right-1/3 w-24 h-24 rounded-full bg-secondary/10 blur-xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-20 h-20 rounded-full bg-tertiary/10 blur-xl"></div>
          <div className="absolute bottom-1/3 left-1/3 w-12 h-12 rounded-full bg-quaternary/10 blur-xl"></div>
        </div>
      </motion.div>
    </div>
  )
}
