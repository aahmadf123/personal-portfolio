/**
 * Performance optimization utilities
 */

// Debounce function to limit how often a function can be called
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle function to limit the rate at which a function is executed
export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle = false

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Request animation frame with fallback
export function requestAnimationFrameWithFallback(callback: FrameRequestCallback): number {
  if (typeof window !== "undefined") {
    return window.requestAnimationFrame(callback)
  }
  return 0 // Fallback for SSR
}

// Cancel animation frame with fallback
export function cancelAnimationFrameWithFallback(id: number): void {
  if (typeof window !== "undefined") {
    window.cancelAnimationFrame(id)
  }
}

// Check if device is low-end based on device memory and hardware concurrency
export function isLowEndDevice(): boolean {
  if (typeof navigator === "undefined") return false

  // Check for device memory API (Chrome)
  const lowMemory = "deviceMemory" in navigator && (navigator as any).deviceMemory < 4

  // Check for hardware concurrency (number of logical processors)
  const lowConcurrency = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4

  // Check for connection type if available
  const slowConnection =
    "connection" in navigator &&
    (navigator as any).connection &&
    ((navigator as any).connection.saveData ||
      ["slow-2g", "2g", "3g"].includes((navigator as any).connection.effectiveType))

  return lowMemory || lowConcurrency || slowConnection
}

// Detect if reduced motion is preferred
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

// Optimize rendering based on visibility
export function optimizeForVisibility(element: HTMLElement | null, callback: () => void): () => void {
  if (!element || typeof IntersectionObserver === "undefined") {
    // Fallback if element is null or IntersectionObserver is not supported
    callback()
    return () => {}
  }

  let observer: IntersectionObserver
  let isVisible = false
  let rafId: number | null = null

  const cleanup = () => {
    if (observer) {
      observer.disconnect()
    }
    if (rafId !== null) {
      cancelAnimationFrameWithFallback(rafId)
    }
  }

  observer = new IntersectionObserver(
    (entries) => {
      const [entry] = entries
      const wasVisible = isVisible
      isVisible = entry.isIntersecting

      // Only run the callback when transitioning from not visible to visible
      if (!wasVisible && isVisible) {
        rafId = requestAnimationFrameWithFallback(callback)
      }
    },
    {
      threshold: 0.1, // 10% visibility is enough to trigger
      rootMargin: "100px", // Start loading a bit before it comes into view
    },
  )

  observer.observe(element)
  return cleanup
}

// Get performance mode based on device capabilities
export function getPerformanceMode(): "high" | "medium" | "low" {
  if (prefersReducedMotion() || isLowEndDevice()) {
    return "low"
  }

  // Additional checks for medium performance
  if (typeof navigator !== "undefined") {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    if (isMobile) {
      return "medium"
    }
  }

  return "high"
}
