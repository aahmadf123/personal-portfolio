"use client";

import { useState } from "react";
import Image from "next/image";

interface FallbackImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  onError?: () => void;
  loading?: "lazy" | "eager";
}

export function FallbackImage({
  src,
  alt,
  width,
  height,
  fill,
  className,
  priority,
  onError,
  loading,
}: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc || "/placeholder.svg"}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      className={className}
      priority={priority}
      loading={loading}
      onError={(e) => {
        setImgSrc("/broken-image-icon.png");
        onError?.();
      }}
    />
  );
}
