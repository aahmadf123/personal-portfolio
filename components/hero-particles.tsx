"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useMotionValue, animate } from "framer-motion"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

interface Particle {
  id: number
  x: number
  y: number
  z: number
  size: number
  color: string
  opacity: number
  speed: {
    x: number
    y: number
    z: number
  }
  initialDelay: number
}

export function HeroParticles() {
  const containerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const [particles, setParticles] = useState<Particle[]>([])
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Generate particles on mount and when dimensions change
  useEffect(() => {
    if (!containerRef.current) return

    const { width, height } = containerRef.current.getBoundingClientRect()
    setDimensions({ width, height })

    const colors = ["primary", "secondary", "tertiary", "quaternary"]
    const count = 60

    const newParticles: Particle[] = Array.from({ length: count }).map((_, i) => {
      const colorIndex = Math.floor(Math.random() * colors.length)
      const size = 2 + Math.random() * 12

      return {
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 300 - 150,
        size,
        color: colors[colorIndex],
        opacity: 0.2 + Math.random() * 0.7,
        speed: {
          x: (Math.random() - 0.5) * 0.5,
          y: (Math.random() - 0.5) * 0.5,
          z: (Math.random() - 0.5) * 0.3,
        },
        initialDelay: Math.random() * 2,
      }
    })

    setParticles(newParticles)
  }, [])

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

  // Handle mouse movement for interactive particles
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const { left, top } = containerRef.current.getBoundingClientRect()
      const x = e.clientX - left
      const y = e.clientY - top

      // Animate mouse values for smoother movement
      animate(mouseX, x, { duration: 0.3, ease: "easeOut" })
      animate(mouseY, y, { duration: 0.3, ease: "easeOut" })

      // Update mouse position state for calculations
      setMousePosition({ x, y })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

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

  // Calculate mouse effect for a particle
  const getMouseEffect = (particle: Particle) => {
    if (prefersReducedMotion || dimensions.width === 0) {
      return { x: particle.x, y: particle.y }
    }

    const zFactor = (150 + particle.z) / 300
    const maxEffect = 40 * zFactor

    // Calculate normalized mouse position (0 to 1)
    const normalizedX = dimensions.width > 0 ? mousePosition.x / dimensions.width : 0.5
    const normalizedY = dimensions.height > 0 ? mousePosition.y / dimensions.height : 0.5

    // Calculate effect based on normalized position (-maxEffect to +maxEffect)
    const effectX = (normalizedX - 0.5) * 2 * maxEffect
    const effectY = (normalizedY - 0.5) * 2 * maxEffect

    return {
      x: particle.x + effectX,
      y: particle.y + effectY,
    }
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ perspective: "1000px" }}
    >
      {particles.map((particle) => {
        // Calculate 3D position
        const zFactor = (150 + particle.z) / 300 // 0 to 1, where 1 is closest
        const scale = 0.5 + zFactor * 0.5 // Scale based on z-position
        const mouseEffect = getMouseEffect(particle)

        return (
          <motion.div
            key={particle.id}
            className="particle-3d particle-glow"
            initial={{ opacity: 0, scale, x: particle.x, y: particle.y, z: particle.z }}
            animate={{
              opacity: particle.opacity,
              scale,
              x: mouseEffect.x,
              y: mouseEffect.y,
              z: particle.z,
              transition: {
                opacity: { delay: particle.initialDelay, duration: 1 },
                scale: { delay: particle.initialDelay, duration: 1 },
                x: { duration: 0.3, ease: "easeOut" },
                y: { duration: 0.3, ease: "easeOut" },
              },
            }}
            // Continuous floating animation
            variants={{
              float: {
                x: [mouseEffect.x, mouseEffect.x + particle.speed.x * 100, mouseEffect.x],
                y: [mouseEffect.y, mouseEffect.y + particle.speed.y * 100, mouseEffect.y],
                z: [particle.z, particle.z + particle.speed.z * 50, particle.z],
              },
            }}
            animate={["float"]}
            transition={{
              float: {
                duration: 10 + Math.random() * 20,
                ease: "easeInOut",
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: particle.initialDelay,
              },
            }}
            style={{
              width: particle.size,
              height: particle.size,
              backgroundColor: getParticleColor(particle.color, particle.opacity * zFactor),
              boxShadow: `0 0 ${particle.size * 2}px ${getParticleColor(particle.color, particle.opacity * 0.5)}`,
              zIndex: Math.floor(zFactor * 100),
              filter: `blur(${(1 - zFactor) * 1}px)`,
            }}
          />
        )
      })}
    </div>
  )
}
