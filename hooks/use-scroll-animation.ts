"use client"

import { useRef } from "react"
import { useInView } from "framer-motion"
import { useReducedMotion } from "./use-reduced-motion"

type AnimationDirection = "up" | "down" | "left" | "right" | "none"
type AnimationOptions = {
  direction?: AnimationDirection
  duration?: number
  delay?: number
  once?: boolean
  amount?: number
}

export function useScrollAnimation(options: AnimationOptions = {}) {
  const { direction = "up", duration = 0.5, delay = 0, once = true, amount = 0.3 } = options

  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once, amount })
  const prefersReducedMotion = useReducedMotion()

  // Calculate initial and animate values based on direction
  const getAnimationProps = () => {
    if (prefersReducedMotion) {
      return {
        initial: {},
        animate: {},
      }
    }

    let initial = {}

    switch (direction) {
      case "up":
        initial = { opacity: 0, y: 40 }
        break
      case "down":
        initial = { opacity: 0, y: -40 }
        break
      case "left":
        initial = { opacity: 0, x: 40 }
        break
      case "right":
        initial = { opacity: 0, x: -40 }
        break
      case "none":
        initial = { opacity: 0 }
        break
    }

    return {
      initial,
      animate: isInView ? { opacity: 1, x: 0, y: 0 } : initial,
      transition: { duration, delay, ease: "easeOut" },
    }
  }

  return { ref, ...getAnimationProps() }
}
