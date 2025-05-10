"use client"

import Link from "next/link"
import Image from "next/image"
import { Eye } from "lucide-react"

interface TopContentTableProps {
  items: Array<{
    id: number
    title: string
    slug: string
    image_url?: string
    views: number
  }>
  type: "project" | "blog"
}

export function TopContentTable({ items, type }: TopContentTableProps) {
  if (items.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No data available for this time period</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left font-medium text-muted-foreground py-3 px-4">Title</th>
            <th className="text-right font-medium text-muted-foreground py-3 px-4">Views</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-border hover:bg-muted/10">
              <td className="py-3 px-4">
                <Link
                  href={`/${type === "project" ? "projects" : "blog"}/${item.slug}`}
                  className="flex items-center gap-3 hover:text-primary transition-colors"
                >
                  <div className="relative h-10 w-10 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image_url || "/placeholder.svg?height=40&width=40"}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="line-clamp-1">{item.title}</span>
                </Link>
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex items-center justify-end gap-1">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span>{item.views}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
