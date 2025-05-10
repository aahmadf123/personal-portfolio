import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { cssm } from "@/lib/css-module-utils"
import styles from "@/styles/design-system/card.module.css"

type CardVariant = "primary" | "secondary" | "tertiary" | "accent" | "default"
type CardSize = "sm" | "md" | "lg" | "full"
type CardShadow = "sm" | "md" | "lg" | "none"

interface CardProps {
  children: React.ReactNode
  variant?: CardVariant
  size?: CardSize
  shadow?: CardShadow
  hover?: boolean
  interactive?: boolean
  horizontal?: boolean
  href?: string
  className?: string
}

interface CardImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  position?: "top" | "bottom"
  className?: string
}

interface CardHeaderProps {
  children: React.ReactNode
  className?: string
}

interface CardBodyProps {
  children: React.ReactNode
  className?: string
}

interface CardFooterProps {
  children: React.ReactNode
  className?: string
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = "default",
  size = "full",
  shadow = "none",
  hover = false,
  interactive = false,
  horizontal = false,
  href,
  className,
  ...props
}) => {
  const cardClasses = cssm(
    styles.card,
    variant !== "default" && styles[`card-${variant}`],
    styles[`card-${size}`],
    shadow !== "none" && styles[`card-shadow-${shadow}`],
    hover && styles["card-hover"],
    interactive && styles["card-interactive"],
    horizontal && styles["card-horizontal"],
    className,
  )

  const cardContent = (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="block">
        {cardContent}
      </Link>
    )
  }

  return cardContent
}

export const CardImage: React.FC<CardImageProps> = ({
  src,
  alt,
  width = 800,
  height = 400,
  position = "top",
  className,
  ...props
}) => {
  const imageClasses = cssm(styles["card-image"], styles[`card-image-${position}`], className)

  return (
    <Image
      src={src || "/placeholder.svg"}
      alt={alt}
      width={width}
      height={height}
      className={imageClasses}
      {...props}
    />
  )
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className, ...props }) => {
  return (
    <div className={cssm(styles["card-header"], className)} {...props}>
      {children}
    </div>
  )
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className, ...props }) => {
  return (
    <div className={cssm(styles["card-body"], className)} {...props}>
      {children}
    </div>
  )
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className, ...props }) => {
  return (
    <div className={cssm(styles["card-footer"], className)} {...props}>
      {children}
    </div>
  )
}
