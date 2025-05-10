"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Skill {
  id: number
  name: string
  category: string
  proficiency: number
  color?: string
  description?: string
  is_featured: boolean
}

export function CategorySkillsSection() {
  const [skills, setSkills] = useState<Record<string, Skill[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Category colors mapping
  const categoryColors: Record<string, { gradient: string; light: string; dark: string }> = {
    "Programming Languages": {
      gradient: "from-purple-500 to-indigo-500",
      light: "bg-purple-100 text-purple-800",
      dark: "bg-purple-900/20 text-purple-300",
    },
    "Web Development": {
      gradient: "from-blue-500 to-cyan-500",
      light: "bg-blue-100 text-blue-800",
      dark: "bg-blue-900/20 text-blue-300",
    },
    "Data Science": {
      gradient: "from-emerald-500 to-green-500",
      light: "bg-emerald-100 text-emerald-800",
      dark: "bg-emerald-900/20 text-emerald-300",
    },
    "Machine Learning": {
      gradient: "from-violet-500 to-purple-500",
      light: "bg-violet-100 text-violet-800",
      dark: "bg-violet-900/20 text-violet-300",
    },
    DevOps: {
      gradient: "from-orange-500 to-amber-500",
      light: "bg-orange-100 text-orange-800",
      dark: "bg-orange-900/20 text-orange-300",
    },
    "Cloud Computing": {
      gradient: "from-sky-500 to-blue-500",
      light: "bg-sky-100 text-sky-800",
      dark: "bg-sky-900/20 text-sky-300",
    },
    Databases: {
      gradient: "from-red-500 to-rose-500",
      light: "bg-red-100 text-red-800",
      dark: "bg-red-900/20 text-red-300",
    },
    "Tools & Platforms": {
      gradient: "from-teal-500 to-cyan-500",
      light: "bg-teal-100 text-teal-800",
      dark: "bg-teal-900/20 text-teal-300",
    },
    "Quantum Computing": {
      gradient: "from-fuchsia-500 to-pink-500",
      light: "bg-fuchsia-100 text-fuchsia-800",
      dark: "bg-fuchsia-900/20 text-fuchsia-300",
    },
    "Mobile Development": {
      gradient: "from-yellow-500 to-amber-500",
      light: "bg-yellow-100 text-yellow-800",
      dark: "bg-yellow-900/20 text-yellow-300",
    },
    "UI/UX Design": {
      gradient: "from-pink-500 to-rose-500",
      light: "bg-pink-100 text-pink-800",
      dark: "bg-pink-900/20 text-pink-300",
    },
    Other: {
      gradient: "from-slate-500 to-gray-500",
      light: "bg-slate-100 text-slate-800",
      dark: "bg-slate-900/20 text-slate-300",
    },
  }

  // Get color theme for a category
  const getCategoryTheme = (category: string) => {
    return (
      categoryColors[category] || {
        gradient: "from-blue-500 to-indigo-500",
        light: "bg-blue-100 text-blue-800",
        dark: "bg-blue-900/20 text-blue-300",
      }
    )
  }

  useEffect(() => {
    async function fetchSkills() {
      try {
        setLoading(true)
        const response = await fetch("/api/skills")

        if (!response.ok) {
          throw new Error(`Failed to fetch skills: ${response.status}`)
        }

        const data = await response.json()

        // Group skills by category
        const groupedSkills: Record<string, Skill[]> = {}

        if (Array.isArray(data)) {
          data.forEach((skill: Skill) => {
            if (!groupedSkills[skill.category]) {
              groupedSkills[skill.category] = []
            }
            groupedSkills[skill.category].push(skill)
          })
        } else {
          // If data is already grouped by category
          Object.assign(groupedSkills, data)
        }

        setSkills(groupedSkills)
      } catch (error) {
        console.error("Error fetching skills:", error)
        setError(error instanceof Error ? error.message : "Unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchSkills()
  }, [])

  // Get all categories
  const categories = Object.keys(skills).sort()

  return (
    <section id="skills" className="py-16 md:py-24 relative overflow-hidden">
      {/* Colorful background elements */}
      <div className="absolute inset-0 bg-[#0a1218] opacity-90 z-0"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Skills & Expertise
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full mb-4"></div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore my technical skills and expertise across various domains including programming, data science, web
            development, and more.
          </p>
        </div>

        {loading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-card/50 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center p-8 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const theme = getCategoryTheme(category)
              return <CategoryCard key={category} category={category} skills={skills[category]} theme={theme} />
            })}
          </div>
        )}
      </div>
    </section>
  )
}

interface CategoryCardProps {
  category: string
  skills: Skill[]
  theme: {
    gradient: string
    light: string
    dark: string
  }
}

function CategoryCard({ category, skills, theme }: CategoryCardProps) {
  return (
    <Card className="overflow-hidden h-full border-0 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
      <div className={`h-1.5 bg-gradient-to-r ${theme.gradient}`}></div>
      <CardHeader className="pb-2">
        <CardTitle className={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${theme.gradient}`}>
          {category}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {skills.map((skill) => (
          <SkillItem key={skill.id} skill={skill} theme={theme} />
        ))}
      </CardContent>
    </Card>
  )
}

function SkillItem({ skill, theme }: { skill: Skill; theme: { gradient: string; light: string; dark: string } }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium text-white">{skill.name}</span>
          {skill.is_featured && (
            <Badge variant="outline" className="bg-amber-900/20 text-amber-300 border-amber-500/30 text-xs">
              Featured
            </Badge>
          )}
        </div>
        <span className="text-xs text-gray-400">{skill.proficiency * 10}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-1.5 rounded-full bg-gradient-to-r ${theme.gradient}`}
          style={{
            width: `${skill.proficiency * 10}%`,
          }}
        ></div>
      </div>
    </div>
  )
}
