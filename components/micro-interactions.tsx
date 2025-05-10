"use client"

import type React from "react"

import { useEffect } from "react"
import { motion, useAnimation, useScroll, useMotionValueEvent } from "framer-motion"

export function MicroInteractions() {
  const { scrollY } = useScroll()
  const controls = useAnimation()

  // Track scroll position and trigger animations
  useMotionValueEvent(scrollY, "change", (latest) => {
    // Only execute if latest is defined
    if (latest !== undefined) {
      // You can add scroll-based animations here
    }
  })

  // Add cursor effects
  useEffect(() => {
    const cursor = document.createElement("div")
    cursor.className = "custom-cursor"
    document.body.appendChild(cursor)

    const cursorDot = document.createElement("div")
    cursorDot.className = "cursor-dot"
    document.body.appendChild(cursorDot)

    const moveCursor = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`
      cursor.style.top = `${e.clientY}px`

      cursorDot.style.left = `${e.clientX}px`
      cursorDot.style.top = `${e.clientY}px`
    }

    document.addEventListener("mousemove", moveCursor)

    // Add hover effects for interactive elements
    const handleMouseEnter = () => {
      cursor.classList.add("cursor-expanded")
    }

    const handleMouseLeave = () => {
      cursor.classList.remove("cursor-expanded")
    }

    const interactiveElements = document.querySelectorAll("a, button, input, textarea, select, [role='button']")
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter)
      el.addEventListener("mouseleave", handleMouseLeave)
    })

    return () => {
      document.removeEventListener("mousemove", moveCursor)
      document.body.removeChild(cursor)
      document.body.removeChild(cursorDot)

      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter)
        el.removeEventListener("mouseleave", handleMouseLeave)
      })
    }
  }, [])

  return null
}

export function FadeInOnScroll({
  children,
  delay = 0,
  duration = 0.5,
  threshold = 0.1,
  className = "",
}: {
  children: React.ReactNode
  delay?: number
  duration?: number
  threshold?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, threshold }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function ScaleOnHover({
  children,
  scale = 1.05,
  className = "",
}: {
  children: React.ReactNode
  scale?: number
  className?: string
}) {
  return (
    <motion.div
      whileHover={{ scale }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function FloatingAnimation({
  children,
  yOffset = 10,
  duration = 2,
  className = "",
}: {
  children: React.ReactNode
  yOffset?: number
  duration?: number
  className?: string
}) {
  return (
    <motion.div
      animate={{
        y: [0, -yOffset, 0],
      }}
      transition={{
        duration,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function GlowOnHover({
  children,
  color = "rgba(0, 229, 255, 0.5)",
  className = "",
}: {
  children: React.ReactNode
  color?: string
  className?: string
}) {
  return (
    <motion.div
      whileHover={{
        boxShadow: `0 0 20px ${color}`,
      }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
