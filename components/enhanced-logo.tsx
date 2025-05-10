"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

interface EnhancedLogoProps {
  size?: number
  animated?: boolean
  className?: string
  interactive?: boolean
  darkMode?: boolean
}

export function EnhancedLogo({
  size = 40,
  animated = true,
  className = "",
  interactive = false,
  darkMode = true,
}: EnhancedLogoProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)

  // Interactive logo effect
  useEffect(() => {
    if (!interactive || !containerRef.current) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setMousePosition({ x, y })
    }

    const handleMouseEnter = () => setIsHovered(true)
    const handleMouseLeave = () => setIsHovered(false)

    const container = containerRef.current
    container.addEventListener("mousemove", handleMouseMove)
    container.addEventListener("mouseenter", handleMouseEnter)
    container.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      container.removeEventListener("mousemove", handleMouseMove)
      container.removeEventListener("mouseenter", handleMouseEnter)
      container.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [interactive])

  // Animation on load
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Color scheme based on dark mode
  const colors = darkMode
    ? {
        core: "#00e5ff",
        glow: "#00a0e5",
        ring: "#0099ff",
        particle: "#00ccff",
        background: "transparent",
      }
    : {
        core: "#00a0e5",
        glow: "#0077cc",
        ring: "#0066cc",
        particle: "#0088dd",
        background: "transparent",
      }

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      aria-label="Interactive logo"
    >
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor={colors.core} stopOpacity="1" />
            <stop offset="40%" stopColor={colors.glow} stopOpacity="0.8" />
            <stop offset="100%" stopColor={colors.glow} stopOpacity="0" />
          </radialGradient>

          <filter id="blurEffect" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
          </filter>
        </defs>

        {/* Background */}
        <circle cx="50" cy="50" r="48" fill={colors.background} />

        {/* Glow effect */}
        <motion.circle
          cx="50"
          cy="50"
          r="20"
          fill="url(#coreGlow)"
          filter="url(#blurEffect)"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: isLoaded ? (animated ? [0.5, 0.7, 0.5] : 0.6) : 0,
            scale: isLoaded ? 1 : 0.5,
          }}
          transition={{
            opacity: {
              duration: 3,
              repeat: animated ? Number.POSITIVE_INFINITY : 0,
              ease: "easeInOut",
            },
            scale: {
              duration: 0.5,
              ease: "easeOut",
            },
          }}
        />

        {/* Outer ring */}
        <motion.circle
          cx="50"
          cy="50"
          r="35"
          fill="none"
          stroke={colors.ring}
          strokeWidth="0.5"
          strokeDasharray="1 2"
          initial={{ opacity: 0, rotate: 0 }}
          animate={{
            opacity: isLoaded ? 0.6 : 0,
            rotate: animated ? 360 : 0,
          }}
          transition={{
            opacity: {
              duration: 0.5,
              delay: 0.2,
            },
            rotate: {
              duration: 60,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            },
          }}
          style={{ transformOrigin: "center" }}
        />

        {/* Middle ring */}
        <motion.circle
          cx="50"
          cy="50"
          r="25"
          fill="none"
          stroke={colors.ring}
          strokeWidth="0.7"
          strokeDasharray="2 2"
          initial={{ opacity: 0, rotate: 0 }}
          animate={{
            opacity: isLoaded ? 0.7 : 0,
            rotate: animated ? -360 : 0,
          }}
          transition={{
            opacity: {
              duration: 0.5,
              delay: 0.3,
            },
            rotate: {
              duration: 45,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            },
          }}
          style={{ transformOrigin: "center" }}
        />

        {/* Inner ring */}
        <motion.circle
          cx="50"
          cy="50"
          r="15"
          fill="none"
          stroke={colors.ring}
          strokeWidth="1"
          initial={{ opacity: 0 }}
          animate={{
            opacity: isLoaded ? (animated ? [0.6, 0.9, 0.6] : 0.8) : 0,
          }}
          transition={{
            opacity: {
              duration: 0.5,
              delay: 0.4,
              repeat: animated ? Number.POSITIVE_INFINITY : 0,
              repeatDelay: 0,
              ease: "easeInOut",
              duration: 2,
            },
          }}
        />

        {/* Core */}
        <motion.circle
          cx="50"
          cy="50"
          r="8"
          fill={colors.core}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: isLoaded ? (animated ? [0.8, 1, 0.8] : 0.9) : 0,
            scale: isLoaded ? (animated ? [1, 1.1, 1] : 1) : 0,
          }}
          transition={{
            opacity: {
              duration: 2,
              repeat: animated ? Number.POSITIVE_INFINITY : 0,
              ease: "easeInOut",
              delay: 0.5,
            },
            scale: {
              duration: 3,
              repeat: animated ? Number.POSITIVE_INFINITY : 0,
              ease: "easeInOut",
              delay: 0.5,
            },
          }}
        />

        {/* Center dot */}
        <motion.circle
          cx="50"
          cy="50"
          r="4"
          fill="#ffffff"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: isLoaded ? 1 : 0,
            scale: isLoaded ? 1 : 0,
          }}
          transition={{
            duration: 0.5,
            delay: 0.6,
            ease: "easeOut",
          }}
        />

        {/* Orbital particles */}
        {animated && (
          <>
            <motion.circle
              cx="50"
              cy="15"
              r="2"
              fill={colors.particle}
              initial={{ opacity: 0 }}
              animate={{
                opacity: isLoaded ? [0, 1, 0] : 0,
                pathLength: isLoaded ? [0, 1] : 0,
              }}
              transition={{
                opacity: {
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 0.7,
                },
              }}
            />
            <motion.circle
              cx="85"
              cy="50"
              r="2"
              fill={colors.particle}
              initial={{ opacity: 0 }}
              animate={{
                opacity: isLoaded ? [0, 1, 0] : 0,
              }}
              transition={{
                opacity: {
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 1.7,
                },
              }}
            />
            <motion.circle
              cx="50"
              cy="85"
              r="2"
              fill={colors.particle}
              initial={{ opacity: 0 }}
              animate={{
                opacity: isLoaded ? [0, 1, 0] : 0,
              }}
              transition={{
                opacity: {
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 2.7,
                },
              }}
            />
            <motion.circle
              cx="15"
              cy="50"
              r="2"
              fill={colors.particle}
              initial={{ opacity: 0 }}
              animate={{
                opacity: isLoaded ? [0, 1, 0] : 0,
              }}
              transition={{
                opacity: {
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 3.7,
                },
              }}
            />
          </>
        )}

        {/* Interactive elements */}
        {isHovered && interactive && (
          <g>
            <motion.line
              x1="50"
              y1="50"
              x2={50 + ((mousePosition.x / size) * 100 - 50) * 0.8}
              y2={50 + ((mousePosition.y / size) * 100 - 50) * 0.8}
              stroke={colors.core}
              strokeWidth="0.5"
              strokeDasharray="1 1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ duration: 0.2 }}
            />

            <motion.circle
              cx={50 + ((mousePosition.x / size) * 100 - 50) * 0.8}
              cy={50 + ((mousePosition.y / size) * 100 - 50) * 0.8}
              r="1.5"
              fill="#ffffff"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          </g>
        )}
      </svg>
    </div>
  )
}
