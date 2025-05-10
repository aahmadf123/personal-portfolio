"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { listImages, deleteImage, type UploadedImage } from "@/lib/blob-service"
import { Loader2, Search, Trash2, Copy, Check, RefreshCw } from "lucide-react"
import Image from "next/image"
import { ImageUploader } from "./image-uploader"

interface ImageGalleryProps {
  onSelectImage?: (image: UploadedImage) => void
  selectable?: boolean
  className?: string
}

export function ImageGallery({ onSelectImage, selectable = false, className }: ImageGalleryProps) {
  const [images, setImages] = useState<UploadedImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFolder, setSelectedFolder] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const [showUploader, setShowUploader] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const folderOptions = [
    { value: "all", label: "All Images" },
    { value: "projects", label: "Projects" },
    { value: "blog", label: "Blog Posts" },
    { value: "case-studies", label: "Case Studies" },
    { value: "skills", label: "Skills" },
    { value: "profile", label: "Profile" },
    { value: "general", label: "General" },
  ]

  const loadImages = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const prefix = selectedFolder === "all" ? "" : selectedFolder + "/"
      const imageList = await listImages(prefix)
      setImages(imageList)
    } catch (error) {
      console.error("Error loading images:", error)
      setError("Failed to load images. Please check your authentication status and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Only load in client-side
    if (typeof window !== "undefined") {
      loadImages()
    }
  }, [selectedFolder])

  const handleDeleteImage = async (pathname: string) => {
    if (!confirm("Are you sure you want to delete this image? This action cannot be undone.")) {
      return
    }

    try {
      await deleteImage(pathname)
      setImages(images.filter((img) => img.pathname !== pathname))
    } catch (error) {
      console.error("Error deleting image:", error)
      alert("Failed to delete image")
    }
  }

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopiedUrl(url)
    setTimeout(() => setCopiedUrl(null), 2000)
  }

  const handleUploadComplete = (image: UploadedImage) => {
    setImages([image, ...images])
    setShowUploader(false)
  }

  const filteredImages = images.filter((image) => {
    if (!searchQuery) return true
    return image.pathname.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  return (
    <div className={className}>
      <div className="flex flex-col space-y-4">
        {error && <div className="p-4 border border-red-300 bg-red-50 text-red-800 rounded-md">{error}</div>}

        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={selectedFolder} onValueChange={setSelectedFolder}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by folder" />
            </SelectTrigger>
            <SelectContent>
              {folderOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search images..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={loadImages} size="icon" title="Refresh">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button onClick={() => setShowUploader(!showUploader)}>
              {showUploader ? "Hide Uploader" : "Upload Image"}
            </Button>
          </div>
        </div>

        {showUploader && (
          <ImageUploader
            onUploadComplete={handleUploadComplete}
            folder={selectedFolder === "all" ? "general" : selectedFolder}
          />
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-12 border rounded-md bg-muted/20">
            <p className="text-muted-foreground">No images found</p>
            {selectedFolder !== "all" && (
              <Button variant="link" onClick={() => setSelectedFolder("all")}>
                View all images
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((image) => (
              <Card key={image.pathname} className="overflow-hidden">
                <div className="relative aspect-video bg-muted">
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt={image.pathname.split("/").pop() || "Image"}
                    fill
                    className="object-cover"
                  />
                  {selectable && (
                    <Button className="absolute bottom-2 right-2" size="sm" onClick={() => onSelectImage?.(image)}>
                      Select
                    </Button>
                  )}
                </div>
                <CardContent className="p-3">
                  <div className="text-xs truncate mb-1" title={image.pathname}>
                    {image.pathname.split("/").pop()}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{formatFileSize(image.size)}</span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleCopyUrl(image.url)}
                        title="Copy URL"
                      >
                        {copiedUrl === image.url ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteImage(image.pathname)}
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
