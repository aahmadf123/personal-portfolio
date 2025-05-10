"use client"

import Image from "next/image"
import { formatDate } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, ClockIcon, TagIcon } from "lucide-react"
import type { BlogPost } from "@/types/blog"

interface PostPreviewProps {
  post: BlogPost
}

export function PostPreview({ post }: PostPreviewProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
        <div className="flex items-center">
          <CalendarIcon className="mr-1 h-4 w-4" />
          {formatDate(post.created_at)}
        </div>

        <div className="flex items-center">
          <ClockIcon className="mr-1 h-4 w-4" />
          {post.read_time}
        </div>

        {post.categories && <Badge variant="secondary">{post.categories.name}</Badge>}
      </div>

      {post.image_url && (
        <div className="relative w-full h-[300px] mb-8 rounded-lg overflow-hidden">
          <Image
            src={post.image_url || "/placeholder.svg"}
            alt={post.title}
            fill
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/broken-image-icon.png"
            }}
          />
        </div>
      )}

      <div className="prose dark:prose-invert max-w-none mb-8">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>

      {post.tags && post.tags.length > 0 && (
        <div className="flex items-center flex-wrap gap-2 mt-8 pt-4 border-t">
          <TagIcon className="h-4 w-4 text-muted-foreground" />
          {post.tags.map((tag) => (
            <Badge key={tag.id} variant="outline">
              {tag.name}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
