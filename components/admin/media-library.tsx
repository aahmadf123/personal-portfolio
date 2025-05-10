"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Loader2, Upload, MoreVertical, Copy, Trash, Edit, ImageIcon, FileText, File } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

interface MediaItem {
  id: string
  url: string
  filename: string
  pathname: string
  contentType: string
  size: number
  width?: number
  height?: number
  createdAt: string
  metadata?: Record<string, any>
}

export function MediaLibrary() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [activeTab, setActiveTab] = useState("all")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [editMetadata, setEditMetadata] = useState<{
    alt?: string
    caption?: string
    title?: string
  }>({})
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [authError, setAuthError] = useState(false)
  const router = useRouter()

  const openDetailDialog = (item: MediaItem) => {
    setSelectedItem(item)
    setIsDetailDialogOpen(true)
  }

  const getFileIcon = (contentType: string) => {
    if (contentType.startsWith("image/")) {
      return <ImageIcon className="h-6 w-6" />
    } else if (contentType.startsWith("text/")) {
      return <FileText className="h-6 w-6" />
    } else {
      return <File className="h-6 w-6" />
    }
  }

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    toast({
      title: "Copied",
      description: "URL copied to clipboard",
    })
  }

  const openEditDialog = (item: MediaItem) => {
    setSelectedItem(item)
    setEditMetadata({
      alt: item.metadata?.alt || "",
      caption: item.metadata?.caption || "",
      title: item.metadata?.title || "",
    })
    setIsEditDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/media/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to delete media item: ${errorText}`)
      }

      toast({
        title: "Success",
        description: "Media item deleted successfully",
      })

      fetchMediaItems()
    } catch (error) {
      console.error("Error deleting media item:", error)
      toast({
        title: "Error",
        description: `Failed to delete media item: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchMediaItems()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = mediaItems.filter((item) => item.filename.toLowerCase().includes(searchTerm.toLowerCase()))
      setFilteredItems(filtered)
    } else {
      setFilteredItems(mediaItems)
    }
  }, [searchTerm, mediaItems])

  const fetchMediaItems = async () => {
    try {
      setIsLoading(true)
      // Add cache-busting query parameter
      const timestamp = new Date().getTime()
      const response = await fetch(`/api/admin/media?t=${timestamp}`)

      if (!response.ok) {
        if (response.status === 401) {
          setAuthError(true)
          return
        }

        const errorText = await response.text()
        throw new Error(`Failed to fetch media items: ${errorText}`)
      }

      const data = await response.json()
      setMediaItems(data)
      setFilteredItems(data)
    } catch (error) {
      console.error("Error fetching media items:", error)
      toast({
        title: "Error",
        description: `Failed to load media items: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const refreshMediaItems = async () => {
    try {
      setIsRefreshing(true)
      await fetchMediaItems()
      toast({
        title: "Success",
        description: "Media library refreshed successfully",
      })
    } catch (error) {
      console.error("Error refreshing media items:", error)
      toast({
        title: "Error",
        description: "Failed to refresh media items",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(e.target.files)
    }
  }

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      })
      return
    }

    try {
      setIsUploading(true)
      setUploadProgress(0)

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]
        const formData = new FormData()
        formData.append("file", file)

        // Simulate progress
        const interval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(interval)
              return prev
            }
            return prev + 10
          })
        }, 300)

        const response = await fetch("/api/admin/media/upload", {
          method: "POST",
          body: formData,
        })

        clearInterval(interval)
        setUploadProgress(100)

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Failed to upload ${file.name}: ${errorText}`)
        }
      }

      toast({
        title: "Success",
        description: "Files uploaded successfully",
      })

      setIsUploadDialogOpen(false)
      fetchMediaItems()
    } catch (error) {
      console.error("Error uploading files:", error)
      toast({
        title: "Error",
        description: `Failed to upload files: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      setSelectedFiles(null)
    }
  }

  if (authError) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>You need to be logged in to access this page</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/login")}>Go to Login</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  function renderMediaItems(items: MediaItem[]) {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )
    }

    if (items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="text-muted-foreground mb-4">
            {searchTerm ? "No matching files found" : "No files in your media library"}
          </div>
          {!searchTerm && (
            <Button onClick={() => setIsUploadDialogOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
            </Button>
          )}
        </div>
      )
    }

    return viewMode === "grid" ? (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map((item) => (
          <Card
            key={item.id}
            className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => openDetailDialog(item)}
          >
            <div className="relative aspect-square bg-muted">
              {item.contentType.startsWith("image/") ? (
                <Image
                  src={item.url || "/placeholder.svg"}
                  alt={item.metadata?.alt || item.filename}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">{getFileIcon(item.contentType)}</div>
              )}
              <div className="absolute top-2 right-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-background/80">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCopyUrl(item.url)
                      }}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy URL
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        openEditDialog(item)
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Metadata
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(item.id)
                      }}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <CardContent className="p-3">
              <div className="truncate text-sm font-medium">{item.filename}</div>
              <div className="flex items-center justify-between mt-1">
                <Badge variant="outline" className="text-xs">
                  {formatFileSize(item.size)}
                </Badge>
                <span className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    ) : (
      <div className="border rounded-md divide-y">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center p-3 hover:bg-muted/50 cursor-pointer"
            onClick={() => openDetailDialog(item)}
          >
            <div className="mr-3">
              {item.contentType.startsWith("image/") ? (
                <div className="relative h-12 w-12 rounded-md overflow-hidden">
                  <Image
                    src={item.url || "/placeholder.svg"}
                    alt={item.metadata?.alt || item.filename}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-12 w-12 bg-muted rounded-md">
                  {getFileIcon(item.contentType)}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="truncate font-medium">{item.filename}</div>
              <div className="flex items-center text-sm text-muted-foreground">
                <span>{formatFileSize(item.size)}</span>
                <span className="mx-2">•</span>
                <span>{formatDate(item.createdAt)}</span>
              </div>
            </div>
            <div className="ml-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCopyUrl(item.url)
                    }}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy URL
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      openEditDialog(item)
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Metadata
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(item.id)
                    }}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    )
  }

  function formatFileSize(bytes: number) {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
  }
}
