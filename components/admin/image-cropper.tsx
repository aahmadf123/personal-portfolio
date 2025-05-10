"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from "react-image-crop"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { X, RotateCw, ZoomIn, CropIcon, Save, RatioIcon as AspectRatio, Undo } from "lucide-react"
import { cn } from "@/lib/utils"

// Import the react-image-crop styles from node_modules
// You'll need to include these styles in your globals.css or another way
// @import 'react-image-crop/dist/ReactCrop.css';
// Here we're assuming it's being imported elsewhere

interface ImageCropperProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  imageSrc: string
  onCropComplete: (croppedImageBlob: Blob, filename: string) => void
  originalFilename?: string
}

const ASPECT_RATIOS = {
  free: { label: "Free", value: undefined },
  "1:1": { label: "Square (1:1)", value: 1 },
  "4:3": { label: "Standard (4:3)", value: 4 / 3 },
  "16:9": { label: "Widescreen (16:9)", value: 16 / 9 },
  "3:4": { label: "Portrait (3:4)", value: 3 / 4 },
  "9:16": { label: "Mobile (9:16)", value: 9 / 16 },
}

type AspectRatioOption = keyof typeof ASPECT_RATIOS

// Center and initialize the crop
function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number | undefined): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect || 1,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

export function ImageCropper({
  open,
  onOpenChange,
  imageSrc,
  onCropComplete,
  originalFilename = "image.jpg",
}: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null)
  const [aspect, setAspect] = useState<AspectRatioOption>("free")
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [originalImageData, setOriginalImageData] = useState<{
    width: number
    height: number
    aspectRatio: number
  } | null>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Reset state when dialog is opened
  useEffect(() => {
    if (open) {
      setCrop(undefined)
      setCompletedCrop(null)
      setAspect("free")
      setZoom(1)
      setRotation(0)
      setOriginalImageData(null)
    }
  }, [open])

  // Handle image load
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget
    setOriginalImageData({
      width,
      height,
      aspectRatio: width / height,
    })

    // Initialize with a centered crop
    const initialCrop = centerAspectCrop(width, height, ASPECT_RATIOS[aspect].value)
    setCrop(initialCrop)
  }

  // Handle aspect ratio change
  const handleAspectChange = (newAspect: AspectRatioOption) => {
    setAspect(newAspect)

    if (imgRef.current && newAspect !== "free") {
      const { width, height } = imgRef.current
      const newCrop = centerAspectCrop(width, height, ASPECT_RATIOS[newAspect].value)
      setCrop(newCrop)
    }
  }

  // Handle rotation
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  // Handle reset
  const handleReset = () => {
    setZoom(1)
    setRotation(0)
    setCrop(undefined)
    if (imgRef.current && aspect !== "free") {
      const { width, height } = imgRef.current
      setCrop(centerAspectCrop(width, height, ASPECT_RATIOS[aspect].value))
    }
  }

  // Generate the cropped image
  const generateCroppedImage = async () => {
    if (!imgRef.current || !completedCrop) return null

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return null

    // Calculate the pixel coordinates of the crop
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height

    const pixelCrop = {
      x: completedCrop.x * scaleX,
      y: completedCrop.y * scaleY,
      width: completedCrop.width * scaleX,
      height: completedCrop.height * scaleY,
    }

    // Set canvas dimensions
    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height

    // For rotation support
    if (rotation > 0) {
      // If rotation is involved, we need a larger canvas
      if (rotation === 90 || rotation === 270) {
        canvas.width = pixelCrop.height
        canvas.height = pixelCrop.width
      }

      ctx.save()
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate((rotation * Math.PI) / 180)
      ctx.translate(-pixelCrop.width / 2, -pixelCrop.height / 2)
    }

    // Draw the image with crop coordinates
    ctx.drawImage(
      imgRef.current,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      rotation > 0 ? 0 : 0,
      rotation > 0 ? 0 : 0,
      pixelCrop.width,
      pixelCrop.height,
    )

    if (rotation > 0) {
      ctx.restore()
    }

    // Generate a filename
    const parts = originalFilename.split(".")
    const ext = parts.pop() || "jpg"
    const name = parts.join(".")
    const newFilename = `${name}-cropped.${ext}`

    // Convert the canvas to a Blob
    return new Promise<{ blob: Blob; filename: string }>((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve({ blob, filename: newFilename })
          }
        },
        `image/${ext === "png" ? "png" : "jpeg"}`,
      )
    })
  }

  // Handle crop save
  const handleSave = async () => {
    if (!completedCrop) return

    try {
      const result = await generateCroppedImage()
      if (result) {
        onCropComplete(result.blob, result.filename)
        onOpenChange(false)
      }
    } catch (error) {
      console.error("Error generating cropped image:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CropIcon className="h-5 w-5" />
            Crop Image
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col space-y-4 overflow-hidden flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-3">
              <Label>Aspect Ratio</Label>
              <Select value={aspect} onValueChange={(value) => handleAspectChange(value as AspectRatioOption)}>
                <SelectTrigger className="w-full">
                  <div className="flex items-center gap-2">
                    <AspectRatio className="h-4 w-4" />
                    <SelectValue placeholder="Select aspect ratio" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ASPECT_RATIOS).map(([key, { label }]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" size="icon" onClick={handleRotate} className="self-end">
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 relative min-h-[300px] overflow-auto bg-muted/30 rounded-md">
            <div className={cn("flex items-center justify-center", rotation % 180 !== 0 && originalImageData && "p-4")}>
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={ASPECT_RATIOS[aspect].value}
                minWidth={20}
                minHeight={20}
              >
                <img
                  ref={imgRef}
                  src={imageSrc || "/placeholder.svg"}
                  alt="Crop preview"
                  style={{
                    transform: `scale(${zoom}) rotate(${rotation}deg)`,
                    maxHeight: "60vh",
                  }}
                  onLoad={onImageLoad}
                  crossOrigin="anonymous"
                />
              </ReactCrop>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Zoom</Label>
                <span className="text-xs text-muted-foreground">{Math.round(zoom * 100)}%</span>
              </div>
              <div className="flex items-center gap-2">
                <ZoomIn className="h-4 w-4 text-muted-foreground" />
                <Slider
                  value={[zoom * 100]}
                  min={50}
                  max={200}
                  step={5}
                  onValueChange={(vals) => setZoom(vals[0] / 100)}
                />
              </div>
            </div>

            <div className="flex justify-end items-end gap-2 sm:col-span-1">
              <Button variant="outline" onClick={handleReset} size="sm">
                <Undo className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!completedCrop}>
            <Save className="h-4 w-4 mr-2" />
            Apply Crop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
