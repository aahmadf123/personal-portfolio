"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ContributionDay {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4 // 0 = no contributions, 1-4 = contribution levels
}

interface ContributionWeek {
  days: ContributionDay[]
}

interface ContributionData {
  weeks: ContributionWeek[]
  totalContributions: number
  currentStreak: number
}

// Mock data - replace with actual API call
const fetchContributionData = async (month: number, year: number): Promise<ContributionData> => {
  // In a real implementation, this would fetch from GitHub API
  // For now, generate some mock data
  const weeks: ContributionWeek[] = []
  const startDate = new Date(year, month, 1)
  const endDate = new Date(year, month + 1, 0)

  // Find the first Sunday before or on the start date
  const firstSunday = new Date(startDate)
  firstSunday.setDate(firstSunday.getDate() - firstSunday.getDay())

  // Generate weeks until we cover the entire month
  const currentDate = new Date(firstSunday)
  let totalContributions = 0
  let streak = 0
  let currentStreak = 0

  while (currentDate <= endDate || weeks[weeks.length - 1]?.days.length < 7) {
    // Start a new week if needed
    if (currentDate.getDay() === 0 || weeks.length === 0) {
      weeks.push({ days: [] })
    }

    // Generate contribution count (random for mock data)
    const isInMonth = currentDate.getMonth() === month

    // Generate a level based on count (GitHub style)
    let count = 0
    let level: 0 | 1 | 2 | 3 | 4 = 0

    if (isInMonth) {
      // More realistic distribution for GitHub-style contributions
      const rand = Math.random()
      if (rand > 0.6) {
        count = Math.floor(Math.random() * 10) + 1
        if (count > 0 && count <= 2) level = 1
        else if (count <= 5) level = 2
        else if (count <= 8) level = 3
        else level = 4
      }

      totalContributions += count

      // Update streak
      if (count > 0) {
        currentStreak++
      } else {
        currentStreak = 0
      }

      if (currentStreak > streak) {
        streak = currentStreak
      }
    }

    // Add the day
    weeks[weeks.length - 1].days.push({
      date: currentDate.toISOString().split("T")[0],
      count,
      level,
    })

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return {
    weeks,
    totalContributions,
    currentStreak: streak,
  }
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export default function GitHubContributionGraph() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [contributionData, setContributionData] = useState<ContributionData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const data = await fetchContributionData(currentMonth, currentYear)
        setContributionData(data)
      } catch (error) {
        console.error("Failed to load contribution data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [currentMonth, currentYear])

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  // GitHub-style contribution colors
  const getLevelColor = (level: number) => {
    switch (level) {
      case 0:
        return "bg-gray-800"
      case 1:
        return "bg-green-900"
      case 2:
        return "bg-green-700"
      case 3:
        return "bg-green-500"
      case 4:
        return "bg-green-300"
      default:
        return "bg-gray-800"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">
          <span className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-github"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
            GitHub Contribution Activity
          </span>
        </CardTitle>
        <div className="flex items-center space-x-2">
          <button
            onClick={goToPreviousMonth}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="font-medium">
            {monthNames[currentMonth]} {currentYear}
          </span>
          <button
            onClick={goToNextMonth}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Next month"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <>
            <div className="flex mb-1 text-xs text-gray-500">
              <div className="w-8"></div>
              <div className="flex-1 grid grid-cols-7 gap-1">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
              </div>
            </div>
            <div className="flex">
              <div className="w-8"></div>
              <div className="flex-1">
                <div className="grid grid-cols-7 gap-1">
                  {contributionData?.weeks.flatMap((week, weekIndex) =>
                    week.days.map((day, dayIndex) => (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        className={`h-3 w-3 rounded-sm ${getLevelColor(day.level)}`}
                        title={`${day.date}: ${day.count} contributions`}
                      />
                    )),
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <div className="flex items-center gap-1 text-sm">
                <span>Less</span>
                <div className={`h-3 w-3 rounded-sm ${getLevelColor(0)}`}></div>
                <div className={`h-3 w-3 rounded-sm ${getLevelColor(1)}`}></div>
                <div className={`h-3 w-3 rounded-sm ${getLevelColor(2)}`}></div>
                <div className={`h-3 w-3 rounded-sm ${getLevelColor(3)}`}></div>
                <div className={`h-3 w-3 rounded-sm ${getLevelColor(4)}`}></div>
                <span>More</span>
              </div>
              <div className="text-sm">
                <span className="font-bold">{contributionData?.totalContributions}</span> contributions in{" "}
                {monthNames[currentMonth]}
                {contributionData?.currentStreak ? (
                  <span className="ml-2 text-green-500">{contributionData.currentStreak} day streak</span>
                ) : null}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

// Add this named export at the end of the file, after the default export

export { default as GitHubContributionGraph } from "./github-contribution-graph"
