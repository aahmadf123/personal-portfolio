"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useAnimationControls } from "framer-motion"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

interface TechGradientLogoProps {
  size?: number
  className?: string
  animated?: boolean
  interactive?: boolean
  initialAnimation?: boolean
}

export function TechGradientLogo({
  size = 40,
  className,
  animated = true,
  interactive = false,
  initialAnimation = false,
}: TechGradientLogoProps) {
  const prefersReducedMotion = useReducedMotion()
  const [isHovered, setIsHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const waveformControls = useAnimationControls()
  const orbitControls = useAnimationControls()
  const nodesControls = useAnimationControls()
  const arrowsControls = useAnimationControls()

  // Disable animations if user prefers reduced motion
  const shouldAnimate = animated && !prefersReducedMotion

  // Initial animation sequence
  useEffect(() => {
    if (initialAnimation && shouldAnimate) {
      const sequence = async () => {
        // Start with everything invisible
        await waveformControls.start({ pathLength: 0, opacity: 0 })
        await orbitControls.start({ pathLength: 0, opacity: 0 })
        await nodesControls.start({ scale: 0, opacity: 0 })
        await arrowsControls.start({ scale: 0, opacity: 0 })

        // Animate in sequence
        await orbitControls.start({ pathLength: 1, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } })
        await nodesControls.start({ scale: 1, opacity: 1, transition: { duration: 0.5, ease: "backOut" } })
        await waveformControls.start({ pathLength: 1, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } })
        await arrowsControls.start({ scale: 1, opacity: 1, transition: { duration: 0.5, ease: "backOut" } })
      }

      sequence()
    }
  }, [initialAnimation, shouldAnimate, waveformControls, orbitControls, nodesControls, arrowsControls])

  // Interactive hover effects
  useEffect(() => {
    if (interactive && isHovered && shouldAnimate) {
      waveformControls.start({
        pathLength: [1, 1.05, 1],
        transition: { duration: 1.5, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY },
      })

      orbitControls.start({
        rotate: 360,
        transition: { duration: 20, ease: "linear", repeat: Number.POSITIVE_INFINITY },
      })

      nodesControls.start({
        y: [0, -3, 0, 3, 0],
        transition: { duration: 3, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY },
      })

      arrowsControls.start({
        scale: [1, 1.05, 1],
        transition: { duration: 2, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY },
      })
    } else if (shouldAnimate) {
      // Default animations when not hovered
      waveformControls.start({
        pathLength: 1,
        opacity: 1,
        transition: { duration: 0.3 },
      })

      orbitControls.start({
        rotate: 360,
        transition: { duration: 40, ease: "linear", repeat: Number.POSITIVE_INFINITY },
      })

      nodesControls.start({
        scale: 1,
        opacity: 1,
        transition: { duration: 0.3 },
      })

      arrowsControls.start({
        scale: 1,
        opacity: 1,
        transition: { duration: 0.3 },
      })
    } else {
      // Stop animations if animation is disabled
      waveformControls.stop()
      orbitControls.stop()
      nodesControls.stop()
      arrowsControls.stop()
    }
  }, [isHovered, interactive, shouldAnimate, waveformControls, orbitControls, nodesControls, arrowsControls])

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      style={{ width: size, height: size }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Tech Gradient Logo"
    >
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00e5ff" />
            <stop offset="50%" stopColor="#2979ff" />
            <stop offset="100%" stopColor="#9c27b0" />
          </linearGradient>

          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Orbital paths */}
        <motion.g animate={orbitControls} style={{ originX: "50%", originY: "50%" }}>
          {/* Outer orbit */}
          <motion.path
            d="M40 100 C40 40, 160 40, 160 100 C160 160, 40 160, 40 100"
            stroke="url(#logoGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: shouldAnimate ? 0 : 1, opacity: shouldAnimate ? 0 : 1 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />

          {/* Inner orbit */}
          <motion.circle
            cx="100"
            cy="100"
            r="30"
            stroke="url(#logoGradient)"
            strokeWidth="4"
            fill="none"
            initial={{ pathLength: shouldAnimate ? 0 : 1, opacity: shouldAnimate ? 0 : 1 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          />

          {/* Connection line 1 */}
          <motion.path
            d="M30 70 L50 90"
            stroke="url(#logoGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: shouldAnimate ? 0 : 1, opacity: shouldAnimate ? 0 : 1 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
          />

          {/* Connection line 2 */}
          <motion.path
            d="M50 90 L30 110"
            stroke="url(#logoGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: shouldAnimate ? 0 : 1, opacity: shouldAnimate ? 0 : 1 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
          />
        </motion.g>

        {/* Waveform in center */}
        <motion.path
          d="M85 100 L90 85 L95 115 L100 85 L105 115 L110 85 L115 100"
          stroke="url(#logoGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          animate={waveformControls}
          initial={{ pathLength: shouldAnimate ? 0 : 1, opacity: shouldAnimate ? 0 : 1 }}
          filter="url(#glow)"
        />

        {/* Nodes */}
        <motion.g animate={nodesControls}>
          {/* Node 1 */}
          <motion.circle
            cx="30"
            cy="70"
            r="6"
            fill="url(#logoGradient)"
            initial={{ scale: shouldAnimate ? 0 : 1, opacity: shouldAnimate ? 0 : 1 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          />

          {/* Node 2 */}
          <motion.circle
            cx="50"
            cy="90"
            r="4"
            stroke="url(#logoGradient)"
            strokeWidth="2"
            fill="none"
            initial={{ scale: shouldAnimate ? 0 : 1, opacity: shouldAnimate ? 0 : 1 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          />

          {/* Node 3 */}
          <motion.circle
            cx="30"
            cy="110"
            r="4"
            stroke="url(#logoGradient)"
            strokeWidth="2"
            fill="none"
            initial={{ scale: shouldAnimate ? 0 : 1, opacity: shouldAnimate ? 0 : 1 }}
            transition={{ duration: 0.3, delay: 0.8 }}
          />

          {/* Node 4 */}
          <motion.circle
            cx="160"
            cy="50"
            r="6"
            fill="url(#logoGradient)"
            initial={{ scale: shouldAnimate ? 0 : 1, opacity: shouldAnimate ? 0 : 1 }}
            transition={{ duration: 0.3, delay: 0.9 }}
          />
        </motion.g>

        {/* Arrows */}
        <motion.g animate={arrowsControls}>
          {/* Arrow 1 */}
          <motion.path
            d="M150 40 L170 60 L150 60 Z"
            fill="url(#logoGradient)"
            initial={{ scale: shouldAnimate ? 0 : 1, opacity: shouldAnimate ? 0 : 1 }}
            transition={{ duration: 0.4, delay: 1 }}
          />

          {/* Curved arrow path */}
          <motion.path
            d="M170 60 C180 90, 170 130, 140 150"
            stroke="url(#logoGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: shouldAnimate ? 0 : 1, opacity: shouldAnimate ? 0 : 1 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 1.1 }}
          />
        </motion.g>
      </svg>
    </div>
  )
}
