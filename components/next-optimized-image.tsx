"use client"

import { useState, useEffect } from "react"
import Image, { type ImageProps } from "next/image"
import { usePerformance } from "@/contexts/performance-context"

interface OptimizedImageProps extends Omit<ImageProps, "onLoad" | "onError"> {
  lowQualitySrc?: string
  loadingPriority?: "high" | "medium" | "low"
  blurhash?: string
}

export function NextOptimizedImage({
  src,
  alt,
  lowQualitySrc,
  loadingPriority = "medium",
  priority,
  blurhash,
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

  // Generate placeholder blur data URL if blurhash is provided
  const placeholderDataUrl = blurhash
    ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1 1"><rect width="1" height="1" fill="#cccccc"/></svg>')}`
    : undefined

  return (
    <div className={`relative ${props.className || ""}`} style={props.style}>
      <Image
        {...props}
        src={imageSrc || "/placeholder.svg"}
        alt={alt}
        className={`${props.className || ""} ${isLoaded ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
        onLoadingComplete={() => setIsLoaded(true)}
        loading={priority ? "eager" : "lazy"}
        placeholder={blurhash ? "blur" : undefined}
        blurDataURL={placeholderDataUrl}
        sizes={props.sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"} // Responsive sizes
        fetchPriority={loadingPriority === "high" ? "high" : loadingPriority === "medium" ? "auto" : "low"} // New in Next.js 14
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
