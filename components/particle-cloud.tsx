"use client"

import { useRef, useEffect, useState, useMemo } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

interface Particle {
  id: number
  x: number
  y: number
  z: number
  size: number
  color: string
  opacity: number
  speed: number
  delay: number
}

interface ParticleCloudProps {
  count?: number
  colors?: string[]
  minSize?: number
  maxSize?: number
  depth?: number
  className?: string
  scrollFactor?: number
}

export function ParticleCloud({
  count = 50,
  colors = ["primary", "secondary", "tertiary", "quaternary"],
  minSize = 2,
  maxSize = 10,
  depth = 300,
  className = "",
  scrollFactor = 1,
}: ParticleCloudProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const [particles, setParticles] = useState<Particle[]>([])
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  const { scrollYProgress } = useScroll()
  const scrollY = useTransform(scrollYProgress, [0, 1], [0, 200 * scrollFactor])

  // Generate particles on mount and when dimensions change
  useEffect(() => {
    if (!containerRef.current) return

    const { width, height } = containerRef.current.getBoundingClientRect()
    setDimensions({ width, height })

    const newParticles: Particle[] = Array.from({ length: count }).map((_, i) => {
      const colorIndex = Math.floor(Math.random() * colors.length)
      const size = minSize + Math.random() * (maxSize - minSize)
      const speed = Math.random() * 2 + 0.5

      return {
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * depth - depth / 2,
        size,
        color: colors[colorIndex],
        opacity: 0.1 + Math.random() * 0.4,
        speed,
        delay: Math.random() * 2,
      }
    })

    setParticles(newParticles)
  }, [count, colors, minSize, maxSize, depth])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return
      const { width, height } = containerRef.current.getBoundingClientRect()
      setDimensions({ width, height })
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Get color based on theme
  const getParticleColor = (color: string, opacity: number) => {
    switch (color) {
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

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ perspective: "1000px" }}
    >
      {particles.map((particle) => {
        // Calculate 3D position
        const zFactor = (depth / 2 + particle.z) / depth // 0 to 1, where 1 is closest
        const scale = 0.5 + zFactor * 0.5 // Scale based on z-position

        // Calculate parallax effect based on z-position
        const parallaxFactor = 1 - zFactor // Particles further away move more
        const yOffsetBase = parallaxFactor * 100
        const yOffset = useMemo(() => {
          return prefersReducedMotion ? 0 : useTransform(scrollY, [0, 200], [0, yOffsetBase])
        }, [prefersReducedMotion, scrollY, yOffsetBase])

        const animatedYValue = prefersReducedMotion ? particle.y : useTransform(yOffset, (value) => particle.y + value)

        const yOffsetTransform = useMemo(() => {
          if (prefersReducedMotion) {
            return particle.y
          } else {
            return useTransform(scrollY, [0, 200], [0, yOffsetBase])
          }
        }, [prefersReducedMotion, scrollY, yOffsetBase, particle.y])

        const animatedY = prefersReducedMotion ? particle.y : yOffsetTransform

        return (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              x: particle.x,
              y: animatedY,
              z: particle.z,
              width: particle.size,
              height: particle.size,
              backgroundColor: getParticleColor(particle.color, particle.opacity * zFactor),
              boxShadow: `0 0 ${particle.size * 2}px ${getParticleColor(particle.color, particle.opacity * 0.5)}`,
              scale,
              zIndex: Math.floor(zFactor * 100),
              filter: `blur(${(1 - zFactor) * 1}px)`,
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: particle.opacity,
              transition: { delay: particle.delay, duration: 1 },
            }}
            // Subtle floating animation
            variants={{
              float: {
                y: [particle.y, particle.y - particle.speed * 20, particle.y],
              },
            }}
            animate="float"
            transition={{
              duration: 5 + Math.random() * 10,
              ease: "easeInOut",
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              delay: particle.delay,
            }}
          />
        )
      })}
    </div>
  )
}
