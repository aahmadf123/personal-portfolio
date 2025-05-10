"use client"

import type React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import styles from "@/styles/design-system/alert.module.css"

export interface AlertProps {
  /**
   * The variant of the alert
   */
  variant?: "info" | "success" | "warning" | "error" | "neutral"
  /**
   * The size of the alert
   */
  size?: "sm" | "md" | "lg"
  /**
   * The title of the alert
   */
  title?: string
  /**
   * Whether the alert is dismissible
   */
  dismissible?: boolean
  /**
   * Whether the alert has a border
   */
  bordered?: boolean
  /**
   * The icon to display in the alert
   */
  icon?: React.ReactNode
  /**
   * The content of the alert
   */
  children: React.ReactNode
  /**
   * Additional CSS class names
   */
  className?: string
  /**
   * Callback when the alert is dismissed
   */
  onDismiss?: () => void
}

export const Alert: React.FC<AlertProps> = ({
  variant = "info",
  size = "md",
  title,
  dismissible = false,
  bordered = false,
  icon,
  children,
  className,
  onDismiss,
}) => {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) {
    return null
  }

  const handleDismiss = () => {
    setDismissed(true)
    if (onDismiss) {
      onDismiss()
    }
  }

  return (
    <div
      className={cn(
        styles.alert,
        styles[variant],
        styles[size],
        !icon && styles.noIcon,
        bordered && styles.bordered,
        className,
      )}
      role="alert"
    >
      {icon && <div className={styles.icon}>{icon}</div>}
      <div className={styles.content}>
        {title && <div className={styles.title}>{title}</div>}
        <div>{children}</div>
      </div>
      {dismissible && (
        <button type="button" className={styles.close} onClick={handleDismiss} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  )
}
