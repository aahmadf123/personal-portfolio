"use client"

import { useState, useEffect } from "react"
import Image, { type ImageProps } from "next/image"
import { usePerformance } from "@/contexts/performance-context"

interface OptimizedImageProps extends Omit<ImageProps, "onLoad" | "onError"> {
  lowQualitySrc?: string
  loadingPriority?: "high" | "medium" | "low"
}

export function OptimizedImage({
  src,
  alt,
  lowQualitySrc,
  loadingPriority = "medium",
  priority,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [shouldLoad, setShouldLoad] = useState(false)
  const { performanceMode } = usePerformance()

  // Determine if this image should be loaded immediately based on performance mode and priority
  useEffect(() => {
    if (priority) {
      setShouldLoad(true)
      return
    }

    // High performance mode loads all images
    if (performanceMode === "high") {
      setShouldLoad(true)
      return
    }

    // Medium performance mode loads high and medium priority images
    if (performanceMode === "medium" && (loadingPriority === "high" || loadingPriority === "medium")) {
      setShouldLoad(true)
      return
    }

    // Low performance mode only loads high priority images
    if (performanceMode === "low" && loadingPriority === "high") {
      setShouldLoad(true)
      return
    }

    // For other cases, use intersection observer to load when visible
    if (typeof window !== "undefined" && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setShouldLoad(true)
            observer.disconnect()
          }
        },
        { rootMargin: "200px" }, // Start loading when within 200px of viewport
      )

      const element = document.getElementById(props.id || "")
      if (element) {
        observer.observe(element)
        return () => observer.disconnect()
      }
    } else {
      // Fallback for browsers without IntersectionObserver
      setShouldLoad(true)
    }
  }, [performanceMode, loadingPriority, priority, props.id])

  // Use a placeholder or low quality image until the main image is loaded
  const imageSrc = shouldLoad ? src : lowQualitySrc || src

  return (
    <div className={`relative ${props.className || ""}`} style={props.style}>
      <Image
        {...props}
        src={imageSrc || "/placeholder.svg"}
        alt={alt}
        className={`${props.className || ""} ${isLoaded ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
        onLoadingComplete={() => setIsLoaded(true)}
        loading={priority ? "eager" : "lazy"}
      />

      {!isLoaded && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{
            width: props.width ? `${props.width}px` : "100%",
            height: props.height ? `${props.height}px` : "100%",
          }}
        />
      )}
    </div>
  )
}
