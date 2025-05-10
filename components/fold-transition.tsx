"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

interface FoldTransitionProps {
  from?: "primary" | "secondary" | "tertiary" | "quaternary" | "accent"
  to?: "primary" | "secondary" | "tertiary" | "quaternary" | "accent"
  height?: number
  direction?: "horizontal" | "vertical"
}

export function FoldTransition({
  from = "tertiary",
  to = "secondary",
  height = 150,
  direction = "horizontal",
}: FoldTransitionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  // Create transformed values at the top level
  const foldProgress = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0])

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  const getColor = (color: string, opacity = 0.2) => {
    switch (color) {
      case "primary":
        return `rgba(160, 120, 255, ${opacity})`
      case "secondary":
        return `rgba(255, 20, 147, ${opacity})`
      case "tertiary":
        return `rgba(0, 255, 255, ${opacity})`
      case "quaternary":
        return `rgba(0, 204, 102, ${opacity})`
      case "accent":
        return `rgba(255, 165, 0, ${opacity})`
      default:
        return `rgba(160, 120, 255, ${opacity})`
    }
  }

  // Create derived motion values for rotations
  const rotateYTop = useTransform(foldProgress, [0, 1], [0, direction === "horizontal" ? -45 : 0])

  const rotateXTop = useTransform(foldProgress, [0, 1], [0, direction === "vertical" ? 45 : 0])

  const rotateYBottom = useTransform(foldProgress, [0, 1], [0, direction === "horizontal" ? 45 : 0])

  const rotateXBottom = useTransform(foldProgress, [0, 1], [0, direction === "vertical" ? -45 : 0])

  return (
    <div ref={ref} className="relative w-full overflow-hidden" style={{ height: `${height}px` }}>
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          opacity,
          perspective: "1200px",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Top/Left fold */}
        <motion.div
          className="absolute"
          style={{
            width: direction === "horizontal" ? "50%" : "100%",
            height: direction === "horizontal" ? "100%" : "50%",
            left: direction === "horizontal" ? 0 : 0,
            top: direction === "horizontal" ? 0 : 0,
            background: `linear-gradient(to ${direction === "horizontal" ? "right" : "bottom"}, ${getColor(from, 0.4)}, transparent)`,
            transformOrigin: direction === "horizontal" ? "right" : "bottom",
            rotateY: rotateYTop,
            rotateX: rotateXTop,
            filter: "blur(5px)",
          }}
        />

        {/* Bottom/Right fold */}
        <motion.div
          className="absolute"
          style={{
            width: direction === "horizontal" ? "50%" : "100%",
            height: direction === "horizontal" ? "100%" : "50%",
            right: direction === "horizontal" ? 0 : 0,
            bottom: direction === "horizontal" ? 0 : 0,
            background: `linear-gradient(to ${direction === "horizontal" ? "left" : "top"}, ${getColor(to, 0.4)}, transparent)`,
            transformOrigin: direction === "horizontal" ? "left" : "top",
            rotateY: rotateYBottom,
            rotateX: rotateXBottom,
            filter: "blur(5px)",
          }}
        />
      </motion.div>
    </div>
  )
}
