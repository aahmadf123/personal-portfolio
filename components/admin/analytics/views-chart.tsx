"use client"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

interface ViewsChartProps {
  data: Record<string, { projects: number; blog: number; total: number }>
}

export function ViewsChart({ data }: ViewsChartProps) {
  // Sort dates in ascending order
  const sortedDates = Object.keys(data).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

  // Format dates for display
  const formattedDates = sortedDates.map((date) => {
    const d = new Date(date)
    return `${d.getMonth() + 1}/${d.getDate()}`
  })

  // Extract data points
  const totalViews = sortedDates.map((date) => data[date].total)
  const projectViews = sortedDates.map((date) => data[date].projects)
  const blogViews = sortedDates.map((date) => data[date].blog)

  const chartData = {
    labels: formattedDates,
    datasets: [
      {
        label: "Total Views",
        data: totalViews,
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
        borderWidth: 2,
      },
      {
        label: "Project Views",
        data: projectViews,
        borderColor: "rgba(16, 185, 129, 1)",
        backgroundColor: "rgba(16, 185, 129, 0.05)",
        fill: true,
        tension: 0.4,
        borderWidth: 2,
      },
      {
        label: "Blog Views",
        data: blogViews,
        borderColor: "rgba(249, 115, 22, 1)",
        backgroundColor: "rgba(249, 115, 22, 0.05)",
        fill: true,
        tension: 0.4,
        borderWidth: 2,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "rgba(255, 255, 255, 0.8)",
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        titleColor: "rgba(255, 255, 255, 0.9)",
        bodyColor: "rgba(255, 255, 255, 0.7)",
        borderColor: "rgba(59, 130, 246, 0.5)",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
          precision: 0,
        },
      },
    },
    interaction: {
      mode: "nearest" as const,
      axis: "x" as const,
      intersect: false,
    },
  }

  return <Line data={chartData} options={options} />
}
