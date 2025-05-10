import { Overview } from "@/components/admin/dashboard/overview"
import { RecentActivity } from "@/components/admin/dashboard/recent-activity"
import { SystemStatus } from "@/components/admin/dashboard/system-status"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { ContentRevalidationCard } from "@/components/admin/dashboard/content-revalidation-card"

export default function DashboardPage() {
  return (
    <div className="space-y-4 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={<Skeleton className="col-span-3 h-[400px]" />}>
          <Overview />
        </Suspense>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
          <Suspense fallback={<Skeleton className="h-[200px]" />}>
            <SystemStatus />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-[200px]" />}>
            <RecentActivity />
          </Suspense>
        </div>
        <ContentRevalidationCard />
      </div>
    </div>
  )
}
