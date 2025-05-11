import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  ArrowLeft,
  Github,
  ExternalLink,
  Video,
  Tag,
  Clock,
} from "lucide-react";
import { getProjectBySlug, getAllProjects } from "@/lib/project-service";

type Props = {
  params: { slug: string };
};

// Set a revalidation period for all project pages (3 hours)
export const revalidate = 10800;

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} | Project Details`,
    description:
      project.description ||
      project.summary ||
      `Details about ${project.title}`,
  };
}

export default async function ProjectPage({ params }: Props) {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  // Format dates for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.error(`Invalid date: ${dateString}`);
        return null;
      }

      // Format as YYYY-MM-DD
      return date.toISOString().split("T")[0];
    } catch (error) {
      console.error(`Error formatting date ${dateString}:`, error);
      return null;
    }
  };

  const startDate = formatDate(project.start_date);
  const endDate = formatDate(project.end_date);

  // Get main image
  const mainImage =
    project.main_image_url ||
    project.thumbnail_url ||
    project.image_url ||
    "/project-visualization.png";

  // Process tags and technologies
  const tags = project.project_tags
    ? project.project_tags.map((tag) =>
        typeof tag === "string" ? tag : tag.name
      )
    : [];

  const technologies = project.project_technologies
    ? project.project_technologies.map((tech) =>
        typeof tech === "string" ? tech : tech.name
      )
    : [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/projects"
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
          scroll={true}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Projects
        </Link>
      </div>

      {/* Project header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {project.title}
        </h1>

        {/* Improved timeline display */}
        {(startDate || endDate) && (
          <div className="inline-flex items-center px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 mb-4">
            <Calendar className="h-4 w-4 mr-2 text-primary" />
            <span className="font-medium mr-1">Timeline:</span>
            {startDate && <span>{startDate}</span>}
            {startDate && endDate && <span className="mx-2">—</span>}
            {endDate ? (
              <span>{endDate}</span>
            ) : (
              startDate && <span>Present</span>
            )}
          </div>
        )}

        {/* Status and completion */}
        {project.status && (
          <div className="flex items-center mt-2 mb-4">
            <Clock className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Status: <span className="font-normal">{project.status}</span>
              {project.completion !== undefined &&
                ` (${project.completion}% complete)`}
            </span>
          </div>
        )}

        {/* External links */}
        <div className="flex flex-wrap gap-4 mb-6">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Github className="h-4 w-4 mr-2" />
              GitHub Repository
            </a>
          )}
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Live Demo
            </a>
          )}
          {project.video_url && (
            <a
              href={project.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Video className="h-4 w-4 mr-2" />
              Watch Video
            </a>
          )}
        </div>
      </div>

      {/* Main image */}
      <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-lg overflow-hidden mb-8">
        <Image
          src={mainImage || "/placeholder.svg"}
          alt={project.title}
          fill
          className="object-cover"
          priority
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/broken-image-icon.png";
          }}
        />
      </div>

      {/* Project content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Description */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Project Overview
            </h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {project.description}
              </p>
              {project.details && (
                <>
                  <h3 className="text-lg font-semibold mt-6 mb-3">Details</h3>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {project.details}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Challenges */}
          {project.project_challenges &&
            project.project_challenges.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Challenges & Solutions
                </h2>
                <div className="space-y-6">
                  {project.project_challenges.map((challenge) => (
                    <div
                      key={challenge.id}
                      className="border-l-4 border-primary pl-4"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {challenge.title}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        {challenge.description}
                      </p>
                      {challenge.solution && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Solution:
                          </h4>
                          <p className="text-gray-700 dark:text-gray-300">
                            {challenge.solution}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Additional images */}
          {project.project_images && project.project_images.length > 1 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Project Gallery
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.project_images
                  .filter((img) => img.url !== mainImage)
                  .map((image) => (
                    <div
                      key={image.id}
                      className="relative h-48 rounded-lg overflow-hidden"
                    >
                      <Image
                        src={image.url || "/placeholder.svg"}
                        alt={image.alt_text || `${project.title} image`}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/broken-image-icon.png";
                        }}
                      />
                      {image.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 text-sm">
                          {image.caption}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          {/* Project details sidebar */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
            {/* Client info */}
            {project.client && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Client
                </h3>
                <p className="text-gray-900 dark:text-white">
                  {project.client}
                </p>
              </div>
            )}

            {/* Technologies */}
            {technologies.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Milestones */}
            {project.project_milestones &&
              project.project_milestones.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Project Milestones
                  </h3>
                  <div className="space-y-3">
                    {project.project_milestones.map((milestone) => (
                      <div
                        key={milestone.id}
                        className="border-l-2 border-gray-200 dark:border-gray-700 pl-3 py-1"
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            {milestone.title}
                          </h4>
                          <span
                            className={`text-xs px-1.5 py-0.5 rounded ${
                              milestone.status === "completed"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : milestone.status === "in_progress"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                            }`}
                          >
                            {milestone.status === "completed"
                              ? "Completed"
                              : milestone.status === "in_progress"
                              ? "In Progress"
                              : "Planned"}
                          </span>
                        </div>
                        {milestone.description && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {milestone.description}
                          </p>
                        )}
                        {milestone.date && (
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {new Date(milestone.date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
