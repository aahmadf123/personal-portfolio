"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

interface WaveTransitionProps {
  variant?: "primary" | "secondary" | "tertiary" | "quaternary" | "accent"
  height?: number
}

export function WaveTransition({ variant = "tertiary", height = 80 }: WaveTransitionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  // Create transformed values
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3])
  const y1 = useTransform(scrollYProgress, [0, 0.5, 1], [0, -10, 0])
  const y2 = useTransform(scrollYProgress, [0, 0.5, 1], [0, 10, 0])
  const y3 = useTransform(scrollYProgress, [0, 0.5, 1], [0, -15, 0])

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

  const getColor = (opacity = 0.2) => {
    switch (variant) {
      case "primary":
        return `rgba(160, 120, 255, ${opacity})`
      case "secondary":
        return `rgba(255, 20, 147, ${opacity})`
      case "tertiary":
        return `rgba(0, 255, 255, ${opacity})`
      case "quaternary":
        return `rgba(0, 204, 102, ${opacity})`
      case "accent":
        return `rgba(255, 165, 0, ${opacity})`
      default:
        return `rgba(0, 255, 255, ${opacity})`
    }
  }

  return (
    <div ref={ref} className="relative w-full overflow-hidden" style={{ height: `${height}px` }}>
      <motion.div
        className="absolute inset-0"
        style={{
          opacity,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        <svg
          className="absolute bottom-0 w-full"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          style={{ height: `${height}px` }}
        >
          <motion.path
            d="M0,0 C300,60 600,0 900,50 L1200,80 L1200,120 L0,120 Z"
            style={{
              fill: getColor(0.3),
              y: y1,
            }}
          />
          <motion.path
            d="M0,0 C400,40 700,90 1200,20 L1200,120 L0,120 Z"
            style={{
              fill: getColor(0.2),
              y: y2,
            }}
          />
          <motion.path
            d="M0,40 C200,10 800,100 1200,30 L1200,120 L0,120 Z"
            style={{
              fill: getColor(0.1),
              y: y3,
            }}
          />
        </svg>
      </motion.div>
    </div>
  )
}
