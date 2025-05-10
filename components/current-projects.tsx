"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Clock,
  AlertCircle,
  CheckCircle,
  Calendar,
  Tag,
  ChevronDown,
  ChevronUp,
  Filter,
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
import styles from "./current-projects.module.css"
import type { ResearchProject } from "@/types/research-projects"
import { RefreshButton } from "@/components/ui/refresh-button"

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

// Filter options
const FILTER_OPTIONS = {
  categories: [
    "All",
    "AI",
    "Aerospace",
    "Quantum",
    "Robotics",
    "Energy",
    "Data Science",
    "Software",
    "Research",
    "Engineering",
  ],
  priorities: ["All", "High", "Medium", "Low"],
  completion: ["All", "Early Stage (<30%)", "Mid Stage (30-70%)", "Final Stage (>70%)"],
}

export function CurrentProjects() {
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [filters, setFilters] = useState({
    category: "All",
    priority: "All",
    completion: "All",
  })
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("priority")
  const [projects, setProjects] = useState<ResearchProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date())

  // Fetch research projects
  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/research-projects")

      if (!response.ok) {
        throw new Error("Failed to fetch research projects")
      }

      const data = await response.json()

      // Debug log to see what's coming from the API
      console.log("Research projects data:", data)

      // Process the data to ensure dates and days_remaining are properly formatted
      const processedData = data.map((project: any) => {
        // Ensure startDate is properly formatted
        const startDate = project.start_date || project.startDate

        // Ensure endDate is properly formatted
        const endDate = project.end_date || project.endDate

        // Ensure daysRemaining is properly extracted
        const daysRemaining = project.days_remaining !== undefined ? project.days_remaining : project.daysRemaining

        return {
          ...project,
          startDate,
          endDate,
          daysRemaining,
        }
      })

      setProjects(processedData)
      setLastRefreshed(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("Error fetching research projects:", err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects()
  }, [])

  // Filter projects based on selected filters
  const filteredProjects = projects.filter((project) => {
    if (filters.category !== "All" && project.category !== filters.category) return false
    if (filters.priority !== "All" && project.priority !== filters.priority.toLowerCase()) return false

    if (filters.completion !== "All") {
      if (filters.completion === "Early Stage (<30%)" && project.completion >= 30) return false
      if (filters.completion === "Mid Stage (30-70%)" && (project.completion < 30 || project.completion > 70))
        return false
      if (filters.completion === "Final Stage (>70%)" && project.completion <= 70) return false
    }

    return true
  })

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === "priority") {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      return (
        priorityOrder[a.priority as keyof typeof priorityOrder] -
        priorityOrder[b.priority as keyof typeof priorityOrder]
      )
    } else if (sortBy === "completion") {
      return b.completion - a.completion
    } else if (sortBy === "deadline") {
      // Use days_remaining for sorting if available, otherwise fallback to comparing dates
      const aDaysRemaining =
        a.days_remaining !== undefined
          ? a.days_remaining
          : a.daysRemaining !== undefined
            ? a.daysRemaining
            : Number.MAX_SAFE_INTEGER
      const bDaysRemaining =
        b.days_remaining !== undefined
          ? b.days_remaining
          : b.daysRemaining !== undefined
            ? b.daysRemaining
            : Number.MAX_SAFE_INTEGER

      if (aDaysRemaining !== Number.MAX_SAFE_INTEGER || bDaysRemaining !== Number.MAX_SAFE_INTEGER) {
        return aDaysRemaining - bDaysRemaining
      }

      // Fallback to comparing end dates
      const aEndDate = a.end_date || a.endDate
      const bEndDate = b.end_date || b.endDate

      const aDate = aEndDate ? new Date(aEndDate).getTime() : Number.MAX_SAFE_INTEGER
      const bDate = bEndDate ? new Date(bEndDate).getTime() : Number.MAX_SAFE_INTEGER
      return aDate - bDate
    }
    return 0
  })

  // Get category icon
  const getCategoryIcon = (category: string) => {
    const IconComponent = CATEGORIES[category] || Layers
    return <IconComponent className="h-4 w-4" />
  }

  // Handle refresh
  const handleRefresh = () => {
    fetchProjects()
  }

  return (
    <section className={styles.projectsSection}>
      {/* Background particles effect */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(67,56,202,0.15),transparent_70%)]"></div>
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className={styles.backgroundParticle}
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <div className="flex items-center justify-center w-full mb-4">
            <motion.h2
              className={styles.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Current Research & Development
            </motion.h2>
          </div>

          <div className="flex items-center justify-end w-full mb-4">
            <span className="text-sm text-gray-400 mr-2">Last updated: {lastRefreshed.toLocaleTimeString()}</span>
            <RefreshButton onClick={handleRefresh} />
          </div>

          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Track the progress of my ongoing research and development projects in aerospace engineering, artificial
            intelligence, and emerging technologies.
          </motion.p>
        </div>

        {/* Filters and sorting */}
        <div className={styles.filtersContainer}>
          <div className={styles.filterRow}>
            <button className={styles.filterButton} onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4" />
              {showFilters ? "Hide Filters" : "Show Filters"}
              {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            <div className={styles.sortContainer}>
              <span className={styles.sortLabel}>Sort by:</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={styles.sortSelect}>
                <option value="priority">Priority</option>
                <option value="completion">Completion</option>
                <option value="deadline">Deadline</option>
              </select>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ overflow: "hidden" }}
              >
                <div className={styles.filtersPanel}>
                  <div className={styles.filtersGrid}>
                    <div className={styles.filterGroup}>
                      <label className={styles.filterLabel}>Category</label>
                      <select
                        value={filters.category}
                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                        className={styles.filterSelect}
                      >
                        {FILTER_OPTIONS.categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className={styles.filterGroup}>
                      <label className={styles.filterLabel}>Priority</label>
                      <select
                        value={filters.priority}
                        onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                        className={styles.filterSelect}
                      >
                        {FILTER_OPTIONS.priorities.map((priority) => (
                          <option key={priority} value={priority}>
                            {priority}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className={styles.filterGroup}>
                      <label className={styles.filterLabel}>Completion Stage</label>
                      <select
                        value={filters.completion}
                        onChange={(e) => setFilters({ ...filters, completion: e.target.value })}
                        className={styles.filterSelect}
                      >
                        {FILTER_OPTIONS.completion.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative my-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Project count */}
        {!loading && !error && (
          <div className={styles.projectsCount}>
            <BarChart3 className="h-4 w-4" />
            <span>
              Showing {sortedProjects.length} of {projects.length} projects
            </span>
          </div>
        )}

        {/* Projects grid */}
        {!loading && !error && (
          <div className={styles.projectsGrid}>
            {sortedProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProjectCard
                  project={project}
                  isExpanded={expandedId === project.id}
                  onToggleExpand={() => setExpandedId(expandedId === project.id ? null : project.id)}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && sortedProjects.length === 0 && (
          <div className={styles.emptyState}>
            <AlertCircle className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>No projects match your filters</h3>
            <p className={styles.emptyText}>Try adjusting your filter criteria to see more projects.</p>
            <button
              className={styles.resetButton}
              onClick={() => setFilters({ category: "All", priority: "All", completion: "All" })}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

interface ProjectCardProps {
  project: ResearchProject
  isExpanded: boolean
  onToggleExpand: () => void
}

function ProjectCard({ project, isExpanded, onToggleExpand }: ProjectCardProps) {
  const priorityClass = {
    high: styles.highPriority,
    medium: styles.mediumPriority,
    low: styles.lowPriority,
  }[project.priority]

  const priorityValueClass = {
    high: styles.highValue,
    medium: styles.mediumValue,
    low: styles.lowValue,
  }[project.priority]

  const progressFillClass = {
    high: styles.highFill,
    medium: styles.mediumFill,
    low: styles.lowFill,
  }[project.priority]

  // Format date properly
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A"

    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (error) {
      console.error(`Error formatting date ${dateString}:`, error)
      return "N/A"
    }
  }

  // Get days remaining
  const getDaysRemaining = () => {
    // First check days_remaining field
    if (project.days_remaining !== undefined) {
      return project.days_remaining
    }

    // Then check daysRemaining field
    if (project.daysRemaining !== undefined) {
      return project.daysRemaining
    }

    // If neither exists, return N/A
    return "N/A"
  }

  // Get category icon
  const getCategoryIcon = (category: string) => {
    const IconComponent = CATEGORIES[category] || Layers
    return <IconComponent className="h-4 w-4" />
  }

  // Debug log for this specific project
  console.log("Project card data:", {
    id: project.id,
    title: project.title,
    startDate: project.startDate,
    start_date: project.start_date,
    endDate: project.endDate,
    end_date: project.end_date,
    daysRemaining: project.daysRemaining,
    days_remaining: project.days_remaining,
  })

  return (
    <div className={`${styles.projectCard} ${isExpanded ? "border-gray-600" : ""}`}>
      <div className={styles.cardContent}>
        {/* Header with title and priority */}
        <div className={styles.cardHeader}>
          <div className={styles.headerContent}>
            <div className="flex items-center gap-2 mb-2">
              {project.category && (
                <div className={styles.categoryBadge}>
                  {getCategoryIcon(project.category)}
                  <span>{project.category}</span>
                </div>
              )}
              <div className={`${styles.priorityBadge} ${priorityClass}`}>
                {project.priority === "high"
                  ? "High Priority"
                  : project.priority === "medium"
                    ? "Medium Priority"
                    : "Low Priority"}
              </div>
            </div>
            <h3 className={styles.projectTitle}>{project.title}</h3>
            <p className={styles.projectDescription}>{project.description}</p>
          </div>

          {/* Project image (only on larger screens) */}
          {project.image_url && (
            <div className="hidden lg:block">
              <div className={styles.projectImage}>
                <img
                  src={project.image_url || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className={styles.progressSection}>
          <div className={styles.progressLabel}>
            <span className={styles.progressText}>Completion Status</span>
            <span className={priorityValueClass}>{project.completion}%</span>
          </div>
          <div className={styles.progressBar}>
            <div
              className={`${styles.progressFill} ${progressFillClass} ${styles.shimmerEffect}`}
              style={{ width: `${project.completion}%` }}
            ></div>
          </div>
        </div>

        {/* Timeline info */}
        <div className={styles.timelineInfo}>
          <div className={styles.timelineItem}>
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>Started: {formatDate(project.start_date || project.startDate)}</span>
          </div>
          {(project.end_date || project.endDate) && (
            <div className={styles.timelineItem}>
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>Deadline: {formatDate(project.end_date || project.endDate)}</span>
            </div>
          )}
          <div className={styles.timelineItem}>
            <Clock className="h-4 w-4 text-gray-500" />
            <span>Days remaining: {getDaysRemaining()}</span>
          </div>
        </div>

        {/* Tags */}
        <div className={styles.tagsContainer}>
          {project.tags &&
            project.tags.map((tag, index) => (
              <div key={`${tag}-${index}`} className={styles.tag}>
                <Tag className="h-3 w-3" />
                {tag}
              </div>
            ))}
        </div>

        {/* Expandable content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              style={{ overflow: "hidden" }}
            >
              <div className={styles.expandedContent}>
                {/* Long description */}
                <div className={styles.expandedSection}>
                  <h4 className={styles.expandedTitle}>Project Overview</h4>
                  <p className={styles.projectDescription}>{project.longDescription || project.long_description}</p>
                </div>

                {/* Challenges and Milestones */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className={styles.expandedSection}>
                    <h4 className={styles.expandedTitle}>
                      <AlertCircle className="h-4 w-4 text-rose-500 mr-1" />
                      Current Challenges
                    </h4>
                    <ul className={styles.challengesList}>
                      {project.challenges &&
                        project.challenges.map((challenge) => (
                          <li key={challenge.id} className={styles.challengeItem}>
                            <span className={styles.challengeBullet}>•</span>
                            <span>{challenge.description}</span>
                          </li>
                        ))}
                    </ul>
                  </div>

                  <div className={styles.expandedSection}>
                    <h4 className={styles.expandedTitle}>
                      <CheckCircle className="h-4 w-4 text-emerald-500 mr-1" />
                      Next Milestone
                    </h4>
                    <p className={styles.projectDescription}>{project.nextMilestone || project.next_milestone}</p>

                    {/* Recent updates */}
                    {project.recentUpdates && project.recentUpdates.length > 0 && (
                      <div className={styles.updatesList}>
                        <h5 className="text-xs font-medium text-gray-400 mb-2">Recent Updates</h5>
                        <ul className={styles.updatesList}>
                          {project.recentUpdates.map((update, index) => (
                            <li key={index} className={styles.updateItem}>
                              <span className={styles.updateDate}>{update.date}:</span>
                              <span className={styles.updateText}>{update.text}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Team members */}
                {project.teamMembers && project.teamMembers.length > 0 && (
                  <div className={styles.teamSection}>
                    <h4 className={styles.expandedTitle}>Team</h4>
                    <div className={styles.teamList}>
                      {project.teamMembers.map((member, index) => (
                        <span key={index} className={styles.teamMember}>
                          {member}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Resources */}
                {project.resources && project.resources.length > 0 && (
                  <div className={styles.resourcesSection}>
                    <h4 className={styles.expandedTitle}>Resources</h4>
                    <div className={styles.resourcesList}>
                      {project.resources.map((resource, index) => (
                        <a key={index} href={resource.url} className={styles.resourceLink}>
                          {resource.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className={styles.actionsContainer}>
          <button className={styles.expandButton} onClick={onToggleExpand}>
            {isExpanded ? "Show Less" : "Show More"}
            {isExpanded ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
          </button>

          <div className={styles.actionButtons}>
            <Link href={`/research/${project.slug}`} className={styles.ghostButton} scroll={true}>
              View Details
            </Link>

            <Link href={`/research/${project.slug}`} className={styles.primaryButton} scroll={true}>
              Project Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
