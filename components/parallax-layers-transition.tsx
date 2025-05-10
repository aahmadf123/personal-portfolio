"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll } from "framer-motion"

interface ParallaxLayersTransitionProps {
  variant?: "primary" | "secondary" | "tertiary" | "quaternary"
  height?: number
  layers?: number
}

export function ParallaxLayersTransition({
  variant = "primary",
  height = 250,
  layers = 5,
}: ParallaxLayersTransitionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [yTransforms, setYTransforms] = useState<number[]>([])

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  // Create layer data
  const layerData = Array.from({ length: layers }).map((_, i) => {
    const depth = i / layers
    const translateY = depth * 100
    const translateZ = -100 * depth
    const opacity = 0.8 - depth * 0.5
    const scale = 1 + depth * 0.2

    return {
      depth,
      translateY,
      translateZ,
      opacity,
      scale,
    }
  })

  useEffect(() => {
    // Create all transform values at the top level
    const calculatedYTransforms = layerData.map(({ translateY }) => {
      return translateY * -0.5 + translateY * 0.5 // Calculate the transform value directly
    })

    setYTransforms(calculatedYTransforms)
  }, [layerData])

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

  const getColor = (opacity = 0.2) => {
    switch (variant) {
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
    <div ref={ref} className="relative w-full overflow-hidden" style={{ height: `${height}px`, perspective: "1200px" }}>
      <div className="absolute inset-0">
        {layerData.map(({ depth, translateZ, opacity, scale }, i) => {
          return (
            <motion.div
              key={i}
              className="absolute inset-0 flex items-center justify-center"
              style={{
                y: yTransforms[i] !== undefined ? scrollYProgress * yTransforms[i] : 0, // Use the pre-created transform
                z: translateZ,
                scale,
                opacity: isVisible ? opacity : 0,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: isVisible ? opacity : 0 }}
              transition={{ duration: 0.8, delay: depth * 0.2 }}
            >
              <div
                className="w-[80%] h-[30%] rounded-full"
                style={{
                  background: `radial-gradient(circle, ${getColor(0.4)}, transparent 70%)`,
                  filter: `blur(${5 + depth * 10}px)`,
                }}
              />
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
