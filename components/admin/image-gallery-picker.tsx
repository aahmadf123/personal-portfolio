"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { listImages, uploadImage, type UploadedImage } from "@/lib/blob-service"
import { Loader2, Search, Upload, X, Crop, Edit2 } from "lucide-react"
import { ImageCropper } from "./image-cropper"

interface ImageGalleryPickerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectImage: (imageUrl: string, altText?: string) => void
}

export function ImageGalleryPicker({ open, onOpenChange, onSelectImage }: ImageGalleryPickerProps) {
  const [images, setImages] = useState<UploadedImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"gallery" | "upload">("gallery")
  const [uploadingFile, setUploadingFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [altText, setAltText] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [cropperOpen, setCropperOpen] = useState(false)
  const [cropImageSrc, setCropImageSrc] = useState<string>("")
  const [cropImageFile, setCropImageFile] = useState<File | null>(null)
  const [selectedImageForCrop, setSelectedImageForCrop] = useState<UploadedImage | null>(null)

  useEffect(() => {
    if (open) {
      loadImages()
    }
  }, [open])

  useEffect(() => {
    // Clean up preview URL when component unmounts or file changes
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const loadImages = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const imageList = await listImages()
      setImages(imageList)
    } catch (error) {
      console.error("Error loading images:", error)
      setError("Failed to load images")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadingFile(file)
      setCropImageFile(file)
      setAltText(file.name.split(".")[0].replace(/-/g, " ").replace(/_/g, " "))

      // Create preview
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)

      // Open cropper with the file
      setCropImageSrc(objectUrl)
      setCropperOpen(true)
    }
  }

  const handleUpload = async (blob?: Blob, filename?: string) => {
    const fileToUpload = blob
      ? new File([blob], filename || "cropped-image.jpg", {
          type: blob.type || "image/jpeg",
        })
      : uploadingFile

    if (!fileToUpload) return

    setIsUploading(true)
    setUploadProgress(0)
    setError(null)

    try {
      // Simulate progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + 10
          if (newProgress >= 90) {
            clearInterval(interval)
            return 90
          }
          return newProgress
        })
      }, 300)

      // Upload the file
      const uploadedImage = await uploadImage(fileToUpload, "blog")

      clearInterval(interval)
      setUploadProgress(100)

      // Add the new image to the list
      setImages((prev) => [uploadedImage, ...prev])

      // Reset upload state
      setTimeout(() => {
        setIsUploading(false)
        setUploadingFile(null)
        setPreviewUrl(null)
        setUploadProgress(0)
        setActiveTab("gallery")
      }, 1000)
    } catch (error) {
      console.error("Error uploading image:", error)
      setError("Failed to upload image")
      setIsUploading(false)
    }
  }

  const handleSelectImage = (image: UploadedImage) => {
    const fileName = image.pathname.split("/").pop() || ""
    const defaultAlt = fileName.split(".")[0].replace(/-/g, " ").replace(/_/g, " ")
    onSelectImage(image.url, altText || defaultAlt)
    onOpenChange(false)
  }

  const handleCropExisting = (image: UploadedImage) => {
    setCropImageSrc(image.url)
    setSelectedImageForCrop(image)
    setCropperOpen(true)
  }

  const handleCropComplete = async (croppedImageBlob: Blob, filename: string) => {
    // Upload the cropped image
    await handleUpload(croppedImageBlob, filename)
    setCropperOpen(false)
    setSelectedImageForCrop(null)
  }

  const filteredImages = images.filter((image) => {
    if (!searchQuery) return true
    return image.pathname.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Image Gallery</DialogTitle>
          </DialogHeader>

          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "gallery" | "upload")}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
                <TabsTrigger value="upload">Upload New</TabsTrigger>
              </TabsList>

              {activeTab === "gallery" && (
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search images..."
                    className="pl-8 w-[200px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              )}
            </div>

            <TabsContent value="gallery" className="flex-1 overflow-hidden flex flex-col mt-0">
              {error && <div className="bg-red-50 text-red-800 p-3 rounded-md mb-4">{error}</div>}

              {isLoading ? (
                <div className="flex-1 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredImages.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-center p-8 border-2 border-dashed rounded-md">
                  <div>
                    <p className="text-muted-foreground mb-2">No images found</p>
                    <Button variant="outline" onClick={() => setActiveTab("upload")}>
                      Upload an image
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 overflow-y-auto p-1">
                  {filteredImages.map((image) => (
                    <Card
                      key={image.pathname}
                      className="overflow-hidden group cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                    >
                      <div className="relative aspect-square bg-muted" onClick={() => handleSelectImage(image)}>
                        <Image
                          src={image.url || "/placeholder.svg"}
                          alt={image.pathname.split("/").pop() || ""}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/50 transition-opacity flex items-center justify-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-white opacity-90 hover:opacity-100 mr-1"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCropExisting(image)
                            }}
                          >
                            <Crop className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-2">
                        <p className="text-xs truncate" title={image.pathname.split("/").pop()}>
                          {image.pathname.split("/").pop()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="upload" className="flex-1 mt-0">
              <div className="space-y-4">
                {!uploadingFile ? (
                  <div
                    className="border-2 border-dashed rounded-md p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => document.getElementById("file-upload")?.click()}
                  >
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground mb-2">Click or drag and drop to upload an image</p>
                    <Input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <Button variant="outline" size="sm">
                      Select Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
                      {previewUrl && (
                        <Image src={previewUrl || "/placeholder.svg"} alt="Preview" fill className="object-contain" />
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full"
                        onClick={() => {
                          setUploadingFile(null)
                          setPreviewUrl(null)
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-12 bg-black/50 hover:bg-black/70 text-white rounded-full"
                        onClick={() => {
                          if (previewUrl) {
                            setCropImageSrc(previewUrl)
                            setCropperOpen(true)
                          }
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Alt Text</label>
                      <Input
                        value={altText}
                        onChange={(e) => setAltText(e.target.value)}
                        placeholder="Describe this image"
                      />
                    </div>

                    {isUploading && (
                      <div className="space-y-2">
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <p className="text-xs text-center">{uploadProgress}% uploaded</p>
                      </div>
                    )}

                    {error && <div className="bg-red-50 text-red-800 p-3 rounded-md">{error}</div>}

                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setUploadingFile(null)
                          setPreviewUrl(null)
                        }}
                        disabled={isUploading}
                      >
                        Cancel
                      </Button>
                      <Button onClick={() => handleUpload()} disabled={isUploading}>
                        {isUploading ? "Uploading..." : "Upload"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <ImageCropper
        open={cropperOpen}
        onOpenChange={setCropperOpen}
        imageSrc={cropImageSrc}
        onCropComplete={handleCropComplete}
        originalFilename={
          selectedImageForCrop
            ? selectedImageForCrop.pathname.split("/").pop() || "image.jpg"
            : cropImageFile?.name || "image.jpg"
        }
      />
    </>
  )
}
