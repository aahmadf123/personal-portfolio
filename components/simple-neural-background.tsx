"use client"

import { useEffect, useRef } from "react"
import { usePerformance } from "@/contexts/performance-context"

interface Node {
  x: number
  y: number
  radius: number
  color: string
  vx: number
  vy: number
}

interface Connection {
  from: Node
  to: Node
  opacity: number
}

interface DataPacket {
  connection: Connection
  position: number
  speed: number
  size: number
  color: string
}

export function SimpleNeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { performanceLevel } = usePerformance()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    // Initial resize
    resizeCanvas()

    // Handle window resize
    window.addEventListener("resize", resizeCanvas)

    // Neural network parameters
    const nodes: Node[] = []
    const connections: Connection[] = []
    const nodeCount = performanceLevel === "high" ? 150 : performanceLevel === "medium" ? 100 : 50
    const connectionDistance = performanceLevel === "high" ? 150 : performanceLevel === "medium" ? 100 : 75

    // Data packets for information transfer animation
    const dataPackets: DataPacket[] = []
    const maxDataPackets = 15 // Increased back to 15 for more simultaneous transfers

    // Node class
    class NodeClass implements Node {
      x: number
      y: number
      radius: number
      color: string
      vx: number
      vy: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.radius = Math.random() * 1.5 + 1
        this.color = `rgba(160, 120, 255, ${0.5 + Math.random() * 0.5})`
        // Keep reduced velocity for slower node movement
        this.vx = (Math.random() - 0.5) * 0.15
        this.vy = (Math.random() - 0.5) * 0.15
      }

      update() {
        // Move node
        this.x += this.vx
        this.y += this.vy

        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy
      }

      draw() {
        ctx!.beginPath()
        ctx!.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx!.fillStyle = this.color
        ctx!.fill()
      }
    }

    // Connection class
    class ConnectionClass implements Connection {
      from: Node
      to: Node
      opacity: number

      constructor(from: Node, to: Node) {
        this.from = from
        this.to = to
        this.opacity = 0.1 + Math.random() * 0.2
      }

      draw() {
        const dx = this.from.x - this.to.x
        const dy = this.from.y - this.to.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Only draw if nodes are close enough
        if (distance < connectionDistance) {
          // Opacity based on distance
          const opacity = this.opacity * (1 - distance / connectionDistance)

          ctx!.beginPath()
          ctx!.moveTo(this.from.x, this.from.y)
          ctx!.lineTo(this.to.x, this.to.y)
          ctx!.strokeStyle = `rgba(160, 120, 255, ${opacity})`
          ctx!.lineWidth = 0.5
          ctx!.stroke()
        }
      }

      getDistance(): number {
        const dx = this.from.x - this.to.x
        const dy = this.from.y - this.to.y
        return Math.sqrt(dx * dx + dy * dy)
      }
    }

    // Data Packet class for information transfer animation
    class DataPacketClass implements DataPacket {
      connection: Connection
      position: number // 0 to 1, representing position along the connection
      speed: number
      size: number
      color: string

      constructor(connection: Connection) {
        this.connection = connection
        this.position = 0
        // Significantly increased speed for much faster data transfer
        this.speed = 0.015 + Math.random() * 0.025
        // Slightly larger size for better visibility
        this.size = 2 + Math.random() * 1.5
        // Brighter white color for better visibility
        this.color = `rgba(255, 255, 255, ${0.8 + Math.random() * 0.2})`
      }

      update() {
        this.position += this.speed
        return this.position >= 1 // Return true when packet reaches destination
      }

      draw() {
        const distance = this.connection.getDistance()

        // Only draw if connection is visible
        if (distance < connectionDistance) {
          // Calculate position along the line
          const x = this.connection.from.x + (this.connection.to.x - this.connection.from.x) * this.position
          const y = this.connection.from.y + (this.connection.to.y - this.connection.from.y) * this.position

          // Draw the data packet
          ctx!.beginPath()
          ctx!.arc(x, y, this.size, 0, Math.PI * 2)
          ctx!.fillStyle = this.color
          ctx!.fill()
        }
      }
    }

    // Initialize nodes
    for (let i = 0; i < nodeCount; i++) {
      nodes.push(new NodeClass())
    }

    // Create connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        connections.push(new ConnectionClass(nodes[i], nodes[j]))
      }
    }

    // Occasionally create new data packets
    const createDataPacket = () => {
      // Only create new packets if we're under the limit
      if (dataPackets.length < maxDataPackets) {
        // Find a visible connection
        const visibleConnections = connections.filter((conn) => conn.getDistance() < connectionDistance)

        if (visibleConnections.length > 0) {
          // Select a random visible connection
          const randomConnection = visibleConnections[Math.floor(Math.random() * visibleConnections.length)]
          dataPackets.push(new DataPacketClass(randomConnection))
        }
      }

      // More frequent packet creation to simulate rapid brain activity
      setTimeout(createDataPacket, 300 + Math.random() * 700)
    }

    // Start creating data packets
    createDataPacket()

    // Animation loop with reduced frame rate for slower overall animation
    let animationFrameId: number
    let lastFrameTime = 0
    const frameInterval = 40 // ~25 fps instead of 60fps for smoother animation

    const animate = (timestamp: number) => {
      // Only render every frameInterval ms
      if (timestamp - lastFrameTime < frameInterval) {
        animationFrameId = requestAnimationFrame(animate)
        return
      }

      lastFrameTime = timestamp

      // Clear canvas with black background
      ctx.fillStyle = "rgba(0, 0, 0, 1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw nodes
      nodes.forEach((node) => {
        if (node instanceof NodeClass) {
          node.update()
          node.draw()
        }
      })

      // Draw connections
      connections.forEach((connection) => {
        connection.draw()
      })

      // Update and draw data packets
      for (let i = dataPackets.length - 1; i >= 0; i--) {
        const packet = dataPackets[i]
        const completed = packet.update()

        // Remove completed packets
        if (completed) {
          dataPackets.splice(i, 1)
        } else {
          packet.draw()
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    // Start animation
    animationFrameId = requestAnimationFrame(animate)

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [performanceLevel])

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 bg-black" style={{ display: "block" }} />
}
