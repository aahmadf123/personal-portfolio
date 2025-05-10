"use client"

import type React from "react"

import { forwardRef } from "react"
import { Spinner } from "./spinner"
import { cn } from "@/lib/utils"
import styles from "./loading-button.module.css"

export interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive"
  size?: "sm" | "md" | "lg" | "icon"
}

const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ className, children, variant = "primary", size = "md", isLoading = false, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(styles.loadingButton, styles[variant], styles[size], isLoading && styles.loading, className)}
        disabled={isLoading || disabled}
        ref={ref}
        {...props}
      >
        {isLoading && (
          <div className={styles.loadingSpinner}>
            <Spinner size="sm" />
          </div>
        )}
        <span className={isLoading ? styles.loadingContent : ""}>{children}</span>
      </button>
    )
  },
)

LoadingButton.displayName = "LoadingButton"

export { LoadingButton }
