"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface TopRepositoryData {
  name: string
  stars: number
  forks: number
  description: string
  url: string
  language: string
  languageColor: string
}

interface GitHubTopRepositoriesProps {
  data: TopRepositoryData[]
}

export function GitHubTopRepositories({ data }: GitHubTopRepositoriesProps) {
  // Format data for the chart
  const chartData = data
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 5)
    .map((repo) => ({
      name: repo.name,
      stars: repo.stars,
      forks: repo.forks,
    }))

  return (
    <ChartContainer
      config={{
        stars: {
          label: "Stars",
          color: "hsl(var(--chart-5))",
        },
        forks: {
          label: "Forks",
          color: "hsl(var(--chart-6))",
        },
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 12 }} tickMargin={10} />
          <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} tickMargin={10} width={100} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="stars" fill="var(--color-stars)" radius={[0, 4, 4, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
