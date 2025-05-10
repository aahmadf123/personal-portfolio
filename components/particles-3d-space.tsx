"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { cn } from "@/lib/utils"

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
}

interface Particles3DSpaceProps {
  className?: string
  count?: number
  depth?: number
  colors?: string[]
  minSize?: number
  maxSize?: number
  minSpeed?: number
  maxSpeed?: number
  interactive?: boolean
  scrollFactor?: number
}

export function Particles3DSpace({
  className,
  count = 50,
  depth = 500,
  colors = [
    "#00c8e6", // Desaturated primary
    "#9521d9", // Darkened secondary
    "#d90068", // Darkened tertiary
    "#00aa55", // Darkened quaternary
    "#7a9cc0", // New neutral gray-blue
  ],
  minSize = 2,
  maxSize = 8,
  minSpeed = 0.2,
  maxSpeed = 1.5,
  interactive = true,
  scrollFactor = 0.5,
}: Particles3DSpaceProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const [particles, setParticles] = useState<Particle[]>([])
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 })
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 })
  const [screenSize, setScreenSize] = useState("large")

  const { scrollY } = useScroll()
  const yOffset = useTransform(scrollY, [0, 1000], [0, -scrollFactor * 200])

  // Determine particle count based on screen size
  const getResponsiveParticleCount = () => {
    if (typeof window === "undefined") return count

    const width = window.innerWidth

    if (width < 640) {
      // Small mobile
      setScreenSize("small")
      return Math.floor(count * 0.3) // 30% of original count
    } else if (width < 768) {
      // Mobile
      setScreenSize("mobile")
      return Math.floor(count * 0.5) // 50% of original count
    } else if (width < 1024) {
      // Tablet
      setScreenSize("tablet")
      return Math.floor(count * 0.7) // 70% of original count
    } else {
      setScreenSize("large")
      return count // Full count for desktop
    }
  }

  // Initialize particles
  useEffect(() => {
    if (prefersReducedMotion) {
      return
    }

    if (!containerRef.current) return

    const { width, height } = containerRef.current.getBoundingClientRect()
    setDimensions({ width, height })

    const responsiveCount = getResponsiveParticleCount()
    const newParticles: Particle[] = []

    for (let i = 0; i < responsiveCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * width - width / 2,
        y: Math.random() * height - height / 2,
        z: Math.random() * depth - depth / 2,
        size: Math.random() * (maxSize - minSize) + minSize,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.5 + 0.15, // Further reduced opacity for professionalism
        speed: {
          x: (Math.random() * 2 - 1) * (maxSpeed - minSpeed) + minSpeed,
          y: (Math.random() * 2 - 1) * (maxSpeed - minSpeed) + minSpeed,
          z: (Math.random() * 2 - 1) * (maxSpeed - minSpeed) + minSpeed,
        },
      })
    }

    setParticles(newParticles)
  }, [count, depth, colors, minSize, maxSize, minSpeed, maxSpeed, prefersReducedMotion])

  // Update mouse position
  useEffect(() => {
    if (!interactive || prefersReducedMotion) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      setMousePosition({ x, y })
      mouseX.set(x)
      mouseY.set(y)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [interactive, mouseX, mouseY, prefersReducedMotion])

  // Handle window resize and update particle count
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return
      const { width, height } = containerRef.current.getBoundingClientRect()
      setDimensions({ width, height })

      // Update particle count on resize
      const responsiveCount = getResponsiveParticleCount()

      // Only regenerate particles if the screen size category changed
      const newScreenSize =
        window.innerWidth < 640
          ? "small"
          : window.innerWidth < 768
            ? "mobile"
            : window.innerWidth < 1024
              ? "tablet"
              : "large"

      if (newScreenSize !== screenSize) {
        setScreenSize(newScreenSize)

        const newParticles: Particle[] = []
        for (let i = 0; i < responsiveCount; i++) {
          // Reuse existing particles if possible
          if (i < particles.length) {
            newParticles.push(particles[i])
          } else {
            newParticles.push({
              id: i,
              x: Math.random() * width - width / 2,
              y: Math.random() * height - height / 2,
              z: Math.random() * depth - depth / 2,
              size: Math.random() * (maxSize - minSize) + minSize,
              color: colors[Math.floor(Math.random() * colors.length)],
              opacity: Math.random() * 0.5 + 0.15,
              speed: {
                x: (Math.random() * 2 - 1) * (maxSpeed - minSpeed) + minSpeed,
                y: (Math.random() * 2 - 1) * (maxSpeed - minSpeed) + minSpeed,
                z: (Math.random() * 2 - 1) * (maxSpeed - minSpeed) + minSpeed,
              },
            })
          }
        }
        setParticles(newParticles)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [count, depth, colors, minSize, maxSize, minSpeed, maxSpeed, particles, screenSize])

  // Animate particles
  useEffect(() => {
    if (prefersReducedMotion || particles.length === 0) return

    let animationFrameId: number
    let lastTime = 0

    // Adjust animation complexity based on screen size
    const getAnimationComplexity = () => {
      switch (screenSize) {
        case "small":
          return 0.3 // 30% speed for small screens
        case "mobile":
          return 0.5 // 50% speed for mobile
        case "tablet":
          return 0.7 // 70% speed for tablets
        default:
          return 1 // 100% for desktop
      }
    }

    const complexity = getAnimationComplexity()

    const animate = (time: number) => {
      if (!lastTime) lastTime = time
      const deltaTime = time - lastTime
      lastTime = time

      setParticles((prevParticles) => {
        return prevParticles.map((particle) => {
          // Calculate new position with reduced complexity for smaller screens
          let newX = particle.x + particle.speed.x * deltaTime * 0.01 * complexity
          let newY = particle.y + particle.speed.y * deltaTime * 0.01 * complexity
          let newZ = particle.z + particle.speed.z * deltaTime * 0.01 * complexity

          // Boundary check with wrapping
          const halfWidth = dimensions.width / 2
          const halfHeight = dimensions.height / 2
          const halfDepth = depth / 2

          if (newX < -halfWidth) newX = halfWidth
          if (newX > halfWidth) newX = -halfWidth
          if (newY < -halfHeight) newY = halfHeight
          if (newY > halfHeight) newY = -halfHeight
          if (newZ < -halfDepth) newZ = halfDepth
          if (newZ > halfDepth) newZ = -halfDepth

          // Add subtle mouse influence if interactive
          let mouseInfluenceX = 0
          let mouseInfluenceY = 0

          if (interactive) {
            const distance = Math.sqrt(
              Math.pow(newX - mousePosition.x, 2) + Math.pow(newY - mousePosition.y, 2) + Math.pow(newZ, 2),
            )

            const maxDistance = Math.sqrt(Math.pow(halfWidth, 2) + Math.pow(halfHeight, 2) + Math.pow(halfDepth, 2))

            // Reduce mouse influence on smaller screens
            const influence = Math.max(0, 1 - distance / maxDistance) * 0.4 * complexity // Reduced influence
            mouseInfluenceX = (mousePosition.x - newX) * influence * 0.01
            mouseInfluenceY = (mousePosition.y - newY) * influence * 0.01
          }

          return {
            ...particle,
            x: newX + mouseInfluenceX,
            y: newY + mouseInfluenceY,
            z: newZ,
          }
        })
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)
    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [particles, dimensions, mousePosition, interactive, depth, prefersReducedMotion, screenSize])

  if (prefersReducedMotion) {
    return null
  }

  return (
    <motion.div
      ref={containerRef}
      className={cn("fixed inset-0 overflow-hidden pointer-events-none z-0", className)}
      style={{
        perspective: "1000px",
        perspectiveOrigin: "center",
      }}
    >
      <motion.div className="w-full h-full relative" style={{ y: yOffset }}>
        {particles.map((particle) => {
          // Calculate scale based on z position for perspective effect
          const scale = (depth + particle.z) / (depth * 2)
          // Calculate position with perspective
          const translateX = particle.x * scale
          const translateY = particle.y * scale

          return (
            <motion.div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                backgroundColor: particle.color,
                width: particle.size,
                height: particle.size,
                opacity: particle.opacity * scale, // Fade out as it goes further back
                x: translateX + dimensions.width / 2,
                y: translateY + dimensions.height / 2,
                zIndex: Math.floor(scale * 100),
                filter: `blur(${Math.max(0, (1 - scale) * 2)}px)`,
                boxShadow: `0 0 ${particle.size * 1.2}px ${particle.color}`, // Further reduced glow
              }}
            />
          )
        })}
      </motion.div>
    </motion.div>
  )
}
