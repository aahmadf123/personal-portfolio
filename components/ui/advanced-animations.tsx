"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform, useInView, useMotionValue, useAnimationFrame } from "framer-motion"

// Parallax effect component
interface ParallaxProps {
  children: React.ReactNode
  speed?: number
  className?: string
}

export const Parallax = ({ children, speed = 0.5, className = "" }: ParallaxProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 100])

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  )
}

// Text reveal animation
interface TextRevealProps {
  text: string
  duration?: number
  staggerChildren?: number
  className?: string
  once?: boolean
}

export const TextReveal = ({
  text,
  duration = 0.5,
  staggerChildren = 0.03,
  className = "",
  once = true,
}: TextRevealProps) => {
  const words = text.split(" ")

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren, delayChildren: 0.04 * i },
    }),
  }

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
        duration,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
        duration,
      },
    },
  }

  return (
    <motion.div
      className={`inline-block ${className}`}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
    >
      {words.map((word, index) => (
        <motion.span key={index} className="inline-block mr-1" variants={child}>
          {word}
        </motion.span>
      ))}
    </motion.div>
  )
}

// Scroll-triggered animation
interface ScrollRevealProps {
  children: React.ReactNode
  threshold?: number
  animation?: "fadeIn" | "slideUp" | "slideLeft" | "slideRight" | "scale" | "rotate"
  duration?: number
  className?: string
  once?: boolean
}

export const ScrollReveal = ({
  children,
  threshold = 0.1,
  animation = "fadeIn",
  duration = 0.5,
  className = "",
  once = true,
}: ScrollRevealProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { amount: threshold, once })

  const variants = {
    hidden: {
      opacity: 0,
      y: animation === "slideUp" ? 50 : 0,
      x: animation === "slideLeft" ? -50 : animation === "slideRight" ? 50 : 0,
      scale: animation === "scale" ? 0.8 : 1,
      rotate: animation === "rotate" ? -10 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      rotate: 0,
      transition: {
        duration,
        ease: "easeOut",
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
    >
      {children}
    </motion.div>
  )
}

// SVG Path animation
interface PathAnimationProps {
  pathData: string
  width?: number
  height?: number
  pathColor?: string
  pathWidth?: number
  duration?: number
  className?: string
}

export const PathAnimation = ({
  pathData,
  width = 100,
  height = 100,
  pathColor = "currentColor",
  pathWidth = 2,
  duration = 2,
  className = "",
}: PathAnimationProps) => {
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className}>
      <motion.path
        d={pathData}
        stroke={pathColor}
        strokeWidth={pathWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration, ease: "easeInOut" }}
      />
    </svg>
  )
}

// Hover card effect
interface HoverCardProps {
  children: React.ReactNode
  depth?: number
  rotation?: number
  className?: string
}

export const HoverCard = ({ children, depth = 10, rotation = 7, className = "" }: HoverCardProps) => {
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateXValue = ((y - centerY) / centerY) * rotation
    const rotateYValue = ((centerX - x) / centerX) * rotation

    setRotateX(rotateXValue)
    setRotateY(rotateYValue)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <motion.div
      className={`relative ${className}`}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      animate={{
        rotateX,
        rotateY,
        z: 0,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div style={{ transform: `translateZ(${depth}px)` }}>{children}</div>
    </motion.div>
  )
}

// Animated counter
interface CounterProps {
  end: number
  start?: number
  duration?: number
  prefix?: string
  suffix?: string
  decimals?: number
  className?: string
}

export const Counter = ({
  end,
  start = 0,
  duration = 2,
  prefix = "",
  suffix = "",
  decimals = 0,
  className = "",
}: CounterProps) => {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const count = useMotionValue(start)
  const rounded = useTransform(count, (latest) => {
    return Number.parseFloat(latest.toFixed(decimals))
  })
  const [displayValue, setDisplayValue] = useState(start)

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, end, { duration })
      return controls.stop
    }
  }, [count, end, isInView, duration])

  useAnimationFrame(() => {
    setDisplayValue(rounded.get())
  })

  return (
    <span ref={ref} className={className}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  )
}

// Helper function for Counter
const animate = (value: { set: (arg0: number) => void }, to: number, options: { duration: number }) => {
  const startTime = performance.now()
  const startValue = value.get() || 0

  const tick = () => {
    const elapsed = performance.now() - startTime
    const progress = Math.min(elapsed / (options.duration * 1000), 1)
    const currentValue = startValue + (to - startValue) * progress

    value.set(currentValue)

    if (progress < 1) {
      requestAnimationFrame(tick)
    }
  }

  tick()

  return {
    stop: () => {},
  }
}

// Animated gradient background
interface AnimatedGradientProps {
  colors: string[]
  duration?: number
  className?: string
  children?: React.ReactNode
}

export const AnimatedGradient = ({ colors, duration = 10, className = "", children }: AnimatedGradientProps) => {
  const gradientColors = colors.join(", ")

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(45deg, ${gradientColors})`,
        backgroundSize: "200% 200%",
      }}
      animate={{
        backgroundPosition: ["0% 0%", "100% 100%"],
      }}
      transition={{
        duration,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        ease: "linear",
      }}
    >
      {children}
    </motion.div>
  )
}

// Typing animation
interface TypingAnimationProps {
  text: string
  speed?: number
  delay?: number
  cursor?: boolean
  className?: string
}

export const TypingAnimation = ({
  text,
  speed = 50,
  delay = 0,
  cursor = true,
  className = "",
}: TypingAnimationProps) => {
  const [displayText, setDisplayText] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (!isTyping) {
      timeout = setTimeout(() => {
        setIsTyping(true)
        let i = 0

        const typeInterval = setInterval(() => {
          if (i < text.length) {
            setDisplayText((prev) => prev + text.charAt(i))
            i++
          } else {
            clearInterval(typeInterval)
          }
        }, speed)

        return () => clearInterval(typeInterval)
      }, delay)
    }

    return () => clearTimeout(timeout)
  }, [text, speed, delay, isTyping])

  return (
    <span className={className}>
      {displayText}
      {cursor && isTyping && <span className="inline-block w-[2px] h-[1em] bg-current ml-[2px] animate-blink" />}
    </span>
  )
}
