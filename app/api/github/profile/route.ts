import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Extract username from NEXT_PUBLIC_GITHUB_URL or use a fallback method
    const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL || ""
    // Extract username from URL like https://github.com/username
    const username = githubUrl.split("/").pop() || ""

    // Update the error handling to be more descriptive
    if (!username) {
      throw new Error(
        "Could not determine GitHub username from NEXT_PUBLIC_GITHUB_URL environment variable. Please set this variable to your GitHub profile URL (e.g., https://github.com/username).",
      )
    }

    // Use the GITHUB_TOKEN from environment variables
    const githubToken = process.env.GITHUB_TOKEN

    // Add more detailed error handling for the token
    if (!githubToken) {
      console.warn("GITHUB_TOKEN not found. Using unauthenticated GitHub API requests which have lower rate limits.")
    }

    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
    }

    // Add token if available
    if (githubToken) {
      headers.Authorization = `token ${githubToken}`
    }

    // Fetch basic profile data
    const profileResponse = await fetch(`https://api.github.com/users/${username}`, {
      headers,
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    // Improve error response
    if (!profileResponse.ok) {
      const errorText = await profileResponse.text()
      throw new Error(`GitHub API error (${profileResponse.status}): ${errorText}`)
    }

    const profileData = await profileResponse.json()

    // Fetch repositories with more details
    const reposResponse = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=12&type=owner`,
      {
        headers,
        next: { revalidate: 3600 },
      },
    )

    if (!reposResponse.ok) {
      throw new Error(`GitHub API error: ${reposResponse.status}`)
    }

    const reposData = await reposResponse.json()

    // Return combined data with enhanced repository information
    return NextResponse.json({
      profile: profileData,
      repositories: reposData.map((repo: any) => ({
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
      })),
    })
  } catch (error) {
    console.error("Error fetching GitHub data:", error)
    return NextResponse.json({ error: "Failed to fetch GitHub data" }, { status: 500 })
  }
}
