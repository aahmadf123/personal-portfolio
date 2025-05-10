"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface AdaptiveGridProps {
  children: React.ReactNode
  className?: string
  minItemWidth?: number
  gap?: number
}

/**
 * AdaptiveGrid - A component that adapts its layout based on container size
 * Uses container queries to create a responsive grid that's based on
 * the container's size rather than the viewport size.
 */
export function AdaptiveGrid({ children, className, minItemWidth = 300, gap = 4 }: AdaptiveGridProps) {
  // Feature detection for container queries
  const [supportsContainerQueries, setSupportsContainerQueries] = useState(false)

  useEffect(() => {
    // Check if container queries are supported
    setSupportsContainerQueries("container" in document.documentElement.style)
  }, [])

  return (
    <div
      className={cn(
        "@container", // Container query root
        "w-full",
        `gap-${gap}`,
        className,
      )}
    >
      {supportsContainerQueries ? (
        <div
          className={cn(
            "grid",
            // Container-based responsive columns - the power of container queries!
            "@xs:grid-cols-1",
            "@sm:grid-cols-2",
            "@md:grid-cols-2",
            "@lg:grid-cols-3",
            "@xl:grid-cols-4",
            "@2xl:grid-cols-5",
            "@3xl:grid-cols-6",
            `gap-${gap}`,
          )}
        >
          {children}
        </div>
      ) : (
        // Fallback to traditional responsive grid if container queries not supported
        <div
          className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5", `gap-${gap}`)}
        >
          {children}
        </div>
      )}
    </div>
  )
}

/**
 * AdaptiveItem - An item that adapts its styling based on container size
 */
export function AdaptiveItem({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border p-4 bg-card/30 backdrop-blur-sm",
        // Apply different styles based on container size
        "@md:p-6", // More padding on larger containers
        "@lg:border-2", // Thicker border on even larger containers
        "@xl:shadow-lg", // Add shadow on extra large containers
        "transition-all duration-300",
        className,
      )}
    >
      {children}
    </div>
  )
}
