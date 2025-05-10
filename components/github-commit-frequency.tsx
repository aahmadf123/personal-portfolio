"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface CommitFrequencyData {
  day: string
  count: number
}

interface GitHubCommitFrequencyProps {
  data: CommitFrequencyData[]
}

export function GitHubCommitFrequency({ data }: GitHubCommitFrequencyProps) {
  return (
    <ChartContainer
      config={{
        count: {
          label: "Commits",
          color: "hsl(var(--chart-3))",
        },
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="day" tick={{ fontSize: 12 }} tickMargin={10} />
          <YAxis tick={{ fontSize: 12 }} tickMargin={10} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
