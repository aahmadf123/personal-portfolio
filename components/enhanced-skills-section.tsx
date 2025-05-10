"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Sparkles, Code, Database, Globe, Cpu, LineChart, Layers, Palette, Search, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface Skill {
  id: number
  name: string
  slug: string
  description?: string
  proficiency: number
  category: string
  color?: string
  icon?: string
  is_featured: boolean
  order_index?: number
}

interface SkillCategory {
  name: string
  slug: string
  icon: React.ReactNode
  description: string
  color: string
}

interface EnhancedSkillsSectionProps {
  initialSkills?: Skill[]
  title?: string
  subtitle?: string
  className?: string
}

export function EnhancedSkillsSection({
  initialSkills,
  title = "Skills & Expertise",
  subtitle = "Explore my technical skills and expertise across various domains",
  className,
}: EnhancedSkillsSectionProps) {
  const [skills, setSkills] = useState<Skill[]>(initialSkills || [])
  const [isLoading, setIsLoading] = useState(!initialSkills)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (!initialSkills) {
      fetchSkills()
    }
  }, [initialSkills])

  const fetchSkills = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/skills")
      if (!response.ok) throw new Error("Failed to fetch skills")

      const data = await response.json()
      setSkills(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching skills:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Define skill categories with icons and colors
  const skillCategories: SkillCategory[] = useMemo(() => {
    const categories = Array.from(new Set(skills.map((skill) => skill.category)))

    return categories.map((category) => {
      // Determine icon based on category name
      let icon
      let color

      if (category.toLowerCase().includes("programming") || category.toLowerCase().includes("development")) {
        icon = <Code className="h-5 w-5" />
        color = "bg-blue-500"
      } else if (category.toLowerCase().includes("data") || category.toLowerCase().includes("analytics")) {
        icon = <LineChart className="h-5 w-5" />
        color = "bg-purple-500"
      } else if (category.toLowerCase().includes("database")) {
        icon = <Database className="h-5 w-5" />
        color = "bg-green-500"
      } else if (category.toLowerCase().includes("web")) {
        icon = <Globe className="h-5 w-5" />
        color = "bg-amber-500"
      } else if (category.toLowerCase().includes("ai") || category.toLowerCase().includes("machine")) {
        icon = <Cpu className="h-5 w-5" />
        color = "bg-rose-500"
      } else if (category.toLowerCase().includes("design")) {
        icon = <Palette className="h-5 w-5" />
        color = "bg-pink-500"
      } else if (category.toLowerCase().includes("cloud") || category.toLowerCase().includes("devops")) {
        icon = <Layers className="h-5 w-5" />
        color = "bg-sky-500"
      } else {
        icon = <Sparkles className="h-5 w-5" />
        color = "bg-slate-500"
      }

      return {
        name: category,
        slug: category.toLowerCase().replace(/\s+/g, "-"),
        icon,
        color,
        description: `Skills related to ${category}`,
      }
    })
  }, [skills])

  // Filter skills based on active category and search query
  const filteredSkills = useMemo(() => {
    let result = skills

    if (activeCategory) {
      result = result.filter((skill) => skill.category === activeCategory)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (skill) =>
          skill.name.toLowerCase().includes(query) ||
          skill.description?.toLowerCase().includes(query) ||
          skill.category.toLowerCase().includes(query),
      )
    }

    return result
  }, [skills, activeCategory, searchQuery])

  // Group skills by category
  const skillsByCategory = useMemo(() => {
    const grouped: Record<string, Skill[]> = {}

    filteredSkills.forEach((skill) => {
      if (!grouped[skill.category]) {
        grouped[skill.category] = []
      }
      grouped[skill.category].push(skill)
    })

    // Sort categories by name
    return Object.fromEntries(Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)))
  }, [filteredSkills])

  if (isLoading) {
    return (
      <section className={cn("py-16 md:py-24", className)}>
        <div className="container px-4 md:px-6">
          <div className="space-y-8">
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{title}</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">{subtitle}</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-[200px] rounded-lg bg-muted animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="container px-4 md:px-6">
        <div className="space-y-8">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{title}</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">{subtitle}</p>
          </div>

          <div className="flex flex-col space-y-4">
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
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={activeCategory === null ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/90 transition-colors"
                  onClick={() => setActiveCategory(null)}
                >
                  All
                </Badge>
                {skillCategories.map((category) => (
                  <Badge
                    key={category.slug}
                    variant={activeCategory === category.name ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/90 transition-colors"
                    onClick={() => setActiveCategory(category.name)}
                  >
                    <span className="flex items-center gap-1">
                      {category.icon}
                      <span>{category.name}</span>
                    </span>
                  </Badge>
                ))}
              </div>
            </div>

            <Tabs defaultValue="grid" className="w-full">
              <div className="flex justify-end mb-6">
                <TabsList>
                  <TabsTrigger value="grid">Grid View</TabsTrigger>
                  <TabsTrigger value="list">List View</TabsTrigger>
                  <TabsTrigger value="chart">Chart View</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="grid" className="mt-0">
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  <AnimatePresence>
                    {filteredSkills.map((skill) => (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <SkillCard skill={skill} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </TabsContent>

              <TabsContent value="list" className="mt-0">
                <div className="space-y-8">
                  {Object.entries(skillsByCategory).map(([category, skills]) => (
                    <div key={category} className="space-y-4">
                      <div className="flex items-center gap-2">
                        {skillCategories.find((c) => c.name === category)?.icon}
                        <h3 className="text-xl font-semibold">{category}</h3>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {skills.map((skill) => (
                          <SkillListItem key={skill.id} skill={skill} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="chart" className="mt-0">
                <div className="space-y-8">
                  {Object.entries(skillsByCategory).map(([category, skills]) => (
                    <Card key={category}>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          {skillCategories.find((c) => c.name === category)?.icon}
                          <CardTitle>{category}</CardTitle>
                        </div>
                        <CardDescription>Proficiency levels in {category.toLowerCase()} skills</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {skills.map((skill) => (
                            <div key={skill.id} className="space-y-2">
                              <div className="flex justify-between">
                                <span className="font-medium">{skill.name}</span>
                                <span className="text-muted-foreground">{skill.proficiency * 10}%</span>
                              </div>
                              <Progress
                                value={skill.proficiency * 10}
                                className="h-2"
                                indicatorClassName={cn(skill.color ? `bg-[${skill.color}]` : undefined)}
                              />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  )
}

function SkillCard({ skill }: { skill: Skill }) {
  return (
    <Card className="overflow-hidden h-full transition-all hover:shadow-md">
      <div className="h-2" style={{ backgroundColor: skill.color || "#3b82f6" }} />
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{skill.name}</CardTitle>
        <CardDescription className="line-clamp-1">{skill.category}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {skill.description && <p className="text-sm text-muted-foreground line-clamp-3">{skill.description}</p>}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Proficiency</span>
            <span className="font-medium">{skill.proficiency * 10}%</span>
          </div>
          <Progress
            value={skill.proficiency * 10}
            className="h-2"
            indicatorClassName={cn(skill.color ? `bg-[${skill.color}]` : undefined)}
          />
        </div>
        {skill.is_featured && (
          <div className="flex items-center gap-1 text-xs text-primary">
            <Zap className="h-3 w-3" />
            <span>Featured Skill</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function SkillListItem({ skill }: { skill: Skill }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/10 transition-colors">
      <div className="w-2 h-10 rounded-full" style={{ backgroundColor: skill.color || "#3b82f6" }} />
      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate">{skill.name}</h4>
        <div className="flex items-center gap-2 mt-1">
          <Progress
            value={skill.proficiency * 10}
            className="h-1.5 flex-1"
            indicatorClassName={cn(skill.color ? `bg-[${skill.color}]` : undefined)}
          />
          <span className="text-xs text-muted-foreground whitespace-nowrap">{skill.proficiency * 10}%</span>
        </div>
      </div>
      {skill.is_featured && <Sparkles className="h-4 w-4 text-amber-500 flex-shrink-0" />}
    </div>
  )
}
