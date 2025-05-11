"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Star } from "lucide-react";
import styles from "./projects.module.css";
import { RefreshButton } from "@/components/ui/refresh-button";

interface Project {
  id: number;
  title: string;
  slug: string;
  description?: string;
  summary?: string;
  thumbnail_url?: string;
  main_image_url?: string;
  image_url?: string;
  github_url?: string;
  demo_url?: string;
  is_featured: boolean;
  status?: string;
  completion?: number;
  start_date?: string;
  end_date?: string;
  tags?: string[] | { name: string }[];
  technologies?: string[] | { name: string }[];
  priority?: string;
}

export function EnhancedFeaturedProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "/api/projects/featured?limit=3&t=" + Date.now()
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.status}`);
      }

      const data = await response.json();
      console.log("Featured projects API response:", data);

      if (data.error) {
        throw new Error(data.error);
      }

      // Make sure we're handling the data properly
      const projectsArray = Array.isArray(data) ? data : [];
      console.log(
        `Setting ${projectsArray.length} featured projects:`,
        projectsArray
      );
      setProjects(projectsArray);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <section id="featured-projects" className={styles.projectsSection}>
      <div className="container px-4 md:px-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className={styles.sectionTitle}>Featured Projects</h2>
          <div className="flex items-center gap-2">
            <RefreshButton
              contentType="projects"
              onSuccess={fetchProjects}
              label="Refresh Projects"
            />
            {lastUpdated && (
              <span className="text-xs text-gray-500">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[450px] rounded-xl bg-gray-800/20 animate-pulse"
              ></div>
            ))}
          </div>
        ) : projects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No featured projects available at the moment.
          </p>
        )}

        <div className="flex justify-center mt-8">
          <Link
            href="/projects"
            className="inline-flex items-center px-4 py-2 rounded-md bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
            scroll={true}
          >
            View All Projects
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  // Process the image URL properly without fallbacks
  const getProcessedImageUrl = (project: Project): string | null => {
    try {
      // First check for thumbnail_url which is preferred for list views
      if (project.thumbnail_url) {
        console.log(
          `Using thumbnail_url for ${project.title}: ${project.thumbnail_url}`
        );
        return project.thumbnail_url;
      }

      // Then try main_image_url
      if (project.main_image_url) {
        console.log(
          `Using main_image_url for ${project.title}: ${project.main_image_url}`
        );
        return project.main_image_url;
      }

      // Then try image_url
      if (project.image_url) {
        console.log(
          `Using image_url for ${project.title}: ${project.image_url}`
        );
        return project.image_url;
      }

      // No valid image found
      return null;
    } catch (error) {
      console.error(`Error processing image URL for ${project.title}:`, error);
      return null;
    }
  };

  const imageUrl = getProcessedImageUrl(project);

  // Format dates if available - improved formatting to actual date format
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.error(`Invalid date: ${dateString}`);
        return null;
      }

      // Format as "Month Day, Year" (e.g., "May 12, 2025")
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error(`Error formatting date ${dateString}:`, error);
      return null;
    }
  };

  const startDate = formatDate(project.start_date);
  const endDate = formatDate(project.end_date);

  // Extract technologies from tags or technologies field
  const technologies = project.technologies || project.tags || [];
  const techList = Array.isArray(technologies)
    ? technologies.map((tech) =>
        typeof tech === "string" ? tech : tech.name || ""
      )
    : [];

  return (
    <div className="group h-full flex flex-col overflow-hidden rounded-xl border border-border bg-card/30 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/50">
      <div className="relative h-48 w-full overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent opacity-60 z-10"></div>

        {/* Featured badge */}
        <div className="absolute top-4 left-4 z-20">
          <span className="inline-flex items-center justify-center h-6 px-3 rounded-full text-xs font-medium bg-primary/20 text-primary border border-primary/30">
            <Star className="w-3 h-3 mr-1" />
            Featured
          </span>
        </div>

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

        {/* Project image - Only show when we have a valid URL */}
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              console.error(`Image loading error for ${project.title}`);
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
            <span className="text-gray-500">No image available</span>
          </div>
        )}
      </div>

      <div className="flex flex-col justify-between p-6 flex-1 relative">
        {/* Project details */}
        <div>
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-muted-foreground mb-4 line-clamp-3">
            {project.description || project.summary}
          </p>

          {/* Improved timeline display */}
          {(startDate || endDate) && (
            <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground bg-muted/30 px-3 py-2 rounded-md backdrop-blur-sm">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="font-medium">Timeline:</span>
              {startDate && <span>{startDate}</span>}
              {startDate && endDate && <span> — </span>}
              {endDate ? (
                <span>{endDate}</span>
              ) : (
                startDate && <span>Present</span>
              )}
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

        {/* Technologies */}
        <div className="flex flex-wrap gap-1 mb-4">
          {techList.slice(0, 4).map((tech, i) => (
            <span
              key={i}
              className="inline-block px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground"
            >
              {tech}
            </span>
          ))}
          {techList.length > 4 && (
            <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground">
              +{techList.length - 4} more
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
  );
}
