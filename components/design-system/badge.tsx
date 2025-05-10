import type React from "react"
import { cssm } from "@/lib/css-module-utils"
import styles from "@/styles/design-system/badge.module.css"

type BadgeVariant = "primary" | "secondary" | "tertiary" | "accent" | "success" | "warning" | "error" | "info"

type BadgeSize = "sm" | "md" | "lg"

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  size?: BadgeSize
  outline?: boolean
  withIcon?: boolean
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "primary",
  size = "md",
  outline = false,
  withIcon = false,
  className,
  ...props
}) => {
  const badgeClasses = cssm(
    styles.badge,
    styles[`badge-${variant}`],
    styles[`badge-${size}`],
    outline && styles["badge-outline"],
    withIcon && styles["badge-with-icon"],
    className,
  )

  return (
    <span className={badgeClasses} {...props}>
      {children}
    </span>
  )
}
