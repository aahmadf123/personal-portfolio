"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

interface FloatingParticlesProps {
  count?: number
  colors?: string[]
  minSize?: number
  maxSize?: number
  minSpeed?: number
  maxSpeed?: number
  depth?: number
  className?: string
  interactive?: boolean
}

export function FloatingParticles({
  count = 20,
  colors = ["primary", "secondary", "tertiary", "quaternary"],
  minSize = 2,
  maxSize = 8,
  minSpeed = 0.2,
  maxSpeed = 0.8,
  depth = 200,
  className = "",
  interactive = true,
}: FloatingParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const [error, setError] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  // Performance detection
  const [isLowPerformance, setIsLowPerformance] = useState(false)

  useEffect(() => {
    // Detect low performance devices
    const checkPerformance = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      const isLowEndDevice = navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 4
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

      setIsLowPerformance(isMobile || isLowEndDevice || prefersReducedMotion)
    }

    checkPerformance()
  }, [])

  // Adjust particle count based on performance
  const adjustedCount = isLowPerformance ? Math.floor(count * 0.3) : count

  // Generate particles
  const particles = Array.from({ length: adjustedCount }).map((_, i) => {
    const colorIndex = Math.floor(Math.random() * colors.length)
    const size = minSize + Math.random() * (maxSize - minSize)
    const speed = minSpeed + Math.random() * (maxSpeed - minSpeed)
    const delay = Math.random() * 2

    return {
      id: i,
      colorName: colors[colorIndex],
      size,
      speed,
      delay,
      opacity: 0.1 + Math.random() * 0.6,
    }
  })

  // Get color based on theme
  const getParticleColor = (colorName: string, opacity: number) => {
    switch (colorName) {
      case "primary":
        return `rgba(0, 229, 255, ${opacity})`
      case "secondary":
        return `rgba(176, 38, 255, ${opacity})`
      case "tertiary":
        return `rgba(255, 0, 128, ${opacity})`
      case "quaternary":
        return `rgba(0, 204, 102, ${opacity})`
      default:
        return `rgba(255, 255, 255, ${opacity})`
    }
  }

  // Fallback for errors or reduced motion
  if (error || prefersReducedMotion) {
    return (
      <div
        className={`absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent ${className}`}
        aria-label="Particle background (static)"
      />
    )
  }

  return (
    <div ref={ref} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {inView &&
        particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              backgroundColor: getParticleColor(particle.colorName, particle.opacity),
              boxShadow: isLowPerformance
                ? "none"
                : `0 0 ${particle.size * 2}px ${getParticleColor(particle.colorName, particle.opacity * 0.5)}`,
            }}
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
              opacity: 0,
            }}
            animate={{
              opacity: particle.opacity,
              y: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
              x: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
            }}
            transition={{
              opacity: { duration: 1, delay: particle.delay },
              y: {
                duration: 10 + Math.random() * 20,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: particle.delay,
              },
              x: {
                duration: 15 + Math.random() * 20,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: particle.delay,
              },
            }}
          />
        ))}
    </div>
  )
}
