import type React from "react"

interface AnimatedElementProps {
  children: React.ReactNode
  className?: string
  animation?: string
  delay?: number
  duration?: number
  as?: React.ElementType
}

export function AnimatedElement({ children, className = "", as: Component = "div" }: AnimatedElementProps) {
  // Simply render children without any animations
  return <Component className={className}>{children}</Component>
}
