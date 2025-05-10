"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export function Overview() {
  const [contentStats, setContentStats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchContentStats() {
      try {
        setLoading(true)
        const response = await fetch("/api/admin/dashboard/content-stats")
        if (!response.ok) {
          throw new Error("Failed to fetch content statistics")
        }
        const data = await response.json()
        setContentStats(data)
      } catch (err) {
        console.error("Error fetching content stats:", err)
        setError("Failed to load content statistics")
      } finally {
        setLoading(false)
      }
    }

    fetchContentStats()
  }, [])

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Content Overview</CardTitle>
        <CardDescription>Summary of your website content</CardDescription>
      </CardHeader>
      <CardContent className="px-2">
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-[300px] w-full" />
          </div>
        ) : error ? (
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-muted-foreground">{error}</p>
          </div>
        ) : (
          <ChartContainer
            config={{
              value: {
                label: "Count",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contentStats}>
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
