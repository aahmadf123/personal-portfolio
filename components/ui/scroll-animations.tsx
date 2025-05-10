"use client"

import React, { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform, useSpring, useInView, useMotionValueEvent } from "framer-motion"

// ===== Scroll Progress Indicator =====
interface ScrollProgressProps {
  color?: string
  height?: number
  position?: "top" | "bottom"
  zIndex?: number
}

export const ScrollProgress = ({
  color = "#3b82f6",
  height = 4,
  position = "top",
  zIndex = 50,
}: ScrollProgressProps) => {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      className="fixed left-0 right-0"
      style={{
        top: position === "top" ? 0 : "auto",
        bottom: position === "bottom" ? 0 : "auto",
        height,
        backgroundColor: color,
        transformOrigin: "0%",
        scaleX,
        zIndex,
      }}
    />
  )
}

// ===== Scroll Sequence =====
interface ScrollSequenceProps {
  children: React.ReactNode[]
  staggerAmount?: number
  threshold?: number
  className?: string
}

export const ScrollSequence = ({
  children,
  staggerAmount = 0.1,
  threshold = 0.1,
  className = "",
}: ScrollSequenceProps) => {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: {
              delay: index * staggerAmount,
              duration: 0.5,
            },
          }}
          viewport={{ once: true, amount: threshold }}
          className="scroll-sequence-item"
        >
          {child}
        </motion.div>
      ))}
    </div>
  )
}

// ===== Scroll Parallax Scene =====
interface ParallaxLayerProps {
  children: React.ReactNode
  speed?: number
  className?: string
}

export const ParallaxLayer = ({ children, speed = 0.5, className = "" }: ParallaxLayerProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 100])

  return (
    <motion.div ref={ref} style={{ y }} className={`relative ${className}`}>
      {children}
    </motion.div>
  )
}

interface ParallaxSceneProps {
  children: React.ReactNode
  className?: string
}

export const ParallaxScene = ({ children, className = "" }: ParallaxSceneProps) => {
  return <div className={`relative overflow-hidden ${className}`}>{children}</div>
}

// ===== Scroll Transform =====
interface ScrollTransformProps {
  children: React.ReactNode
  properties?: {
    opacity?: [number, number]
    scale?: [number, number]
    rotate?: [number, number]
    x?: [number, number]
    y?: [number, number]
    blur?: [number, number]
  }
  scrollRange?: [string, string]
  className?: string
}

export const ScrollTransform = ({
  children,
  properties = {},
  scrollRange = ["start end", "end start"],
  className = "",
}: ScrollTransformProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: scrollRange,
  })

  const opacityTransform = properties.opacity ? useTransform(scrollYProgress, [0, 1], properties.opacity) : null
  const scaleTransform = properties.scale ? useTransform(scrollYProgress, [0, 1], properties.scale) : null
  const rotateTransform = properties.rotate ? useTransform(scrollYProgress, [0, 1], properties.rotate) : null
  const xTransform = properties.x ? useTransform(scrollYProgress, [0, 1], properties.x) : null
  const yTransform = properties.y ? useTransform(scrollYProgress, [0, 1], properties.y) : null
  const blurTransform = properties.blur ? useTransform(scrollYProgress, [0, 1], properties.blur) : null

  const styles: any = {}

  if (opacityTransform) {
    styles.opacity = opacityTransform
  }

  if (scaleTransform) {
    styles.scale = scaleTransform
  }

  if (rotateTransform) {
    styles.rotate = rotateTransform
  }

  if (xTransform) {
    styles.x = xTransform
  }

  if (yTransform) {
    styles.y = yTransform
  }

  if (blurTransform) {
    styles.filter = useTransform(blurTransform, (value) => `blur(${value}px)`)
  }

  return (
    <motion.div ref={ref} style={styles} className={className}>
      {children}
    </motion.div>
  )
}

// ===== Sticky Section =====
interface StickySectionProps {
  children: React.ReactNode
  height?: string
  stickyPosition?: "top" | "center" | "bottom"
  stickyOffset?: string
  className?: string
  contentClassName?: string
}

export const StickySection = ({
  children,
  height = "300vh",
  stickyPosition = "center",
  stickyOffset = "0px",
  className = "",
  contentClassName = "",
}: StickySectionProps) => {
  let positionStyles: React.CSSProperties = {}

  switch (stickyPosition) {
    case "top":
      positionStyles = { top: stickyOffset }
      break
    case "center":
      positionStyles = { top: "50%", transform: "translateY(-50%)" }
      break
    case "bottom":
      positionStyles = { bottom: stickyOffset }
      break
  }

  return (
    <div style={{ height }} className={`relative ${className}`}>
      <div className={`sticky ${contentClassName}`} style={{ ...positionStyles }}>
        {children}
      </div>
    </div>
  )
}

// ===== Scroll Canvas Animation =====
interface ScrollCanvasProps {
  draw: (context: CanvasRenderingContext2D, progress: number) => void
  width?: number
  height?: number
  className?: string
}

export const ScrollCanvas = ({ draw, width = 300, height = 300, className = "" }: ScrollCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { scrollYProgress } = useScroll()
  const [progress, setProgress] = useState(0)

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setProgress(latest)
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    // Clear canvas
    context.clearRect(0, 0, width, height)

    // Draw based on scroll progress
    draw(context, progress)
  }, [draw, height, progress, width])

  return <canvas ref={canvasRef} width={width} height={height} className={className} />
}

// ===== Horizontal Scroll Section =====
interface HorizontalScrollProps {
  children: React.ReactNode
  height?: string
  contentWidth?: string
  className?: string
  contentClassName?: string
}

export const HorizontalScroll = ({
  children,
  height = "100vh",
  contentWidth = "300%",
  className = "",
  contentClassName = "",
}: HorizontalScrollProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-" + (Number.parseFloat(contentWidth) - 100) + "%"])

  return (
    <div ref={containerRef} style={{ height }} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ x, width: contentWidth }} className={`flex h-full ${contentClassName}`}>
        {children}
      </motion.div>
    </div>
  )
}

// ===== Scroll Triggered Counter =====
interface ScrollCounterProps {
  end: number
  start?: number
  duration?: number
  prefix?: string
  suffix?: string
  decimals?: number
  className?: string
  threshold?: number
}

export const ScrollCounter = ({
  end,
  start = 0,
  duration = 1.5,
  prefix = "",
  suffix = "",
  decimals = 0,
  className = "",
  threshold = 0.5,
}: ScrollCounterProps) => {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { amount: threshold, once: true })
  const [count, setCount] = useState(start)

  useEffect(() => {
    if (!isInView) return

    let startTime: number
    let animationFrame: number

    const countUp = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      const currentCount = start + (end - start) * progress

      setCount(Number.parseFloat(currentCount.toFixed(decimals)))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(countUp)
      }
    }

    animationFrame = requestAnimationFrame(countUp)

    return () => cancelAnimationFrame(animationFrame)
  }, [isInView, start, end, duration, decimals])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count}
      {suffix}
    </span>
  )
}

// ===== Scroll Reveal Group =====
interface ScrollRevealGroupProps {
  children: React.ReactNode
  direction?: "up" | "down" | "left" | "right"
  stagger?: number
  duration?: number
  distance?: number
  threshold?: number
  className?: string
}

export const ScrollRevealGroup = ({
  children,
  direction = "up",
  stagger = 0.1,
  duration = 0.5,
  distance = 30,
  threshold = 0.1,
  className = "",
}: ScrollRevealGroupProps) => {
  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { y: distance }
      case "down":
        return { y: -distance }
      case "left":
        return { x: distance }
      case "right":
        return { x: -distance }
    }
  }

  const childrenArray = React.Children.toArray(children)

  return (
    <div className={className}>
      {childrenArray.map((child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, ...getInitialPosition() }}
          whileInView={{
            opacity: 1,
            x: 0,
            y: 0,
            transition: {
              delay: index * stagger,
              duration,
              ease: "easeOut",
            },
          }}
          viewport={{ once: true, amount: threshold }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  )
}

// ===== Scroll Snap Section =====
interface ScrollSnapSectionProps {
  children: React.ReactNode
  snapAlign?: "start" | "center" | "end"
  className?: string
}

export const ScrollSnapContainer = ({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div className={`scroll-snap-container h-screen overflow-y-scroll snap-mandatory ${className}`}>{children}</div>
  )
}

export const ScrollSnapSection = ({ children, snapAlign = "center", className = "" }: ScrollSnapSectionProps) => {
  return <div className={`min-h-screen snap-${snapAlign} ${className}`}>{children}</div>
}

// ===== Scroll Triggered Appear =====
interface ScrollAppearProps {
  children: React.ReactNode
  threshold?: number
  className?: string
  delay?: number
}

export const ScrollAppear = ({ children, threshold = 0.1, className = "", delay = 0 }: ScrollAppearProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { amount: threshold, once: true })

  return (
    <div ref={ref} className={className}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={
          isInView
            ? {
                opacity: 1,
                scale: 1,
                transition: {
                  duration: 0.5,
                  delay,
                  ease: [0.22, 1, 0.36, 1],
                },
              }
            : {}
        }
      >
        {children}
      </motion.div>
    </div>
  )
}
