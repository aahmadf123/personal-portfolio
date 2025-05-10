"use client"

import { useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function PageLoadingIndicator() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isNavigating, setIsNavigating] = useState(false)

  useEffect(() => {
    setIsNavigating(false)
  }, [pathname, searchParams])

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsNavigating(true)
    }

    const handleRouteChangeComplete = () => {
      setIsNavigating(false)
    }

    // Note: Next.js App Router doesn't have router events like Pages Router
    // This is a simplified version that may not catch all navigation events
    window.addEventListener("beforeunload", handleRouteChangeStart)
    window.addEventListener("load", handleRouteChangeComplete)

    return () => {
      window.removeEventListener("beforeunload", handleRouteChangeStart)
      window.removeEventListener("load", handleRouteChangeComplete)
    }
  }, [])

  if (!isNavigating) return null

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <div className="h-1 bg-blue-500">
        <div className="h-1 bg-blue-600 animate-pulse w-[70%]" />
      </div>
    </div>
  )
}
