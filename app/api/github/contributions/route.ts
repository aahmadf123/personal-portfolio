import { NextResponse } from "next/server"

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

export async function GET() {
  try {
    // Extract username from NEXT_PUBLIC_GITHUB_URL
    const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL || ""
    const username = githubUrl.split("/").pop() || ""

    if (!username) {
      throw new Error("Could not determine GitHub username from environment variables")
    }

    // Use the GITHUB_TOKEN from environment variables
    const githubToken = process.env.GITHUB_TOKEN

    if (!githubToken) {
      throw new Error(
        "GITHUB_TOKEN is required for fetching contribution data. Please add this to your environment variables with appropriate permissions (read:user scope).",
      )
    }

    // Calculate date range (last 12 months)
    const today = new Date()
    const toDate = today.toISOString()
    const fromDate = new Date(today.setFullYear(today.getFullYear() - 1)).toISOString()

    // Fetch contribution data using GitHub GraphQL API
    const response = await fetch("https://api.github.com/graphql", {
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
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const data = await response.json()

    // Add more detailed error handling for GraphQL errors
    if (data.errors) {
      const errorMessages = data.errors.map((e: any) => e.message).join(", ")
      throw new Error(`GraphQL Error: ${errorMessages}. Check your token permissions.`)
    }

    // Extract and format the contribution data
    const contributionData = data.data.user.contributionsCollection.contributionCalendar

    return NextResponse.json({
      totalContributions: contributionData.totalContributions,
      weeks: contributionData.weeks,
    })
  } catch (error) {
    console.error("Error fetching GitHub contribution data:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch GitHub contribution data",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
