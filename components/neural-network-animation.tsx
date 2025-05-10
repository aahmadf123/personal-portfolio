"use client"

import { useEffect, useRef, useState } from "react"
import { useInView } from "react-intersection-observer"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

export function NeuralNetworkAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  // Performance detection
  const [isLowPerformance, setIsLowPerformance] = useState(false)

  useEffect(() => {
    // Detect low performance devices
    const checkPerformance = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      const isLowEndDevice = navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 4
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

      setIsLowPerformance(isMobile || isLowEndDevice || prefersReducedMotion)
    }

    checkPerformance()
  }, [])

  useEffect(() => {
    if (!canvasRef.current || !inView) return

    try {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        setError("Could not get canvas context")
        return
      }

      // Set canvas dimensions with device pixel ratio for sharper rendering
      const updateCanvasSize = () => {
        const parent = canvas.parentElement
        if (!parent) return

        const { width, height } = parent.getBoundingClientRect()
        const dpr = window.devicePixelRatio || 1

        // Set display size
        canvas.style.width = `${width}px`
        canvas.style.height = `${height}px`

        // Set actual size in memory (scaled up)
        canvas.width = width * dpr
        canvas.height = height * dpr

        // Scale all drawing operations by the dpr
        ctx.scale(dpr, dpr)
      }

      updateCanvasSize()

      // Throttled resize handler
      let resizeTimeout: NodeJS.Timeout
      const handleResize = () => {
        clearTimeout(resizeTimeout)
        resizeTimeout = setTimeout(updateCanvasSize, 100)
      }

      window.addEventListener("resize", handleResize)

      // Simplified network parameters for better performance
      const nodeCount = isLowPerformance ? 15 : 30
      const connectionCount = isLowPerformance ? 2 : 5

      // Create nodes
      const nodes = Array.from({ length: nodeCount }).map(() => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        color: `rgba(0, 229, 255, ${0.3 + Math.random() * 0.5})`,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        connections: [] as number[],
      }))

      // Create connections (simplified)
      nodes.forEach((node, i) => {
        const connCount = Math.floor(Math.random() * connectionCount) + 1
        for (let j = 0; j < connCount; j++) {
          const target = Math.floor(Math.random() * nodeCount)
          if (target !== i && !node.connections.includes(target)) {
            node.connections.push(target)
          }
        }
      })

      // Animation variables
      let animationFrameId: number
      let lastFrameTime = 0
      const targetFPS = isLowPerformance ? 30 : 60
      const frameInterval = 1000 / targetFPS

      // Animation function
      const animate = (timestamp: number) => {
        if (!inView) {
          animationFrameId = requestAnimationFrame(animate)
          return
        }

        // Throttle frame rate
        if (timestamp - lastFrameTime < frameInterval) {
          animationFrameId = requestAnimationFrame(animate)
          return
        }

        lastFrameTime = timestamp

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio)

        // Update and draw nodes
        nodes.forEach((node, i) => {
          // Update position
          node.x += node.vx
          node.y += node.vy

          // Bounce off edges
          if (node.x < 0 || node.x > canvas.width / window.devicePixelRatio) node.vx = -node.vx
          if (node.y < 0 || node.y > canvas.height / window.devicePixelRatio) node.vy = -node.vy

          // Draw connections
          node.connections.forEach((targetIndex) => {
            const target = nodes[targetIndex]
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(target.x, target.y)
            ctx.strokeStyle = `rgba(0, 229, 255, 0.2)`
            ctx.lineWidth = 0.5
            ctx.stroke()
          })

          // Draw node
          ctx.beginPath()
          ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
          ctx.fillStyle = node.color
          ctx.fill()
        })

        animationFrameId = requestAnimationFrame(animate)
      }

      // Start animation
      animationFrameId = requestAnimationFrame(animate)
      setIsLoaded(true)

      // Cleanup
      return () => {
        window.removeEventListener("resize", handleResize)
        cancelAnimationFrame(animationFrameId)
      }
    } catch (err) {
      console.error("Neural network animation error:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
    }
  }, [inView, isLowPerformance])

  // Fallback for errors or reduced motion
  if (error || (prefersReducedMotion && !isLoaded)) {
    return (
      <div
        className="w-full h-full bg-gradient-to-b from-primary/10 to-primary/5 rounded-lg"
        aria-label="Neural network visualization (static)"
      />
    )
  }

  return (
    <div ref={ref} className="w-full h-full relative">
      <canvas ref={canvasRef} className="w-full h-full rounded-lg" aria-label="Neural network visualization" />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}
