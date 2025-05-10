"use client"

import { useRef, useEffect, useState, useMemo } from "react"
import { motion, useScroll, useTransform, useMotionValue, animate } from "framer-motion"
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

interface Particles3DProps {
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

export function Particles3D({
  count = 30,
  colors = ["primary", "secondary", "tertiary", "quaternary"],
  minSize = 3,
  maxSize = 12,
  minSpeed = 10,
  maxSpeed = 40,
  depth = 200,
  className = "",
  interactive = true,
}: Particles3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const [particles, setParticles] = useState<Particle[]>([])
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const { scrollYProgress } = useScroll()
  const yScroll = useTransform(scrollYProgress, [0, 1], [0, 100])

  // Generate particles on mount and when dimensions change
  useEffect(() => {
    if (!containerRef.current) return

    const { width, height } = containerRef.current.getBoundingClientRect()
    setDimensions({ width, height })

    const newParticles: Particle[] = Array.from({ length: count }).map((_, i) => {
      const colorIndex = Math.floor(Math.random() * colors.length)
      const size = minSize + Math.random() * (maxSize - minSize)
      const speed = minSpeed + Math.random() * (maxSpeed - minSpeed)

      return {
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * depth - depth / 2,
        size,
        color: colors[colorIndex],
        opacity: 0.1 + Math.random() * 0.6,
        speed,
        delay: Math.random() * 5,
      }
    })

    setParticles(newParticles)
  }, [count, colors, minSize, maxSize, minSpeed, maxSpeed, depth])

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
    if (!interactive) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const { left, top } = containerRef.current.getBoundingClientRect()
      const x = e.clientX - left
      const y = e.clientY - top

      setMousePosition({ x, y })

      // Animate mouse values for smoother movement
      animate(mouseX, x, { duration: 0.5, ease: "easeOut" })
      animate(mouseY, y, { duration: 0.5, ease: "easeOut" })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [interactive, mouseX, mouseY])

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
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ perspective: "1000px" }}
    >
      {particles.map((particle) => {
        // Calculate 3D position
        const zFactor = (depth / 2 + particle.z) / depth // 0 to 1, where 1 is closest
        const scale = 0.5 + zFactor * 0.5 // Scale based on z-position
        const translateZ = particle.z

        // Calculate motion values
        const baseX = useMemo(() => useMotionValue(particle.x), [particle.x])
        const baseY = useMemo(() => useMotionValue(particle.y), [particle.y])

        // Apply scroll effect
        const scrollEffect = useTransform(yScroll, [0, 100], [0, -particle.speed * 2])

        const mouseEffectX = useMemo(() => {
          return interactive
            ? useTransform(mouseX, [0, dimensions.width], [particle.x - 20 * zFactor, particle.x + 20 * zFactor])
            : mouseX
        }, [interactive, mouseX, dimensions.width, particle.x, zFactor])

        const mouseEffectY = useMemo(() => {
          return interactive
            ? useTransform(mouseY, [0, dimensions.height], [particle.y - 20 * zFactor, particle.y + 20 * zFactor])
            : mouseY
        }, [interactive, mouseY, dimensions.height, particle.y, zFactor])

        return (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              x: interactive ? mouseEffectX : baseX,
              y: prefersReducedMotion ? baseY : baseY.get() + scrollEffect.get(),
              z: translateZ,
              width: particle.size,
              height: particle.size,
              backgroundColor: getParticleColor(particle.color, particle.opacity * zFactor),
              boxShadow: `0 0 ${particle.size * 2}px ${getParticleColor(particle.color, particle.opacity * 0.5)}`,
              scale,
              zIndex: Math.floor(zFactor * 100),
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: particle.opacity,
              transition: { delay: particle.delay, duration: 1 },
            }}
            transition={{
              type: "spring",
              stiffness: 50,
              damping: 20,
            }}
          />
        )
      })}
    </div>
  )
}
