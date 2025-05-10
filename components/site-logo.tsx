"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface SiteLogoProps {
  size?: number
  className?: string
  animated?: boolean
  variant?: "default" | "simple" | "minimal"
}

export function SiteLogo({ size = 40, className, animated = true, variant = "default" }: SiteLogoProps) {
  // For simple and minimal variants, just use the static image with proper styling
  if (variant === "simple" || variant === "minimal") {
    const imgSize = variant === "minimal" ? Math.round(size * 0.8) : size
    return (
      <div className={cn("relative flex items-center justify-center", className)}>
        <div className="overflow-hidden rounded-full">
          <Image
            src="/android-chrome-512x512.png"
            alt="Site Logo"
            width={imgSize}
            height={imgSize}
            className={cn("object-contain", variant === "minimal" && "opacity-90")}
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
            priority
          />
        </div>
      </div>
    )
  }

  // For the default variant with optional animation
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {animated ? (
        <motion.div
          initial={{ opacity: 0.9, scale: 0.95 }}
          animate={{
            opacity: 1,
            scale: [0.98, 1.02, 0.99, 1],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          className="relative overflow-hidden rounded-full"
        >
          <Image
            src="/android-chrome-512x512.png"
            alt="Site Logo"
            width={size}
            height={size}
            className="object-contain"
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
            priority
          />
        </motion.div>
      ) : (
        <div className="overflow-hidden rounded-full">
          <Image
            src="/android-chrome-512x512.png"
            alt="Site Logo"
            width={size}
            height={size}
            className="object-contain"
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
            priority
          />
        </div>
      )}
    </div>
  )
}
