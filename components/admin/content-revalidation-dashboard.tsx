"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Check, AlertTriangle, Clock } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { revalidateContent, revalidateAllContent, type ContentType } from "@/lib/revalidation-utils"

interface ContentTypeInfo {
  type: ContentType
  title: string
  description: string
  lastRevalidated: Date | null
  status: "idle" | "loading" | "success" | "error"
  error?: string
}

export function ContentRevalidationDashboard() {
  const [contentTypes, setContentTypes] = useState<ContentTypeInfo[]>([
    {
      type: "skills",
      title: "Skills & Expertise",
      description: "Refresh skills, categories, and proficiency levels",
      lastRevalidated: null,
      status: "idle",
    },
    {
      type: "projects",
      title: "Projects",
      description: "Refresh projects, technologies, and project details",
      lastRevalidated: null,
      status: "idle",
    },
    {
      type: "blog",
      title: "Blog Posts",
      description: "Refresh blog posts, categories, and tags",
      lastRevalidated: null,
      status: "idle",
    },
    {
      type: "case-studies",
      title: "Case Studies",
      description: "Refresh case studies and related content",
      lastRevalidated: null,
      status: "idle",
    },
    {
      type: "timeline",
      title: "Timeline",
      description: "Refresh timeline entries and professional journey",
      lastRevalidated: null,
      status: "idle",
    },
  ])

  const [globalStatus, setGlobalStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [globalLastRevalidated, setGlobalLastRevalidated] = useState<Date | null>(null)

  const handleRevalidate = async (contentType: ContentType) => {
    // Update status to loading
    setContentTypes((prev) => prev.map((item) => (item.type === contentType ? { ...item, status: "loading" } : item)))

    try {
      const result = await revalidateContent(contentType)

      if (result.success) {
        // Update status to success
        setContentTypes((prev) =>
          prev.map((item) =>
            item.type === contentType
              ? { ...item, status: "success", lastRevalidated: new Date(), error: undefined }
              : item,
          ),
        )

        toast({
          title: "Content refreshed",
          description: `${contentType} content has been refreshed successfully.`,
        })
      } else {
        // Update status to error
        setContentTypes((prev) =>
          prev.map((item) => (item.type === contentType ? { ...item, status: "error", error: result.message } : item)),
        )

        toast({
          title: "Refresh failed",
          description: result.message || `Failed to refresh ${contentType} content.`,
          variant: "destructive",
        })
      }
    } catch (error) {
      // Update status to error
      setContentTypes((prev) =>
        prev.map((item) =>
          item.type === contentType
            ? {
                ...item,
                status: "error",
                error: error instanceof Error ? error.message : "Unknown error occurred",
              }
            : item,
        ),
      )

      toast({
        title: "Refresh failed",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
      })
    }
  }

  const handleRevalidateAll = async () => {
    setGlobalStatus("loading")

    try {
      const result = await revalidateAllContent()

      if (result.success) {
        // Update all statuses to success
        const now = new Date()
        setContentTypes((prev) =>
          prev.map((item) => ({ ...item, status: "success", lastRevalidated: now, error: undefined })),
        )
        setGlobalStatus("success")
        setGlobalLastRevalidated(now)

        toast({
          title: "All content refreshed",
          description: "All website content has been refreshed successfully.",
        })
      } else {
        setGlobalStatus("error")

        toast({
          title: "Refresh failed",
          description: result.message || "Failed to refresh all content.",
          variant: "destructive",
        })
      }
    } catch (error) {
      setGlobalStatus("error")

      toast({
        title: "Refresh failed",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Refresh All Content</CardTitle>
          <CardDescription>Refresh all content types across the website at once</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Use this option to refresh all content types simultaneously. This ensures that all pages display the most
            up-to-date information from your database.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <div>
            {globalLastRevalidated && (
              <div className="text-sm text-muted-foreground flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Last refreshed: {globalLastRevalidated.toLocaleTimeString()} on{" "}
                {globalLastRevalidated.toLocaleDateString()}
              </div>
            )}
          </div>
          <Button onClick={handleRevalidateAll} disabled={globalStatus === "loading"} size="lg">
            {globalStatus === "loading" ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Refreshing All Content...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh All Content
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contentTypes.map((content) => (
          <Card key={content.type}>
            <CardHeader>
              <CardTitle>{content.title}</CardTitle>
              <CardDescription>{content.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-10">
                {content.status === "success" && (
                  <div className="flex items-center text-green-600">
                    <Check className="h-4 w-4 mr-2" />
                    <span>Successfully refreshed</span>
                  </div>
                )}
                {content.status === "error" && (
                  <div className="flex items-center text-red-600">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    <span>{content.error || "Failed to refresh"}</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <div>
                {content.lastRevalidated && (
                  <div className="text-xs text-muted-foreground">
                    Last refreshed: {content.lastRevalidated.toLocaleTimeString()}
                  </div>
                )}
              </div>
              <Button
                onClick={() => handleRevalidate(content.type)}
                disabled={content.status === "loading"}
                variant="outline"
              >
                {content.status === "loading" ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
