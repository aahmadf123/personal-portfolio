import { Suspense } from "react"
import Link from "next/link"
import { NextOptimizedImage } from "@/components/next-optimized-image"
import { Calendar } from "lucide-react"

// This is a Server Component that fetches data
async function ProjectsList({ limit = 6, featured = false }) {
  // Fetch projects data
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects?limit=${limit}&featured=${featured}`,
    { next: { revalidate: 3600 } }, // Revalidate every hour
  )

  if (!res.ok) {
    throw new Error("Failed to fetch projects")
  }

  const { data } = await res.json()

  // Format date function to format dates as "Month Day, Year"
  const formatDate = (dateString?: string) => {
    if (!dateString) return null

    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return null
      }

      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (error) {
      return null
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((project: any) => {
        // Format dates properly
        const startDate = formatDate(project.start_date)
        const endDate = formatDate(project.end_date)

        return (
          <Link
            key={project.id}
            href={`/projects/${project.slug}`}
            className="group block overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300"
            scroll={true}
          >
            <div className="relative aspect-video overflow-hidden">
              <NextOptimizedImage
                src={project.image_url || "/placeholder.svg?height=300&width=500&query=project"}
                alt={project.title}
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                width={500}
                height={300}
                loadingPriority="medium"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{project.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{project.description}</p>

              {/* Improved timeline display */}
              {(startDate || endDate) && (
                <div className="flex items-center gap-2 mb-3 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/30 px-3 py-2 rounded-md">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="font-medium">Timeline:</span>
                  {startDate && <span>{startDate}</span>}
                  {startDate && endDate && <span> — </span>}
                  {endDate ? <span>{endDate}</span> : startDate && <span>Present</span>}
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {project.technologies?.split(",").map((tech: string, index: number) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  >
                    {tech.trim()}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

// This is the component that will be imported elsewhere
export function ProjectsGrid({ limit, featured }: { limit?: number; featured?: boolean }) {
  return (
    <Suspense
      fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(limit || 6)
            .fill(null)
            .map((_, i) => (
              <div key={i} className="rounded-lg bg-gray-100 dark:bg-gray-800 shadow animate-pulse">
                <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-t-lg" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                  </div>
                </div>
              </div>
            ))}
        </div>
      }
    >
      <ProjectsList limit={limit} featured={featured} />
    </Suspense>
  )
}
