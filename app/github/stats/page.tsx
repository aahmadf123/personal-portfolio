import { GitHubStatsDashboard } from "@/components/github-stats-dashboard"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "GitHub Statistics Dashboard",
  description: "Detailed analytics and insights about my GitHub activity, contributions, and repositories",
}

export default function GitHubStatsPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <GitHubStatsDashboard />
    </main>
  )
}
