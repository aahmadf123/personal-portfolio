"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

interface Skill {
  name: string
  level: number
  category: string
  color: string
}

interface SkillsVisualizationProps {
  skills: Skill[]
  title?: string
  subtitle?: string
}

export function AnimatedSkillsVisualization({
  skills,
  title = "Skills & Expertise",
  subtitle = "My interdisciplinary expertise spans cutting-edge technologies in AI, aerospace engineering, and quantum computing.",
}: SkillsVisualizationProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [visualizationType, setVisualizationType] = useState<"network" | "bubble" | "radar">("network")
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const prefersReducedMotion = useReducedMotion()

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
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

      // Default to simpler visualization on low performance devices
      if (isMobile || isLowEndDevice || prefersReducedMotion) {
        setVisualizationType("bubble")
      }
    }

    checkPerformance()
  }, [])

  // Get unique categories
  const categories = Array.from(new Set(skills.map((skill) => skill.category)))

  useEffect(() => {
    try {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
        setContainerHeight(containerRef.current.offsetHeight)
      }

      const handleResize = () => {
        if (containerRef.current) {
          setContainerWidth(containerRef.current.offsetWidth)
          setContainerHeight(containerRef.current.offsetHeight)
        }
      }

      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    } catch (err) {
      console.error("Skills visualization error:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
    }
  }, [])

  // Filter skills by active category
  const filteredSkills = activeCategory ? skills.filter((skill) => skill.category === activeCategory) : skills

  // Limit number of skills displayed based on performance
  const displayedSkills = isLowPerformance
    ? filteredSkills.slice(0, Math.min(15, filteredSkills.length))
    : filteredSkills

  // Fallback for errors
  if (error) {
    return (
      <section className="py-16 md:py-24 bg-gradient-to-b from-background to-background/80" id="skills">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tight mb-4">{title}</h2>
          <p className="text-muted-foreground mb-8">{subtitle}</p>
          <div className="bg-card/30 backdrop-blur-sm p-8 rounded-lg border border-border">
            <p>Skills visualization unavailable. Please try again later.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-background/80" id="skills" ref={ref}>
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tight mb-4">{title}</h2>
        <p className="text-muted-foreground mb-8">{subtitle}</p>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              activeCategory === null ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
            }`}
          >
            All Skills
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                activeCategory === category ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {!isLowPerformance && (
          <div className="flex justify-end mb-4">
            <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
              <button
                onClick={() => setVisualizationType("network")}
                className={`p-2 rounded-md text-sm transition-all ${
                  visualizationType === "network" ? "bg-card" : "hover:bg-card/50"
                }`}
              >
                Network
              </button>
              <button
                onClick={() => setVisualizationType("bubble")}
                className={`p-2 rounded-md text-sm transition-all ${
                  visualizationType === "bubble" ? "bg-card" : "hover:bg-card/50"
                }`}
              >
                Bubble
              </button>
              <button
                onClick={() => setVisualizationType("radar")}
                className={`p-2 rounded-md text-sm transition-all ${
                  visualizationType === "radar" ? "bg-card" : "hover:bg-card/50"
                }`}
              >
                Radar
              </button>
            </div>
          </div>
        )}

        <div
          ref={containerRef}
          className="relative h-[500px] border border-border rounded-lg bg-card/30 backdrop-blur-sm overflow-hidden"
        >
          {visualizationType === "network" && (
            <NetworkVisualization
              skills={displayedSkills}
              inView={inView}
              width={containerWidth}
              height={containerHeight}
              isLowPerformance={isLowPerformance}
            />
          )}

          {visualizationType === "bubble" && (
            <BubbleVisualization
              skills={displayedSkills}
              inView={inView}
              width={containerWidth}
              height={containerHeight}
              isLowPerformance={isLowPerformance}
            />
          )}

          {visualizationType === "radar" && (
            <RadarVisualization
              skills={displayedSkills}
              inView={inView}
              width={containerWidth}
              height={containerHeight}
              isLowPerformance={isLowPerformance}
            />
          )}
        </div>
      </div>
    </section>
  )
}

function NetworkVisualization({
  skills,
  inView,
  width,
  height,
  isLowPerformance,
}: {
  skills: Skill[]
  inView: boolean
  width: number
  height: number
  isLowPerformance: boolean
}) {
  // Calculate positions for network nodes
  const centerX = width / 2
  const centerY = height / 2
  const radius = Math.min(width, height) * 0.35

  // Limit animations for low performance
  const transition = {
    duration: isLowPerformance ? 0.3 : 0.5,
    ease: "easeOut",
  }

  return (
    <div className="w-full h-full">
      {/* Central node */}
      <motion.div
        className="absolute bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold shadow-[0_0_15px_rgba(0,229,255,0.5)]"
        initial={{ opacity: 0, scale: 0 }}
        animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
        transition={transition}
        style={{
          width: 100,
          height: 100,
          left: centerX - 50,
          top: centerY - 50,
          zIndex: 10,
        }}
      >
        Skills
      </motion.div>

      {/* Skill nodes - limit for performance */}
      {skills.map((skill, index) => {
        // Calculate position in a circle around the center
        const angle = (index * (2 * Math.PI)) / skills.length
        const x = centerX + radius * Math.cos(angle) - 40
        const y = centerY + radius * Math.sin(angle) - 40

        return (
          <div key={skill.name} style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%" }}>
            {/* Connection line */}
            <motion.div
              className="absolute bg-gradient-to-r from-primary/50 to-transparent"
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { opacity: 0.5, scale: 1 } : { opacity: 0, scale: 0 }}
              transition={{ duration: 0.5, delay: isLowPerformance ? 0.1 : 0.2 + index * 0.05 }}
              style={{
                height: 2,
                width: Math.sqrt(Math.pow(x - centerX + 40, 2) + Math.pow(y - centerY + 40, 2)),
                left: centerX,
                top: centerY,
                transformOrigin: "left center",
                transform: `rotate(${angle}rad)`,
              }}
            />

            {/* Skill node */}
            <motion.div
              className="absolute rounded-full flex items-center justify-center text-xs font-medium shadow-lg cursor-pointer hover:scale-110 transition-transform"
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
              transition={{ duration: 0.5, delay: isLowPerformance ? 0.2 : 0.3 + index * 0.05 }}
              style={{
                width: 80 * (skill.level / 100) + 40,
                height: 80 * (skill.level / 100) + 40,
                left: x,
                top: y,
                backgroundColor: skill.color,
                color: "#fff",
                textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                zIndex: 5,
              }}
            >
              {skill.name}
            </motion.div>
          </div>
        )
      })}
    </div>
  )
}

function BubbleVisualization({
  skills,
  inView,
  width,
  height,
  isLowPerformance,
}: {
  skills: Skill[]
  inView: boolean
  width: number
  height: number
  isLowPerformance: boolean
}) {
  // Calculate random positions for bubbles
  const positions = skills.map((skill, index) => {
    const padding = 80
    return {
      x: padding + Math.random() * (width - padding * 2),
      y: padding + Math.random() * (height - padding * 2),
      size: 60 + (skill.level / 100) * 80,
    }
  })

  return (
    <div className="w-full h-full">
      {skills.map((skill, index) => (
        <motion.div
          key={skill.name}
          className="absolute rounded-full flex items-center justify-center text-center p-2 text-xs md:text-sm font-medium cursor-pointer hover:scale-110 transition-transform"
          initial={{ opacity: 0, scale: 0 }}
          animate={
            inView
              ? {
                  opacity: 1,
                  scale: 1,
                  x: [
                    positions[index].x - positions[index].size / 2,
                    positions[index].x - positions[index].size / 2 + (isLowPerformance ? 5 : Math.random() * 20 - 10),
                  ],
                  y: [
                    positions[index].y - positions[index].size / 2,
                    positions[index].y - positions[index].size / 2 + (isLowPerformance ? 5 : Math.random() * 20 - 10),
                  ],
                }
              : { opacity: 0, scale: 0 }
          }
          transition={{
            duration: 0.5,
            delay: isLowPerformance ? 0.1 * (index % 5) : index * 0.05,
            x: {
              duration: isLowPerformance ? 5 : 3,
              repeat: isLowPerformance ? 0 : Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
            },
            y: {
              duration: isLowPerformance ? 5 : 4,
              repeat: isLowPerformance ? 0 : Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
            },
          }}
          style={{
            width: positions[index].size,
            height: positions[index].size,
            backgroundColor: skill.color,
            color: "#fff",
            textShadow: "0 1px 2px rgba(0,0,0,0.5)",
            boxShadow: isLowPerformance ? "none" : `0 0 20px ${skill.color}80`,
          }}
        >
          {skill.name}
        </motion.div>
      ))}
    </div>
  )
}

function RadarVisualization({
  skills,
  inView,
  width,
  height,
  isLowPerformance,
}: {
  skills: Skill[]
  inView: boolean
  width: number
  height: number
  isLowPerformance: boolean
}) {
  const centerX = width / 2
  const centerY = height / 2
  const maxRadius = Math.min(width, height) * 0.4

  // Group skills by category
  const skillsByCategory: Record<string, Skill[]> = {}
  skills.forEach((skill) => {
    if (!skillsByCategory[skill.category]) {
      skillsByCategory[skill.category] = []
    }
    skillsByCategory[skill.category].push(skill)
  })

  const categories = Object.keys(skillsByCategory)

  // Simplified animation for low performance
  const circleDelay = isLowPerformance ? 0.1 : 0.1
  const axisDelay = isLowPerformance ? 0.2 : 0.5
  const labelDelay = isLowPerformance ? 0.3 : 0.7
  const pointDelay = isLowPerformance ? 0.4 : 1
  const polygonDelay = isLowPerformance ? 0.5 : 1.5

  return (
    <div className="w-full h-full">
      {/* Background circles - fewer for low performance */}
      {[0.2, 0.4, 0.6, 0.8, 1]
        .filter((_, i) => !isLowPerformance || i % 2 === 0)
        .map((ratio, i) => (
          <motion.div
            key={`circle-${i}`}
            className="absolute border border-border/30 rounded-full"
            initial={{ opacity: 0, scale: 0 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
            transition={{ duration: 0.5, delay: i * circleDelay }}
            style={{
              width: maxRadius * 2 * ratio,
              height: maxRadius * 2 * ratio,
              left: centerX - maxRadius * ratio,
              top: centerY - maxRadius * ratio,
            }}
          />
        ))}

      {/* Category axes */}
      {categories.map((category, i) => {
        const angle = (i * 2 * Math.PI) / categories.length
        const x2 = centerX + Math.cos(angle) * maxRadius
        const y2 = centerY + Math.sin(angle) * maxRadius

        return (
          <motion.div
            key={`axis-${category}`}
            className="absolute bg-border/30"
            initial={{ opacity: 0, scale: 0 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
            transition={{ duration: 0.5, delay: axisDelay + i * 0.05 }}
            style={{
              height: 1,
              width: maxRadius,
              left: centerX,
              top: centerY,
              transformOrigin: "left center",
              transform: `rotate(${angle}rad)`,
            }}
          />
        )
      })}

      {/* Category labels - simplified for low performance */}
      {categories.map((category, i) => {
        const angle = (i * 2 * Math.PI) / categories.length
        const x = centerX + Math.cos(angle) * (maxRadius + 20)
        const y = centerY + Math.sin(angle) * (maxRadius + 20)

        return (
          <motion.div
            key={`label-${category}`}
            className="absolute text-xs font-medium bg-background/80 backdrop-blur-sm px-2 py-1 rounded"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: labelDelay + i * 0.05 }}
            style={{
              left: x - 50,
              top: y - 10,
              width: 100,
              textAlign: "center",
            }}
          >
            {category}
          </motion.div>
        )
      })}

      {/* Skills data points - limit for performance */}
      {categories.map((category, categoryIndex) => {
        const categorySkills = skillsByCategory[category]
        const angle = (categoryIndex * 2 * Math.PI) / categories.length

        // Limit skills per category for performance
        const displaySkills = isLowPerformance ? categorySkills.slice(0, 2) : categorySkills

        return displaySkills.map((skill, skillIndex) => {
          const skillRatio = skill.level / 100
          const distance = maxRadius * skillRatio
          const spreadAngle = angle + (skillIndex - (displaySkills.length - 1) / 2) * 0.2
          const x = centerX + Math.cos(spreadAngle) * distance
          const y = centerY + Math.sin(spreadAngle) * distance

          return (
            <motion.div
              key={`skill-${skill.name}`}
              className="absolute rounded-full flex items-center justify-center cursor-pointer hover:scale-125 transition-transform"
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
              transition={{
                duration: 0.5,
                delay: pointDelay + categoryIndex * 0.1 + skillIndex * 0.05,
              }}
              style={{
                width: 30,
                height: 30,
                left: x - 15,
                top: y - 15,
                backgroundColor: skill.color,
                boxShadow: isLowPerformance ? "none" : `0 0 10px ${skill.color}80`,
                zIndex: 5,
              }}
            >
              {!isLowPerformance && (
                <motion.div
                  className="absolute whitespace-nowrap text-xs font-medium bg-background/90 backdrop-blur-sm px-2 py-1 rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    top: -30,
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                >
                  {skill.name} - {skill.level}%
                </motion.div>
              )}
            </motion.div>
          )
        })
      })}

      {/* Radar polygon - simplified for low performance */}
      {!isLowPerformance && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          {categories.map((category) => {
            const categorySkills = skillsByCategory[category]
            if (!categorySkills || categorySkills.length === 0) return null

            // Find the highest level skill in this category
            const highestSkill = categorySkills.reduce((prev, current) => (prev.level > current.level ? prev : current))

            const points = categories
              .map((cat, i) => {
                const catSkills = skillsByCategory[cat]
                if (!catSkills || catSkills.length === 0) return ""

                const highestCatSkill = catSkills.reduce((prev, current) =>
                  prev.level > current.level ? prev : current,
                )

                const angle = (i * 2 * Math.PI) / categories.length
                const distance = maxRadius * (highestCatSkill.level / 100)
                const x = centerX + Math.cos(angle) * distance
                const y = centerY + Math.sin(angle) * distance

                return `${x},${y}`
              })
              .join(" ")

            return (
              <motion.polygon
                key={`polygon-${category}`}
                points={points}
                fill={`${highestSkill.color}20`}
                stroke={highestSkill.color}
                strokeWidth="2"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 1, delay: polygonDelay }}
              />
            )
          })}
        </svg>
      )}
    </div>
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
  const prefersReducedMotion = useReducedMotion()

  // Disable animation for reduced motion
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

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
