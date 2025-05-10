"use client"

import { useEffect, useState } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

export function CustomCursor() {
  const prefersReducedMotion = useReducedMotion()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Only run on client-side and if user doesn't prefer reduced motion
    if (prefersReducedMotion) return

    setMounted(true)

    // Create cursor elements
    const cursor = document.createElement("div")
    cursor.className = "custom-cursor"
    document.body.appendChild(cursor)

    const cursorDot = document.createElement("div")
    cursorDot.className = "cursor-dot"
    document.body.appendChild(cursorDot)

    // Move cursor with mouse
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

    // Cleanup
    return () => {
      document.removeEventListener("mousemove", moveCursor)

      if (cursor.parentNode) {
        document.body.removeChild(cursor)
      }

      if (cursorDot.parentNode) {
        document.body.removeChild(cursorDot)
      }

      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter)
        el.removeEventListener("mouseleave", handleMouseLeave)
      })
    }
  }, [prefersReducedMotion, mounted])

  // Component doesn't render anything visible
  return null
}
