import { type NextRequest, NextResponse } from "next/server"

// GraphQL query to fetch contribution data
const contributionsQuery = `
query($username: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $username) {
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            contributionCount
            date
            color
          }
        }
      }
    }
  }
}
`

export async function GET(request: NextRequest) {
  try {
    // Get time range from query params
    const searchParams = request.nextUrl.searchParams
    const timeRange = searchParams.get("timeRange") || "year"

    // Extract username from NEXT_PUBLIC_GITHUB_URL
    const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL || ""
    const username = githubUrl.split("/").pop() || ""

    if (!username) {
      throw new Error("Could not determine GitHub username from environment variables")
    }

    // Use the GITHUB_TOKEN from environment variables
    const githubToken = process.env.GITHUB_TOKEN

    if (!githubToken) {
      throw new Error("GITHUB_TOKEN is required for fetching GitHub statistics")
    }

    // Calculate date range based on timeRange
    const today = new Date()
    const toDate = today.toISOString()
    let fromDate: string

    switch (timeRange) {
      case "month":
        fromDate = new Date(today.setMonth(today.getMonth() - 1)).toISOString()
        break
      case "quarter":
        fromDate = new Date(today.setMonth(today.getMonth() - 3)).toISOString()
        break
      case "halfyear":
        fromDate = new Date(today.setMonth(today.getMonth() - 6)).toISOString()
        break
      case "year":
        fromDate = new Date(today.setFullYear(today.getFullYear() - 1)).toISOString()
        break
      case "all":
        fromDate = new Date(2010, 0, 1).toISOString() // Arbitrary old date
        break
      default:
        fromDate = new Date(today.setFullYear(today.getFullYear() - 1)).toISOString()
    }

    // Fetch basic profile data
    const profileResponse = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        Authorization: `token ${githubToken}`,
        Accept: "application/vnd.github.v3+json",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!profileResponse.ok) {
      throw new Error(`GitHub API error: ${profileResponse.status}`)
    }

    const profileData = await profileResponse.json()

    // Fetch repositories
    const reposResponse = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=100&type=owner`,
      {
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
        },
        next: { revalidate: 3600 },
      },
    )

    if (!reposResponse.ok) {
      throw new Error(`GitHub API error: ${reposResponse.status}`)
    }

    const reposData = await reposResponse.json()

    // Fetch contribution data using GitHub GraphQL API
    const contributionResponse = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `bearer ${githubToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: contributionsQuery,
        variables: {
          username,
          from: fromDate,
          to: toDate,
        },
      }),
      next: { revalidate: 3600 },
    })

    if (!contributionResponse.ok) {
      throw new Error(`GitHub API error: ${contributionResponse.status}`)
    }

    const contributionData = await contributionResponse.json()

    // Check for errors in the GraphQL response
    if (contributionData.errors) {
      throw new Error(`GraphQL Error: ${contributionData.errors[0].message}`)
    }

    // Process the data to generate statistics
    const repositories = reposData.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      url: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      updated_at: repo.updated_at,
      created_at: repo.created_at,
      topics: repo.topics || [],
      is_fork: repo.fork,
      is_private: repo.private,
      homepage: repo.homepage,
      has_issues: repo.has_issues,
      open_issues_count: repo.open_issues_count,
      license: repo.license ? repo.license.name : null,
      size: repo.size,
    }))

    // Calculate language statistics
    const languages: Record<string, { count: number; color: string }> = {}
    const languageColors: Record<string, string> = {
      JavaScript: "#f1e05a",
      TypeScript: "#3178c6",
      Python: "#3572A5",
      Java: "#b07219",
      "C#": "#178600",
      PHP: "#4F5D95",
      Ruby: "#701516",
      Go: "#00ADD8",
      Swift: "#F05138",
      Kotlin: "#A97BFF",
      Rust: "#DEA584",
      Dart: "#00B4AB",
      HTML: "#e34c26",
      CSS: "#563d7c",
      Shell: "#89e051",
      Jupyter: "#DA5B0B",
    }

    repositories.forEach((repo) => {
      if (repo.language) {
        if (!languages[repo.language]) {
          languages[repo.language] = {
            count: 0,
            color: languageColors[repo.language] || "#8884d8",
          }
        }
        languages[repo.language].count++
      }
    })

    const totalLanguages = Object.values(languages).reduce((sum, lang) => sum + lang.count, 0)
    const languageStats = Object.entries(languages).map(([name, { count, color }]) => ({
      name,
      count,
      percentage: (count / totalLanguages) * 100,
      color,
    }))

    // Sort languages by count
    languageStats.sort((a, b) => b.count - a.count)

    // Calculate commit activity
    const contributionCalendar = contributionData.data.user.contributionsCollection.contributionCalendar
    const allDays = contributionCalendar.weeks.flatMap((week: any) => week.contributionDays)

    // Sort days by date
    allDays.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Generate commit activity data
    const commitActivity = []
    const dayMap: Record<string, number> = {
      "0": 0, // Sunday
      "1": 0, // Monday
      "2": 0, // Tuesday
      "3": 0, // Wednesday
      "4": 0, // Thursday
      "5": 0, // Friday
      "6": 0, // Saturday
    }

    // Process contribution data
    for (const day of allDays) {
      const date = new Date(day.date)
      const dayOfWeek = date.getDay().toString()

      // Add to commit activity
      commitActivity.push({
        date: day.date,
        count: day.contributionCount,
      })

      // Add to day map
      dayMap[dayOfWeek] += day.contributionCount
    }

    // Calculate commit frequency by day of week
    const commitFrequency = [
      { day: "Sun", count: dayMap["0"] },
      { day: "Mon", count: dayMap["1"] },
      { day: "Tue", count: dayMap["2"] },
      { day: "Wed", count: dayMap["3"] },
      { day: "Thu", count: dayMap["4"] },
      { day: "Fri", count: dayMap["5"] },
      { day: "Sat", count: dayMap["6"] },
    ]

    // Find most active day
    const mostActiveDay = [...commitFrequency].sort((a, b) => b.count - a.count)[0].day

    // Calculate repository growth over time
    const reposByDate = repositories.reduce((acc: Record<string, number>, repo: any) => {
      const date = new Date(repo.created_at)
      const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

      if (!acc[yearMonth]) {
        acc[yearMonth] = 0
      }

      acc[yearMonth]++
      return acc
    }, {})

    // Convert to cumulative growth
    const repositoryGrowth = []
    let cumulativeCount = 0

    Object.entries(reposByDate)
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .forEach(([date, count]) => {
        cumulativeCount += count
        repositoryGrowth.push({
          date: `${date}-01`, // First day of month
          count: cumulativeCount,
        })
      })

    // Generate star history (simulated for demo)
    const starHistory = []
    const startDate = new Date(fromDate)
    const endDate = new Date(toDate)
    const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const initialTotalStars = repositories.reduce((sum: number, repo: any) => sum + repo.stars, 0)

    // Create a simulated star history
    let currentStars = Math.floor(initialTotalStars * 0.2) // Start with 20% of current stars
    const starsPerDay = (initialTotalStars - currentStars) / totalDays

    for (let i = 0; i < totalDays; i += Math.floor(totalDays / 20)) {
      // Sample 20 points
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + i)

      currentStars += Math.floor(starsPerDay * i * (Math.random() * 0.5 + 0.75)) // Add some randomness

      starHistory.push({
        date: currentDate.toISOString(),
        count: Math.min(currentStars, initialTotalStars),
      })
    }

    // Ensure the last point has the total stars
    starHistory.push({
      date: endDate.toISOString(),
      count: initialTotalStars,
    })

    // Calculate streaks
    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0

    // Calculate current streak (consecutive days with contributions)
    for (let i = allDays.length - 1; i >= 0; i--) {
      const day = allDays[i]
      const date = new Date(day.date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      // Break if we're looking at days in the future
      if (date > today) continue

      // Break if we find a day with zero contributions
      if (day.contributionCount === 0) break

      currentStreak++
    }

    // Calculate longest streak
    for (const day of allDays) {
      if (day.contributionCount > 0) {
        tempStreak++
        longestStreak = Math.max(longestStreak, tempStreak)
      } else {
        tempStreak = 0
      }
    }

    // Format top repositories
    const topRepositories = repositories
      .sort((a: any, b: any) => b.stars - a.stars)
      .slice(0, 10)
      .map((repo: any) => ({
        name: repo.name,
        stars: repo.stars,
        forks: repo.forks,
        description: repo.description || "",
        url: repo.url,
        language: repo.language || "Unknown",
        languageColor: repo.language ? languageColors[repo.language] || "#8884d8" : "#8884d8",
      }))

    // Calculate overall stats
    const totalStars = repositories.reduce((sum: number, repo: any) => sum + repo.stars, 0)
    const totalForks = repositories.reduce((sum: number, repo: any) => sum + repo.forks, 0)
    const totalWatchers = repositories.reduce((sum: number, repo: any) => sum + (repo.watchers_count || 0), 0)
    const totalIssues = repositories.reduce((sum: number, repo: any) => sum + (repo.open_issues_count || 0), 0)
    const totalPullRequests = Math.floor(totalIssues * 0.7) // Estimate, as GitHub API doesn't provide this directly
    const totalCommits = contributionCalendar.totalContributions
    const averageCommitsPerDay = totalCommits / allDays.length

    // Return the processed data
    return NextResponse.json({
      profile: {
        login: profileData.login,
        name: profileData.name,
        avatar_url: profileData.avatar_url,
        html_url: profileData.html_url,
        public_repos: profileData.public_repos,
        followers: profileData.followers,
        following: profileData.following,
        created_at: profileData.created_at,
      },
      overallStats: {
        totalStars,
        totalForks,
        totalWatchers,
        totalIssues,
        totalPullRequests,
        totalCommits,
        totalContributions: contributionCalendar.totalContributions,
        averageCommitsPerDay,
        mostActiveDay,
        mostActiveTime: "10:00 - 14:00", // Placeholder, would need more detailed API data
        longestStreak,
        currentStreak,
      },
      languageStats,
      commitActivity,
      repositoryGrowth,
      starHistory,
      topRepositories,
      commitFrequency,
    })
  } catch (error) {
    console.error("Error fetching GitHub stats:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch GitHub statistics",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
