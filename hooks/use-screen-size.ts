"use client"

import { useState, useEffect } from "react"

type ScreenSize = "small" | "mobile" | "tablet" | "desktop" | "large"

export function useScreenSize(): ScreenSize {
  const [screenSize, setScreenSize] = useState<ScreenSize>("desktop")

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth

      if (width < 640) {
        setScreenSize("small") // Small mobile
      } else if (width < 768) {
        setScreenSize("mobile") // Mobile
      } else if (width < 1024) {
        setScreenSize("tablet") // Tablet
      } else if (width < 1280) {
        setScreenSize("desktop") // Desktop
      } else {
        setScreenSize("large") // Large desktop
      }
    }

    // Set initial size
    updateScreenSize()

    // Add event listener
    window.addEventListener("resize", updateScreenSize)

    // Clean up
    return () => window.removeEventListener("resize", updateScreenSize)
  }, [])

  return screenSize
}
