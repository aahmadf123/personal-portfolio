"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { uploadImage } from "@/lib/blob-service"
import { Loader2, Upload, FileText } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export function DocumentUploader() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

      const uploadedFile = await uploadImage(file, "documents")

      clearInterval(progressInterval)
      setUploadProgress(100)

      // Set the file URL
      setUploadedUrl(uploadedFile.url)

      toast({
        title: "Upload successful",
        description: `${file.name} has been uploaded successfully.`,
      })

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
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload document",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4 p-4 border rounded-md">
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">Upload Resume or Documents</h3>
      </div>

      <div className="space-y-2">
        <Label htmlFor="document-upload">Select Document</Label>
        <Input
          id="document-upload"
          type="file"
          accept=".pdf,.doc,.docx"
          ref={fileInputRef}
          onChange={() => setUploadedUrl(null)}
          disabled={isUploading}
        />
        <p className="text-xs text-muted-foreground">Supported file types: PDF, DOC, DOCX</p>
      </div>

      {isUploading && (
        <div className="w-full bg-muted rounded-full h-2.5 mt-4">
          <div
            className="bg-primary h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}

      <Button onClick={handleUpload} disabled={!fileInputRef.current?.files?.[0] || isUploading} className="w-full">
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </>
        )}
      </Button>

      {uploadedUrl && (
        <div className="mt-4 p-3 bg-muted rounded-md">
          <p className="font-medium">Document uploaded successfully!</p>
          <div className="mt-2 flex flex-col gap-2">
            <p className="text-sm break-all">{uploadedUrl}</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(uploadedUrl)}>
                Copy URL
              </Button>
              <Button size="sm" variant="outline" onClick={() => window.open(uploadedUrl, "_blank")}>
                View Document
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
