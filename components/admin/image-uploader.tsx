"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { uploadImage } from "@/lib/blob-service"
import { Loader2, Upload, ImageIcon, FileIcon } from "lucide-react"
import Image from "next/image"
import { ImageGalleryPicker } from "./image-gallery-picker"

interface ImageUploaderProps {
  onImageSelected: (url: string) => void
  currentImage?: string | null
  folder?: string
  className?: string
  acceptedFileTypes?: string
}

export function ImageUploader({
  onImageSelected,
  currentImage,
  folder = "general",
  className,
  acceptedFileTypes = "image/*",
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFolder, setSelectedFolder] = useState(folder)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [fileType, setFileType] = useState<string>("image")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const folderOptions = [
    { value: "projects", label: "Projects" },
    { value: "blog", label: "Blog Posts" },
    { value: "case-studies", label: "Case Studies" },
    { value: "skills", label: "Skills" },
    { value: "profile", label: "Profile" },
    { value: "documents", label: "Documents" },
    { value: "general", label: "General" },
  ]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Determine file type
      if (file.type.startsWith("image/")) {
        setFileType("image")
      } else if (file.type === "application/pdf") {
        setFileType("pdf")
      } else {
        setFileType("file")
      }

      // Create a preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            setPreviewUrl(e.target.result as string)
          }
        }
        reader.readAsDataURL(file)
      } else {
        // For non-images, just show the file name
        setPreviewUrl(null)
      }
    } else {
      setPreviewUrl(currentImage)
    }
  }

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + Math.random() * 15
          return newProgress > 90 ? 90 : newProgress
        })
      }, 300)

      const uploadedImage = await uploadImage(file, selectedFolder)

      clearInterval(progressInterval)
      setUploadProgress(100)

      // Set the image URL
      onImageSelected(uploadedImage.url)

      // Reset the form
      setTimeout(() => {
        setUploadProgress(0)
        setIsUploading(false)
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      }, 1000)
    } catch (error) {
      console.error("Upload failed:", error)
      setIsUploading(false)
      setUploadProgress(0)
      alert("Upload failed: " + (error instanceof Error ? error.message : "Unknown error"))
    }
  }

  const handleSelectFromGallery = (url: string) => {
    setPreviewUrl(url)
    onImageSelected(url)
  }

  return (
    <div className={className}>
      <div className="space-y-4">
        {previewUrl && fileType === "image" && (
          <div className="relative aspect-video w-full overflow-hidden rounded-md border border-border">
            <Image src={previewUrl || "/placeholder.svg"} alt="Preview" fill className="object-contain" />
          </div>
        )}

        {fileType === "pdf" && fileInputRef.current?.files?.[0] && (
          <div className="flex items-center p-4 rounded-md border border-border">
            <FileIcon className="h-8 w-8 mr-2 text-red-500" />
            <div>
              <p className="font-medium">{fileInputRef.current.files[0].name}</p>
              <p className="text-sm text-muted-foreground">
                {(fileInputRef.current.files[0].size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="image-folder">File Category</Label>
          <Select value={selectedFolder} onValueChange={setSelectedFolder}>
            <SelectTrigger id="image-folder">
              <SelectValue placeholder="Select folder" />
            </SelectTrigger>
            <SelectContent>
              {folderOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="file-upload">Upload File</Label>
          <Input
            id="file-upload"
            type="file"
            accept={acceptedFileTypes}
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <p className="text-xs text-muted-foreground">
            Supported file types: Images (JPG, PNG, GIF, WebP), Documents (PDF)
          </p>
        </div>

        {isUploading && (
          <div className="w-full bg-muted rounded-full h-2.5 mt-4">
            <div
              className="bg-primary h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={handleUpload} disabled={!fileInputRef.current?.files?.[0] || isUploading} className="flex-1">
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload File
              </>
            )}
          </Button>

          {acceptedFileTypes === "image/*" && (
            <Button type="button" variant="outline" onClick={() => setGalleryOpen(true)} className="flex-1">
              <ImageIcon className="mr-2 h-4 w-4" />
              Select from Gallery
            </Button>
          )}
        </div>
      </div>

      {acceptedFileTypes === "image/*" && (
        <ImageGalleryPicker open={galleryOpen} onOpenChange={setGalleryOpen} onSelectImage={handleSelectFromGallery} />
      )}
    </div>
  )
}
