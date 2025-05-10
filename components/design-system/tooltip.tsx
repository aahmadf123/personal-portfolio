"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import styles from "@/styles/design-system/tooltip.module.css"

export interface TooltipProps {
  /**
   * The content to display in the tooltip
   */
  content: React.ReactNode
  /**
   * The position of the tooltip
   */
  position?: "top" | "bottom" | "left" | "right"
  /**
   * The variant of the tooltip
   */
  variant?: "dark" | "light" | "primary"
  /**
   * The element that triggers the tooltip
   */
  children: React.ReactNode
  /**
   * Additional CSS class names
   */
  className?: string
  /**
   * Additional CSS class names for the tooltip
   */
  tooltipClassName?: string
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = "top",
  variant = "dark",
  children,
  className,
  tooltipClassName,
}) => {
  return (
    <div className={cn(styles.tooltipContainer, className)}>
      {children}
      <div className={cn(styles.tooltip, styles[position], styles[variant], tooltipClassName)} role="tooltip">
        {content}
      </div>
    </div>
  )
}
