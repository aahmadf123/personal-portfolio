"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, AlertTriangle, HelpCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export function SystemStatus() {
  const [statuses, setStatuses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSystemStatus() {
      try {
        setLoading(true)
        const response = await fetch("/api/admin/dashboard/system-status")
        if (!response.ok) {
          throw new Error("Failed to fetch system status")
        }
        const data = await response.json()
        setStatuses(data)
      } catch (err) {
        console.error("Error fetching system status:", err)
        setError("Failed to load system status")
      } finally {
        setLoading(false)
      }
    }

    fetchSystemStatus()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Status</CardTitle>
        <CardDescription>Current status of system components</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-5 w-[180px]" />
                <Skeleton className="h-4 w-[100px]" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-6 text-center">
            <p className="text-muted-foreground">{error}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {statuses.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    {item.status === "healthy" && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {item.status === "warning" && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                    {item.status === "error" && <AlertCircle className="h-4 w-4 text-red-500" />}
                    {item.status === "unknown" && <HelpCircle className="h-4 w-4 text-gray-500" />}
                    <p className="text-sm font-medium">{item.name}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.message}</p>
                </div>
                <p className="text-xs text-muted-foreground">{item.lastChecked}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
