import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SectionWithContainerProps {
  children: ReactNode
  className?: string
  containerClassName?: string
  id?: string
  as?: keyof JSX.IntrinsicElements
}

/**
 * SectionWithContainer - A component that creates a section with a container-query enabled container
 * Allows for creating sections that adapt based on their container size rather than just viewport size
 */
export function SectionWithContainer({
  children,
  className,
  containerClassName,
  id,
  as: Component = "section",
}: SectionWithContainerProps) {
  return (
    <Component id={id} className={cn("py-16 md:py-24 relative", className)}>
      <div className={cn("container px-4 md:px-6 @container", containerClassName)}>{children}</div>
    </Component>
  )
}

/**
 * SectionTitle - A component for consistent section titles with text balancing
 */
export function SectionTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("mb-12 text-center", className)}>
      <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-teal-500 to-cyan-500 text-transparent bg-clip-text inline-block mb-4 text-balance">
        {children}
      </h2>
      <div className="w-24 h-1 bg-gradient-to-r from-blue-400 via-teal-500 to-cyan-500 mx-auto rounded-full"></div>
    </div>
  )
}

/**
 * SectionSubtitle - A component for consistent section subtitles with text-pretty for better wrapping
 */
export function SectionSubtitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("text-muted-foreground max-w-3xl mx-auto text-center mb-12 text-lg text-pretty", className)}>
      {children}
    </p>
  )
}
