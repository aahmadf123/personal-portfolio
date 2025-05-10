import { Header } from "@/components/header"
import { getTotalViewStats } from "@/lib/analytics-service"
import { AnalyticsDashboard } from "@/components/admin/analytics/analytics-dashboard"

export const metadata = {
  title: "Analytics Dashboard | Admin",
  description: "View analytics for your portfolio website",
}

export default async function AnalyticsPage() {
  // Get analytics data for the last 30 days
  const analyticsData = await getTotalViewStats(30)

  return (
    <div className="min-h-screen bg-[#0a1218] text-white">
      <Header />

      <div className="container px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>

        <AnalyticsDashboard data={analyticsData} />
      </div>
    </div>
  )
}
