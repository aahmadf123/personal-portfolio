"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

interface DiagonalTransitionProps {
  from?: "primary" | "secondary" | "tertiary" | "quaternary"
  to?: "primary" | "secondary" | "tertiary" | "quaternary"
  angle?: number
  height?: number
}

export function DiagonalTransition({
  from = "primary",
  to = "secondary",
  angle = -3,
  height = 120,
}: DiagonalTransitionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  // Create transformed values
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3])
  const skew = useTransform(scrollYProgress, [0, 0.5, 1], [angle * 0.5, angle, angle * 0.5])

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
        return `rgba(176, 38, 255, ${opacity})`
      case "tertiary":
        return `rgba(255, 0, 128, ${opacity})`
      case "quaternary":
        return `rgba(0, 204, 102, ${opacity})`
      default:
        return `rgba(0, 229, 255, ${opacity})`
    }
  }

  return (
    <div ref={ref} className="relative w-full overflow-hidden" style={{ height: `${height}px` }}>
      <motion.div
        className="absolute inset-0"
        style={{
          opacity,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(${angle < 0 ? "to bottom right" : "to bottom left"}, ${getColor(
              from,
              0.4,
            )}, transparent)`,
            skewY: skew,
            transformOrigin: "top",
            filter: "blur(8px)",
          }}
        />
        <motion.div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(${angle < 0 ? "to top left" : "to top right"}, ${getColor(
              to,
              0.4,
            )}, transparent)`,
            skewY: skew.get() * -1,
            transformOrigin: "bottom",
            filter: "blur(8px)",
          }}
        />
      </motion.div>
    </div>
  )
}
