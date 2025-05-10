"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2 } from "lucide-react"

interface PoolStats {
  totalCount: number
  idleCount: number
  waitingCount: number
  maxConnections: number
}

export function DbPoolMonitor() {
  const [stats, setStats] = useState<PoolStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/admin/db-pool-stats")

        if (!response.ok) {
          throw new Error(`Failed to fetch pool stats: ${response.status}`)
        }

        const data = await response.json()
        setStats(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching pool stats:", err)
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()

    // Poll every 10 seconds
    const interval = setInterval(fetchStats, 10000)

    return () => clearInterval(interval)
  }, [])

  if (loading && !stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Database Connection Pool</CardTitle>
          <CardDescription>Loading connection statistics...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-24">
            <div className="animate-pulse w-full h-16 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Database Connection Error
          </CardTitle>
          <CardDescription>Unable to fetch connection pool statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-md text-red-800 dark:text-red-200">{error}</div>
        </CardContent>
      </Card>
    )
  }

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Database Connection Pool</CardTitle>
          <CardDescription>No connection pool data available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md text-yellow-800 dark:text-yellow-200">
            Connection pooling may not be enabled or configured properly.
          </div>
        </CardContent>
      </Card>
    )
  }

  const activeConnections = stats.totalCount - stats.idleCount
  const usagePercentage = Math.round((activeConnections / stats.maxConnections) * 100)

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Database Connection Pool</CardTitle>
            <CardDescription>Real-time connection statistics</CardDescription>
          </div>
          <Badge
            variant={usagePercentage > 80 ? "destructive" : usagePercentage > 50 ? "warning" : "success"}
            className="ml-2"
          >
            {usagePercentage}% Used
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1 text-sm">
              <span>Active connections: {activeConnections}</span>
              <span>Max: {stats.maxConnections}</span>
            </div>
            <Progress value={usagePercentage} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
              <div className="text-sm text-gray-500 dark:text-gray-400">Idle</div>
              <div className="text-2xl font-semibold">{stats.idleCount}</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
              <div className="text-sm text-gray-500 dark:text-gray-400">Waiting</div>
              <div className="text-2xl font-semibold">{stats.waitingCount}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>Pool is functioning normally</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
