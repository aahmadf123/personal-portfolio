import { GitHubProfile } from "@/components/github-profile"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "GitHub Profile | Open Source Contributions",
  description: "View my GitHub repositories, contributions, and open source work",
}

export default function GitHubPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <GitHubProfile />
    </main>
  )
}
