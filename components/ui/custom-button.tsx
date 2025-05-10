import React from "react"
import Link from "next/link"
import { cssm } from "@/lib/css-module-utils"
import styles from "./button.module.css"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive"
  size?: "sm" | "md" | "lg"
  asChild?: boolean
  fullWidth?: boolean
  withIcon?: boolean
  href?: string
  external?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      asChild = false,
      fullWidth = false,
      withIcon = false,
      href,
      external = false,
      children,
      ...props
    },
    ref,
  ) => {
    const buttonClasses = cssm(
      styles.button,
      styles[`button-${variant}`],
      styles[`button-${size}`],
      fullWidth && styles["button-full"],
      withIcon && styles["button-with-icon"],
      className,
    )

    if (asChild && href) {
      const linkProps = external ? { target: "_blank", rel: "noopener noreferrer" } : {}

      return (
        <Link href={href} {...linkProps} className={buttonClasses}>
          {children}
        </Link>
      )
    }

    return (
      <button className={buttonClasses} ref={ref} {...props}>
        {children}
      </button>
    )
  },
)

Button.displayName = "Button"

export { Button }
