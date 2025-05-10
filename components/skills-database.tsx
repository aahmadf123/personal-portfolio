"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, ArrowUpDown, Star, StarHalf, X, RefreshCw } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Skill } from "@/types/skills"
import { toast } from "@/components/ui/use-toast"

// Category icons mapping
import {
  Code,
  Database,
  LineChart,
  Globe,
  Cpu,
  Layers,
  Palette,
  Zap,
  Server,
  Cloud,
  Smartphone,
  Microscope,
  Braces,
  Terminal,
  BarChart,
} from "lucide-react"

// Get icon for a category
const getCategoryIcon = (category: string) => {
  const iconMap: Record<string, JSX.Element> = {
    "Programming Languages": <Code className="h-4 w-4" />,
    "Web Development": <Globe className="h-4 w-4" />,
    "Data Science": <LineChart className="h-4 w-4" />,
    "Machine Learning": <Cpu className="h-4 w-4" />,
    DevOps: <Server className="h-4 w-4" />,
    "Cloud Computing": <Cloud className="h-4 w-4" />,
    Databases: <Database className="h-4 w-4" />,
    "Tools & Platforms": <Layers className="h-4 w-4" />,
    "Quantum Computing": <Microscope className="h-4 w-4" />,
    "Mobile Development": <Smartphone className="h-4 w-4" />,
    "UI/UX Design": <Palette className="h-4 w-4" />,
    "Backend Development": <Terminal className="h-4 w-4" />,
    "Data Analytics": <BarChart className="h-4 w-4" />,
    "Frontend Development": <Braces className="h-4 w-4" />,
  }

  return iconMap[category] || <Zap className="h-4 w-4" />
}

// Get proficiency level label
const getProficiencyLabel = (proficiency: number): string => {
  if (proficiency >= 9) return "Expert"
  if (proficiency >= 7) return "Advanced"
  if (proficiency >= 5) return "Intermediate"
  if (proficiency >= 3) return "Basic"
  return "Beginner"
}

// Get color for a category
const getCategoryColor = (category: string): string => {
  const colorMap: Record<string, string> = {
    "Programming Languages": "#8b5cf6", // Purple
    "Web Development": "#3b82f6", // Blue
    "Data Science": "#10b981", // Emerald
    "Machine Learning": "#8b5cf6", // Purple
    DevOps: "#f97316", // Orange
    "Cloud Computing": "#0ea5e9", // Sky
    Databases: "#ef4444", // Red
    "Tools & Platforms": "#14b8a6", // Teal
    "Quantum Computing": "#d946ef", // Fuchsia
    "Mobile Development": "#f59e0b", // Amber
    "UI/UX Design": "#ec4899", // Pink
    "Backend Development": "#6366f1", // Indigo
    "Data Analytics": "#84cc16", // Lime
    "Frontend Development": "#06b6d4", // Cyan
  }

  return colorMap[category] || "#6b7280" // Gray default
}

export function SkillsDatabase() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"proficiency" | "name">("proficiency")
  const [viewMode, setViewMode] = useState<"grid" | "list" | "compact">("grid")
  const [mounted, setMounted] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const supabase = createClientComponentClient()

  const fetchSkills = useCallback(
    async (showRefreshing = false) => {
      try {
        if (showRefreshing) {
          setRefreshing(true)
        } else {
          setLoading(true)
        }

        // Use a cache-busting query parameter to avoid browser caching
        const timestamp = new Date().getTime()
        const response = await fetch(`/api/skills?t=${timestamp}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch skills")
        }

        const data = await response.json()
        setSkills(data)
        setLastUpdated(new Date())

        if (showRefreshing) {
          toast({
            title: "Skills refreshed",
            description: `Successfully loaded ${data.length} skills from the database.`,
            duration: 3000,
          })
        }
      } catch (err) {
        console.error("Error fetching skills:", err)
        setError("Failed to load skills data. Please try again later.")

        if (showRefreshing) {
          toast({
            title: "Refresh failed",
            description: "Could not refresh skills data. Please try again.",
            variant: "destructive",
            duration: 3000,
          })
        }
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    [toast],
  )

  const handleRefresh = useCallback(() => {
    fetchSkills(true)
  }, [fetchSkills])

  useEffect(() => {
    setMounted(true)
    fetchSkills()

    // Set up a polling interval to check for updates every minute
    const intervalId = setInterval(() => {
      fetchSkills()
    }, 60000) // 60 seconds

    return () => clearInterval(intervalId)
  }, [fetchSkills])

  // Get unique categories from the skills data
  const categories = useMemo(() => {
    return Array.from(new Set(skills.map((skill) => skill.category))).sort()
  }, [skills])

  // Filter and sort skills
  const filteredAndSortedSkills = useMemo(() => {
    let result = skills

    // Filter by category
    if (activeCategory) {
      result = result.filter((skill) => skill.category === activeCategory)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (skill) =>
          skill.name.toLowerCase().includes(query) ||
          skill.category.toLowerCase().includes(query) ||
          (skill.description && skill.description.toLowerCase().includes(query)),
      )
    }

    // Sort
    if (sortBy === "proficiency") {
      result = [...result].sort((a, b) => b.proficiency - a.proficiency)
    } else {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name))
    }

    return result
  }, [skills, activeCategory, searchQuery, sortBy])

  // Group skills by category
  const skillsByCategory = useMemo(() => {
    const grouped: Record<string, Skill[]> = {}

    filteredAndSortedSkills.forEach((skill) => {
      if (!grouped[skill.category]) {
        grouped[skill.category] = []
      }
      grouped[skill.category].push(skill)
    })

    // Sort categories by name
    return Object.fromEntries(Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)))
  }, [filteredAndSortedSkills])

  // Generate star rating based on proficiency
  const renderStarRating = (proficiency: number) => {
    const fullStars = Math.floor(proficiency / 2)
    const hasHalfStar = proficiency % 2 >= 1

    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return <Star key={i} size={12} fill="currentColor" className="text-amber-500" />
          } else if (i === fullStars && hasHalfStar) {
            return <StarHalf key={i} size={12} fill="currentColor" className="text-amber-500" />
          } else {
            return <Star key={i} size={12} className="text-gray-300 dark:text-gray-600" />
          }
        })}
      </div>
    )
  }

  if (!mounted) return null

  return (
    <section className="py-16 md:py-24 relative overflow-hidden" id="skills">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background to-background z-0"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Skills & Expertise
          </motion.h2>
          <motion.p
            className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Explore my technical skills and expertise across various domains including programming, data science, web
            development, and more.
          </motion.p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-muted-foreground">Loading skills data...</p>
          </div>
        ) : error ? (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 text-center">
            <p className="text-destructive mb-4">{error}</p>
            <button
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              onClick={handleRefresh}
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col space-y-6">
              {/* Controls */}
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative w-full sm:w-64 md:w-80">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="search"
                    placeholder="Search skills..."
                    className="w-full bg-background rounded-md border border-input pl-8 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground"
                      onClick={() => setSearchQuery("")}
                      aria-label="Clear search"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Filter className="h-4 w-4" />
                    <span className="hidden sm:inline">Sort:</span>
                  </div>
                  <button
                    className={`px-2.5 py-1.5 text-xs rounded-md flex items-center gap-1 ${
                      sortBy === "proficiency" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                    }`}
                    onClick={() => setSortBy("proficiency")}
                  >
                    <ArrowUpDown className="h-3 w-3" />
                    Proficiency
                  </button>
                  <button
                    className={`px-2.5 py-1.5 text-xs rounded-md flex items-center gap-1 ${
                      sortBy === "name" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                    }`}
                    onClick={() => setSortBy("name")}
                  >
                    <ArrowUpDown className="h-3 w-3" />
                    Name
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Layers className="h-4 w-4" />
                    <span className="hidden sm:inline">View:</span>
                  </div>
                  <button
                    className={`px-2.5 py-1.5 text-xs rounded-md ${
                      viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                    }`}
                    onClick={() => setViewMode("grid")}
                  >
                    Grid
                  </button>
                  <button
                    className={`px-2.5 py-1.5 text-xs rounded-md ${
                      viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                    }`}
                    onClick={() => setViewMode("list")}
                  >
                    List
                  </button>
                  <button
                    className={`px-2.5 py-1.5 text-xs rounded-md ${
                      viewMode === "compact" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                    }`}
                    onClick={() => setViewMode("compact")}
                  >
                    Compact
                  </button>
                </div>
              </div>

              {/* Refresh button and last updated info */}
              <div className="flex justify-between items-center">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
                  {refreshing ? "Refreshing..." : "Refresh Skills"}
                </button>

                {lastUpdated && (
                  <div className="text-xs text-muted-foreground">Last updated: {lastUpdated.toLocaleTimeString()}</div>
                )}
              </div>

              {/* Category filters */}
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={activeCategory === null ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/90 transition-colors"
                  onClick={() => setActiveCategory(null)}
                >
                  All Categories
                </Badge>
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={activeCategory === category ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/90 transition-colors"
                    onClick={() => setActiveCategory(category)}
                    style={{
                      backgroundColor: activeCategory === category ? getCategoryColor(category) : "transparent",
                      borderColor: getCategoryColor(category),
                      color: activeCategory === category ? "white" : undefined,
                    }}
                  >
                    <span className="flex items-center gap-1">
                      {getCategoryIcon(category)}
                      <span>{category}</span>
                    </span>
                  </Badge>
                ))}
              </div>

              {/* Results info */}
              <div className="text-sm text-muted-foreground">
                Showing {filteredAndSortedSkills.length} of {skills.length} skills
                {activeCategory && ` in ${activeCategory}`}
                {searchQuery && ` matching "${searchQuery}"`}
              </div>

              {/* Skills display based on view mode */}
              {viewMode === "grid" && (
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  <AnimatePresence>
                    {filteredAndSortedSkills.map((skill, index) => (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, delay: index * 0.03 }}
                        className="group"
                      >
                        <div className="h-full rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                          <div
                            className="h-1.5"
                            style={{ backgroundColor: skill.color || getCategoryColor(skill.category) }}
                          ></div>
                          <div className="p-4 space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <h3 className="font-medium text-base">{skill.name}</h3>
                                <div className="flex items-center text-xs text-muted-foreground">
                                  {getCategoryIcon(skill.category)}
                                  <span className="ml-1">{skill.category}</span>
                                </div>
                              </div>
                              {skill.is_featured && (
                                <Badge
                                  variant="outline"
                                  className="bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300 border-amber-200 dark:border-amber-800/30"
                                >
                                  Featured
                                </Badge>
                              )}
                            </div>

                            {skill.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2 group-hover:line-clamp-none transition-all">
                                {skill.description}
                              </p>
                            )}

                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1">
                                  {renderStarRating(skill.proficiency)}
                                  <span
                                    className="text-xs font-medium ml-1"
                                    style={{ color: skill.color || getCategoryColor(skill.category) }}
                                  >
                                    {getProficiencyLabel(skill.proficiency)}
                                  </span>
                                </div>
                                <span className="text-xs text-muted-foreground">{skill.proficiency * 10}%</span>
                              </div>
                              <Progress
                                value={skill.proficiency * 10}
                                className="h-1.5"
                                indicatorClassName="bg-gradient-to-r"
                                style={{
                                  "--tw-gradient-from": `${skill.color || getCategoryColor(skill.category)}80`,
                                  "--tw-gradient-to": skill.color || getCategoryColor(skill.category),
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {viewMode === "list" && (
                <div className="space-y-8">
                  {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                    <div key={category} className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `${getCategoryColor(category)}20` }}
                        >
                          {getCategoryIcon(category)}
                        </div>
                        <h3 className="text-xl font-semibold">{category}</h3>
                        <Badge variant="outline" className="ml-2">
                          {categorySkills.length}
                        </Badge>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {categorySkills.map((skill) => (
                          <div
                            key={skill.id}
                            className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/10 transition-colors"
                          >
                            <div
                              className="w-1.5 h-10 rounded-full"
                              style={{ backgroundColor: skill.color || getCategoryColor(skill.category) }}
                            ></div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium truncate">{skill.name}</h4>
                                {skill.is_featured && <Zap className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <Progress
                                  value={skill.proficiency * 10}
                                  className="h-1.5 flex-1"
                                  indicatorClassName="bg-gradient-to-r"
                                  style={{
                                    "--tw-gradient-from": `${skill.color || getCategoryColor(skill.category)}80`,
                                    "--tw-gradient-to": skill.color || getCategoryColor(skill.category),
                                  }}
                                />
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                  {skill.proficiency * 10}%
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {viewMode === "compact" && (
                <Tabs defaultValue={categories[0] || "all"} className="w-full">
                  <TabsList className="flex flex-wrap h-auto mb-6">
                    <TabsTrigger value="all" onClick={() => setActiveCategory(null)}>
                      All
                    </TabsTrigger>
                    {categories.map((category) => (
                      <TabsTrigger
                        key={category}
                        value={category}
                        onClick={() => setActiveCategory(category)}
                        className="flex items-center gap-1"
                      >
                        {getCategoryIcon(category)}
                        <span>{category}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  <TabsContent value="all" className="mt-0">
                    <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                      {filteredAndSortedSkills.map((skill) => (
                        <div
                          key={skill.id}
                          className="rounded-md border p-2 flex flex-col items-center text-center hover:bg-accent/10 transition-colors"
                        >
                          <div
                            className="w-2 h-2 rounded-full mb-2"
                            style={{ backgroundColor: skill.color || getCategoryColor(skill.category) }}
                          ></div>
                          <h4 className="text-sm font-medium line-clamp-1">{skill.name}</h4>
                          <div className="mt-1 flex items-center justify-center">
                            <Progress
                              value={skill.proficiency * 10}
                              className="h-1 w-12"
                              indicatorClassName="bg-gradient-to-r"
                              style={{
                                "--tw-gradient-from": `${skill.color || getCategoryColor(skill.category)}80`,
                                "--tw-gradient-to": skill.color || getCategoryColor(skill.category),
                              }}
                            />
                            <span className="text-xs text-muted-foreground ml-1">{skill.proficiency * 10}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {categories.map((category) => (
                    <TabsContent key={category} value={category} className="mt-0">
                      <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                        {skills
                          .filter((skill) => skill.category === category)
                          .map((skill) => (
                            <div
                              key={skill.id}
                              className="rounded-md border p-2 flex flex-col items-center text-center hover:bg-accent/10 transition-colors"
                            >
                              <div
                                className="w-2 h-2 rounded-full mb-2"
                                style={{ backgroundColor: skill.color || getCategoryColor(skill.category) }}
                              ></div>
                              <h4 className="text-sm font-medium line-clamp-1">{skill.name}</h4>
                              <div className="mt-1 flex items-center justify-center">
                                <Progress
                                  value={skill.proficiency * 10}
                                  className="h-1 w-12"
                                  indicatorClassName="bg-gradient-to-r"
                                  style={{
                                    "--tw-gradient-from": `${skill.color || getCategoryColor(skill.category)}80`,
                                    "--tw-gradient-to": skill.color || getCategoryColor(skill.category),
                                  }}
                                />
                                <span className="text-xs text-muted-foreground ml-1">{skill.proficiency * 10}%</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
