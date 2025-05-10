"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

interface LanguageData {
  name: string
  count: number
  percentage: number
  color: string
}

interface GitHubLanguageChartProps {
  data: LanguageData[]
}

export function GitHubLanguageChart({ data }: GitHubLanguageChartProps) {
  // Format data for the chart
  const chartData = data.map((lang) => ({
    name: lang.name,
    value: lang.count,
    percentage: lang.percentage,
    color: lang.color,
  }))

  return (
    <ChartContainer
      config={{
        ...Object.fromEntries(
          data.map((lang) => [
            lang.name,
            {
              label: lang.name,
              color: lang.color,
            },
          ]),
        ),
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltipContent />} />
          <Legend layout="vertical" verticalAlign="middle" align="right" />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
