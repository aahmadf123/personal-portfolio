"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

export function MicroInteractions() {
  const prefersReducedMotion = useReducedMotion()
  const [mounted, setMounted] = useState(false)

  // Only run animations after component is mounted on the client
  useEffect(() => {
    setMounted(true)
  }, [])

  // If user prefers reduced motion or component isn't mounted yet, don't render animations
  if (prefersReducedMotion || !mounted) {
    return null
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      <AnimatePresence>
        {/* Subtle background particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute h-1 w-1 rounded-full bg-primary/20"
              initial={{
                x: `${Math.random() * 100}vw`,
                y: `${Math.random() * 100}vh`,
                opacity: 0,
              }}
              animate={{
                x: `${Math.random() * 100}vw`,
                y: `${Math.random() * 100}vh`,
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 5 + Math.random() * 10,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                ease: "easeInOut",
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        {/* Cursor follow effect */}
        <CursorFollowEffect />
      </AnimatePresence>
    </div>
  )
}

function CursorFollowEffect() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    // Safety check for browser environment
    if (typeof window === "undefined") return

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      if (!isActive) setIsActive(true)
    }

    const handleMouseLeave = () => {
      setIsActive(false)
    }

    window.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [isActive])

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="pointer-events-none absolute h-32 w-32 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 blur-xl"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 0.3,
            x: mousePosition.x - 64,
            y: mousePosition.y - 64,
          }}
          exit={{ opacity: 0 }}
          transition={{
            type: "spring",
            damping: 20,
            stiffness: 300,
            opacity: { duration: 0.3 },
          }}
        />
      )}
    </AnimatePresence>
  )
}
