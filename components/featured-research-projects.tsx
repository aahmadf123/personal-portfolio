"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Calendar,
  Clock,
  Tag,
  Brain,
  Rocket,
  Atom,
  Cpu,
  Database,
  Code,
  Microscope,
  Layers,
  Zap,
} from "lucide-react"
import { motion } from "framer-motion"
import { FallbackImage } from "./fallback-image"

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

interface ResearchProject {
  id: number
  title: string
  slug: string
  description: string
  image_url?: string
  category: string
  priority: string
  completion: number
  startDate: string
  endDate?: string
  daysRemaining: number
  tags: string[]
}

export function FeaturedResearchProjects() {
  const [projects, setProjects] = useState<ResearchProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/research-projects/featured?limit=3")

        if (!response.ok) {
          throw new Error(`Failed to fetch featured research projects: ${response.status}`)
        }

        const data = await response.json()
        setProjects(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Error fetching featured research projects:", error)
        setError(error instanceof Error ? error.message : "Unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProjects()
  }, [])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

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

  if (loading) {
    return (
      <div className="py-16">
        <div className="container px-4 mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Current Research</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl bg-gray-800/50 animate-pulse h-[400px]"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-16">
        <div className="container px-4 mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Current Research</h2>
          </div>
          <div className="p-4 bg-red-900/30 border border-red-800 rounded-lg text-red-400">
            <p>{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (projects.length === 0) {
    return null // Don't show the section if there are no featured projects
  }

  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
      <div className="container px-4 mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Current Research
          </h2>
          <Link
            href="/research"
            className="text-purple-400 hover:text-purple-300 flex items-center text-sm font-medium"
          >
            View All Research Projects
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <motion.div
          className="grid md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              className="group flex flex-col h-full overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-500/50"
              variants={itemVariants}
            >
              <div className="relative h-48 w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent opacity-60 z-10"></div>
                {project.image_url ? (
                  <FallbackImage
                    src={project.image_url}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    fallbackSrc="/research-project.png"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <span className="text-gray-500">No image</span>
                  </div>
                )}
                <div className="absolute top-4 left-4 z-20 flex gap-2">
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                    {getCategoryIcon(project.category)}
                    <span className="ml-1">{project.category}</span>
                  </div>
                  <div
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityClass(
                      project.priority,
                    )}`}
                  >
                    {project.priority === "high"
                      ? "High Priority"
                      : project.priority === "medium"
                        ? "Medium Priority"
                        : "Low Priority"}
                  </div>
                </div>
              </div>

              <div className="flex flex-col flex-1 p-6">
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>Started: {formatDate(project.startDate)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{project.daysRemaining} days left</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-purple-400 transition-colors line-clamp-2">
                  {project.title}
                </h3>

                <p className="text-gray-400 mb-4 line-clamp-3">{project.description}</p>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500">Completion</span>
                    <span className="text-xs font-medium">{project.completion}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${project.completion}%` }}></div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {project.tags.slice(0, 3).map((tag, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-800 text-gray-300"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </div>
                  ))}
                  {project.tags.length > 3 && (
                    <div className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-800 text-gray-300">
                      +{project.tags.length - 3} more
                    </div>
                  )}
                </div>

                <div className="mt-auto">
                  <Link
                    href={`/research/${project.slug}`}
                    className="inline-flex items-center text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    View Research Details
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
