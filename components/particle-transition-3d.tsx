"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

interface Particle {
  id: number
  x: number
  y: number
  z: number
  size: number
  color: string
  opacity: number
  speed: number
  yOffset: number
  zOffset: number
}

interface ParticleTransition3DProps {
  from?: "primary" | "secondary" | "tertiary" | "quaternary"
  to?: "primary" | "secondary" | "tertiary" | "quaternary"
  height?: number
  particleCount?: number
}

export function ParticleTransition3D({
  from = "primary",
  to = "secondary",
  height = 200,
  particleCount = 30,
}: ParticleTransition3DProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])
  const [dimensions, setDimensions] = useState({ width: 0 })

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  // Create transformed values at the top level
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3])
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1])

  // Generate particles
  useEffect(() => {
    if (!ref.current) return

    const { width } = ref.current.getBoundingClientRect()
    setDimensions({ width })

    const colors = [from, to]
    const newParticles: Particle[] = Array.from({ length: particleCount }).map((_, i) => {
      const colorIndex = Math.floor(Math.random() * colors.length)
      const size = 3 + Math.random() * 10
      const speed = 0.5 + Math.random() * 2
      const yOffset = Math.random() * 100 - 50
      const zOffset = Math.random() * 40 - 20

      return {
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 200 - 100,
        size,
        color: colors[colorIndex],
        opacity: 0.1 + Math.random() * 0.5,
        speed,
        yOffset,
        zOffset,
      }
    })

    setParticles(newParticles)
  }, [from, to, height, particleCount])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!ref.current) return
      const { width } = ref.current.getBoundingClientRect()
      setDimensions({ width })
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

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
        return `rgba(0, 229, 255, ${opacity})`
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
        className="absolute inset-0"
        style={{
          opacity,
          perspective: "1000px",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, ${getColor(from, 0.1)}, ${getColor(to, 0.1)})`,
            filter: "blur(20px)",
          }}
        />

        {/* 3D Particles */}
        {particles.map((particle) => {
          // Calculate 3D position
          const zFactor = (100 + particle.z) / 200 // 0 to 1, where 1 is closest
          const scale = 0.5 + zFactor * 0.5 // Scale based on z-position

          // Calculate particle movement based on scroll
          const yTransform = progress.get() * 100
          const zTransform = progress.get() * 40

          return (
            <motion.div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                x: particle.x,
                y: particle.y + particle.yOffset - yTransform * particle.speed,
                z: particle.z + particle.zOffset - zTransform,
                width: particle.size,
                height: particle.size,
                backgroundColor: getColor(particle.color, particle.opacity * zFactor),
                boxShadow: `0 0 ${particle.size * 2}px ${getColor(particle.color, particle.opacity * 0.5)}`,
                scale,
                zIndex: Math.floor(zFactor * 100),
                filter: `blur(${(1 - zFactor) * 2}px)`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: isVisible ? particle.opacity : 0 }}
              transition={{ duration: 0.8, delay: Math.random() * 0.5 }}
            />
          )
        })}
      </motion.div>
    </div>
  )
}
