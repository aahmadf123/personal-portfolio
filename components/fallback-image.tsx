"use client"

import { useState } from "react"
import Image, { type ImageProps } from "next/image"

interface FallbackImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string
  onError?: () => void
}

export function FallbackImage({
  src,
  alt,
  fallbackSrc = "/broken-image-icon.png",
  onError,
  ...props
}: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasErrored, setHasErrored] = useState(false)

  const handleError = () => {
    if (!hasErrored) {
      setImgSrc(fallbackSrc)
      setHasErrored(true)
      if (onError) onError()
    }
  }

  return <Image {...props} src={imgSrc || "/placeholder.svg"} alt={alt} onError={handleError} />
}
