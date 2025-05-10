"use client"
import { useRouter } from "next/router"
import { getCriticalCSSForRoute } from "@/lib/critical-css"

export function CriticalCSSHead() {
  const router = useRouter()
  const criticalCSS = getCriticalCSSForRoute(router.pathname)

  // Only render if we have critical CSS
  if (!criticalCSS) return null

  return <style data-critical="true" dangerouslySetInnerHTML={{ __html: criticalCSS }} />
}
