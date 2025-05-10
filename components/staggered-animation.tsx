"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

interface StaggeredAnimationProps {
  children: ReactNode
  staggerDelay?: number
  duration?: number
  className?: string
  direction?: "up" | "down" | "left" | "right" | "none"
}

export function StaggeredAnimation({
  children,
  staggerDelay = 0.1,
  duration = 0.5,
  className = "",
  direction = "up",
}: StaggeredAnimationProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const prefersReducedMotion = useReducedMotion()

  // Get initial animation values based on direction
  const getInitial = () => {
    if (prefersReducedMotion) return {}

    switch (direction) {
      case "up":
        return { opacity: 0, y: 40 }
      case "down":
        return { opacity: 0, y: -40 }
      case "left":
        return { opacity: 0, x: 40 }
      case "right":
        return { opacity: 0, x: -40 }
      case "none":
        return { opacity: 0 }
      default:
        return { opacity: 0, y: 40 }
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  }

  const itemVariants = {
    hidden: getInitial(),
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        ease: "easeOut",
      },
    },
  }

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
    >
      {Array.isArray(children) ? (
        children.map((child, index) => (
          <motion.div key={index} variants={itemVariants}>
            {child}
          </motion.div>
        ))
      ) : (
        <motion.div variants={itemVariants}>{children}</motion.div>
      )}
    </motion.div>
  )
}
