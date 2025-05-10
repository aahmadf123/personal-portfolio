"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

export interface QuantumParticleLogoProps {
  size?: number
  color?: string
  className?: string
  particleCount?: number
  particleSize?: number
  orbitSpeed?: number
  showOrbits?: boolean
  showConnections?: boolean
  particleBehavior?: "orbital" | "bouncy" | "chaotic"
  glowIntensity?: number
  centerSize?: number
  interactive?: boolean
  onCustomize?: () => void
}

export const QuantumParticleLogo = ({
  size = 40,
  color = "#00BFFF",
  className = "",
  particleCount = 12,
  particleSize = 1.5,
  orbitSpeed = 1,
  showOrbits = true,
  showConnections = true,
  particleBehavior = "orbital",
  glowIntensity = 0.5,
  centerSize = 0.1,
  interactive = false,
  onCustomize,
}: QuantumParticleLogoProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const particles: Particle[] = []

    // Set canvas dimensions with device pixel ratio for sharp rendering
    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount
      const distance = Math.random() * (size / 3) + size / 6

      let velocityFactor = orbitSpeed * 0.015

      if (particleBehavior === "chaotic") {
        velocityFactor = orbitSpeed * 0.03
      }

      particles.push({
        x: size / 2 + Math.cos(angle) * distance,
        y: size / 2 + Math.sin(angle) * distance,
        radius: Math.random() * particleSize + particleSize / 2,
        color: color,
        velocity: {
          x:
            particleBehavior === "orbital"
              ? -Math.sin(angle) * velocityFactor
              : (Math.random() - 0.5) * velocityFactor * 2,
          y:
            particleBehavior === "orbital"
              ? Math.cos(angle) * velocityFactor
              : (Math.random() - 0.5) * velocityFactor * 2,
        },
        opacity: Math.random() * 0.5 + 0.5,
        angle: angle,
        distance: distance,
      })
    }

    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, size, size)

      // Draw glow effect
      if (glowIntensity > 0) {
        const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
        gradient.addColorStop(
          0,
          `${color}${Math.floor(glowIntensity * 40)
            .toString(16)
            .padStart(2, "0")}`,
        )
        gradient.addColorStop(1, "transparent")
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, size, size)
      }

      // Draw orbital circles
      if (showOrbits) {
        ctx.beginPath()
        ctx.arc(size / 2, size / 2, size / 3, 0, Math.PI * 2)
        ctx.strokeStyle = `${color}40` // 25% opacity
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(size / 2, size / 2, size / 2.2, 0, Math.PI * 2)
        ctx.strokeStyle = `${color}20` // 12.5% opacity
        ctx.stroke()
      }

      // Draw center circle
      ctx.beginPath()
      ctx.arc(size / 2, size / 2, size * centerSize, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()

      // Add glow to center
      if (glowIntensity > 0) {
        ctx.beginPath()
        ctx.arc(size / 2, size / 2, size * centerSize * 1.5, 0, Math.PI * 2)
        const gradient = ctx.createRadialGradient(
          size / 2,
          size / 2,
          size * centerSize * 0.5,
          size / 2,
          size / 2,
          size * centerSize * 2,
        )
        gradient.addColorStop(
          0,
          `${color}${Math.floor(glowIntensity * 80)
            .toString(16)
            .padStart(2, "0")}`,
        )
        gradient.addColorStop(1, "transparent")
        ctx.fillStyle = gradient
        ctx.fill()
      }

      // Update and draw particles
      particles.forEach((particle) => {
        if (particleBehavior === "orbital") {
          // Update angle for orbital movement
          particle.angle += orbitSpeed * 0.01
          particle.x = size / 2 + Math.cos(particle.angle) * particle.distance
          particle.y = size / 2 + Math.sin(particle.angle) * particle.distance
        } else {
          // Update position for bouncy or chaotic behavior
          particle.x += particle.velocity.x
          particle.y += particle.velocity.y

          // Boundary behavior
          if (particleBehavior === "bouncy") {
            // Bounce off edges
            if (particle.x <= particle.radius || particle.x >= size - particle.radius) {
              particle.velocity.x *= -1
            }
            if (particle.y <= particle.radius || particle.y >= size - particle.radius) {
              particle.velocity.y *= -1
            }
          } else if (particleBehavior === "chaotic") {
            // Wrap around edges with some randomness
            if (particle.x < 0) particle.x = size
            if (particle.x > size) particle.x = 0
            if (particle.y < 0) particle.y = size
            if (particle.y > size) particle.y = 0

            // Add some randomness to velocity
            if (Math.random() < 0.05) {
              particle.velocity.x += (Math.random() - 0.5) * 0.1
              particle.velocity.y += (Math.random() - 0.5) * 0.1
            }
          }

          // Orbital gravity effect
          const dx = particle.x - size / 2
          const dy = particle.y - size / 2
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance > size / 2) {
            // Apply force toward center
            particle.velocity.x -= dx * 0.001 * orbitSpeed
            particle.velocity.y -= dy * 0.001 * orbitSpeed
          }
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = `${particle.color}${Math.floor(particle.opacity * 255)
          .toString(16)
          .padStart(2, "0")}`
        ctx.fill()

        // Add glow to particles
        if (glowIntensity > 0) {
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.radius * 2, 0, Math.PI * 2)
          const gradient = ctx.createRadialGradient(
            particle.x,
            particle.y,
            0,
            particle.x,
            particle.y,
            particle.radius * 3,
          )
          gradient.addColorStop(
            0,
            `${particle.color}${Math.floor(glowIntensity * 60)
              .toString(16)
              .padStart(2, "0")}`,
          )
          gradient.addColorStop(1, "transparent")
          ctx.fillStyle = gradient
          ctx.fill()
        }

        // Draw connection lines to center
        if (showConnections) {
          ctx.beginPath()
          ctx.moveTo(size / 2, size / 2)
          ctx.lineTo(particle.x, particle.y)
          ctx.strokeStyle = `${particle.color}20` // Very transparent
          ctx.stroke()
        }
      })

      requestAnimationFrame(animate)
    }

    const animationId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [
    size,
    color,
    particleCount,
    particleSize,
    orbitSpeed,
    showOrbits,
    showConnections,
    particleBehavior,
    glowIntensity,
    centerSize,
  ])

  return (
    <motion.div
      className={`relative inline-block ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{ width: size, height: size }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: size,
          height: size,
          display: "block",
          cursor: interactive ? "pointer" : "default",
        }}
        onClick={interactive ? onCustomize : undefined}
      />
      {interactive && isHovered && (
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap">
          Customize
        </div>
      )}
    </motion.div>
  )
}

interface Particle {
  x: number
  y: number
  radius: number
  color: string
  velocity: {
    x: number
    y: number
  }
  opacity: number
  angle: number
  distance: number
}

// Also export as default for convenience
export default QuantumParticleLogo
