"use client"

import { SimpleNeuralBackground } from "./simple-neural-background"
import { FallbackBackground } from "./fallback-background"
import { useState, useEffect } from "react"

export function VisibleTechBackground() {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    // Check if canvas is supported
    const isCanvasSupported = () => {
      const canvas = document.createElement("canvas")
      return !!(canvas.getContext && canvas.getContext("2d"))
    }

    if (!isCanvasSupported()) {
      setHasError(true)
    }
  }, [])

  if (hasError) {
    return <FallbackBackground />
  }

  return <SimpleNeuralBackground />
}
