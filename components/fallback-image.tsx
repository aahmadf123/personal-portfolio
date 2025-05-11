"use client";

import { useState } from "react";
import Image from "next/image";

interface FallbackImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  priority?: boolean;
}

export function FallbackImage({
  src,
  alt,
  fill,
  className,
  priority,
}: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc || "/placeholder.svg"}
      alt={alt}
      fill={fill}
      className={className}
      priority={priority}
      onError={() => setImgSrc("/broken-image-icon.png")}
    />
  );
}
