"use client"

import { useEffect, useState } from "react"

interface LazyStylesProps {
  href: string
  media?: string
  id?: string
  onLoad?: () => void
}

export function LazyStyles({ href, media = "all", id, onLoad }: LazyStylesProps) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // Skip if already loaded or no window
    if (loaded || typeof window === "undefined") return

    // Check if this stylesheet is already loaded
    const existingLink = document.querySelector(`link[href="${href}"]`)
    if (existingLink) {
      setLoaded(true)
      onLoad?.()
      return
    }

    // Create link element
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = href
    link.media = media
    if (id) link.id = id

    // Handle load event
    link.onload = () => {
      setLoaded(true)
      onLoad?.()
    }

    // Handle error
    link.onerror = () => {
      console.error(`Failed to load stylesheet: ${href}`)
    }

    // Add to document
    document.head.appendChild(link)

    // Cleanup
    return () => {
      // Only remove if we added it
      if (document.head.contains(link)) {
        document.head.removeChild(link)
      }
    }
  }, [href, id, loaded, media, onLoad])

  return null
}
