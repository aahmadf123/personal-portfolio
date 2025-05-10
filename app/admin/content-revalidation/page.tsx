import type { Metadata } from "next"
import { AutoRevalidationSettings } from "@/components/admin/auto-revalidation-settings"
import { ContentRevalidationDashboard } from "@/components/admin/content-revalidation-dashboard"

export const metadata: Metadata = {
  title: "Content Revalidation",
  description: "Manage content revalidation settings and refresh your website content",
}

export default function ContentRevalidationPage() {
  return (
    <div className="container mx-auto py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Content Revalidation</h1>
        <p className="text-muted-foreground mt-2">Manage how and when your website content is refreshed</p>
      </div>

      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-1">
        <AutoRevalidationSettings />
        <ContentRevalidationDashboard />
      </div>
    </div>
  )
}
