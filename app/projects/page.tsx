import type { Metadata } from "next"
import { getAllProjects } from "@/lib/project-service"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Calendar, Star } from "lucide-react"

export const metadata: Metadata = {
  title: "Projects | Ahmad Firas",
  description: "Explore my projects in computer science, engineering, and data science",
}

// Set no cache on this page to ensure fresh data
export const revalidate = 0

export default async function ProjectsPage() {
  console.log("Rendering ProjectsPage")
  const projects = await getAllProjects()

  // Format date function to format dates as "Month Day, Year"
  const formatDate = (dateString?: string) => {
    if (!dateString) return null

    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        console.error(`Invalid date: ${dateString}`)
        return null
      }

      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (error) {
      console.error(`Error formatting date ${dateString}:`, error)
      return null
    }
  }

  return (
    <div className="container px-4 py-16 md:py-24 mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-teal-500 to-cyan-500 text-transparent bg-clip-text inline-block mb-4">
          Projects
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-400 via-teal-500 to-cyan-500 mx-auto rounded-full mb-6"></div>
        <p className="text-muted-foreground max-w-3xl mx-auto text-center text-lg">
          A collection of my projects in computer science, engineering, data science, and more. Each project showcases
          different skills and technologies.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {projects.map((project) => {
          // Get the image URL with proper fallbacks
          const imageUrl =
            project.thumbnail_url || project.main_image_url || project.image_url || "/project-visualization.png"

          // Format dates properly
          const startDate = formatDate(project.start_date)
          const endDate = formatDate(project.end_date)

          return (
            <div
              key={project.id}
              className="group h-full flex flex-col overflow-hidden rounded-xl border border-border bg-card/30 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/50"
            >
              <div className="relative h-48 w-full overflow-hidden">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent opacity-60 z-10"></div>

                {/* Featured badge */}
                {project.is_featured && (
                  <div className="absolute top-4 left-4 z-20">
                    <span className="inline-flex items-center justify-center h-6 px-3 rounded-full text-xs font-medium bg-primary/20 text-primary border border-primary/30">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </span>
                  </div>
                )}

                {/* Priority badge */}
                <div className="absolute top-4 right-4 z-20">
                  <span
                    className={`inline-flex items-center justify-center h-6 px-3 rounded-full text-xs font-medium ${
                      project.priority === "high"
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : project.priority === "medium"
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    }`}
                  >
                    <Star className="w-3 h-3 mr-1" />
                    {project.priority || "medium"}
                  </span>
                </div>

                {/* Project image */}
                <Image
                  src={imageUrl || "/placeholder.svg"}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    console.error(`Image error for ${project.title}:`, e)
                    const target = e.target as HTMLImageElement
                    target.src = "/broken-image-icon.png"
                  }}
                />
              </div>

              <div className="flex flex-col justify-between p-6 flex-1 relative">
                {/* Project details */}
                <div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                  <p className="text-muted-foreground mb-4 line-clamp-3">{project.description}</p>

                  {/* Improved timeline display */}
                  {(startDate || endDate) && (
                    <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground bg-muted/30 px-3 py-2 rounded-md backdrop-blur-sm">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="font-medium">Timeline:</span>
                      {startDate && <span>{startDate}</span>}
                      {startDate && endDate && <span> — </span>}
                      {endDate ? <span>{endDate}</span> : startDate && <span>Present</span>}
                    </div>
                  )}

                  {/* Progress bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium">Progress</span>
                      <span className="font-bold">{project.completion || 100}%</span>
                    </div>
                    <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-700`}
                        style={{ width: `${project.completion || 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.tags &&
                    (Array.isArray(project.tags) ? project.tags : []).slice(0, 4).map((tag, i) => {
                      const tagName = typeof tag === "string" ? tag : tag.name || ""
                      return (
                        <span
                          key={i}
                          className="inline-block px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground"
                        >
                          {tagName}
                        </span>
                      )
                    })}
                  {project.tags && (Array.isArray(project.tags) ? project.tags : []).length > 4 && (
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground">
                      +{(Array.isArray(project.tags) ? project.tags : []).length - 4} more
                    </span>
                  )}
                </div>

                {/* View project link */}
                <Link
                  href={`/projects/${project.slug}`}
                  className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  scroll={true}
                >
                  View Project Details
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
