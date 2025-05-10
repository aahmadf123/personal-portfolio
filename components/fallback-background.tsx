"use client"

import { useEffect, useState } from "react"

export function FallbackBackground() {
  const [gradientPosition, setGradientPosition] = useState({ x: 50, y: 50 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate mouse position as percentage of window
      const x = (e.clientX / window.innerWidth) * 100
      const y = (e.clientY / window.innerHeight) * 100

      // Update with some damping for smoother effect
      setGradientPosition((prev) => ({
        x: prev.x + (x - prev.x) * 0.1,
        y: prev.y + (y - prev.y) * 0.1,
      }))
    }

    // Throttled event listener
    let timeoutId: NodeJS.Timeout
    const throttledHandleMouseMove = (e: MouseEvent) => {
      if (!timeoutId) {
        timeoutId = setTimeout(() => {
          handleMouseMove(e)
          timeoutId = undefined as unknown as NodeJS.Timeout
        }, 50)
      }
    }

    window.addEventListener("mousemove", throttledHandleMouseMove)

    return () => {
      window.removeEventListener("mousemove", throttledHandleMouseMove)
      clearTimeout(timeoutId)
    }
  }, [])

  return (
    <div
      className="fixed inset-0 z-0 bg-black"
      style={{
        background: `radial-gradient(circle at ${gradientPosition.x}% ${gradientPosition.y}%, rgba(0, 229, 255, 0.1) 0%, rgba(0, 0, 0, 1) 70%)`,
      }}
    />
  )
}
