import type { Metadata } from "next"
import Link from "next/link"
import { getAllResearchProjects } from "@/lib/research-project-service"
import {
  ArrowRight,
  Calendar,
  Clock,
  Tag,
  BarChart3,
  Rocket,
  Brain,
  Cpu,
  Database,
  Code,
  Microscope,
  Atom,
  Zap,
  Layers,
} from "lucide-react"

// Project categories with corresponding icons
const CATEGORIES: Record<string, any> = {
  AI: Brain,
  "Machine Learning": Brain,
  Aerospace: Rocket,
  Quantum: Atom,
  Robotics: Cpu,
  "Data Science": Database,
  Software: Code,
  Research: Microscope,
  Engineering: Layers,
  Energy: Zap,
}

export const metadata: Metadata = {
  title: "Research & Development Projects",
  description:
    "Explore my ongoing research and development projects in aerospace engineering, artificial intelligence, and emerging technologies.",
}

export default async function ResearchProjectsPage() {
  const projects = await getAllResearchProjects()

  // Get category icon
  const getCategoryIcon = (category: string) => {
    const IconComponent = CATEGORIES[category] || Layers
    return <IconComponent className="h-4 w-4" />
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Get priority class
  const getPriorityClass = (priority: string) => {
    return (
      {
        high: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
        medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
        low: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
      }[priority] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Research & Development</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore my ongoing research and development projects in aerospace engineering, artificial intelligence, and
            emerging technologies.
          </p>
        </div>

        {/* Projects count */}
        <div className="flex items-center justify-center mb-8 text-gray-600 dark:text-gray-400">
          <BarChart3 className="h-5 w-5 mr-2" />
          <span>Showing {projects.length} active research projects</span>
        </div>

        {/* Projects list */}
        <div className="space-y-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                    {getCategoryIcon(project.category)}
                    <span className="ml-1">{project.category}</span>
                  </div>
                  <div
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityClass(project.priority)}`}
                  >
                    {project.priority === "high"
                      ? "High Priority"
                      : project.priority === "medium"
                        ? "Medium Priority"
                        : "Low Priority"}
                  </div>
                </div>

                <h2 className="text-2xl font-bold mb-3">
                  <Link href={`/research/${project.slug}`} className="hover:text-primary transition-colors">
                    {project.title}
                  </Link>
                </h2>

                <p className="text-gray-600 dark:text-gray-400 mb-4">{project.description}</p>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Completion</span>
                    <span className="text-sm font-medium">{project.completion}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${project.completion}%` }}></div>
                  </div>
                </div>

                {/* Timeline info */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Started: {formatDate(project.startDate)}</span>
                  </div>

                  {project.endDate && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Deadline: {formatDate(project.endDate)}</span>
                    </div>
                  )}

                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Days remaining: {project.daysRemaining}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.tags.slice(0, 5).map((tag, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </div>
                  ))}
                  {project.tags.length > 5 && (
                    <div className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                      +{project.tags.length - 5} more
                    </div>
                  )}
                </div>

                {/* View details link */}
                <div className="mt-4">
                  <Link
                    href={`/research/${project.slug}`}
                    className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    View Project Details
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {projects.length === 0 && (
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-8 text-center">
            <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <h3 className="text-xl font-semibold mb-2">No Research Projects Found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              There are currently no active research projects to display.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
