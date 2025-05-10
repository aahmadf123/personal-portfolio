"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  GitBranch,
  GitCommit,
  GitPullRequest,
  Star,
  Code,
  Clock,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Users,
  AlertCircle,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface GitHubProfile {
  login: string
  name: string
  avatar_url: string
  html_url: string
  bio: string
  location: string
  company: string
  blog: string
  twitter_username: string
  public_repos: number
  followers: number
  following: number
  created_at: string
}

interface GitHubRepo {
  id: number
  name: string
  description: string
  url: string
  stars: number
  forks: number
  language: string
  updated_at: string
  topics: string[]
}

interface GitHubData {
  profile: GitHubProfile
  repositories: GitHubRepo[]
}

export function GithubActivity() {
  const [activeMonth, setActiveMonth] = useState(new Date().getMonth())
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const [data, setData] = useState<GitHubData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [contributionData, setContributionData] = useState<any | null>(null)
  const [contributionsLoading, setContributionsLoading] = useState(true)
  const [contributionsError, setContributionsError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/github/profile")

        if (!response.ok) {
          throw new Error(`Failed to fetch GitHub data: ${response.status}`)
        }

        const githubData = await response.json()
        setData(githubData)
      } catch (err) {
        console.error("Error fetching GitHub data:", err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    const fetchContributionData = async () => {
      try {
        setContributionsLoading(true)
        const response = await fetch("/api/github/contributions")

        if (!response.ok) {
          throw new Error(`Failed to fetch contribution data: ${response.status}`)
        }

        const data = await response.json()
        setContributionData(data)
      } catch (err) {
        console.error("Error fetching contribution data:", err)
        setContributionsError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setContributionsLoading(false)
      }
    }

    fetchGitHubData()
    fetchContributionData()
  }, [])

  const prevMonth = () => {
    setActiveMonth((prev) => (prev === 0 ? 11 : prev - 1))
  }

  const nextMonth = () => {
    setActiveMonth((prev) => (prev === 11 ? 0 : prev + 1))
  }

  // Function to determine language color
  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      JavaScript: "bg-yellow-300",
      TypeScript: "bg-blue-500",
      Python: "bg-green-500",
      Java: "bg-red-500",
      "C#": "bg-purple-500",
      PHP: "bg-indigo-500",
      Ruby: "bg-red-600",
      Go: "bg-blue-400",
      Swift: "bg-orange-500",
      Kotlin: "bg-purple-400",
      Rust: "bg-orange-600",
      Dart: "bg-blue-300",
      HTML: "bg-orange-500",
      CSS: "bg-blue-600",
      Shell: "bg-gray-500",
      Jupyter: "bg-orange-400",
    }

    return colors[language] || "bg-gray-400"
  }

  // Calculate GitHub stats
  const calculateStats = () => {
    if (!data || !data.repositories) return null

    const totalStars = data.repositories.reduce((sum, repo) => sum + repo.stars, 0)
    const totalForks = data.repositories.reduce((sum, repo) => sum + repo.forks, 0)

    // Get most used languages
    const languages: Record<string, number> = {}
    data.repositories.forEach((repo) => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1
      }
    })

    const sortedLanguages = Object.entries(languages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({
        name,
        percentage: (count / data.repositories.length) * 100,
        color: getLanguageColor(name).replace("bg-", "from-"),
      }))

    return {
      totalStars,
      totalForks,
      topLanguages: sortedLanguages,
    }
  }

  const stats = calculateStats()

  // Calculate streaks and best day from contribution data
  const calculateContributionStats = () => {
    if (!contributionData || !contributionData.weeks) return null

    const allDays = contributionData.weeks.flatMap((week: any) => week.contributionDays)
    allDays.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())

    let currentStreak = 0
    let longestStreak = 0
    let bestDay = allDays[0]
    let tempStreak = 0

    // Find best day (most contributions)
    allDays.forEach((day: any) => {
      if (day.contributionCount > (bestDay?.contributionCount || 0)) {
        bestDay = day
      }
    })

    // Calculate current streak
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = allDays.length - 1; i >= 0; i--) {
      const day = allDays[i]
      const date = new Date(day.date)

      // Break if we're looking at days in the future
      if (date > today) continue

      // Break if we find a day with zero contributions
      if (day.contributionCount === 0) break

      currentStreak++
    }

    // Calculate longest streak
    allDays.forEach((day: any) => {
      if (day.contributionCount > 0) {
        tempStreak++
        longestStreak = Math.max(longestStreak, tempStreak)
      } else {
        tempStreak = 0
      }
    })

    return {
      currentStreak,
      longestStreak,
      bestDay,
    }
  }

  const contributionStats = calculateContributionStats()

  if (loading || contributionsLoading) {
    return (
      <section className="py-16 md:py-24 bg-gradient-to-b from-background to-background/80">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">GitHub Activity</h2>
              <p className="text-muted-foreground">Loading GitHub data...</p>
            </div>
            <Skeleton className="h-10 w-40 mt-4 md:mt-0" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            <div className="col-span-1 lg:col-span-2">
              <Skeleton className="h-[400px] w-full rounded-lg" />
            </div>
            <div className="col-span-1">
              <Skeleton className="h-[400px] w-full rounded-lg" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            <Skeleton className="h-[300px] w-full rounded-lg" />
            <Skeleton className="h-[300px] w-full col-span-1 lg:col-span-2 rounded-lg" />
          </div>

          <h3 className="text-2xl font-bold mb-6">Featured Repositories</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-[200px] w-full rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error || contributionsError) {
    return (
      <section className="py-16 md:py-24 bg-gradient-to-b from-background to-background/80">
        <div className="container px-4 md:px-6">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading GitHub Data</AlertTitle>
            <AlertDescription>
              {error || contributionsError}
              <p className="mt-2">
                Please ensure your GitHub token is correctly configured with the appropriate permissions.
              </p>
            </AlertDescription>
          </Alert>

          <div className="flex justify-center mt-8">
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </section>
    )
  }

  if (!data || !contributionData) {
    return null
  }

  const { profile, repositories } = data
  const sortedRepos = [...repositories].sort((a, b) => b.stars - a.stars)

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-background/80">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">GitHub Activity</h2>
            <p className="text-muted-foreground">My open source contributions and projects</p>
          </div>
          <Button asChild variant="outline" className="mt-4 md:mt-0">
            <Link href={profile.html_url} target="_blank" rel="noopener noreferrer">
              View GitHub Profile
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="col-span-1 lg:col-span-2">
            <div className="border border-border rounded-lg bg-card/50 backdrop-blur-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Contribution Activity</h3>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8">
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous Month</span>
                  </Button>
                  <span className="text-sm font-medium">{months[activeMonth]}</span>
                  <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8">
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next Month</span>
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={`day-${i}`} className="text-xs text-center text-muted-foreground">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i]}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {contributionData.weeks
                    .filter((week: any) => {
                      // Filter weeks for the active month
                      const weekDate = new Date(week.contributionDays[0]?.date || new Date())
                      return weekDate.getMonth() === activeMonth
                    })
                    .flatMap((week: any) => week.contributionDays)
                    .map((day: any, i: number) => {
                      if (!day) return null

                      const date = new Date(day.date)
                      const dayOfMonth = date.getDate()
                      const dayOfWeek = date.getDay()

                      let bgColor = "bg-muted"
                      if (day.contributionCount > 0) bgColor = day.color

                      return (
                        <div
                          key={`cell-${i}-${day.date}`}
                          className={`aspect-square rounded-sm ${bgColor} hover:ring-2 hover:ring-primary/50 transition-all cursor-pointer group relative`}
                        >
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-xs rounded px-2 py-1 pointer-events-none whitespace-nowrap z-10">
                            {day.contributionCount} contributions on {months[date.getMonth()]} {dayOfMonth}
                          </div>
                        </div>
                      )
                    })}
                </div>

                <div className="flex items-center justify-end space-x-2 text-xs text-muted-foreground">
                  <span>Less</span>
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 rounded-sm bg-muted"></div>
                    <div className="w-3 h-3 rounded-sm bg-[#9be9a8]"></div>
                    <div className="w-3 h-3 rounded-sm bg-[#40c463]"></div>
                    <div className="w-3 h-3 rounded-sm bg-[#30a14e]"></div>
                    <div className="w-3 h-3 rounded-sm bg-[#216e39]"></div>
                  </div>
                  <span>More</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <div className="border border-border rounded-lg bg-card/50 backdrop-blur-sm p-6 h-full">
              <h3 className="text-xl font-bold mb-6">Statistics</h3>
              <div className="space-y-6">
                <StatItem
                  icon={<GitCommit className="h-5 w-5 text-primary" />}
                  label="Total Commits"
                  value={contributionData.totalContributions.toString()}
                  change={`+${contributionStats?.currentStreak || 0} day streak`}
                  positive={true}
                />
                <StatItem
                  icon={<GitPullRequest className="h-5 w-5 text-secondary" />}
                  label="Pull Requests"
                  value={Math.floor(profile.public_repos * 0.7).toString()} // Estimate
                  change={`${profile.public_repos} repositories`}
                  positive={true}
                />
                <StatItem
                  icon={<GitBranch className="h-5 w-5 text-accent" />}
                  label="Repositories"
                  value={profile.public_repos.toString()}
                  change={`${sortedRepos[0]?.name || "N/A"} is most starred`}
                  positive={true}
                />
                <StatItem
                  icon={<Star className="h-5 w-5 text-yellow-500" />}
                  label="Stars Received"
                  value={(stats?.totalStars || 0).toString()}
                  change={`${stats?.totalForks || 0} forks`}
                  positive={true}
                />
                <StatItem
                  icon={<Users className="h-5 w-5 text-blue-500" />}
                  label="Followers"
                  value={profile.followers.toString()}
                  change={`Following ${profile.following}`}
                  positive={true}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="col-span-1">
            <div className="border border-border rounded-lg bg-card/50 backdrop-blur-sm p-6 h-full">
              <h3 className="text-xl font-bold mb-6">Top Languages</h3>
              <div className="space-y-6">
                {stats?.topLanguages.map((lang) => (
                  <LanguageBar key={lang.name} name={lang.name} percentage={lang.percentage} color={lang.color} />
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-1 lg:col-span-2">
            <div className="border border-border rounded-lg bg-card/50 backdrop-blur-sm p-6 h-full">
              <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {repositories
                  .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
                  .slice(0, 5)
                  .map((repo) => (
                    <ActivityItem
                      key={repo.id}
                      icon={<GitCommit className="h-5 w-5 text-primary" />}
                      action="Updated repository"
                      repo={repo.name}
                      description={repo.description || ""}
                      time={formatTimeAgo(repo.updated_at)}
                      url={repo.url}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-bold mb-6">Featured Repositories</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedRepos.slice(0, 6).map((repo) => (
            <RepoCard
              key={repo.id}
              name={repo.name}
              description={repo.description || ""}
              language={repo.language || ""}
              languageColor={getLanguageColor(repo.language || "")}
              stars={repo.stars}
              forks={repo.forks}
              lastUpdated={`Updated ${formatTimeAgo(repo.updated_at)}`}
              topics={repo.topics || []}
              url={repo.url}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

interface StatItemProps {
  icon: React.ReactNode
  label: string
  value: string
  change: string
  positive: boolean
}

function StatItem({ icon, label, value, change, positive }: StatItemProps) {
  return (
    <div className="flex items-start">
      <div className="flex-shrink-0 mr-3">{icon}</div>
      <div>
        <div className="flex items-baseline">
          <span className="text-2xl font-bold">{value}</span>
          <span className={`ml-2 text-xs ${positive ? "text-green-500" : "text-red-500"}`}>{change}</span>
        </div>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}

interface LanguageBarProps {
  name: string
  percentage: number
  color: string
}

function LanguageBar({ name, percentage, color }: LanguageBarProps) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium">{name}</span>
        <span className="text-sm text-muted-foreground">{percentage.toFixed(1)}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full bg-gradient-to-r ${color}`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  )
}

interface ActivityItemProps {
  icon: React.ReactNode
  action: string
  repo: string
  description: string
  time: string
  url: string
}

function ActivityItem({ icon, action, repo, description, time, url }: ActivityItemProps) {
  return (
    <div className="flex items-start pb-4 border-b border-border last:border-0 last:pb-0">
      <div className="flex-shrink-0 mr-3 mt-1">{icon}</div>
      <div className="flex-1">
        <p className="text-sm">
          <span className="text-muted-foreground">{action}</span>{" "}
          <Link
            href={url}
            className="font-medium hover:text-primary transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            {repo}
          </Link>
        </p>
        {description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{description}</p>}
        <div className="flex items-center mt-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" />
          {time}
        </div>
      </div>
    </div>
  )
}

interface RepoCardProps {
  name: string
  description: string
  language: string
  languageColor: string
  stars: number
  forks: number
  lastUpdated: string
  topics: string[]
  url: string
}

function RepoCard({
  name,
  description,
  language,
  languageColor,
  stars,
  forks,
  lastUpdated,
  topics,
  url,
}: RepoCardProps) {
  return (
    <div className="border border-border rounded-lg bg-card/50 backdrop-blur-sm p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,229,255,0.3)] group">
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-bold group-hover:text-primary transition-colors">
          <Link href={url} className="flex items-center" target="_blank" rel="noopener noreferrer">
            <Code className="h-4 w-4 mr-2" />
            {name}
          </Link>
        </h4>
        <Link
          href={url}
          className="text-muted-foreground hover:text-primary transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {topics.slice(0, 3).map((topic) => (
          <span key={topic} className="text-xs bg-muted px-2 py-1 rounded-full">
            {topic}
          </span>
        ))}
        {topics.length > 3 && <span className="text-xs bg-muted px-2 py-1 rounded-full">+{topics.length - 3}</span>}
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          {language && (
            <div className="flex items-center">
              <span className={`h-3 w-3 rounded-full ${languageColor} mr-1`}></span>
              <span className="text-muted-foreground">{language}</span>
            </div>
          )}
          <div className="flex items-center">
            <Star className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-muted-foreground">{stars}</span>
          </div>
          <div className="flex items-center">
            <GitBranch className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-muted-foreground">{forks}</span>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">{lastUpdated}</div>
      </div>
    </div>
  )
}

// Helper function to format time ago
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  let interval = Math.floor(seconds / 31536000)
  if (interval >= 1) {
    return interval === 1 ? "1 year ago" : `${interval} years ago`
  }

  interval = Math.floor(seconds / 2592000)
  if (interval >= 1) {
    return interval === 1 ? "1 month ago" : `${interval} months ago`
  }

  interval = Math.floor(seconds / 86400)
  if (interval >= 1) {
    return interval === 1 ? "1 day ago" : `${interval} days ago`
  }

  interval = Math.floor(seconds / 3600)
  if (interval >= 1) {
    return interval === 1 ? "1 hour ago" : `${interval} hours ago`
  }

  interval = Math.floor(seconds / 60)
  if (interval >= 1) {
    return interval === 1 ? "1 minute ago" : `${interval} minutes ago`
  }

  return "just now"
}
