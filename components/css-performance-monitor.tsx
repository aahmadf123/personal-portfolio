"use client"

import { useEffect, useState } from "react"

interface CSSPerformanceStats {
  stylesheetCount: number
  totalStylesheetSize: number
  inlineStyleCount: number
  unusedRules: number
  renderBlockingTime: number
}

export function CSSPerformanceMonitor() {
  const [stats, setStats] = useState<CSSPerformanceStats | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== "development") return

    const calculateStats = () => {
      // Get all stylesheets
      const sheets = document.styleSheets
      const totalSize = 0
      let ruleCount = 0
      let unusedRules = 0

      // Calculate stylesheet sizes and rule counts
      for (let i = 0; i < sheets.length; i++) {
        try {
          const rules = sheets[i].cssRules
          ruleCount += rules.length

          // Estimate unused rules (this is a simplified approach)
          for (let j = 0; j < rules.length; j++) {
            const rule = rules[j]
            if (rule instanceof CSSStyleRule) {
              try {
                const elements = document.querySelectorAll(rule.selectorText)
                if (elements.length === 0) {
                  unusedRules++
                }
              } catch (e) {
                // Invalid selector, skip
              }
            }
          }
        } catch (e) {
          // CORS error or other issue, skip
        }
      }

      // Count inline styles
      const elementsWithStyle = document.querySelectorAll("[style]")

      // Get render blocking time from performance API
      let renderBlockingTime = 0
      if (window.performance && window.performance.getEntriesByType) {
        const resources = window.performance.getEntriesByType("resource")
        for (const resource of resources) {
          if (resource.initiatorType === "link" || resource.initiatorType === "style") {
            renderBlockingTime += resource.responseEnd - resource.startTime
          }
        }
      }

      setStats({
        stylesheetCount: sheets.length,
        totalStylesheetSize: totalSize,
        inlineStyleCount: elementsWithStyle.length,
        unusedRules,
        renderBlockingTime,
      })
    }

    // Calculate stats after page load
    if (document.readyState === "complete") {
      calculateStats()
    } else {
      window.addEventListener("load", calculateStats)
      return () => window.removeEventListener("load", calculateStats)
    }
  }, [])

  if (!stats || process.env.NODE_ENV !== "development") return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button onClick={() => setIsVisible(!isVisible)} className="bg-gray-800 text-white p-2 rounded-full shadow-lg">
        CSS
      </button>

      {isVisible && (
        <div className="absolute bottom-12 right-0 bg-gray-800 text-white p-4 rounded-lg shadow-xl w-80">
          <h3 className="text-lg font-bold mb-2">CSS Performance</h3>
          <ul className="space-y-1 text-sm">
            <li>Stylesheets: {stats.stylesheetCount}</li>
            <li>Inline styles: {stats.inlineStyleCount}</li>
            <li>Unused rules: {stats.unusedRules}</li>
            <li>Render blocking: {stats.renderBlockingTime.toFixed(2)}ms</li>
          </ul>
          <div className="mt-2 text-xs text-gray-400">Only visible in development mode</div>
        </div>
      )}
    </div>
  )
}
