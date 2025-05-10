"use client"
import { createClient } from "@/lib/supabase"

export type UploadedImage = {
  url: string
  pathname: string
  contentType: string
  size: number
  uploadedAt: Date
}

// Utility function to check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

// Client-side only upload function
export async function uploadImage(file: File, folder = "general"): Promise<UploadedImage> {
  if (!isBrowser) {
    throw new Error("uploadImage can only be called from browser code")
  }

  try {
    // Ensure authenticated
    const supabase = createClient()

    // Check for session
    const { data, error } = await supabase.auth.getSession()
    if (error || !data.session) {
      throw new Error("Unauthorized: You must be logged in to upload images")
    }

    // Generate a unique filename with folder structure
    const timestamp = new Date().getTime()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "-")
    const filename = `${folder}/${timestamp}-${originalName}`

    // Use FormData and fetch instead of direct Blob API
    const formData = new FormData()
    formData.append("file", file)
    formData.append("folder", folder)

    const response = await fetch("/api/admin/upload-blob", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to upload image")
    }

    const result = await response.json()

    return {
      url: result.url,
      pathname: result.pathname,
      contentType: result.contentType,
      size: result.size,
      uploadedAt: new Date(result.uploadedAt),
    }
  } catch (error) {
    console.error("Error uploading image:", error)
    throw error
  }
}

// Client-side only delete function
export async function deleteImage(pathname: string): Promise<void> {
  if (!isBrowser) {
    throw new Error("deleteImage can only be called from browser code")
  }

  try {
    // Delete via API route instead of direct Blob API
    const response = await fetch(`/api/admin/delete-blob?pathname=${encodeURIComponent(pathname)}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error("Failed to delete image")
    }
  } catch (error) {
    console.error("Error deleting image:", error)
    throw error
  }
}

// Client-side only list function
export async function listImages(prefix = ""): Promise<UploadedImage[]> {
  if (!isBrowser) {
    return []
  }

  try {
    // List via API route instead of direct Blob API
    const response = await fetch(`/api/admin/list-blobs?prefix=${encodeURIComponent(prefix)}`)

    if (!response.ok) {
      throw new Error("Failed to list images")
    }

    const result = await response.json()

    return result.images.map((blob: any) => ({
      url: blob.url,
      pathname: blob.pathname,
      contentType: blob.contentType || "image/jpeg",
      size: blob.size,
      uploadedAt: new Date(blob.uploadedAt),
    }))
  } catch (error) {
    console.error("Error listing images:", error)
    return []
  }
}

// Client-side only metadata function
export async function getImageMetadata(pathname: string): Promise<UploadedImage | null> {
  if (!isBrowser) {
    return null
  }

  try {
    // Get metadata via API route instead of direct Blob API
    const response = await fetch(`/api/admin/blob-metadata?pathname=${encodeURIComponent(pathname)}`)

    if (!response.ok) {
      return null
    }

    const blob = await response.json()

    return {
      url: blob.url,
      pathname: blob.pathname,
      contentType: blob.contentType || "image/jpeg",
      size: blob.size,
      uploadedAt: new Date(blob.uploadedAt),
    }
  } catch (error) {
    console.error("Error getting image metadata:", error)
    return null
  }
}
