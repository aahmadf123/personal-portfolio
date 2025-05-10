"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

interface NeuralLogoProps {
  size?: number
  className?: string
  animated?: boolean
  primaryColor?: string
  secondaryColor?: string
  tertiaryColor?: string
  interactive?: boolean
  complexity?: "low" | "medium" | "high"
}

export function NeuralLogo({
  size = 40,
  className,
  animated = true,
  primaryColor = "#38bdf8",
  secondaryColor = "#0ea5e9",
  tertiaryColor = "#0284c7",
  interactive = false,
  complexity = "medium",
}: NeuralLogoProps) {
  const svgSize = size
  const [isHovered, setIsHovered] = useState(false)
  const [nodes, setNodes] = useState<Array<{ x: number; y: number; r: number }>>([])
  const [connections, setConnections] = useState<Array<{ x1: number; y1: number; x2: number; y2: number }>>([])

  // Generate nodes and connections based on complexity
  useEffect(() => {
    const nodeCount = complexity === "low" ? 5 : complexity === "medium" ? 8 : 12
    const newNodes: Array<{ x: number; y: number; r: number }> = []

    // Create central node
    newNodes.push({ x: 50, y: 50, r: 4 })

    // Create surrounding nodes
    for (let i = 1; i < nodeCount; i++) {
      const angle = (i * 2 * Math.PI) / (nodeCount - 1)
      const radius = 25 + Math.random() * 15
      const x = 50 + radius * Math.cos(angle)
      const y = 50 + radius * Math.sin(angle)
      const r = 2 + Math.random() * 2
      newNodes.push({ x, y, r })
    }

    setNodes(newNodes)

    // Create connections
    const newConnections: Array<{ x1: number; y1: number; x2: number; y2: number }> = []

    // Connect central node to all others
    for (let i = 1; i < newNodes.length; i++) {
      newConnections.push({
        x1: newNodes[0].x,
        y1: newNodes[0].y,
        x2: newNodes[i].x,
        y2: newNodes[i].y,
      })
    }

    // Add some random connections between non-central nodes
    const connectionCount = complexity === "low" ? 2 : complexity === "medium" ? 4 : 8
    for (let i = 0; i < connectionCount; i++) {
      const node1 = 1 + Math.floor(Math.random() * (newNodes.length - 1))
      let node2 = 1 + Math.floor(Math.random() * (newNodes.length - 1))
      while (node2 === node1) {
        node2 = 1 + Math.floor(Math.random() * (newNodes.length - 1))
      }

      newConnections.push({
        x1: newNodes[node1].x,
        y1: newNodes[node1].y,
        x2: newNodes[node2].x,
        y2: newNodes[node2].y,
      })
    }

    setConnections(newConnections)
  }, [complexity])

  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {animated ? (
        <motion.svg
          width={svgSize}
          height={svgSize}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          initial={{ opacity: 0.9 }}
          animate={{
            opacity: 1,
            scale: interactive && isHovered ? 1.05 : 1,
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
          className="relative"
        >
          {/* Background circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            stroke={primaryColor}
            strokeWidth="1"
            strokeDasharray="2 2"
            fill="transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 1 }}
          />

          {/* Connections */}
          {connections.map((connection, i) => (
            <motion.line
              key={i}
              x1={connection.x1}
              y1={connection.y1}
              x2={connection.x2}
              y2={connection.y2}
              stroke={i % 2 === 0 ? primaryColor : secondaryColor}
              strokeWidth="1"
              strokeDasharray="2 2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: 1,
                opacity: 0.6,
                strokeDashoffset: [0, -10],
              }}
              transition={{
                pathLength: { duration: 1, delay: 0.1 * i },
                opacity: { duration: 1, delay: 0.1 * i },
                strokeDashoffset: {
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                  delay: 0.1 * i,
                },
              }}
            />
          ))}

          {/* Data flow animations */}
          {connections.map((connection, i) => (
            <motion.circle
              key={i}
              r="1.5"
              fill={i % 2 === 0 ? secondaryColor : tertiaryColor}
              animate={{
                cx: [connection.x1, connection.x2],
                cy: [connection.y1, connection.y2],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.3,
                ease: "easeInOut",
                repeatDelay: Math.random() * 2,
              }}
            />
          ))}

          {/* Nodes */}
          {nodes.map((node, i) => (
            <motion.circle
              key={i}
              cx={node.x}
              cy={node.y}
              r={node.r}
              fill={i === 0 ? primaryColor : i % 2 === 0 ? secondaryColor : tertiaryColor}
              initial={{ scale: 0 }}
              animate={{
                scale: 1,
                r: i === 0 ? [node.r, node.r * 1.2, node.r] : node.r,
              }}
              transition={{
                scale: { duration: 0.5, delay: 0.05 * i },
                r:
                  i === 0
                    ? {
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                      }
                    : undefined,
              }}
            />
          ))}

          {/* Central node glow */}
          {nodes.length > 0 && (
            <motion.circle
              cx={nodes[0].x}
              cy={nodes[0].y}
              r="10"
              fill={`url(#neuralGradient)`}
              opacity="0.3"
              animate={{
                opacity: [0.1, 0.3, 0.1],
                r: [8, 12, 8],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          )}

          {/* Gradient definitions */}
          <defs>
            <radialGradient id="neuralGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor={primaryColor} stopOpacity="0.8" />
              <stop offset="100%" stopColor={secondaryColor} stopOpacity="0" />
            </radialGradient>
          </defs>
        </motion.svg>
      ) : (
        <svg
          width={svgSize}
          height={svgSize}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke={primaryColor}
            strokeWidth="1"
            strokeDasharray="2 2"
            fill="transparent"
            opacity="0.3"
          />

          {/* Connections */}
          {connections.map((connection, i) => (
            <line
              key={i}
              x1={connection.x1}
              y1={connection.y1}
              x2={connection.x2}
              y2={connection.y2}
              stroke={i % 2 === 0 ? primaryColor : secondaryColor}
              strokeWidth="1"
              strokeDasharray="2 2"
              opacity="0.6"
            />
          ))}

          {/* Nodes */}
          {nodes.map((node, i) => (
            <circle
              key={i}
              cx={node.x}
              cy={node.y}
              r={node.r}
              fill={i === 0 ? primaryColor : i % 2 === 0 ? secondaryColor : tertiaryColor}
            />
          ))}

          {/* Central node glow */}
          {nodes.length > 0 && (
            <circle cx={nodes[0].x} cy={nodes[0].y} r="10" fill={`url(#neuralGradientStatic)`} opacity="0.2" />
          )}

          {/* Gradient definitions */}
          <defs>
            <radialGradient id="neuralGradientStatic" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor={primaryColor} stopOpacity="0.8" />
              <stop offset="100%" stopColor={secondaryColor} stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      )}
    </div>
  )
}
