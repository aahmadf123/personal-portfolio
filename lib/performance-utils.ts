/**
 * Utility functions for performance optimization
 */

/**
 * Creates a debounced function that only invokes the provided function after a specified
 * delay (in milliseconds) has passed without any new invocations.
 *
 * @param func The function to debounce
 * @param wait The time in milliseconds to wait before invoking the function
 * @returns A debounced version of the function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function debounced(this: any, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      timeoutId = null;
      func.apply(this, args);
    }, wait);
  };
}

/**
 * Creates a throttled function that only invokes the provided function at most once per
 * specified time period (in milliseconds).
 *
 * @param func The function to throttle
 * @param wait The time in milliseconds to throttle invocations
 * @returns A throttled version of the function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let lastCallTime = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function throttled(this: any, ...args: Parameters<T>) {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTime;
    const timeUntilNextCall = wait - timeSinceLastCall;

    if (timeUntilNextCall <= 0) {
      // If enough time has passed, call the function immediately
      lastCallTime = now;
      func.apply(this, args);
    } else if (!timeoutId) {
      // Schedule a call after the remaining time
      timeoutId = setTimeout(() => {
        lastCallTime = Date.now();
        timeoutId = null;
        func.apply(this, args);
      }, timeUntilNextCall);
    }
  };
}

// Request animation frame with fallback
export function requestAnimationFrameWithFallback(
  callback: FrameRequestCallback
): number {
  if (typeof window !== "undefined") {
    return window.requestAnimationFrame(callback);
  }
  return 0; // Fallback for SSR
}

// Cancel animation frame with fallback
export function cancelAnimationFrameWithFallback(id: number): void {
  if (typeof window !== "undefined") {
    window.cancelAnimationFrame(id);
  }
}

// Check if device is low-end based on device memory and hardware concurrency
export function isLowEndDevice(): boolean {
  if (typeof navigator === "undefined") return false;

  // Check for device memory API (Chrome)
  const lowMemory =
    "deviceMemory" in navigator && (navigator as any).deviceMemory < 4;

  // Check for hardware concurrency (number of logical processors)
  const lowConcurrency =
    navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;

  // Check for connection type if available
  const slowConnection =
    "connection" in navigator &&
    (navigator as any).connection &&
    ((navigator as any).connection.saveData ||
      ["slow-2g", "2g", "3g"].includes(
        (navigator as any).connection.effectiveType
      ));

  return lowMemory || lowConcurrency || slowConnection;
}

// Detect if reduced motion is preferred
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Get performance mode based on device capabilities
export function getPerformanceMode(): "high" | "medium" | "low" {
  if (prefersReducedMotion() || isLowEndDevice()) {
    return "low";
  }

  // Additional checks for medium performance
  if (typeof navigator !== "undefined") {
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    if (isMobile) {
      return "medium";
    }
  }

  return "high";
}
