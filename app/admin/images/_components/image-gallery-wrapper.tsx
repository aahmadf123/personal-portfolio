"use client"

import dynamic from "next/dynamic"

// Use dynamic import to ensure client-side only rendering
const ImageGallery = dynamic(() => import("@/components/admin/image-gallery").then((mod) => mod.ImageGallery), {
  ssr: false,
})

export function ImageGalleryWrapper() {
  return <ImageGallery />
}
