"use client"

import { useEffect } from "react"

interface ViewTrackerProps {
  type: "project" | "blog"
  id: number
  slug: string
}

export function ViewTracker({ type, id, slug }: ViewTrackerProps) {
  useEffect(() => {
    // Only track views in production and when the component mounts
    if (process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_TRACK_VIEWS_IN_DEV === "true") {
      const trackView = async () => {
        try {
          const endpoint = type === "project" ? "/api/analytics/track-project-view" : "/api/analytics/track-blog-view"

          await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id,
              slug,
              referrer: document.referrer || null,
            }),
          })
        } catch (error) {
          // Silently fail to not disrupt user experience
          console.error(`Error tracking ${type} view:`, error)
        }
      }

      // Small delay to ensure the page has loaded
      const timeoutId = setTimeout(trackView, 1500)
      return () => clearTimeout(timeoutId)
    }
  }, [type, id, slug])

  // This component doesn't render anything
  return null
}
