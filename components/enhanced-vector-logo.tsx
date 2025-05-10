"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

interface EnhancedVectorLogoProps {
  size?: number
  color?: string
  secondaryColor?: string
  animated?: boolean
  variant?: "default" | "tech" | "neural"
  interactive?: boolean
  className?: string
}

export function EnhancedVectorLogo({
  size = 40,
  color = "#38bdf8",
  secondaryColor = "#0ea5e9",
  animated = true,
  variant = "default",
  interactive = false,
  className = "",
}: EnhancedVectorLogoProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Handle mouse interactions for interactive mode
  useEffect(() => {
    if (!interactive || !svgRef.current) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!svgRef.current) return
      const rect = svgRef.current.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }

    const svg = svgRef.current
    svg.addEventListener("mousemove", handleMouseMove)
    return () => {
      svg.removeEventListener("mousemove", handleMouseMove)
    }
  }, [interactive])

  // Determine which variant to render
  const renderVariant = () => {
    switch (variant) {
      case "tech":
        return renderTechVariant()
      case "neural":
        return renderNeuralVariant()
      default:
        return renderDefaultVariant()
    }
  }

  // Default variant - simple AF monogram
  const renderDefaultVariant = () => (
    <>
      <motion.path
        d="M10,10 L30,10 L20,30 Z"
        fill={color}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      />
      <motion.path
        d="M15,15 L25,15 L20,25 Z"
        fill={secondaryColor}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />
    </>
  )

  // Tech variant - circuit-like AF monogram
  const renderTechVariant = () => (
    <>
      <motion.path
        d="M10,10 L30,10 L20,30 L10,10 Z"
        fill="none"
        stroke={color}
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
      <motion.circle
        cx="10"
        cy="10"
        r="2"
        fill={secondaryColor}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 1 }}
      />
      <motion.circle
        cx="30"
        cy="10"
        r="2"
        fill={secondaryColor}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 1.1 }}
      />
      <motion.circle
        cx="20"
        cy="30"
        r="2"
        fill={secondaryColor}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 1.2 }}
      />
      <motion.line
        x1="15"
        y1="15"
        x2="25"
        y2="15"
        stroke={color}
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 1.3 }}
      />
    </>
  )

  // Neural variant - neural network-inspired AF monogram
  const renderNeuralVariant = () => (
    <>
      <motion.circle
        cx="10"
        cy="10"
        r="3"
        fill={color}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      />
      <motion.circle
        cx="30"
        cy="10"
        r="3"
        fill={color}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      />
      <motion.circle
        cx="20"
        cy="20"
        r="3"
        fill={secondaryColor}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      />
      <motion.circle
        cx="10"
        cy="30"
        r="3"
        fill={color}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      />
      <motion.circle
        cx="30"
        cy="30"
        r="3"
        fill={color}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      />
      <motion.line
        x1="10"
        y1="10"
        x2="20"
        y2="20"
        stroke={color}
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      />
      <motion.line
        x1="30"
        y1="10"
        x2="20"
        y2="20"
        stroke={color}
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      />
      <motion.line
        x1="20"
        y1="20"
        x2="10"
        y2="30"
        stroke={color}
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      />
      <motion.line
        x1="20"
        y1="20"
        x2="30"
        y2="30"
        stroke={color}
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      />
    </>
  )

  return (
    <motion.svg
      ref={svgRef}
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={
        interactive && isHovered
          ? {
              filter: "drop-shadow(0 0 8px rgba(56, 189, 248, 0.8))",
            }
          : {}
      }
    >
      {renderVariant()}
    </motion.svg>
  )
}
