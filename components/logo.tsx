"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

interface LogoProps {
  size?: number
  variant?: "default" | "quantum" | "neural" | "aerospace" | "interactive" | "minimal"
  animated?: boolean
  className?: string
  interactive?: boolean
}

export function Logo({
  size = 40,
  variant = "default",
  animated = true,
  className = "",
  interactive = false,
}: LogoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Neural network animation
  useEffect(() => {
    if (!animated || variant !== "neural" || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = size * 0.35
    const nodeCount = 8
    const nodes: { x: number; y: number }[] = []

    // Create nodes in a circle
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2
      nodes.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
      })
    }

    // Add center node
    nodes.push({ x: centerX, y: centerY })

    let animationFrame: number
    let phase = 0

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      phase += 0.02

      // Draw connections
      for (let i = 0; i < nodeCount; i++) {
        // Connect to adjacent nodes
        const next = (i + 1) % nodeCount
        ctx.beginPath()
        ctx.moveTo(nodes[i].x, nodes[i].y)
        ctx.lineTo(nodes[next].x, nodes[next].y)
        ctx.strokeStyle = `rgba(0, 153, 255, ${0.3 + 0.2 * Math.sin(phase + i)})`
        ctx.lineWidth = 1
        ctx.stroke()

        // Connect to center
        ctx.beginPath()
        ctx.moveTo(nodes[i].x, nodes[i].y)
        ctx.lineTo(nodes[nodeCount].x, nodes[nodeCount].y)
        ctx.strokeStyle = `rgba(0, 153, 255, ${0.3 + 0.2 * Math.sin(phase + i + Math.PI)})`
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Draw nodes
      for (let i = 0; i <= nodeCount; i++) {
        ctx.beginPath()
        const nodeSize = i === nodeCount ? 4 : 3
        ctx.arc(nodes[i].x, nodes[i].y, nodeSize, 0, Math.PI * 2)
        ctx.fillStyle = i === nodeCount ? "#00e5ff" : `rgba(0, 153, 255, ${0.7 + 0.3 * Math.sin(phase + i)})`
        ctx.fill()
      }

      animationFrame = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(animationFrame)
  }, [animated, variant, size])

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

  if (variant === "neural" && animated) {
    return <canvas ref={canvasRef} width={size} height={size} className={className} />
  }

  // New minimal logo based on the provided image
  if (variant === "minimal") {
    return (
      <div ref={containerRef} className={`relative ${className}`} style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="minimalGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="#00e5ff" stopOpacity="1" />
              <stop offset="40%" stopColor="#00a0e5" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0077cc" stopOpacity="0" />
            </radialGradient>

            <filter id="blurFilter" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
            </filter>

            <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#0099ff" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#0077cc" stopOpacity="0.5" />
            </linearGradient>
          </defs>

          {/* Background glow */}
          <circle
            cx="50"
            cy="50"
            r="20"
            fill="url(#minimalGlow)"
            filter="url(#blurFilter)"
            opacity={animated ? 0.7 : 0.5}
          />

          {/* Outer rings */}
          <motion.circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="url(#ringGradient)"
            strokeWidth="0.5"
            strokeDasharray="1 2"
            animate={
              animated
                ? {
                    rotate: [0, 360],
                    opacity: [0.4, 0.6, 0.4],
                  }
                : {}
            }
            transition={{
              rotate: { duration: 60, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
              opacity: { duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
            }}
            style={{ transformOrigin: "center" }}
          />

          <motion.circle
            cx="50"
            cy="50"
            r="30"
            fill="none"
            stroke="url(#ringGradient)"
            strokeWidth="0.7"
            strokeDasharray="2 2"
            animate={
              animated
                ? {
                    rotate: [360, 0],
                    opacity: [0.5, 0.7, 0.5],
                  }
                : {}
            }
            transition={{
              rotate: { duration: 45, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
              opacity: { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
            }}
            style={{ transformOrigin: "center" }}
          />

          <motion.circle
            cx="50"
            cy="50"
            r="20"
            fill="none"
            stroke="url(#ringGradient)"
            strokeWidth="1"
            animate={
              animated
                ? {
                    opacity: [0.6, 0.9, 0.6],
                  }
                : {}
            }
            transition={{
              opacity: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
            }}
          />

          {/* Core elements */}
          <motion.circle
            cx="50"
            cy="50"
            r="10"
            fill="#00e5ff"
            animate={
              animated
                ? {
                    r: [10, 11, 10],
                    opacity: [0.8, 1, 0.8],
                  }
                : {}
            }
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          <motion.circle
            cx="50"
            cy="50"
            r="5"
            fill="#ffffff"
            animate={
              animated
                ? {
                    r: [5, 6, 5],
                    opacity: [0.9, 1, 0.9],
                  }
                : {}
            }
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          {/* Orbital particles */}
          {animated && (
            <>
              <motion.circle
                cx="50"
                cy="50"
                r="2"
                fill="#00e5ff"
                animate={{
                  cx: [50, 50 + 30 * Math.cos(0), 50],
                  cy: [50 - 30, 50 - 30 * Math.sin(0), 50 - 30],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              />

              <motion.circle
                cx="50"
                cy="50"
                r="2"
                fill="#00e5ff"
                animate={{
                  cx: [50, 50 + 30 * Math.cos(Math.PI / 2), 50],
                  cy: [50, 50 - 30 * Math.sin(Math.PI / 2), 50],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                  delay: 1,
                }}
              />

              <motion.circle
                cx="50"
                cy="50"
                r="2"
                fill="#00e5ff"
                animate={{
                  cx: [50, 50 + 30 * Math.cos(Math.PI), 50],
                  cy: [50 + 30, 50 - 30 * Math.sin(Math.PI), 50 + 30],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                  delay: 2,
                }}
              />

              <motion.circle
                cx="50"
                cy="50"
                r="2"
                fill="#00e5ff"
                animate={{
                  cx: [50, 50 + 30 * Math.cos((3 * Math.PI) / 2), 50],
                  cy: [50, 50 - 30 * Math.sin((3 * Math.PI) / 2), 50],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                  delay: 3,
                }}
              />
            </>
          )}

          {/* Interactive elements */}
          {isHovered && interactive && (
            <g>
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#00e5ff"
                strokeWidth="0.3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ duration: 0.3 }}
              />

              <motion.line
                x1="50"
                y1="50"
                x2={50 + ((mousePosition.x / size) * 100 - 50) * 0.8}
                y2={50 + ((mousePosition.y / size) * 100 - 50) * 0.8}
                stroke="#00e5ff"
                strokeWidth="0.5"
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

  if (variant === "interactive") {
    return (
      <div ref={containerRef} className={`relative ${className}`} style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          {/* Base circle with gradient */}
          <defs>
            <radialGradient id="interactiveGradient" cx="50%" cy="50%" r="50%" fx="40%" fy="40%">
              <stop offset="0%" stopColor="#0099ff" stopOpacity="0.9" />
              <stop offset="80%" stopColor="#0066cc" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#003366" stopOpacity="0.7" />
            </radialGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <circle cx="50" cy="50" r="48" fill="url(#interactiveGradient)" stroke="#0099ff" strokeWidth="1.5" />

          {/* Dynamic elements that respond to mouse position */}
          <g filter="url(#glow)">
            {isHovered && (
              <>
                <circle
                  cx={50 + ((mousePosition.x / size) * 100 - 50) * 0.2}
                  cy={50 + ((mousePosition.y / size) * 100 - 50) * 0.2}
                  r="20"
                  fill="rgba(0, 153, 255, 0.15)"
                />
                <circle
                  cx={50 + ((mousePosition.x / size) * 100 - 50) * 0.1}
                  cy={50 + ((mousePosition.y / size) * 100 - 50) * 0.1}
                  r="30"
                  fill="rgba(0, 153, 255, 0.1)"
                />
              </>
            )}
          </g>

          {/* Core elements */}
          <g>
            <circle cx="50" cy="50" r="10" fill="#0099ff" opacity="0.8" />
            <circle cx="50" cy="50" r="5" fill="#ffffff" opacity="0.9" />
          </g>

          {/* Orbital rings */}
          <g>
            <motion.ellipse
              cx="50"
              cy="50"
              rx="35"
              ry="20"
              fill="none"
              stroke="#0099ff"
              strokeWidth="1"
              strokeDasharray="2 2"
              animate={
                animated
                  ? {
                      transform: isHovered ? "rotate(720deg)" : "rotate(360deg)",
                      rx: isHovered ? 38 : 35,
                      ry: isHovered ? 22 : 20,
                    }
                  : {}
              }
              transition={{
                duration: isHovered ? 15 : 20,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              style={{ transformOrigin: "center" }}
            />

            <motion.ellipse
              cx="50"
              cy="50"
              rx="25"
              ry="15"
              fill="none"
              stroke="#0099ff"
              strokeWidth="1"
              strokeDasharray="3 1"
              animate={
                animated
                  ? {
                      transform: isHovered ? "rotate(-540deg)" : "rotate(-360deg)",
                      rx: isHovered ? 28 : 25,
                      ry: isHovered ? 18 : 15,
                    }
                  : {}
              }
              transition={{
                duration: isHovered ? 12 : 15,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              style={{ transformOrigin: "center" }}
            />
          </g>

          {/* Particles */}
          <g>
            <motion.circle
              cx="85"
              cy="50"
              r="2.5"
              fill="#0099ff"
              animate={
                animated
                  ? {
                      cx: isHovered ? [85, 15, 85] : [85, 15, 85],
                      cy: isHovered ? [50, 50, 50] : [50, 50, 50],
                      r: isHovered ? [2.5, 3.5, 2.5] : [2.5, 2.5, 2.5],
                    }
                  : {}
              }
              transition={{
                duration: isHovered ? 8 : 12,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />

            <motion.circle
              cx="50"
              cy="85"
              r="2.5"
              fill="#0099ff"
              animate={
                animated
                  ? {
                      cx: isHovered ? [50, 50, 50] : [50, 50, 50],
                      cy: isHovered ? [85, 15, 85] : [85, 15, 85],
                      r: isHovered ? [2.5, 3.5, 2.5] : [2.5, 2.5, 2.5],
                    }
                  : {}
              }
              transition={{
                duration: isHovered ? 6 : 10,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />

            <motion.circle
              cx="30"
              cy="30"
              r="2"
              fill="#0099ff"
              animate={
                animated
                  ? {
                      cx: isHovered ? [30, 70, 30] : [30, 70, 30],
                      cy: isHovered ? [30, 70, 30] : [30, 70, 30],
                      opacity: isHovered ? [0.7, 1, 0.7] : [0.7, 0.7, 0.7],
                    }
                  : {}
              }
              transition={{
                duration: isHovered ? 7 : 14,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />

            <motion.circle
              cx="70"
              cy="70"
              r="2"
              fill="#0099ff"
              animate={
                animated
                  ? {
                      cx: isHovered ? [70, 30, 70] : [70, 30, 70],
                      cy: isHovered ? [70, 30, 70] : [70, 30, 70],
                      opacity: isHovered ? [0.7, 1, 0.7] : [0.7, 0.7, 0.7],
                    }
                  : {}
              }
              transition={{
                duration: isHovered ? 9 : 16,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          </g>

          {/* Connection lines that appear on hover */}
          {isHovered && animated && (
            <g>
              <motion.line
                x1="50"
                y1="50"
                x2={50 + ((mousePosition.x / size) * 100 - 50) * 0.5}
                y2={50 + ((mousePosition.y / size) * 100 - 50) * 0.5}
                stroke="#0099ff"
                strokeWidth="0.8"
                strokeDasharray="2 1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ duration: 0.3 }}
              />

              <motion.circle
                cx={50 + ((mousePosition.x / size) * 100 - 50) * 0.5}
                cy={50 + ((mousePosition.y / size) * 100 - 50) * 0.5}
                r="2"
                fill="#ffffff"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ duration: 0.3 }}
              />
            </g>
          )}
        </svg>
      </div>
    )
  }

  // SVG-based logos
  return (
    <div ref={containerRef} className={`relative ${className}`} style={{ width: size, height: size }}>
      {variant === "default" && (
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          {/* Definitions for gradients and filters */}
          <defs>
            <radialGradient id="coreGradient" cx="50%" cy="50%" r="50%" fx="40%" fy="40%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#0099ff" />
              <stop offset="100%" stopColor="#0066cc" />
            </radialGradient>

            <linearGradient id="orbitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0099ff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0099ff" stopOpacity="0.4" />
            </linearGradient>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Base circle with subtle gradient */}
          <circle cx="50" cy="50" r="48" fill="#000" stroke="url(#orbitGradient)" strokeWidth="2" />

          {/* Aerospace/orbit element with improved animation */}
          <motion.ellipse
            cx="50"
            cy="50"
            rx="35"
            ry="20"
            fill="none"
            stroke="url(#orbitGradient)"
            strokeWidth="1.5"
            strokeDasharray="2 2"
            animate={
              animated
                ? {
                    transform: "rotate(360deg)",
                    rx: [35, 36, 35],
                    ry: [20, 21, 20],
                  }
                : {}
            }
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
              times: [0, 0.5, 1],
              rx: {
                duration: 10,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              },
              ry: {
                duration: 10,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              },
            }}
            style={{ transformOrigin: "center" }}
          />

          {/* Secondary orbit */}
          <motion.ellipse
            cx="50"
            cy="50"
            rx="25"
            ry="15"
            fill="none"
            stroke="url(#orbitGradient)"
            strokeWidth="1"
            strokeDasharray="3 1"
            animate={
              animated
                ? {
                    transform: "rotate(-360deg)",
                    rx: [25, 26, 25],
                    ry: [15, 16, 15],
                  }
                : {}
            }
            transition={{
              duration: 15,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
              times: [0, 0.5, 1],
              rx: {
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              },
              ry: {
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              },
            }}
            style={{ transformOrigin: "center" }}
          />

          {/* Neural network nodes with glow effect */}
          <g filter="url(#glow)">
            <circle cx="50" cy="50" r="6" fill="url(#coreGradient)" />
            <circle cx="35" cy="40" r="3" fill="#0099ff" opacity="0.8" />
            <circle cx="65" cy="40" r="3" fill="#0099ff" opacity="0.8" />
            <circle cx="35" cy="60" r="3" fill="#0099ff" opacity="0.8" />
            <circle cx="65" cy="60" r="3" fill="#0099ff" opacity="0.8" />
          </g>

          {/* Neural connections with animated opacity */}
          <motion.line
            x1="50"
            y1="50"
            x2="35"
            y2="40"
            stroke="#0099ff"
            strokeWidth="1.5"
            animate={animated ? { opacity: [0.4, 0.8, 0.4] } : {}}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
          <motion.line
            x1="50"
            y1="50"
            x2="65"
            y2="40"
            stroke="#0099ff"
            strokeWidth="1.5"
            animate={animated ? { opacity: [0.6, 0.9, 0.6] } : {}}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
          <motion.line
            x1="50"
            y1="50"
            x2="35"
            y2="60"
            stroke="#0099ff"
            strokeWidth="1.5"
            animate={animated ? { opacity: [0.5, 0.8, 0.5] } : {}}
            transition={{ duration: 3.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
          <motion.line
            x1="50"
            y1="50"
            x2="65"
            y2="60"
            stroke="#0099ff"
            strokeWidth="1.5"
            animate={animated ? { opacity: [0.7, 1, 0.7] } : {}}
            transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />

          {/* Quantum bits representation with enhanced animation */}
          <motion.circle
            cx="50"
            cy="30"
            r="2.5"
            fill="#0099ff"
            animate={
              animated
                ? {
                    opacity: [0.4, 1, 0.4],
                    r: [2, 2.5, 2],
                  }
                : {}
            }
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <motion.circle
            cx="50"
            cy="70"
            r="2.5"
            fill="#0099ff"
            animate={
              animated
                ? {
                    opacity: [1, 0.4, 1],
                    r: [2.5, 2, 2.5],
                  }
                : {}
            }
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          {/* Aerospace element with improved animation */}
          <motion.path
            d="M50 15 L55 25 L45 25 Z"
            fill="#0099ff"
            animate={
              animated
                ? {
                    y: [0, 2, 0],
                    fill: ["#0099ff", "#00ccff", "#0099ff"],
                  }
                : {}
            }
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          {/* Particle effects */}
          {animated && (
            <>
              <motion.circle
                cx="75"
                cy="50"
                r="1.5"
                fill="#ffffff"
                animate={{
                  opacity: [0, 0.8, 0],
                  cx: [75, 85, 95],
                  cy: [50, 48, 50],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 1,
                }}
              />
              <motion.circle
                cx="25"
                cy="50"
                r="1.5"
                fill="#ffffff"
                animate={{
                  opacity: [0, 0.8, 0],
                  cx: [25, 15, 5],
                  cy: [50, 52, 50],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 2,
                }}
              />
              <motion.circle
                cx="50"
                cy="25"
                r="1.5"
                fill="#ffffff"
                animate={{
                  opacity: [0, 0.8, 0],
                  cy: [25, 15, 5],
                  cx: [50, 48, 50],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 0,
                }}
              />
              <motion.circle
                cx="50"
                cy="75"
                r="1.5"
                fill="#ffffff"
                animate={{
                  opacity: [0, 0.8, 0],
                  cy: [75, 85, 95],
                  cx: [50, 52, 50],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 3,
                }}
              />
            </>
          )}
        </svg>
      )}

      {variant === "quantum" && (
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="quantumCore" cx="50%" cy="50%" r="50%" fx="40%" fy="40%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#B026FF" />
              <stop offset="100%" stopColor="#7B1FA2" />
            </radialGradient>

            <filter id="quantumGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <circle cx="50" cy="50" r="48" fill="#000" stroke="#B026FF" strokeWidth="2" />

          {/* Quantum orbital paths with improved animation */}
          <motion.ellipse
            cx="50"
            cy="50"
            rx="30"
            ry="15"
            fill="none"
            stroke="#B026FF"
            strokeWidth="1.5"
            strokeDasharray="2 1"
            animate={
              animated
                ? {
                    transform: "rotate(360deg)",
                    rx: [30, 32, 30],
                    ry: [15, 17, 15],
                  }
                : {}
            }
            transition={{
              duration: 15,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
              rx: {
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              },
              ry: {
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              },
            }}
            style={{ transformOrigin: "center" }}
          />

          <motion.ellipse
            cx="50"
            cy="50"
            rx="15"
            ry="30"
            fill="none"
            stroke="#B026FF"
            strokeWidth="1.5"
            strokeDasharray="2 1"
            animate={
              animated
                ? {
                    transform: "rotate(360deg)",
                    rx: [15, 17, 15],
                    ry: [30, 32, 30],
                  }
                : {}
            }
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
              rx: {
                duration: 6,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              },
              ry: {
                duration: 6,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              },
            }}
            style={{ transformOrigin: "center" }}
          />

          {/* Quantum particles with enhanced animation */}
          <motion.circle
            cx="80"
            cy="50"
            r="3"
            fill="#B026FF"
            filter="url(#quantumGlow)"
            animate={
              animated
                ? {
                    cx: [80, 20, 80],
                    cy: [50, 50, 50],
                    r: [3, 4, 3],
                    opacity: [0.8, 1, 0.8],
                  }
                : {}
            }
            transition={{
              duration: 15,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          <motion.circle
            cx="50"
            cy="80"
            r="3"
            fill="#B026FF"
            filter="url(#quantumGlow)"
            animate={
              animated
                ? {
                    cx: [50, 50, 50],
                    cy: [80, 20, 80],
                    r: [3, 4, 3],
                    opacity: [0.8, 1, 0.8],
                  }
                : {}
            }
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          {/* Quantum core with glow effect */}
          <circle cx="50" cy="50" r="10" fill="url(#quantumCore)" filter="url(#quantumGlow)" opacity="0.9" />
          <circle cx="50" cy="50" r="5" fill="#FFFFFF" opacity="0.9" />

          {/* Quantum energy waves */}
          {animated && (
            <>
              <motion.circle
                cx="50"
                cy="50"
                r="20"
                fill="none"
                stroke="#B026FF"
                strokeWidth="0.5"
                animate={{
                  r: [20, 40, 60],
                  opacity: [0.8, 0.4, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              />
              <motion.circle
                cx="50"
                cy="50"
                r="15"
                fill="none"
                stroke="#B026FF"
                strokeWidth="0.5"
                animate={{
                  r: [15, 35, 55],
                  opacity: [0.8, 0.4, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                  delay: 1.3,
                }}
              />
              <motion.circle
                cx="50"
                cy="50"
                r="10"
                fill="none"
                stroke="#B026FF"
                strokeWidth="0.5"
                animate={{
                  r: [10, 30, 50],
                  opacity: [0.8, 0.4, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                  delay: 2.6,
                }}
              />
            </>
          )}
        </svg>
      )}

      {variant === "aerospace" && (
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="planetGradient" cx="50%" cy="50%" r="50%" fx="40%" fy="40%">
              <stop offset="0%" stopColor="#FF8A65" />
              <stop offset="50%" stopColor="#FF5722" />
              <stop offset="100%" stopColor="#E64A19" />
            </radialGradient>

            <linearGradient id="orbitPathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF5722" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FF5722" stopOpacity="0.3" />
            </linearGradient>

            <filter id="aeroGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <circle cx="50" cy="50" r="48" fill="#000" stroke="#FF5722" strokeWidth="2" />

          {/* Orbit path with gradient */}
          <ellipse
            cx="50"
            cy="50"
            rx="35"
            ry="20"
            fill="none"
            stroke="url(#orbitPathGradient)"
            strokeWidth="1.5"
            strokeDasharray="3 2"
          />

          {/* Spacecraft with enhanced animation */}
          <motion.g
            animate={
              animated
                ? {
                    transform: "rotate(360deg) translate(35px, 0)",
                    scale: [1, 1.1, 1],
                  }
                : {}
            }
            transition={{
              duration: 12,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
              scale: {
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              },
            }}
            style={{ transformOrigin: "center" }}
            filter="url(#aeroGlow)"
          >
            <path d="M0 0 L6 -3 L6 3 Z" fill="#FF5722" />
            <motion.circle
              cx="3"
              cy="0"
              r="1"
              fill="#FFFFFF"
              animate={animated ? { opacity: [0.5, 1, 0.5] } : {}}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            />
          </motion.g>

          {/* Planet with atmosphere and details */}
          <circle cx="50" cy="50" r="15" fill="url(#planetGradient)" opacity="0.9" />

          {/* Planet atmosphere */}
          <motion.circle
            cx="50"
            cy="50"
            r="17"
            fill="none"
            stroke="#FF8A65"
            strokeWidth="0.5"
            opacity="0.5"
            animate={animated ? { r: [17, 18, 17] } : {}}
            transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />

          {/* Planet surface details */}
          <path d="M45 45 Q50 40 55 45 Q60 50 55 55 Q50 60 45 55 Q40 50 45 45" fill="#E64A19" opacity="0.7" />
          <circle cx="60" cy="45" r="3" fill="#E64A19" opacity="0.6" />
          <circle cx="40" cy="55" r="4" fill="#E64A19" opacity="0.5" />

          {/* Flight path with improved animation */}
          <motion.path
            d="M20 50 Q35 30 50 50 Q65 70 80 50"
            fill="none"
            stroke="#FF5722"
            strokeWidth="1.5"
            strokeDasharray="4 2"
            animate={
              animated
                ? {
                    opacity: [0.3, 0.8, 0.3],
                    y: [0, -2, 0],
                  }
                : {}
            }
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          {/* Aircraft with trail effect */}
          <motion.g
            animate={animated ? { x: [0, 40, 0] } : {}}
            transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            <path d="M30 50 L35 47 L40 50 L35 53 Z" fill="#FF5722" />

            {/* Exhaust trail */}
            {animated && (
              <>
                <motion.circle
                  cx="28"
                  cy="50"
                  r="1"
                  fill="#FF8A65"
                  animate={{
                    opacity: [0.8, 0, 0],
                    cx: [28, 25, 22],
                    r: [1, 0.5, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeOut",
                  }}
                />
                <motion.circle
                  cx="27"
                  cy="50"
                  r="0.8"
                  fill="#FF8A65"
                  animate={{
                    opacity: [0.6, 0, 0],
                    cx: [27, 24, 21],
                    r: [0.8, 0.4, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeOut",
                    delay: 0.3,
                  }}
                />
                <motion.circle
                  cx="26"
                  cy="50"
                  r="0.6"
                  fill="#FF8A65"
                  animate={{
                    opacity: [0.4, 0, 0],
                    cx: [26, 23, 20],
                    r: [0.6, 0.3, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeOut",
                    delay: 0.6,
                  }}
                />
              </>
            )}
          </motion.g>

          {/* Stars in background */}
          {animated && (
            <>
              <motion.circle
                cx="15"
                cy="15"
                r="0.8"
                fill="#FFFFFF"
                animate={{ opacity: [0.2, 0.8, 0.2] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              />
              <motion.circle
                cx="85"
                cy="15"
                r="0.8"
                fill="#FFFFFF"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              />
              <motion.circle
                cx="15"
                cy="85"
                r="0.8"
                fill="#FFFFFF"
                animate={{ opacity: [0.7, 0.3, 0.7] }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              />
              <motion.circle
                cx="85"
                cy="85"
                r="0.8"
                fill="#FFFFFF"
                animate={{ opacity: [0.3, 0.9, 0.3] }}
                transition={{ duration: 3.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              />
            </>
          )}
        </svg>
      )}
    </div>
  )
}
