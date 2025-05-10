"use client"

import { useEffect, useRef } from "react"

export function BackgroundPattern() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Draw background
    const drawBackground = () => {
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "rgba(17, 24, 39, 1)")
      gradient.addColorStop(0.5, "rgba(30, 41, 59, 1)")
      gradient.addColorStop(1, "rgba(17, 24, 39, 1)")

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Add subtle color accents
      const colorAccents = [
        {
          x: canvas.width * 0.1,
          y: canvas.height * 0.2,
          color: "rgba(59, 130, 246, 0.05)",
          radius: canvas.width * 0.2,
        },
        {
          x: canvas.width * 0.8,
          y: canvas.height * 0.3,
          color: "rgba(168, 85, 247, 0.05)",
          radius: canvas.width * 0.25,
        },
        {
          x: canvas.width * 0.3,
          y: canvas.height * 0.7,
          color: "rgba(236, 72, 153, 0.05)",
          radius: canvas.width * 0.2,
        },
        {
          x: canvas.width * 0.7,
          y: canvas.height * 0.8,
          color: "rgba(20, 184, 166, 0.05)",
          radius: canvas.width * 0.3,
        },
      ]

      colorAccents.forEach((accent) => {
        const gradient = ctx.createRadialGradient(accent.x, accent.y, 0, accent.x, accent.y, accent.radius)
        gradient.addColorStop(0, accent.color)
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      })

      // Draw grid pattern
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)"
      ctx.lineWidth = 1

      const gridSize = 50

      // Vertical lines
      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      // Horizontal lines
      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Add dots at intersections
      const dotColors = [
        "rgba(59, 130, 246, 0.2)", // Blue
        "rgba(168, 85, 247, 0.2)", // Purple
        "rgba(236, 72, 153, 0.2)", // Pink
        "rgba(20, 184, 166, 0.2)", // Teal
      ]

      for (let x = 0; x <= canvas.width; x += gridSize) {
        for (let y = 0; y <= canvas.height; y += gridSize) {
          // Only draw some dots (random pattern)
          if (Math.random() > 0.95) {
            const colorIndex = Math.floor(Math.random() * dotColors.length)
            ctx.fillStyle = dotColors[colorIndex]
            ctx.beginPath()
            ctx.arc(x, y, 2, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }
    }

    drawBackground()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10" style={{ pointerEvents: "none" }} aria-hidden="true" />
}
