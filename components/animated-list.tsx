"use client"

import { motion } from "framer-motion"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import type React from "react"

interface AnimatedListProps {
  items: React.ReactNode[]
  className?: string
  itemClassName?: string
  staggerDelay?: number
  as?: "ul" | "ol"
  motionProps?: any
}

export function AnimatedList({
  items,
  className,
  itemClassName,
  staggerDelay = 0.1,
  as = "ul",
  motionProps,
}: AnimatedListProps) {
  const prefersReducedMotion = useReducedMotion()
  const Component = as === "ol" ? motion.ol : motion.ul

  // If user prefers reduced motion, render without animation
  if (prefersReducedMotion) {
    const ItemComponent = as === "ol" ? "li" : "li"
    return (
      <Component className={className} {...motionProps}>
        {items.map((item, index) => (
          <ItemComponent key={index} className={itemClassName}>
            {item}
          </ItemComponent>
        ))}
      </Component>
    )
  }

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  return (
    <Component
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, threshold: 0.1 }}
      {...motionProps}
    >
      {items.map((item, index) => (
        <motion.li key={index} className={itemClassName} variants={itemVariants}>
          {item}
        </motion.li>
      ))}
    </Component>
  )
}
