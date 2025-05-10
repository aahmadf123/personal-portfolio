"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import styles from "./animated-button.module.css"

interface AnimatedButtonProps extends React.ComponentProps<typeof Button> {
  glowColor?: string
  hoverScale?: number
  gradient?: boolean
  glowIntensity?: "subtle" | "medium" | "strong"
}

export function AnimatedButton({
  children,
  className,
  glowColor,
  hoverScale = 1.03,
  gradient = false,
  glowIntensity = "medium",
  ...props
}: AnimatedButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  // Default glow colors based on variant
  const defaultGlowColor =
    props.variant === "outline" ? "rgba(var(--color-primary), 0.3)" : "rgba(var(--color-primary), 0.5)"

  const finalGlowColor = glowColor || defaultGlowColor

  // Adjust glow intensity
  const glowOpacity = {
    subtle: 0.2,
    medium: 0.3,
    strong: 0.4,
  }[glowIntensity]

  const glowBlur = {
    subtle: "8px",
    medium: "12px",
    strong: "16px",
  }[glowIntensity]

  // Skip animations if user prefers reduced motion
  const animations = prefersReducedMotion
    ? {}
    : {
        whileHover: {
          scale: hoverScale,
          boxShadow: `0 0 ${glowBlur} 2px ${finalGlowColor}`,
        },
        whileTap: { scale: 0.98 },
      }

  const gradientClass = gradient ? cn(styles.gradient, "bg-gradient-to-r from-primary via-secondary to-primary") : ""

  return (
    <motion.div
      className={styles.buttonWrapper}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      {...animations}
    >
      {isHovered && !prefersReducedMotion && (
        <motion.div
          className={styles.glowEffect}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: glowOpacity, scale: 1.1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          style={{ backgroundColor: finalGlowColor }}
        />
      )}
      <Button className={cn(styles.button, gradientClass, className)} {...props}>
        {children}
      </Button>
    </motion.div>
  )
}
