"use client"

import React, { useState, useRef } from "react"
import Link from "next/link"
import { cssm } from "@/lib/css-module-utils"
import styles from "@/styles/design-system/button.module.css"

type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "accent"
  | "outline"
  | "outline-primary"
  | "outline-secondary"
  | "ghost"
  | "ghost-primary"
  | "link"
  | "destructive"

type ButtonSize = "sm" | "md" | "lg"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  withIcon?: boolean
  iconPosition?: "left" | "right"
  iconOnly?: boolean
  loading?: boolean
  ripple?: boolean
  href?: string
  external?: boolean
  className?: string
  children: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      withIcon = false,
      iconPosition = "left",
      iconOnly = false,
      loading = false,
      ripple = false,
      href,
      external = false,
      className,
      children,
      onClick,
      ...props
    },
    ref,
  ) => {
    const [rippleArray, setRippleArray] = useState<{ x: number; y: number; size: number }[]>([])
    const buttonRef = useRef<HTMLButtonElement>(null)

    // Merge refs
    const mergedRef = (node: HTMLButtonElement) => {
      if (typeof ref === "function") {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
      buttonRef.current = node
    }

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (ripple && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect()
        const size = Math.max(rect.width, rect.height)
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        setRippleArray([...rippleArray, { x, y, size }])

        // Clean up ripple effect after animation
        setTimeout(() => {
          setRippleArray((prev) => prev.slice(1))
        }, 600)
      }

      if (onClick) {
        onClick(e)
      }
    }

    const buttonClasses = cssm(
      styles.button,
      styles[`button-${variant}`],
      styles[`button-${size}`],
      fullWidth && styles["button-full"],
      withIcon && styles["button-with-icon"],
      iconPosition === "left" && withIcon && !iconOnly && styles["button-icon-left"],
      iconPosition === "right" && withIcon && !iconOnly && styles["button-icon-right"],
      iconOnly && styles["button-icon"],
      loading && styles["button-loading"],
      ripple && styles["button-ripple"],
      className,
    )

    // If href is provided, render as a link
    if (href) {
      const linkProps = external ? { target: "_blank", rel: "noopener noreferrer" } : {}

      return (
        <Link href={href} {...linkProps} className={buttonClasses} onClick={handleClick as any}>
          {loading && (
            <span className={styles["button-loading-spinner"]}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" />
                <path
                  d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          )}
          <span className={loading ? styles["button-loading-text"] : undefined}>{children}</span>
          {ripple &&
            rippleArray.map((ripple, i) => (
              <span
                key={i}
                className={styles.ripple}
                style={{
                  left: ripple.x,
                  top: ripple.y,
                  width: ripple.size,
                  height: ripple.size,
                }}
              />
            ))}
        </Link>
      )
    }

    // Otherwise render as a button
    return (
      <button
        ref={mergedRef}
        className={buttonClasses}
        onClick={handleClick}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && (
          <span className={styles["button-loading-spinner"]}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" />
              <path
                d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </span>
        )}
        <span className={loading ? styles["button-loading-text"] : undefined}>{children}</span>
        {ripple &&
          rippleArray.map((ripple, i) => (
            <span
              key={i}
              className={styles.ripple}
              style={{
                left: ripple.x,
                top: ripple.y,
                width: ripple.size,
                height: ripple.size,
              }}
            />
          ))}
      </button>
    )
  },
)

Button.displayName = "Button"
