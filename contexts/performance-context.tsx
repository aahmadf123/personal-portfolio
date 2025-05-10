"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type PerformanceLevel = "low" | "medium" | "high"

interface PerformanceContextType {
  performanceLevel: PerformanceLevel
  nodeCount: number
  connectionCount: number
  frameRate: number
  enableAnimations: boolean
  enableBackgroundEffects: boolean
  setPerformanceLevel: (level: PerformanceLevel) => void
  toggleAnimations: () => void
  toggleBackgroundEffects: () => void
}

const PerformanceContext = createContext<PerformanceContextType>({
  performanceLevel: "medium",
  nodeCount: 100,
  connectionCount: 5,
  frameRate: 30,
  enableAnimations: true,
  enableBackgroundEffects: true,
  setPerformanceLevel: () => {},
  toggleAnimations: () => {},
  toggleBackgroundEffects: () => {},
})

export function PerformanceProvider({ children }: { children: ReactNode }) {
  const [performanceLevel, setPerformanceLevel] = useState<PerformanceLevel>("medium")
  const [enableAnimations, setEnableAnimations] = useState(true)
  const [enableBackgroundEffects, setEnableBackgroundEffects] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  // Derived performance settings
  const nodeCount = performanceLevel === "high" ? 150 : performanceLevel === "medium" ? 100 : 50
  const connectionCount = performanceLevel === "high" ? 8 : performanceLevel === "medium" ? 5 : 3
  const frameRate = performanceLevel === "high" ? 60 : performanceLevel === "medium" ? 30 : 20

  // Auto-detect performance capabilities on mount
  useEffect(() => {
    if (isInitialized) return

    const detectPerformance = () => {
      try {
        // Check for mobile devices
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

        // Check processor cores
        const lowCores = navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 4

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

        // Check for battery saving mode if available
        const checkBatterySaving = async () => {
          if ("getBattery" in navigator) {
            try {
              // @ts-ignore - getBattery is not in the standard navigator type
              const battery = await navigator.getBattery()
              if (battery.charging === false && battery.level < 0.2) {
                return true // Low battery, likely in power saving
              }
            } catch (e) {
              // Ignore errors
            }
          }
          return false
        }

        // Set performance level based on detected capabilities
        checkBatterySaving().then((isBatterySaving) => {
          if (isMobile || lowCores || prefersReducedMotion || isBatterySaving) {
            setPerformanceLevel("low")
            setEnableAnimations(false)
          } else if (window.innerWidth < 768 || navigator.hardwareConcurrency <= 8) {
            setPerformanceLevel("medium")
          } else {
            setPerformanceLevel("high")
          }

          setIsInitialized(true)
        })
      } catch (error) {
        // Fallback to medium if detection fails
        setPerformanceLevel("medium")
        setIsInitialized(true)
      }
    }

    detectPerformance()
  }, [isInitialized])

  const toggleAnimations = () => {
    setEnableAnimations((prev) => !prev)
  }

  const toggleBackgroundEffects = () => {
    setEnableBackgroundEffects((prev) => !prev)
  }

  return (
    <PerformanceContext.Provider
      value={{
        performanceLevel,
        nodeCount,
        connectionCount,
        frameRate,
        enableAnimations,
        enableBackgroundEffects,
        setPerformanceLevel,
        toggleAnimations,
        toggleBackgroundEffects,
      }}
    >
      {children}
    </PerformanceContext.Provider>
  )
}

export function usePerformance() {
  return useContext(PerformanceContext)
}
