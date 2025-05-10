"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ViewsChart } from "./views-chart"
import { TopContentTable } from "./top-content-table"
import { ViewsOverview } from "./views-overview"

interface AnalyticsData {
  totalViews: number
  projectViews: number
  blogViews: number
  viewsByDay: Record<string, { projects: number; blog: number; total: number }>
  topProjects: Array<{ id: number; title: string; slug: string; image_url?: string; views: number }>
  topPosts: Array<{ id: number; title: string; slug: string; image_url?: string; views: number }>
}

interface AnalyticsDashboardProps {
  data: AnalyticsData
}

export function AnalyticsDashboard({ data }: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState<"7" | "14" | "30" | "90">("30")

  // Filter data based on selected time range
  const filterDataByTimeRange = () => {
    const days = Number.parseInt(timeRange)
    const now = new Date()
    const filteredViewsByDay: Record<string, { projects: number; blog: number; total: number }> = {}

    for (let i = 0; i < days; i++) {
      const date = new Date(now)
      date.setDate(now.getDate() - i)
      const dateString = date.toISOString().split("T")[0]

      if (data.viewsByDay[dateString]) {
        filteredViewsByDay[dateString] = data.viewsByDay[dateString]
      }
    }

    return {
      ...data,
      viewsByDay: filteredViewsByDay,
    }
  }

  const filteredData = filterDataByTimeRange()

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <h2 className="text-2xl font-bold">Website Analytics</h2>

        <div>
          <Tabs value={timeRange} onValueChange={(value) => setTimeRange(value as any)} className="w-full">
            <TabsList className="grid grid-cols-4 w-[400px]">
              <TabsTrigger value="7">7 Days</TabsTrigger>
              <TabsTrigger value="14">14 Days</TabsTrigger>
              <TabsTrigger value="30">30 Days</TabsTrigger>
              <TabsTrigger value="90">90 Days</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <ViewsOverview data={filteredData} timeRange={timeRange} />

      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Views Over Time</CardTitle>
            <CardDescription>Tracking page views for the last {timeRange} days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ViewsChart data={filteredData.viewsByDay} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Top Projects</CardTitle>
            <CardDescription>Most viewed projects in the last {timeRange} days</CardDescription>
          </CardHeader>
          <CardContent>
            <TopContentTable items={filteredData.topProjects} type="project" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Blog Posts</CardTitle>
            <CardDescription>Most viewed blog posts in the last {timeRange} days</CardDescription>
          </CardHeader>
          <CardContent>
            <TopContentTable items={filteredData.topPosts} type="blog" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
