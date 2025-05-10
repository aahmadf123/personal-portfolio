"use client"

import { useReducedMotion } from "@/hooks/use-reduced-motion"

interface PatternProps {
  className?: string
  color?: string
  opacity?: number
}

export function DotPattern({ className = "", color = "currentColor", opacity = 0.1 }: PatternProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`} aria-hidden="true">
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <defs>
          <pattern id="dot-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill={color} fillOpacity={opacity} />
          </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#dot-pattern)" />
      </svg>
    </div>
  )
}

export function GridPattern({ className = "", color = "currentColor", opacity = 0.05 }: PatternProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`} aria-hidden="true">
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <defs>
          <pattern id="grid-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke={color} strokeOpacity={opacity} strokeWidth="1" />
          </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#grid-pattern)" />
      </svg>
    </div>
  )
}

export function WavePattern({ className = "", color = "currentColor", opacity = 0.1 }: PatternProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`} aria-hidden="true">
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="wave-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path
              d="M 0 50 C 20 30, 40 30, 50 50 C 60 70, 80 70, 100 50 L 100 100 L 0 100 Z"
              fill={color}
              fillOpacity={opacity}
            />
            {!prefersReducedMotion && (
              <animateTransform
                attributeName="patternTransform"
                type="translate"
                from="0 0"
                to="100 0"
                dur="20s"
                repeatCount="indefinite"
              />
            )}
          </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#wave-pattern)" />
      </svg>
    </div>
  )
}
