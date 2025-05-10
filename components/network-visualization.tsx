"use client"

import { useEffect, useRef, useState, useMemo, useCallback } from "react"
import { useInView } from "react-intersection-observer"
import { usePerformance } from "@/contexts/performance-context"
import { throttle } from "@/lib/performance-utils"

interface Connection {
  toNodeId: number
  strength: number
  lastUsed: number
  useCount: number
}

interface Node {
  id: number
  x: number
  y: number
  z: number
  size: number
  color: string
  vx: number
  vy: number
  vz: number
  connections: Connection[]
  lastActivated: number
  activationLevel: number
}

interface Signal {
  fromNode: number
  toNode: number
  progress: number
  speed: number
  color: string
  size: number
  createdAt: number
  connectionStrength: number
}

export function NetworkVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { performanceMode, nodeCount, connectionCount, frameRate, enableAnimations, enableBackgroundEffects } =
    usePerformance()
  const nodesRef = useRef<Node[]>([])
  const signalsRef = useRef<Signal[]>([])
  const animationRef = useRef<number>(0)
  const dimensionsRef = useRef({ width: 1000, height: 800 })
  const speedMultiplier = useRef(0.25)
  const densityMultiplier = useRef(2.0) // Slightly reduced density
  const currentTheme = useRef<string>("tech")
  const lastSignalTime = useRef<number>(0)
  const learningRate = useRef(0.05)
  const forgettingRate = useRef(0.0005)
  const lastFrameTime = useRef<number>(0)
  const frameCount = useRef<number>(0)
  const [isLowPerfDevice, setIsLowPerfDevice] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const projectionCache = useRef(new Map<string, any>())

  // Use IntersectionObserver to only animate when visible
  const { ref: inViewRef, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
    rootMargin: "200px", // Start loading before it's visible
  })

  // Performance optimization: Detect low-performance devices
  useEffect(() => {
    // Check if device is likely to be low performance
    const checkPerformance = () => {
      // Check for mobile devices
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

      // Check for low-end devices by processor count
      const isLowEndDevice = navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 4

      // Check for battery saving mode if available
      const checkBatterySaving = async () => {
        if ("getBattery" in navigator) {
          try {
            // @ts-ignore - getBattery is not in the standard navigator type
            const battery = await navigator.getBattery()
            if (battery.charging === false && battery.level < 0.2) {
              return true // Low battery, likely in power saving
            }
          } catch (e) {
            // Ignore errors
          }
        }
        return false
      }

      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

      // Set low performance mode if any conditions are met
      checkBatterySaving().then((isBatterySaving) => {
        setIsLowPerfDevice(isMobile || isLowEndDevice || prefersReducedMotion || isBatterySaving)
      })
    }

    checkPerformance()

    // Listen for reduced motion preference changes
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const handleReducedMotionChange = () => {
      setIsLowPerfDevice(reducedMotionQuery.matches)
    }

    reducedMotionQuery.addEventListener("change", handleReducedMotionChange)

    return () => {
      reducedMotionQuery.removeEventListener("change", handleReducedMotionChange)
    }
  }, [])

  // Optimize node generation
  const generateNodes = useCallback(() => {
    if (typeof window === "undefined") return

    // Calculate node count based on screen size, density, and performance
    const baseNodeCount = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 20000), 120)
    const performanceFactor = isLowPerfDevice ? 0.3 : 1
    const nodeCountAdjusted = Math.max(15, Math.floor(baseNodeCount * densityMultiplier.current * performanceFactor))
    const nodeCountToUse = nodeCount || nodeCountAdjusted

    const newNodes: Node[] = []

    // Pre-allocate array for better performance
    newNodes.length = nodeCountToUse

    for (let i = 0; i < nodeCountToUse; i++) {
      newNodes[i] = {
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        z: Math.random() * 500 - 250,
        size: Math.random() * 3 + 1.5,
        color: getRandomColor(),
        vx: (Math.random() - 0.5) * 0.005,
        vy: (Math.random() - 0.5) * 0.005,
        vz: (Math.random() - 0.5) * 0.002,
        connections: [],
        lastActivated: 0,
        activationLevel: 0,
      }
    }

    // Create connections more efficiently
    for (let i = 0; i < newNodes.length; i++) {
      // Fewer connections for better performance
      const connectionCountToUse = connectionCount || Math.floor(Math.random() * 3) + 5
      const connections: Connection[] = []

      // Find potential connections more efficiently
      const potentialConnections = new Array(Math.min(15, newNodes.length - 1))
      let potentialIdx = 0

      // Get a random sample of nodes instead of sorting the entire array
      const visited = new Set([i])
      while (potentialIdx < potentialConnections.length) {
        const randIdx = Math.floor(Math.random() * newNodes.length)
        if (!visited.has(randIdx)) {
          potentialConnections[potentialIdx++] = randIdx
          visited.add(randIdx)
        }
      }

      for (let j = 0; j < Math.min(connectionCountToUse, potentialConnections.length); j++) {
        connections.push({
          toNodeId: potentialConnections[j],
          strength: 0.2 + Math.random() * 0.3,
          lastUsed: Date.now(),
          useCount: 0,
        })
      }

      newNodes[i].connections = connections
    }

    // Add fewer long-range connections
    const longRangeConnectionCount = Math.floor(newNodes.length * 0.1)

    for (let i = 0; i < longRangeConnectionCount; i++) {
      const fromNodeIndex = Math.floor(Math.random() * newNodes.length)
      const fromNode = newNodes[fromNodeIndex]

      // Find a distant node more efficiently
      let maxDistance = 0
      let distantNodeIndex = -1

      // Sample a few random nodes instead of checking all
      for (let j = 0; j < 10; j++) {
        const randIdx = Math.floor(Math.random() * newNodes.length)
        if (randIdx !== fromNodeIndex) {
          const distance = Math.hypot(
            newNodes[randIdx].x - fromNode.x,
            newNodes[randIdx].y - fromNode.y,
            newNodes[randIdx].z - fromNode.z,
          )
          if (distance > maxDistance) {
            maxDistance = distance
            distantNodeIndex = randIdx
          }
        }
      }

      if (distantNodeIndex >= 0) {
        fromNode.connections.push({
          toNodeId: distantNodeIndex,
          strength: 0.3 + Math.random() * 0.2,
          lastUsed: Date.now(),
          useCount: 0,
        })
      }
    }

    // Initialize a few active nodes
    for (let i = 0; i < Math.min(2, newNodes.length); i++) {
      const randomIndex = Math.floor(Math.random() * newNodes.length)
      newNodes[randomIndex].activationLevel = 0.7
      newNodes[randomIndex].lastActivated = Date.now()
    }

    nodesRef.current = newNodes
    signalsRef.current = []
  }, [isLowPerfDevice, nodeCount, connectionCount])

  // Initialize with performance considerations
  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current) {
        // For low-performance devices, use a lower resolution canvas
        const scaleFactor = isLowPerfDevice ? 0.6 : 0.8

        const width = window.innerWidth
        const height = window.innerHeight

        dimensionsRef.current = {
          width: width,
          height: height,
        }

        // Set actual canvas size with scaling for performance
        canvasRef.current.width = width * scaleFactor
        canvasRef.current.height = height * scaleFactor

        // Scale the canvas to fill the viewport
        canvasRef.current.style.width = `${width}px`
        canvasRef.current.style.height = `${height}px`
      }
    }

    updateDimensions()
    generateNodes()

    // Only start animation if in view
    if (inView) {
      startAnimation()
    }

    // Throttle resize events for better performance
    let resizeTimeout: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        updateDimensions()
        generateNodes()
      }, 300) // Longer debounce for better performance
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      clearTimeout(resizeTimeout)
      cancelAnimationFrame(animationRef.current)
    }
  }, [generateNodes, inView, isLowPerfDevice])

  // Handle visibility changes to pause animation when tab is not visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden)
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  // Update animation when visibility or pause state changes
  useEffect(() => {
    if (isVisible && inView && !isPaused) {
      startAnimation()
    } else {
      cancelAnimationFrame(animationRef.current)
    }
  }, [isVisible, inView, isPaused])

  // Memoized helper functions
  const calculateBlur = useCallback(
    (z: number) => {
      // Disable blur on low-performance devices
      if (isLowPerfDevice) return 0

      const normalizedZ = (z + 250) / 500
      return Math.max(0, 1.5 * (1 - normalizedZ))
    },
    [isLowPerfDevice],
  )

  const findConnection = useCallback((fromNodeId: number, toNodeId: number): Connection | null => {
    const fromNode = nodesRef.current[fromNodeId]
    if (!fromNode) return null

    const connection = fromNode.connections.find((conn) => conn.toNodeId === toNodeId)
    return connection || null
  }, [])

  const strengthenConnection = useCallback((fromNodeId: number, toNodeId: number) => {
    const fromNode = nodesRef.current[fromNodeId]
    if (!fromNode) return

    const connectionIndex = fromNode.connections.findIndex((conn) => conn.toNodeId === toNodeId)
    if (connectionIndex === -1) return

    const connection = fromNode.connections[connectionIndex]
    connection.strength = Math.min(1, connection.strength + learningRate.current * speedMultiplier.current)
    connection.lastUsed = Date.now()
    connection.useCount++
    fromNode.connections[connectionIndex] = connection
  }, [])

  const createSignal = useCallback(
    (fromNodeId: number, toNodeId: number) => {
      // Limit signals for performance
      if (signalsRef.current.length > (isLowPerfDevice ? 1 : 3)) return

      const fromNode = nodesRef.current[fromNodeId]
      if (!fromNode) return

      const connection = findConnection(fromNodeId, toNodeId)
      if (!connection) return

      const signalColor = fromNode.color.replace(/rgba\((\d+),\s*(\d+),\s*(\d+).*/, `rgba($1, $2, $3, 0.8)`)

      signalsRef.current.push({
        fromNode: fromNodeId,
        toNode: toNodeId,
        progress: 0,
        speed: 0.002 + Math.random() * 0.003,
        color: signalColor,
        size: 0.8 + Math.random() * 1.2,
        createdAt: Date.now(),
        connectionStrength: connection.strength,
      })

      strengthenConnection(fromNodeId, toNodeId)
    },
    [findConnection, isLowPerfDevice, strengthenConnection],
  )

  const draw = useCallback(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true, // Potential performance improvement
    })

    if (!ctx) return

    // Performance optimization: Use a lower quality context on low-performance devices
    if (isLowPerfDevice && ctx.imageSmoothingQuality) {
      ctx.imageSmoothingQuality = "low"
    }

    const perspective = 800
    const rotationSpeed = 0.00001
    let rotationAngle = 0

    const project = (x: number, y: number, z: number) => {
      // Round coordinates to reduce cache misses
      const roundedX = Math.round(x * 5) / 5
      const roundedY = Math.round(y * 5) / 5
      const roundedZ = Math.round(z * 5) / 5

      // Create a cache key
      const cacheKey = `${roundedX},${roundedY},${roundedZ},${rotationAngle.toFixed(2)}`

      // Check if projection is cached
      if (projectionCache.current.has(cacheKey)) {
        return projectionCache.current.get(cacheKey)
      }

      // Calculate projection
      const rotatedX = roundedX * Math.cos(rotationAngle) - roundedZ * Math.sin(rotationAngle)
      const rotatedZ = roundedZ * Math.cos(rotationAngle) + rotatedX * Math.sin(rotationAngle)

      const factor = perspective / (perspective + rotatedZ)
      const projectedX = rotatedX * factor + canvas.width / 2
      const projectedY = roundedY * factor + canvas.height / 2

      const result = {
        x: projectedX,
        y: projectedY,
        factor: factor,
        z: rotatedZ,
      }

      // Cache the result (limit cache size)
      if (projectionCache.current.size > 500) {
        // Clear cache if it gets too large
        projectionCache.current.clear()
      }
      projectionCache.current.set(cacheKey, result)

      return result
    }

    // Optimized drawing functions
    const drawConnection = (
      ctx: CanvasRenderingContext2D,
      fromNode: Node,
      toNode: Node,
      connection: Connection,
      fromProjected: any,
      toProjected: any,
    ) => {
      // Skip drawing very weak connections
      if (connection.strength < 0.25) return

      const avgDepth = (fromNode.z + toNode.z) / 2
      const depthFactor = 1 - Math.min(0.8, Math.abs(avgDepth) / 500)

      // Skip blur on low-performance devices
      const blurAmount = calculateBlur(avgDepth)

      const fromOpacity = 0.1 + fromNode.activationLevel * 0.2
      const toOpacity = 0.1 + toNode.activationLevel * 0.2

      // Use simple colors for better performance
      const strengthFactor = 0.5 + connection.strength * 0.5
      const opacity = Math.min(0.8, ((fromOpacity + toOpacity) / 2) * depthFactor * strengthFactor)

      // Use a simple color instead of gradient for better performance
      ctx.strokeStyle = fromNode.color.replace(/rgba\((\d+),\s*(\d+),\s*(\d+).*/, `rgba($1, $2, $3, ${opacity})`)

      const dx = fromProjected.x - toProjected.x
      const dy = fromProjected.y - toProjected.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      const baseWidth = Math.max(0.2, (1 - distance / 800) * depthFactor * 0.8)
      const strengthWidth = baseWidth * (0.5 + connection.strength * 2)

      // Apply blur only on higher-performance devices
      if (!isLowPerfDevice && blurAmount > 0.1) {
        ctx.filter = `blur(${blurAmount * 0.7}px)`
      } else {
        ctx.filter = "none"
      }

      ctx.beginPath()
      ctx.moveTo(fromProjected.x, fromProjected.y)
      ctx.lineTo(toProjected.x, toProjected.y)
      ctx.lineWidth = strengthWidth
      ctx.stroke()

      // Add glow effect only for strong connections and not on low-performance devices
      if (!isLowPerfDevice && connection.strength > 0.9) {
        ctx.shadowColor = fromNode.color.replace(/rgba\((\d+),\s*(\d+),\s*(\d+).*/, `rgba($1, $2, $3, 0.5)`)
        ctx.shadowBlur = 3 * connection.strength * depthFactor

        ctx.beginPath()
        ctx.moveTo(fromProjected.x, fromProjected.y)
        ctx.lineTo(toProjected.x, toProjected.y)
        ctx.lineWidth = strengthWidth * 0.7
        ctx.stroke()

        ctx.shadowBlur = 0
      }

      ctx.filter = "none"
    }

    const drawNode = (ctx: CanvasRenderingContext2D, node: Node, projected: any) => {
      const depthFactor = projected.factor

      // Skip blur on low-performance devices
      const blurAmount = calculateBlur(node.z)

      // Simplified size calculation
      const activationBoost = node.activationLevel * 0.3
      const effectiveSize = (node.size + activationBoost) * depthFactor

      // Apply blur only on higher-performance devices
      if (!isLowPerfDevice && blurAmount > 0.1) {
        ctx.filter = `blur(${blurAmount}px)`
      } else {
        ctx.filter = "none"
      }

      ctx.beginPath()
      ctx.arc(projected.x, projected.y, effectiveSize, 0, Math.PI * 2)

      // Simplified glow effect for better performance
      if (!isLowPerfDevice && node.activationLevel > 0.5) {
        const shadowColor = node.color.replace(/rgba\((\d+),\s*(\d+),\s*(\d+).*/, "rgb($1, $2, $3)")
        const glowIntensity = 1.5 + node.activationLevel * 3
        ctx.shadowColor = shadowColor
        ctx.shadowBlur = effectiveSize * glowIntensity * depthFactor
      }

      // Use simple fill instead of gradient for better performance
      const brightness = 0.8 + node.activationLevel * 0.2
      ctx.fillStyle = node.color.replace("0.8", brightness.toString())
      ctx.fill()

      ctx.shadowBlur = 0
      ctx.filter = "none"

      // Add highlight only for highly activated nodes and not on low-performance devices
      if (!isLowPerfDevice && node.activationLevel > 0.6) {
        ctx.beginPath()
        ctx.arc(projected.x, projected.y, effectiveSize * 0.3, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${(0.5 + node.activationLevel * 0.5) * depthFactor})`
        ctx.fill()
      }
    }

    const drawSignal = (
      ctx: CanvasRenderingContext2D,
      signal: Signal,
      position: { x: number; y: number; z: number },
      projected: any,
    ) => {
      // Skip blur on low-performance devices
      const blurAmount = calculateBlur(position.z)
      const depthFactor = projected.factor

      // Apply blur only on higher-performance devices
      if (!isLowPerfDevice && blurAmount > 0.1) {
        ctx.filter = `blur(${blurAmount * 0.5}px)`
      } else {
        ctx.filter = "none"
      }

      const strengthSize = signal.size * (0.8 + signal.connectionStrength * 0.8)

      ctx.beginPath()
      ctx.arc(projected.x, projected.y, strengthSize * depthFactor, 0, Math.PI * 2)

      // Add glow only on higher-performance devices
      if (!isLowPerfDevice) {
        ctx.shadowColor = signal.color
        ctx.shadowBlur = strengthSize * 2.5 * depthFactor
      }

      ctx.fillStyle = signal.color
      ctx.fill()

      ctx.shadowBlur = 0
      ctx.filter = "none"

      // Add highlight only on higher-performance devices
      if (!isLowPerfDevice) {
        ctx.beginPath()
        ctx.arc(projected.x, projected.y, strengthSize * 0.5 * depthFactor, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
        ctx.fill()
      }
    }

    // Animation function with performance optimizations
    const animate = (timestamp: number) => {
      // Skip animation if paused or not visible
      if (!isVisible || isPaused || !inView) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      // Calculate delta time for consistent animations regardless of frame rate
      const deltaTime = timestamp - (lastFrameTime.current || timestamp)
      lastFrameTime.current = timestamp

      // Skip frames on low-performance devices
      frameCount.current++
      if (isLowPerfDevice && frameCount.current % 4 !== 0) {
        // Skip more frames
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      // Update rotation angle based on delta time for consistent speed
      rotationAngle += rotationSpeed * speedMultiplier.current * (deltaTime / 16.67)

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const nodes = nodesRef.current
      const signals = signalsRef.current

      // Performance optimization: Process nodes in batches
      const nodeBatchSize = isLowPerfDevice ? 5 : 15
      const currentTime = Date.now()

      // Update only a subset of nodes each frame
      const startNodeIndex = frameCount.current % nodeBatchSize
      const endNodeIndex = Math.min(nodes.length, startNodeIndex + Math.ceil(nodes.length / nodeBatchSize))

      for (let i = startNodeIndex; i < endNodeIndex; i++) {
        const node = nodes[i]

        // Update position with delta time for consistent speed
        node.x += node.vx * speedMultiplier.current * (deltaTime / 16.67)
        node.y += node.vy * speedMultiplier.current * (deltaTime / 16.67)
        node.z += node.vz * speedMultiplier.current * (deltaTime / 16.67)

        // Bounce off edges
        if (node.x < 0 || node.x > dimensionsRef.current.width) {
          node.vx = -node.vx
          node.x = Math.max(0, Math.min(dimensionsRef.current.width, node.x))
        }

        if (node.y < 0 || node.y > dimensionsRef.current.height) {
          node.vy = -node.vy
          node.y = Math.max(0, Math.min(dimensionsRef.current.height, node.y))
        }

        if (node.z < -250 || node.z > 250) {
          node.vz = -node.vz
          node.z = Math.max(-250, Math.min(250, node.z))
        }

        // Decay activation level
        if (node.activationLevel > 0) {
          node.activationLevel = Math.max(
            0,
            node.activationLevel - 0.0005 * speedMultiplier.current * (deltaTime / 16.67), // Slow decay
          )

          // Reduce signal creation frequency for better performance
          if (node.activationLevel > 0.5 && Math.random() < 0.0005 * speedMultiplier.current) {
            // Very low probability for better performance
            if (node.connections.length > 0) {
              // Select a connection with higher probability for stronger connections
              const weightedConnections = [...node.connections].sort((a, b) => {
                return 0.8 * (b.strength - a.strength) + 0.2 * (Math.random() - 0.5)
              })

              // Send signal along the strongest connection
              if (weightedConnections.length > 0 && Math.random() < weightedConnections[0].strength) {
                createSignal(node.id, weightedConnections[0].toNodeId)
              }
            }
          }
        }

        // Process connections less frequently for better performance
        if (frameCount.current % 180 === 0) {
          // Much less frequent updates
          // Apply forgetting - weaken unused connections over time
          for (let j = 0; j < node.connections.length; j++) {
            const connection = node.connections[j]
            const timeSinceUsed = currentTime - connection.lastUsed

            if (timeSinceUsed > 30000) {
              // Much longer time before weakening
              connection.strength = Math.max(
                0.1,
                connection.strength - forgettingRate.current * speedMultiplier.current,
              )
              node.connections[j] = connection
            }
          }
        }
      }

      // Randomly activate nodes occasionally
      if (currentTime - lastSignalTime.current > (isLowPerfDevice ? 8000 : 6000) / speedMultiplier.current) {
        // Less frequent activation
        const randomNodeIndex = Math.floor(Math.random() * nodes.length)
        nodes[randomNodeIndex].activationLevel = 0.7
        nodes[randomNodeIndex].lastActivated = currentTime

        // Create signals to connected nodes (limit for performance)
        const maxSignals = isLowPerfDevice ? 1 : 2
        let signalsCreated = 0

        for (const connection of nodes[randomNodeIndex].connections) {
          if (signalsCreated < maxSignals && Math.random() < connection.strength * 0.7) {
            createSignal(randomNodeIndex, connection.toNodeId)
            signalsCreated++
          }
        }

        lastSignalTime.current = currentTime
      }

      // Update signals with delta time for consistent speed
      for (let i = signals.length - 1; i >= 0; i--) {
        const signal = signals[i]
        signal.progress += signal.speed * speedMultiplier.current * (deltaTime / 16.67)

        if (signal.progress >= 1) {
          const toNode = nodes[signal.toNode]
          if (toNode) {
            toNode.activationLevel = 0.7
            toNode.lastActivated = currentTime
          }
          signals.splice(i, 1)
        }
      }

      // Performance optimization: Only collect visible objects
      const visibleObjects: Array<{
        type: "node" | "connection" | "signal"
        z: number
        renderData: any
      }> = []

      // Use a visibility culling approach
      const isInViewport = (x: number, y: number, margin = 100) => {
        return x >= -margin && x <= canvas.width + margin && y >= -margin && y <= canvas.height + margin
      }

      // Collect visible nodes
      for (const node of nodes) {
        const projected = project(
          node.x - dimensionsRef.current.width / 2,
          node.y - dimensionsRef.current.height / 2,
          node.z,
        )

        if (isInViewport(projected.x, projected.y)) {
          visibleObjects.push({
            type: "node",
            z: projected.z,
            renderData: { node, projected },
          })
        }
      }

      // Collect visible connections (only if both nodes are visible)
      const processedConnections = new Set<string>()

      for (const node of nodes) {
        const fromProjected = project(
          node.x - dimensionsRef.current.width / 2,
          node.y - dimensionsRef.current.height / 2,
          node.z,
        )

        if (!isInViewport(fromProjected.x, fromProjected.y, 150)) continue

        for (const connection of node.connections) {
          const connectedNode = nodes[connection.toNodeId]
          if (!connectedNode) continue

          // Skip if we've already processed this connection
          const connectionKey = `${Math.min(node.id, connectedNode.id)}-${Math.max(node.id, connectedNode.id)}`
          if (processedConnections.has(connectionKey)) continue
          processedConnections.add(connectionKey)

          const toProjected = project(
            connectedNode.x - dimensionsRef.current.width / 2,
            connectedNode.y - dimensionsRef.current.height / 2,
            connectedNode.z,
          )

          if (!isInViewport(toProjected.x, toProjected.y, 150)) continue

          const avgZ = (fromProjected.z + toProjected.z) / 2

          visibleObjects.push({
            type: "connection",
            z: avgZ,
            renderData: {
              fromNode: node,
              toNode: connectedNode,
              connectionData: connection,
              fromProjected,
              toProjected,
            },
          })
        }
      }

      // Collect visible signals
      for (const signal of signals) {
        const fromNode = nodes[signal.fromNode]
        const toNode = nodes[signal.toNode]

        if (!fromNode || !toNode) continue

        // Interpolate position
        const x = fromNode.x + (toNode.x - fromNode.x) * signal.progress
        const y = fromNode.y + (toNode.y - fromNode.y) * signal.progress
        const z = fromNode.z + (toNode.z - fromNode.z) * signal.progress

        const projected = project(x - dimensionsRef.current.width / 2, y - dimensionsRef.current.height / 2, z)

        if (isInViewport(projected.x, projected.y)) {
          visibleObjects.push({
            type: "signal",
            z: projected.z,
            renderData: {
              signal,
              position: { x, y, z },
              projected,
            },
          })
        }
      }

      // Sort objects by Z (furthest first)
      // Only sort if we have more than a few objects for performance
      if (visibleObjects.length > 10) {
        visibleObjects.sort((a, b) => b.z - a.z)
      }

      // Draw all objects in order
      for (const obj of visibleObjects) {
        if (obj.type === "connection") {
          const data = obj.renderData
          drawConnection(ctx, data.fromNode, data.toNode, data.connectionData, data.fromProjected, data.toProjected)
        } else if (obj.type === "node") {
          drawNode(ctx, obj.renderData.node, obj.renderData.projected)
        } else if (obj.type === "signal") {
          drawSignal(ctx, obj.renderData.signal, obj.renderData.position, obj.renderData.projected)
        }
      }
    }
  }, [isLowPerfDevice, isVisible, isPaused, inView, calculateBlur, createSignal])

  const throttledDraw = useMemo(() => throttle(draw, 1000 / frameRate), [draw, frameRate])

  function startAnimation() {
    if (!enableAnimations) return
    throttledDraw()
    animationRef.current = requestAnimationFrame(startAnimation)
  }

  // Use requestAnimationFrame only if animations are enabled
  useEffect(() => {
    if (!canvasRef.current || !enableAnimations) return

    let animationFrameId: number

    const animate = () => {
      throttledDraw()
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [throttledDraw, enableAnimations])

  // If animations are disabled, just draw once
  useEffect(() => {
    if (!enableAnimations && canvasRef.current) {
      draw()
    }
  }, [draw, enableAnimations])

  function getRandomColor() {
    // Simplified color themes for better performance
    const colorThemes = {
      tech: [
        "rgba(0, 229, 255, 0.8)", // Cyan
        "rgba(0, 153, 204, 0.8)", // Blue
        "rgba(0, 102, 153, 0.8)", // Dark Blue
      ],
      ocean: [
        "rgba(0, 229, 255, 0.8)", // Cyan
        "rgba(0, 153, 204, 0.8)", // Blue
      ],
    }

    // Use a simpler theme for low-performance devices
    const theme = isLowPerfDevice ? "ocean" : currentTheme.current
    const colors = colorThemes[theme as keyof typeof colorThemes]

    // Reduce accent nodes on low-performance devices
    if (!isLowPerfDevice && Math.random() < 0.03) {
      return "rgba(255, 255, 255, 0.9)" // Bright white accent
    }

    return colors[Math.floor(Math.random() * colors.length)]
  }

  return (
    <div ref={inViewRef} className={`w-full h-full ${enableBackgroundEffects ? "opacity-100" : "opacity-50"}`}>
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full z-0" style={{ background: "black" }} />
    </div>
  )
}

export default NetworkVisualization
