"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ArrowUp, ArrowDown, Minus, Eye, FileText, FolderOpen } from "lucide-react"

interface ViewsOverviewProps {
  data: {
    totalViews: number
    projectViews: number
    blogViews: number
    viewsByDay: Record<string, { projects: number; blog: number; total: number }>
  }
  timeRange: string
}

export function ViewsOverview({ data, timeRange }: ViewsOverviewProps) {
  // Calculate percentage change compared to previous period
  const calculateChange = (currentViews: number, viewsByDay: Record<string, { total: number }>) => {
    const days = Number.parseInt(timeRange)
    const now = new Date()

    // Current period
    const currentPeriodViews = currentViews

    // Previous period (same number of days before current period)
    let previousPeriodViews = 0

    // Calculate previous period views
    for (let i = days; i < days * 2; i++) {
      const date = new Date(now)
      date.setDate(now.getDate() - i)
      const dateString = date.toISOString().split("T")[0]

      if (viewsByDay[dateString]) {
        previousPeriodViews += viewsByDay[dateString].total
      }
    }

    // Calculate percentage change
    if (previousPeriodViews === 0) return { change: 0, direction: "neutral" }

    const percentChange = ((currentViews - previousPeriodViews) / previousPeriodViews) * 100

    return {
      change: Math.abs(Math.round(percentChange)),
      direction: percentChange > 0 ? "up" : percentChange < 0 ? "down" : "neutral",
    }
  }

  const totalChange = calculateChange(data.totalViews, data.viewsByDay)
  const projectChange = calculateChange(data.projectViews, data.viewsByDay)
  const blogChange = calculateChange(data.blogViews, data.viewsByDay)

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Views</p>
              <h3 className="text-3xl font-bold mt-1">{data.totalViews.toLocaleString()}</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Eye className="h-6 w-6 text-blue-500" />
            </div>
          </div>

          <div className="mt-4 flex items-center text-sm">
            {totalChange.direction === "up" ? (
              <div className="flex items-center text-green-500">
                <ArrowUp className="h-4 w-4 mr-1" />
                <span>{totalChange.change}% increase</span>
              </div>
            ) : totalChange.direction === "down" ? (
              <div className="flex items-center text-red-500">
                <ArrowDown className="h-4 w-4 mr-1" />
                <span>{totalChange.change}% decrease</span>
              </div>
            ) : (
              <div className="flex items-center text-gray-500">
                <Minus className="h-4 w-4 mr-1" />
                <span>No change</span>
              </div>
            )}
            <span className="text-muted-foreground ml-2">vs. previous {timeRange} days</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Project Views</p>
              <h3 className="text-3xl font-bold mt-1">{data.projectViews.toLocaleString()}</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <FolderOpen className="h-6 w-6 text-green-500" />
            </div>
          </div>

          <div className="mt-4 flex items-center text-sm">
            {projectChange.direction === "up" ? (
              <div className="flex items-center text-green-500">
                <ArrowUp className="h-4 w-4 mr-1" />
                <span>{projectChange.change}% increase</span>
              </div>
            ) : projectChange.direction === "down" ? (
              <div className="flex items-center text-red-500">
                <ArrowDown className="h-4 w-4 mr-1" />
                <span>{projectChange.change}% decrease</span>
              </div>
            ) : (
              <div className="flex items-center text-gray-500">
                <Minus className="h-4 w-4 mr-1" />
                <span>No change</span>
              </div>
            )}
            <span className="text-muted-foreground ml-2">vs. previous {timeRange} days</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Blog Views</p>
              <h3 className="text-3xl font-bold mt-1">{data.blogViews.toLocaleString()}</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-orange-500/20 flex items-center justify-center">
              <FileText className="h-6 w-6 text-orange-500" />
            </div>
          </div>

          <div className="mt-4 flex items-center text-sm">
            {blogChange.direction === "up" ? (
              <div className="flex items-center text-green-500">
                <ArrowUp className="h-4 w-4 mr-1" />
                <span>{blogChange.change}% increase</span>
              </div>
            ) : blogChange.direction === "down" ? (
              <div className="flex items-center text-red-500">
                <ArrowDown className="h-4 w-4 mr-1" />
                <span>{blogChange.change}% decrease</span>
              </div>
            ) : (
              <div className="flex items-center text-gray-500">
                <Minus className="h-4 w-4 mr-1" />
                <span>No change</span>
              </div>
            )}
            <span className="text-muted-foreground ml-2">vs. previous {timeRange} days</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
