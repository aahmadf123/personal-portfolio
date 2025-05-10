"use client"

import React, { useState } from "react"
import { cn } from "@/lib/utils"
import styles from "@/styles/design-system/avatar.module.css"

export interface AvatarProps {
  /**
   * The source of the avatar image
   */
  src?: string
  /**
   * The alt text for the avatar image
   */
  alt?: string
  /**
   * The fallback content to display when the image fails to load
   */
  fallback?: React.ReactNode
  /**
   * The size of the avatar
   */
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl"
  /**
   * The shape of the avatar
   */
  shape?: "circle" | "square" | "rounded"
  /**
   * The status of the user
   */
  status?: "online" | "offline" | "busy" | "away"
  /**
   * Additional CSS class names
   */
  className?: string
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "",
  fallback,
  size = "md",
  shape = "circle",
  status,
  className,
}) => {
  const [imageError, setImageError] = useState(false)

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <div className={cn(styles.avatar, styles[size], styles[shape], className)}>
      {src && !imageError ? (
        <img src={src || "/placeholder.svg"} alt={alt} className={styles.image} onError={handleImageError} />
      ) : (
        <div className={styles.fallback}>{fallback || alt.charAt(0).toUpperCase()}</div>
      )}
      {status && <span className={cn(styles.status, styles[status])} />}
    </div>
  )
}

export interface AvatarGroupProps {
  /**
   * The maximum number of avatars to display
   */
  max?: number
  /**
   * The children (Avatar components)
   */
  children: React.ReactNode
  /**
   * Additional CSS class names
   */
  className?: string
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({ max, children, className }) => {
  const childrenArray = React.Children.toArray(children)
  const totalAvatars = childrenArray.length
  const visibleAvatars = max ? childrenArray.slice(0, max) : childrenArray
  const remainingAvatars = max ? totalAvatars - max : 0

  return (
    <div className={cn(styles.group, className)}>
      {visibleAvatars}
      {remainingAvatars > 0 && (
        <Avatar fallback={`+${remainingAvatars}`} size={(visibleAvatars[0] as React.ReactElement).props.size || "md"} />
      )}
    </div>
  )
}
