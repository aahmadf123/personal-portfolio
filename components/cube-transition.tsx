"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

interface CubeTransitionProps {
  from?: "primary" | "secondary" | "tertiary" | "quaternary" | "accent"
  to?: "primary" | "secondary" | "tertiary" | "quaternary" | "accent"
  height?: number
}

export function CubeTransition({ from = "tertiary", to = "secondary", height = 250 }: CubeTransitionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  // Create transformed values
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 90])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3])
  const z = useTransform(scrollYProgress, [0, 0.5, 1], [-100, 0, -100])

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
        return `rgba(0, 255, 255, ${opacity})`
    }
  }

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
        <motion.div
          className="relative w-[80%] h-[80%]"
          style={{
            transformStyle: "preserve-3d",
            rotateX,
            z,
          }}
        >
          {/* Front face */}
          <motion.div
            className="absolute inset-0 rounded-lg"
            style={{
              background: `linear-gradient(to bottom, ${getColor(from, 0.5)}, transparent)`,
              backfaceVisibility: "hidden",
              filter: "blur(8px)",
            }}
          />

          {/* Bottom face */}
          <motion.div
            className="absolute inset-0 rounded-lg"
            style={{
              background: `linear-gradient(to top, ${getColor(to, 0.5)}, transparent)`,
              transform: "rotateX(90deg) translateZ(50%)",
              transformOrigin: "bottom",
              backfaceVisibility: "hidden",
              filter: "blur(8px)",
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  )
}
