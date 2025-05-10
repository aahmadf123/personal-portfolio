"use client"

import Image, { type ImageProps } from "next/image"
import { useState, useEffect } from "react"
import { useResponsive } from "@/hooks/use-responsive"

interface ResponsiveImageProps extends Omit<ImageProps, "src"> {
  mobileSrc: string
  tabletSrc?: string
  desktopSrc: string
  alt: string
}

export function ResponsiveImage({ mobileSrc, tabletSrc, desktopSrc, alt, ...props }: ResponsiveImageProps) {
  const { isMobile, isTablet } = useResponsive()
  const [src, setSrc] = useState<string>(desktopSrc)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isMobile) {
      setSrc(mobileSrc)
    } else if (isTablet && tabletSrc) {
      setSrc(tabletSrc)
    } else {
      setSrc(desktopSrc)
    }
  }, [isMobile, isTablet, mobileSrc, tabletSrc, desktopSrc])

  return (
    <div className={`relative ${isLoading ? "animate-pulse bg-muted/20" : ""}`}>
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        onLoad={() => setIsLoading(false)}
        {...props}
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
      />
    </div>
  )
}
