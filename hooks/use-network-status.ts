"use client"

import { useState, useEffect } from "react"

export function useNetworkStatus() {
  // Default to true (online) for SSR
  const [isOnline, setIsOnline] = useState(true)
  const [wasOffline, setWasOffline] = useState(false)

  useEffect(() => {
    // Set initial state based on navigator.onLine
    setIsOnline(typeof navigator !== "undefined" ? navigator.onLine : true)

    const handleOnline = () => {
      setIsOnline(true)
      // If we were previously offline, mark that we've recovered
      if (!navigator.onLine) {
        setWasOffline(true)
      }
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    // Add event listeners
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Clean up
    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return { isOnline, wasOffline, setWasOffline }
}
