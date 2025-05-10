"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Activity,
  BarChart3,
  Calendar,
  ChevronLeft,
  Clock,
  Code,
  FileCode2,
  Github,
  GitFork,
  GitPullRequest,
  History,
  Languages,
  LineChart,
  PieChart,
  Star,
  Users,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GitHubLanguageChart } from "./github-language-chart"
import { GitHubActivityChart } from "./github-activity-chart"
import { GitHubStarHistory } from "./github-star-history"
import { GitHubCommitFrequency } from "./github-commit-frequency"
import { GitHubRepositoryGrowth } from "./github-repository-growth"
import { GitHubTopRepositories } from "./github-top-repositories"

interface GitHubStats {
  profile: {
    login: string
    name: string
    avatar_url: string
    html_url: string
    public_repos: number
    followers: number
    following: number
    created_at: string
  }
  overallStats: {
    totalStars: number
    totalForks: number
    totalWatchers: number
    totalIssues: number
    totalPullRequests: number
    totalCommits: number
    totalContributions: number
    averageCommitsPerDay: number
    mostActiveDay: string
    mostActiveTime: string
    longestStreak: number
    currentStreak: number
  }
  languageStats: {
    name: string
    count: number
    percentage: number
    color: string
  }[]
  commitActivity: {
    date: string
    count: number
  }[]
  repositoryGrowth: {
    date: string
    count: number
  }[]
  starHistory: {
    date: string
    count: number
  }[]
  topRepositories: {
    name: string
    stars: number
    forks: number
    description: string
    url: string
    language: string
    languageColor: string
  }[]
  commitFrequency: {
    day: string
    count: number
  }[]
}

export function GitHubStatsDashboard() {
  const [data, setData] = useState<GitHubStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState("year")

  useEffect(() => {
    const fetchGitHubStats = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/github/stats?timeRange=${timeRange}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch GitHub stats: ${response.status}`)
        }

        const statsData = await response.json()
        setData(statsData)
      } catch (err) {
        console.error("Error fetching GitHub stats:", err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchGitHubStats()
  }, [timeRange])

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return <GitHubStatsDashboardSkeleton />
  }

  if (error) {
    return (
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <Card className="border-red-300 bg-red-50 dark:bg-red-950/20">
            <CardHeader>
              <CardTitle className="text-red-600 dark:text-red-400">Error Loading GitHub Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{error}</p>
              <p className="mt-4">
                This could be due to GitHub API rate limits, invalid environment variables, or a temporary connection
                issue.
              </p>
              <p className="mt-2 text-sm">
                Please ensure your <code className="bg-muted px-1 py-0.5 rounded">GITHUB_TOKEN</code> environment
                variable is correctly set with appropriate permissions.
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    )
  }

  if (!data) {
    return null
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-background/80">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Button asChild variant="ghost" size="sm" className="h-8 px-2">
                <Link href="/github">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back to Profile
                </Link>
              </Button>
              <Badge variant="outline" className="ml-2">
                <Github className="h-3 w-3 mr-1" />
                {data.profile.login}
              </Badge>
            </div>
            <h2 className="text-3xl font-bold mb-2">GitHub Statistics Dashboard</h2>
            <p className="text-muted-foreground">Detailed analytics and insights about my GitHub activity</p>
          </div>

          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="halfyear">Last 6 Months</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>

            <Button asChild variant="default" className="group">
              <Link
                href={data.profile.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <Github className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                View on GitHub
              </Link>
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-colors group">
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Star className="h-5 w-5 text-primary" />
                </div>
                <div className="text-2xl font-bold">{data.overallStats.totalStars.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Total Stars</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-colors group">
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <GitFork className="h-5 w-5 text-primary" />
                </div>
                <div className="text-2xl font-bold">{data.overallStats.totalForks.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Total Forks</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-colors group">
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Code className="h-5 w-5 text-primary" />
                </div>
                <div className="text-2xl font-bold">{data.overallStats.totalCommits.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Total Commits</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-colors group">
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <GitPullRequest className="h-5 w-5 text-primary" />
                </div>
                <div className="text-2xl font-bold">{data.overallStats.totalPullRequests.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Pull Requests</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-colors group">
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="text-2xl font-bold">{data.overallStats.longestStreak}</div>
                <p className="text-xs text-muted-foreground">Longest Streak</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-colors group">
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div className="text-2xl font-bold">{data.profile.followers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Followers</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="mb-12">
          <TabsList className="mb-6 w-full justify-start overflow-x-auto">
            <TabsTrigger value="overview" className="flex items-center gap-1.5">
              <Activity className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="languages" className="flex items-center gap-1.5">
              <Languages className="h-4 w-4" />
              Languages
            </TabsTrigger>
            <TabsTrigger value="repositories" className="flex items-center gap-1.5">
              <FileCode2 className="h-4 w-4" />
              Repositories
            </TabsTrigger>
            <TabsTrigger value="commits" className="flex items-center gap-1.5">
              <History className="h-4 w-4" />
              Commit Activity
            </TabsTrigger>
            <TabsTrigger value="engagement" className="flex items-center gap-1.5">
              <Star className="h-4 w-4" />
              Engagement
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card className="border border-border bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Contribution Activity
                  </CardTitle>
                  <CardDescription>
                    Commits over time ({timeRange === "all" ? "all time" : `last ${timeRange}`})
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <GitHubActivityChart data={data.commitActivity} />
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-primary" />
                    Language Distribution
                  </CardTitle>
                  <CardDescription>Programming languages used across repositories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <GitHubLanguageChart data={data.languageStats} />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border border-border bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Activity Patterns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Most Active Day</h4>
                      <p className="text-lg font-semibold">{data.overallStats.mostActiveDay}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Most Active Time</h4>
                      <p className="text-lg font-semibold">{data.overallStats.mostActiveTime}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Average Commits Per Day</h4>
                      <p className="text-lg font-semibold">{data.overallStats.averageCommitsPerDay.toFixed(1)}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Current Streak</h4>
                      <p className="text-lg font-semibold">{data.overallStats.currentStreak} days</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border bg-card/50 backdrop-blur-sm md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Commit Frequency by Day
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[220px]">
                    <GitHubCommitFrequency data={data.commitFrequency} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Languages Tab */}
          <TabsContent value="languages">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card className="border border-border bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-primary" />
                    Language Distribution
                  </CardTitle>
                  <CardDescription>Programming languages used across repositories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <GitHubLanguageChart data={data.languageStats} />
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Languages className="h-5 w-5 text-primary" />
                    Language Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.languageStats.map((lang) => (
                      <div key={lang.name} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: lang.color }}></span>
                            <span className="font-medium">{lang.name}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{lang.percentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${lang.percentage}%`,
                              backgroundColor: lang.color,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border border-border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Code className="h-5 w-5 text-primary" />
                  Language Usage by Repository
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-medium">Repository</th>
                        <th className="text-left py-3 px-4 font-medium">Primary Language</th>
                        <th className="text-left py-3 px-4 font-medium">Size (KB)</th>
                        <th className="text-left py-3 px-4 font-medium">Stars</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.topRepositories.map((repo) => (
                        <tr key={repo.name} className="border-b border-border/50 hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <Link
                              href={repo.url}
                              className="font-medium hover:text-primary transition-colors"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {repo.name}
                            </Link>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <span
                                className="h-3 w-3 rounded-full mr-2"
                                style={{ backgroundColor: repo.languageColor }}
                              ></span>
                              {repo.language || "N/A"}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            {Math.floor(Math.random() * 5000) + 100} {/* Placeholder for demo */}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <Star className="h-3 w-3 mr-1 text-amber-500" />
                              {repo.stars}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Repositories Tab */}
          <TabsContent value="repositories">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card className="border border-border bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <LineChart className="h-5 w-5 text-primary" />
                    Repository Growth
                  </CardTitle>
                  <CardDescription>Number of repositories created over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <GitHubRepositoryGrowth data={data.repositoryGrowth} />
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Star className="h-5 w-5 text-primary" />
                    Top Repositories
                  </CardTitle>
                  <CardDescription>Most starred repositories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <GitHubTopRepositories data={data.topRepositories} />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border border-border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileCode2 className="h-5 w-5 text-primary" />
                  Repository Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px] text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-medium">Repository</th>
                        <th className="text-left py-3 px-4 font-medium">Language</th>
                        <th className="text-left py-3 px-4 font-medium">Stars</th>
                        <th className="text-left py-3 px-4 font-medium">Forks</th>
                        <th className="text-left py-3 px-4 font-medium">Created</th>
                        <th className="text-left py-3 px-4 font-medium">Last Updated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.topRepositories.map((repo) => (
                        <tr key={repo.name} className="border-b border-border/50 hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <Link
                              href={repo.url}
                              className="font-medium hover:text-primary transition-colors"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {repo.name}
                            </Link>
                            {repo.description && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{repo.description}</p>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <span
                                className="h-3 w-3 rounded-full mr-2"
                                style={{ backgroundColor: repo.languageColor }}
                              ></span>
                              {repo.language || "N/A"}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <Star className="h-3 w-3 mr-1 text-amber-500" />
                              {repo.stars}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <GitFork className="h-3 w-3 mr-1 text-blue-500" />
                              {repo.forks}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {formatDate(new Date().toISOString())} {/* Placeholder for demo */}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {formatDate(new Date().toISOString())} {/* Placeholder for demo */}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Commits Tab */}
          <TabsContent value="commits">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card className="border border-border bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Commit Activity
                  </CardTitle>
                  <CardDescription>
                    Commits over time ({timeRange === "all" ? "all time" : `last ${timeRange}`})
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <GitHubActivityChart data={data.commitActivity} />
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Commit Frequency by Day
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <GitHubCommitFrequency data={data.commitFrequency} />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border border-border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" />
                  Commit Patterns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Total Commits</h4>
                      <p className="text-2xl font-semibold">{data.overallStats.totalCommits.toLocaleString()}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Average Per Day</h4>
                      <p className="text-2xl font-semibold">{data.overallStats.averageCommitsPerDay.toFixed(1)}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Most Active Day</h4>
                      <p className="text-2xl font-semibold">{data.overallStats.mostActiveDay}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Most Active Time</h4>
                      <p className="text-2xl font-semibold">{data.overallStats.mostActiveTime}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Current Streak</h4>
                      <p className="text-2xl font-semibold">{data.overallStats.currentStreak} days</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Longest Streak</h4>
                      <p className="text-2xl font-semibold">{data.overallStats.longestStreak} days</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Engagement Tab */}
          <TabsContent value="engagement">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card className="border border-border bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Star className="h-5 w-5 text-primary" />
                    Star History
                  </CardTitle>
                  <CardDescription>Stars received over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <GitHubStarHistory data={data.starHistory} />
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Community Engagement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Followers Growth</h4>
                      <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: "65%" }}></div>
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                        <span>0</span>
                        <span>{data.profile.followers}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-card/60 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-medium text-muted-foreground">Stars</h4>
                          <Star className="h-4 w-4 text-amber-500" />
                        </div>
                        <p className="text-2xl font-bold">{data.overallStats.totalStars}</p>
                      </div>

                      <div className="bg-card/60 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-medium text-muted-foreground">Forks</h4>
                          <GitFork className="h-4 w-4 text-blue-500" />
                        </div>
                        <p className="text-2xl font-bold">{data.overallStats.totalForks}</p>
                      </div>

                      <div className="bg-card/60 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-medium text-muted-foreground">Watchers</h4>
                          <Activity className="h-4 w-4 text-green-500" />
                        </div>
                        <p className="text-2xl font-bold">{data.overallStats.totalWatchers}</p>
                      </div>

                      <div className="bg-card/60 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-medium text-muted-foreground">Issues</h4>
                          <Code className="h-4 w-4 text-purple-500" />
                        </div>
                        <p className="text-2xl font-bold">{data.overallStats.totalIssues}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border border-border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  Most Starred Repositories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-medium">Repository</th>
                        <th className="text-left py-3 px-4 font-medium">Stars</th>
                        <th className="text-left py-3 px-4 font-medium">Forks</th>
                        <th className="text-left py-3 px-4 font-medium">Language</th>
                        <th className="text-left py-3 px-4 font-medium">Star-Fork Ratio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.topRepositories
                        .sort((a, b) => b.stars - a.stars)
                        .slice(0, 5)
                        .map((repo) => (
                          <tr key={repo.name} className="border-b border-border/50 hover:bg-muted/50">
                            <td className="py-3 px-4">
                              <Link
                                href={repo.url}
                                className="font-medium hover:text-primary transition-colors"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {repo.name}
                              </Link>
                              {repo.description && (
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{repo.description}</p>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <Star className="h-3 w-3 mr-1 text-amber-500" />
                                {repo.stars}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <GitFork className="h-3 w-3 mr-1 text-blue-500" />
                                {repo.forks}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <span
                                  className="h-3 w-3 rounded-full mr-2"
                                  style={{ backgroundColor: repo.languageColor }}
                                ></span>
                                {repo.language || "N/A"}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              {repo.forks > 0 ? (repo.stars / repo.forks).toFixed(1) : repo.stars.toFixed(1)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

function GitHubStatsDashboardSkeleton() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-background/80">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">GitHub Statistics Dashboard</h2>
            <p className="text-muted-foreground">Loading GitHub statistics...</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-card/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center">
                  <Skeleton className="h-10 w-10 rounded-full mb-2" />
                  <Skeleton className="h-8 w-16 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mb-6">
          <Skeleton className="h-10 w-full max-w-md rounded-md mb-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className="border border-border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-60" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full rounded-md" />
              </CardContent>
            </Card>

            <Card className="border border-border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-60" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full rounded-md" />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border border-border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <Skeleton className="h-6 w-40 mb-2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i}>
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border bg-card/50 backdrop-blur-sm md:col-span-2">
              <CardHeader>
                <Skeleton className="h-6 w-40 mb-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[220px] w-full rounded-md" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
