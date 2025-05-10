"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Particles3D } from "./particles-3d"

interface ParticleTransitionProps {
  from?: "primary" | "secondary" | "tertiary" | "quaternary"
  to?: "primary" | "secondary" | "tertiary" | "quaternary"
  height?: number
  particleCount?: number
  particleColors?: string[]
}

export function ParticleTransition({
  from = "primary",
  to = "secondary",
  height = 250,
  particleCount = 40,
  particleColors = ["primary", "secondary"],
}: ParticleTransitionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  // Create transformed values at the top level
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9])
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [-5, 0, 5])

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

  const getColor = (color: string, opacity = 0.2) => {
    switch (color) {
      case "primary":
        return `rgba(160, 120, 255, ${opacity})`
      case "secondary":
        return `rgba(176, 38, 255, ${opacity})`
      case "tertiary":
        return `rgba(255, 0, 128, ${opacity})`
      case "quaternary":
        return `rgba(0, 204, 102, ${opacity})`
      default:
        return `rgba(0, 229, 255, ${opacity})`
    }
  }

  return (
    <div ref={ref} className="relative w-full overflow-hidden" style={{ height: `${height}px` }}>
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          opacity,
          scale,
          rotateX,
          perspective: "1200px",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, ${getColor(from, 0.2)}, ${getColor(to, 0.2)})`,
            filter: "blur(20px)",
          }}
        />

        {/* 3D Particles */}
        <Particles3D
          count={particleCount}
          colors={particleColors}
          minSize={3}
          maxSize={12}
          minSpeed={5}
          maxSpeed={20}
          depth={300}
          interactive={true}
        />
      </motion.div>
    </div>
  )
}
