"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow } from "date-fns"

export function RecentActivity() {
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRecentActivities() {
      try {
        setLoading(true)
        const response = await fetch("/api/admin/dashboard/recent-activity")
        if (!response.ok) {
          throw new Error("Failed to fetch recent activities")
        }
        const data = await response.json()
        setActivities(data)
      } catch (err) {
        console.error("Error fetching recent activities:", err)
        setError("Failed to load recent activities")
      } finally {
        setLoading(false)
      }
    }

    fetchRecentActivities()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest actions performed on the site</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-4">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-3 w-[150px]" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-6 text-center">
            <p className="text-muted-foreground">{error}</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-muted-foreground">No recent activity found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={activity.user?.avatar || "/placeholder.svg"} alt={activity.user?.name || "User"} />
                  <AvatarFallback>{activity.user?.initials || "U"}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.target}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.timestamp
                      ? formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })
                      : "Just now"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
