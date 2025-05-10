"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

interface PerspectiveTransitionProps {
  from?: "primary" | "secondary" | "tertiary" | "quaternary"
  to?: "primary" | "secondary" | "tertiary" | "quaternary"
  height?: number
  reverse?: boolean
}

export function PerspectiveTransition({
  from = "primary",
  to = "secondary",
  height = 200,
  reverse = false,
}: PerspectiveTransitionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  // Create transformed values at the top level
  const rotateX = useTransform(scrollYProgress, [0, 1], reverse ? [10, -10] : [-10, 10])

  const translateZ = useTransform(scrollYProgress, [0, 0.5, 1], [-50, 0, -50])

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3])

  // Create layer data
  const layers = 3
  const layerData = Array.from({ length: layers }).map((_, i) => {
    const depth = i / layers
    const scale = 1 - depth * 0.15
    const translateY = depth * 20

    return { depth, scale, translateY }
  })

  // Pre-calculate transform values outside the component
  const scaleTransformsValues = layerData.map(({ depth }) => [1 - depth * 0.15, 1 - depth * 0.15 - 0.05])
  const yTransformsValues = layerData.map(({ depth, translateY }) => [translateY, translateY + 20])

  // Create transforms for each layer
  const scaleTransforms = scaleTransformsValues.map((values) => useTransform(scrollYProgress, [0, 1], values))

  const yTransforms = yTransformsValues.map((values) => useTransform(scrollYProgress, [0, 1], values))

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
        className="absolute inset-0 flex items-center justify-center"
        style={{
          opacity,
          perspective: "1200px",
          rotateX,
          z: translateZ,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        {layerData.map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-full h-full flex items-center justify-center"
            style={{
              scale: scaleTransforms[i],
              y: yTransforms[i],
              zIndex: layers - i,
            }}
          >
            <div
              className="w-[90%] h-[80%] rounded-lg"
              style={{
                background: `linear-gradient(to bottom, ${getColor(i === 0 ? from : to, 0.3 - i * 0.1)}, transparent)`,
                filter: `blur(${2 + i * 3}px)`,
              }}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
