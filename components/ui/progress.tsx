"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import styles from "./progress.module.css"

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
  size?: "sm" | "md" | "lg"
  variant?: "default" | "success" | "warning" | "error" | "info"
  indeterminate?: boolean
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, max = 100, size = "md", variant = "default", indeterminate = false, ...props }, ref) => {
    const percentage = value != null ? (Math.min(Math.max(0, value), max) / max) * 100 : 0

    return (
      <div
        className={cn(
          styles.progressContainer,
          styles[size],
          styles[variant],
          indeterminate && styles.indeterminate,
          className,
        )}
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={indeterminate ? undefined : value}
        {...props}
      >
        <div className={styles.progressBar} style={indeterminate ? undefined : { width: `${percentage}%` }} />
      </div>
    )
  },
)

Progress.displayName = "Progress"

export { Progress }
