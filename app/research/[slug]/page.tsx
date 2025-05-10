import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { getResearchProjectBySlug } from "@/lib/research-project-service"
import {
  Calendar,
  Clock,
  Tag,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  ExternalLink,
  Users,
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
import { ScrollToTop } from "@/components/scroll-to-top"

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

// Generate metadata for the page
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = await getResearchProjectBySlug(params.slug)

  if (!project) {
    return {
      title: "Research Project Not Found",
      description: "The requested research project could not be found.",
    }
  }

  return {
    title: `${project.title} | Research & Development`,
    description: project.description,
    openGraph: {
      title: `${project.title} | Research & Development`,
      description: project.description,
      images: project.image_url ? [{ url: project.image_url }] : undefined,
    },
  }
}

export default async function ResearchProjectPage({ params }: { params: { slug: string } }) {
  const project = await getResearchProjectBySlug(params.slug)

  if (!project) {
    notFound()
  }

  // Get category icon
  const getCategoryIcon = (category: string) => {
    const IconComponent = CATEGORIES[category] || Layers
    return <IconComponent className="h-5 w-5" />
  }

  // Format dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
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
      <ScrollToTop />
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Link
          href="/research"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 mb-6 transition-colors"
          scroll={true}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Research Projects
        </Link>

        {/* Project header */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
              {getCategoryIcon(project.category)}
              <span className="ml-1">{project.category}</span>
            </div>
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityClass(project.priority)}`}
            >
              {project.priority === "high"
                ? "High Priority"
                : project.priority === "medium"
                  ? "Medium Priority"
                  : "Low Priority"}
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">{project.title}</h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-4">{project.description}</p>
        </div>

        {/* Project image */}
        {project.image_url && (
          <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
            <img
              src={project.image_url || "/placeholder.svg"}
              alt={project.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Project details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="col-span-2">
            {/* Overview */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Project Overview</h2>
              <div className="prose dark:prose-invert max-w-none">
                <p>{project.longDescription}</p>
              </div>
            </div>

            {/* Challenges */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Current Challenges</h2>
              <ul className="space-y-3">
                {project.challenges.map((challenge) => (
                  <li key={challenge.id} className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-rose-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{challenge.description}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Next milestone */}
            {project.nextMilestone && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Next Milestone</h2>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{project.nextMilestone}</span>
                </div>
              </div>
            )}
          </div>

          <div>
            {/* Project stats */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4">Project Stats</h3>

              {/* Completion */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Completion</span>
                  <span className="text-sm font-medium">{project.completion}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: `${project.completion}%` }}></div>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-3">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm">Started: {formatDate(project.startDate)}</span>
                </div>

                {project.endDate && (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm">Deadline: {formatDate(project.endDate)}</span>
                  </div>
                )}

                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm">Days remaining: {project.daysRemaining}</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Technologies & Skills</h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </div>
                ))}
              </div>
            </div>

            {/* Resources */}
            {project.resources && project.resources.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3">Resources</h3>
                <ul className="space-y-2">
                  {project.resources.map((resource, index) => (
                    <li key={index}>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        {resource.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Recent updates */}
        {project.recentUpdates && project.recentUpdates.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Project Timeline</h2>
            <div className="relative border-l-2 border-gray-200 dark:border-gray-700 pl-6 ml-3">
              {project.recentUpdates.map((update, index) => (
                <div key={index} className="mb-8 relative">
                  <div className="absolute -left-8 mt-1.5 w-4 h-4 rounded-full bg-primary"></div>
                  <div className="mb-1 text-sm text-gray-500 dark:text-gray-400">{update.date}</div>
                  <p className="text-gray-800 dark:text-gray-200">{update.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Team members */}
        {project.teamMembers && project.teamMembers.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Research Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {project.teamMembers.map((member, index) => {
                const isLead = member.includes("(Lead)")
                const name = isLead ? member.replace(" (Lead)", "") : member

                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      isLead ? "border-primary/30 bg-primary/5" : "border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                        <Users className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      </div>
                      <div>
                        <div className="font-medium">{name}</div>
                        {isLead && <div className="text-xs text-primary">Project Lead</div>}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Related projects (placeholder for future enhancement) */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Related Research Projects</h2>
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 text-center">
            <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600 dark:text-gray-400">Related projects will be displayed here in the future.</p>
          </div>
        </div>

        {/* Call to action */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Interested in this research?</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            If you're interested in collaborating or learning more about this research project, feel free to reach out
            for more information.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-md transition-colors"
              scroll={true}
            >
              Contact Me
            </Link>
            <Link
              href="/research"
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md transition-colors"
              scroll={true}
            >
              View All Research Projects
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
