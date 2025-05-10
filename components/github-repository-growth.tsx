"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface RepositoryGrowthData {
  date: string
  count: number
}

interface GitHubRepositoryGrowthProps {
  data: RepositoryGrowthData[]
}

export function GitHubRepositoryGrowth({ data }: GitHubRepositoryGrowthProps) {
  // Format dates for display
  const formattedData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    count: item.count,
  }))

  return (
    <ChartContainer
      config={{
        count: {
          label: "Repositories",
          color: "hsl(var(--chart-4))",
        },
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={formattedData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} tickMargin={10} tickFormatter={(value) => value} />
          <YAxis tick={{ fontSize: 12 }} tickMargin={10} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            type="monotone"
            dataKey="count"
            stroke="var(--color-count)"
            fill="var(--color-count)"
            fillOpacity={0.2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
