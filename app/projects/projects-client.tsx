"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Calendar,
  Clock,
  Star,
  Filter,
  Search,
  X,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/types/projects";

interface ProjectsClientProps {
  projects: Project[];
}

export function ProjectsClient({ projects }: ProjectsClientProps) {
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Extract unique categories from projects
  const categories = Array.from(
    new Set(
      projects.map((project) => project.category).filter(Boolean) as string[]
    )
  );

  // Extract unique statuses from projects
  const statuses = Array.from(
    new Set(
      projects.map((project) => project.status).filter(Boolean) as string[]
    )
  );

  // Apply filters and sorting
  useEffect(() => {
    let result = [...projects];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (project) =>
          project.title.toLowerCase().includes(query) ||
          (project.description &&
            project.description.toLowerCase().includes(query)) ||
          (project.summary && project.summary.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (selectedCategory) {
      result = result.filter(
        (project) => project.category === selectedCategory
      );
    }

    // Apply status filter
    if (selectedStatus) {
      result = result.filter((project) => project.status === selectedStatus);
    }

    // Apply sorting
    switch (sortOption) {
      case "newest":
        result.sort((a, b) => {
          const dateA = a.start_date ? new Date(a.start_date).getTime() : 0;
          const dateB = b.start_date ? new Date(b.start_date).getTime() : 0;
          return dateB - dateA;
        });
        break;
      case "oldest":
        result.sort((a, b) => {
          const dateA = a.start_date ? new Date(a.start_date).getTime() : 0;
          const dateB = b.start_date ? new Date(b.start_date).getTime() : 0;
          return dateA - dateB;
        });
        break;
      case "a-z":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "z-a":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "completion-high":
        result.sort((a, b) => (b.completion || 0) - (a.completion || 0));
        break;
      case "completion-low":
        result.sort((a, b) => (a.completion || 0) - (b.completion || 0));
        break;
      case "priority-high":
        result.sort((a, b) => {
          const priorityMap: Record<string, number> = {
            high: 3,
            medium: 2,
            low: 1,
          };
          return (
            (priorityMap[b.priority || "low"] || 0) -
            (priorityMap[a.priority || "low"] || 0)
          );
        });
        break;
      default:
        break;
    }

    setFilteredProjects(result);
  }, [projects, searchQuery, selectedCategory, selectedStatus, sortOption]);

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setSelectedStatus(null);
    setSortOption("newest");
  };

  // Format date function to format dates as "Month Day, Year"
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.error(`Invalid date: ${dateString}`);
        return null;
      }

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

  return (
    <div className="container px-4 py-16 md:py-24 mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-teal-500 to-cyan-500 text-transparent bg-clip-text inline-block mb-4">
          Projects
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-400 via-teal-500 to-cyan-500 mx-auto rounded-full mb-6"></div>
        <p className="text-muted-foreground max-w-3xl mx-auto text-center text-lg">
          A collection of my projects in computer science, engineering, data
          science, and more. Each project showcases different skills and
          technologies.
        </p>
      </div>

      {/* Filters and Search */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="md:w-auto w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white flex items-center justify-center hover:bg-gray-700 transition-colors"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {(selectedCategory ||
              selectedStatus ||
              sortOption !== "newest") && (
              <span className="ml-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {
                  [
                    selectedCategory,
                    selectedStatus,
                    sortOption !== "newest" ? 1 : null,
                  ].filter(Boolean).length
                }
              </span>
            )}
          </button>
        </div>

        {/* Expanded filters */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Category filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category
                    </label>
                    <div className="space-y-2">
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className={`flex items-center px-3 py-2 rounded-lg text-sm w-full ${
                          selectedCategory === null
                            ? "bg-blue-600 text-white"
                            : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
                        }`}
                      >
                        <Check
                          className={`h-4 w-4 mr-2 ${
                            selectedCategory === null
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />
                        All Categories
                      </button>
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`flex items-center px-3 py-2 rounded-lg text-sm w-full ${
                            selectedCategory === category
                              ? "bg-blue-600 text-white"
                              : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
                          }`}
                        >
                          <Check
                            className={`h-4 w-4 mr-2 ${
                              selectedCategory === category
                                ? "opacity-100"
                                : "opacity-0"
                            }`}
                          />
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Status filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Status
                    </label>
                    <div className="space-y-2">
                      <button
                        onClick={() => setSelectedStatus(null)}
                        className={`flex items-center px-3 py-2 rounded-lg text-sm w-full ${
                          selectedStatus === null
                            ? "bg-blue-600 text-white"
                            : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
                        }`}
                      >
                        <Check
                          className={`h-4 w-4 mr-2 ${
                            selectedStatus === null
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />
                        All Statuses
                      </button>
                      {statuses.map((status) => (
                        <button
                          key={status}
                          onClick={() => setSelectedStatus(status)}
                          className={`flex items-center px-3 py-2 rounded-lg text-sm w-full ${
                            selectedStatus === status
                              ? "bg-blue-600 text-white"
                              : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
                          }`}
                        >
                          <Check
                            className={`h-4 w-4 mr-2 ${
                              selectedStatus === status
                                ? "opacity-100"
                                : "opacity-0"
                            }`}
                          />
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sort options */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Sort By
                    </label>
                    <div className="space-y-2">
                      <button
                        onClick={() => setSortOption("newest")}
                        className={`flex items-center px-3 py-2 rounded-lg text-sm w-full ${
                          sortOption === "newest"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
                        }`}
                      >
                        <Check
                          className={`h-4 w-4 mr-2 ${
                            sortOption === "newest"
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />
                        Newest First
                      </button>
                      <button
                        onClick={() => setSortOption("oldest")}
                        className={`flex items-center px-3 py-2 rounded-lg text-sm w-full ${
                          sortOption === "oldest"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
                        }`}
                      >
                        <Check
                          className={`h-4 w-4 mr-2 ${
                            sortOption === "oldest"
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />
                        Oldest First
                      </button>
                      <button
                        onClick={() => setSortOption("a-z")}
                        className={`flex items-center px-3 py-2 rounded-lg text-sm w-full ${
                          sortOption === "a-z"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
                        }`}
                      >
                        <Check
                          className={`h-4 w-4 mr-2 ${
                            sortOption === "a-z" ? "opacity-100" : "opacity-0"
                          }`}
                        />
                        A-Z
                      </button>
                      <button
                        onClick={() => setSortOption("z-a")}
                        className={`flex items-center px-3 py-2 rounded-lg text-sm w-full ${
                          sortOption === "z-a"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
                        }`}
                      >
                        <Check
                          className={`h-4 w-4 mr-2 ${
                            sortOption === "z-a" ? "opacity-100" : "opacity-0"
                          }`}
                        />
                        Z-A
                      </button>
                      <button
                        onClick={() => setSortOption("completion-high")}
                        className={`flex items-center px-3 py-2 rounded-lg text-sm w-full ${
                          sortOption === "completion-high"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
                        }`}
                      >
                        <Check
                          className={`h-4 w-4 mr-2 ${
                            sortOption === "completion-high"
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />
                        Completion (High to Low)
                      </button>
                      <button
                        onClick={() => setSortOption("completion-low")}
                        className={`flex items-center px-3 py-2 rounded-lg text-sm w-full ${
                          sortOption === "completion-low"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
                        }`}
                      >
                        <Check
                          className={`h-4 w-4 mr-2 ${
                            sortOption === "completion-low"
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />
                        Completion (Low to High)
                      </button>
                      <button
                        onClick={() => setSortOption("priority-high")}
                        className={`flex items-center px-3 py-2 rounded-lg text-sm w-full ${
                          sortOption === "priority-high"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
                        }`}
                      >
                        <Check
                          className={`h-4 w-4 mr-2 ${
                            sortOption === "priority-high"
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />
                        Priority (High to Low)
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter summary */}
        {(selectedCategory || selectedStatus || searchQuery) && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-sm text-gray-400">Filtered by:</span>
            {selectedCategory && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 text-blue-400 border border-blue-800">
                Category: {selectedCategory}
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="ml-1 text-blue-400 hover:text-blue-300"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {selectedStatus && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 text-blue-400 border border-blue-800">
                Status: {selectedStatus}
                <button
                  onClick={() => setSelectedStatus(null)}
                  className="ml-1 text-blue-400 hover:text-blue-300"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 text-blue-400 border border-blue-800">
                Search: {searchQuery}
                <button
                  onClick={() => setSearchQuery("")}
                  className="ml-1 text-blue-400 hover:text-blue-300"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            <button
              onClick={resetFilters}
              className="text-xs text-blue-400 hover:text-blue-300 ml-2"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Projects grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <AnimatePresence mode="wait">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => {
              // Get the image URL with proper fallbacks
              const imageUrl =
                project.image_url || "/project-visualization.png";

              // Format dates properly
              const startDate = formatDate(project.start_date);
              const endDate = formatDate(project.end_date);

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className="group h-full flex flex-col overflow-hidden rounded-xl border border-border bg-card/30 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/50"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent opacity-60 z-10"></div>

                    {/* Featured badge */}
                    {project.featured && (
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
                        console.error(`Image error for ${project.title}:`, e);
                        const target = e.target as HTMLImageElement;
                        target.src = "/broken-image-icon.png";
                      }}
                    />
                  </div>

                  <div className="flex flex-col justify-between p-6 flex-1 relative">
                    {/* Project details */}
                    <div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {project.description}
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
                          <span className="font-bold">
                            {project.completion || 100}%
                          </span>
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
                      {project.technologies &&
                        project.technologies.slice(0, 4).map((tech, i) => (
                          <span
                            key={i}
                            className="inline-block px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground"
                          >
                            {tech}
                          </span>
                        ))}
                      {project.technologies &&
                        project.technologies.length > 4 && (
                          <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground">
                            +{project.technologies.length - 4} more
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
                </motion.div>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="col-span-3 py-16 text-center"
            >
              <p className="text-muted-foreground mb-4">
                No projects match your filters.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Reset Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
