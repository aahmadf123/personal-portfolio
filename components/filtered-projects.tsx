"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Code, ExternalLink, FileText, Search, BookOpen } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Modal } from "./ui/modal"

interface Project {
  id: string
  title: string
  description: string
  image: string
  tags: string[]
  category: string
  technologies: string[]
  codeLink: string
  demoLink: string
  caseStudyLink: string
  featured: boolean
}

interface FilteredProjectsProps {
  projects: Project[]
  title?: string
  subtitle?: string
}

export function FilteredProjects({
  projects,
  title = "Featured Projects",
  subtitle = "Explore my portfolio of innovative projects at the intersection of aerospace engineering, artificial intelligence, and quantum computing.",
}: FilteredProjectsProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [activeTech, setActiveTech] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[0] | null>(null)

  // Extract unique categories and technologies
  const categories = ["all", ...Array.from(new Set(projects.map((project) => project.category)))]
  const technologies = ["all", ...Array.from(new Set(projects.flatMap((project) => project.technologies)))]

  // Filter projects based on active filters and search query
  useEffect(() => {
    let result = projects

    // Filter by category
    if (activeFilter !== "all") {
      result = result.filter((project) => project.category === activeFilter)
    }

    // Filter by technology
    if (activeTech !== "all") {
      result = result.filter((project) => project.technologies.includes(activeTech))
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (project) =>
          project.title.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    setFilteredProjects(result)
  }, [activeFilter, activeTech, searchQuery, projects])

  return (
    <section className="py-16 md:py-24" id="projects">
      <div className="container px-4 md:px-6">
        <h2 className="section-title">{title}</h2>
        <p className="section-subtitle">{subtitle}</p>

        <div className="mb-8 space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search
              className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${isSearchFocused ? "text-primary" : "text-muted-foreground"}`}
            />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="pl-10 transition-all border-muted focus:border-primary"
            />
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            <h3 className="text-sm font-medium mr-2 flex items-center">Category:</h3>
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeFilter === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(category)}
                className={`capitalize ${activeFilter === category ? "" : "hover:text-primary hover:border-primary"}`}
              >
                {category === "all" ? "All" : category}
              </Button>
            ))}
          </div>

          {/* Technology filters */}
          <div className="flex flex-wrap gap-2">
            <h3 className="text-sm font-medium mr-2 flex items-center">Technology:</h3>
            <div className="flex flex-wrap gap-2 max-w-full overflow-x-auto pb-2">
              {technologies.map((tech) => (
                <Button
                  key={tech}
                  variant={activeTech === tech ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTech(tech)}
                  className={`capitalize ${activeTech === tech ? "" : "hover:text-primary hover:border-primary"}`}
                >
                  {tech === "all" ? "All" : tech}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-20 border border-border rounded-lg">
            <h3 className="text-xl font-medium mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your filters or search query</p>
            <Button
              onClick={() => {
                setActiveFilter("all")
                setActiveTech("all")
                setSearchQuery("")
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <motion.div layout className="grid md:grid-cols-2 gap-6 lg:gap-10 mb-12">
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className="relative overflow-hidden rounded-lg border border-border bg-card/50 transition-all hover:shadow-lg hover:-translate-y-1"
                    onClick={() => setSelectedProject(project)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setSelectedProject(project)}
                  >
                    <ProjectCard project={project} />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        <div className="flex justify-center">
          <Button asChild className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
            <Link href="#">View All Projects</Link>
          </Button>
        </div>
        {/* Project Details Modal */}
        {selectedProject && (
          <Modal
            isOpen={selectedProject !== null}
            onClose={() => setSelectedProject(null)}
            title={selectedProject.title}
          >
            <div className="space-y-6">
              {/* Project Image */}
              {selectedProject.image && (
                <div className="rounded-md overflow-hidden">
                  <img
                    src={selectedProject.image || "/placeholder.svg"}
                    alt={selectedProject.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {selectedProject.tags?.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-full bg-primary/10 text-xs text-primary">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-medium mb-2">Description</h3>
                <p className="text-muted-foreground">{selectedProject.description}</p>
              </div>

              {/* Technologies */}
              {selectedProject.technologies && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Technologies</h3>
                  <div className="flex flex-wrap gap-1">
                    {selectedProject.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded-full bg-background text-xs text-muted-foreground border border-border"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                {selectedProject.codeLink && (
                  <a
                    href={selectedProject.codeLink}
                    className="inline-flex items-center justify-center px-4 py-2 border border-border bg-background hover:bg-muted rounded-md text-foreground text-sm font-medium transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Code className="h-4 w-4 mr-2" />
                    View Code
                  </a>
                )}
                {selectedProject.demoLink && (
                  <a
                    href={selectedProject.demoLink}
                    className="inline-flex items-center justify-center px-4 py-2 border border-primary/30 bg-primary/10 hover:bg-primary/20 rounded-md text-primary text-sm font-medium transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Live Demo
                  </a>
                )}
                {selectedProject.caseStudyLink && (
                  <a
                    href={selectedProject.caseStudyLink}
                    className="col-span-2 inline-flex items-center justify-center px-4 py-2 border border-border bg-background hover:bg-muted rounded-md text-foreground text-sm font-medium transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Read Case Study
                  </a>
                )}
              </div>
            </div>
          </Modal>
        )}
      </div>
    </section>
  )
}

interface ProjectCardProps {
  project: Project
}

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="project-card flex flex-col group">
      <div className="relative h-48 md:h-64 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-0 group-hover:opacity-60 transition-opacity z-10"></div>
        <Image
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {project.featured && (
          <div className="absolute top-3 left-3 z-20 bg-primary/90 text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
            Featured
          </div>
        )}
      </div>

      <div className="flex-1 p-6 flex flex-col">
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
        <p className="text-sm text-muted-foreground mb-4 flex-1">{project.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag) => (
            <span key={tag} className="tag bg-muted group-hover:bg-muted/80 transition-colors">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex gap-3 mt-auto">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="group-hover:border-primary/50 group-hover:text-primary transition-all"
          >
            <Link href={project.codeLink}>
              <Code className="h-4 w-4 mr-1" />
              Code
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="group-hover:border-primary/50 group-hover:text-primary transition-all"
          >
            <Link href={project.demoLink}>
              <ExternalLink className="h-4 w-4 mr-1" />
              Demo
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="group-hover:border-primary/50 group-hover:text-primary transition-all"
          >
            <Link href={project.caseStudyLink}>
              <FileText className="h-4 w-4 mr-1" />
              Case Study
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
