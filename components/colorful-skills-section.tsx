"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
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

export function ColorfulSkillsSection() {
  const [skills, setSkills] = useState<Record<string, Skill[]>>({})
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  // Category colors mapping
  const categoryColors: Record<string, string> = {
    "Programming Languages": "from-purple-500 to-indigo-500",
    "Web Development": "from-blue-500 to-cyan-500",
    "Data Science": "from-emerald-500 to-green-500",
    "Machine Learning": "from-violet-500 to-purple-500",
    DevOps: "from-orange-500 to-amber-500",
    "Cloud Computing": "from-sky-500 to-blue-500",
    Databases: "from-red-500 to-rose-500",
    "Tools & Platforms": "from-teal-500 to-cyan-500",
    "Quantum Computing": "from-fuchsia-500 to-pink-500",
    "Mobile Development": "from-yellow-500 to-amber-500",
    "UI/UX Design": "from-pink-500 to-rose-500",
    Other: "from-slate-500 to-gray-500",
  }

  // Get a default gradient for categories not in our mapping
  const getGradient = (category: string) => {
    return categoryColors[category] || "from-blue-500 to-indigo-500"
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
      } finally {
        setLoading(false)
      }
    }

    fetchSkills()
  }, [])

  // Get all categories
  const categories = Object.keys(skills).sort()

  // Filter skills by active category or show all
  const displayedCategories = activeCategory ? [activeCategory] : categories

  return (
    <section id="skills" className="py-16 md:py-24 relative overflow-hidden">
      {/* Colorful background elements */}
      <div className="absolute inset-0 bg-[#0a1218] opacity-90 z-0"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Skills & Expertise
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <Badge
            variant={activeCategory === null ? "default" : "outline"}
            className={`cursor-pointer text-sm px-4 py-1.5 rounded-full transition-all ${
              activeCategory === null
                ? "bg-gradient-to-r from-blue-500 to-purple-600 border-transparent hover:from-blue-600 hover:to-purple-700"
                : "hover:border-blue-500 hover:text-blue-500"
            }`}
            onClick={() => setActiveCategory(null)}
          >
            All Categories
          </Badge>

          {categories.map((category) => (
            <Badge
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              className={`cursor-pointer text-sm px-4 py-1.5 rounded-full transition-all ${
                activeCategory === category
                  ? `bg-gradient-to-r ${getGradient(category)} border-transparent`
                  : "hover:border-blue-500 hover:text-blue-500"
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {loading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 bg-card/50 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-16">
            {displayedCategories.map((category) => (
              <div key={category} className="space-y-6">
                <h3
                  className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${getGradient(category)}`}
                >
                  {category}
                </h3>
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {skills[category]?.map((skill) => (
                    <SkillCard key={skill.id} skill={skill} categoryGradient={getGradient(category)} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function SkillCard({ skill, categoryGradient }: { skill: Skill; categoryGradient: string }) {
  // Default color if none is provided
  const skillColor = skill.color || "#3b82f6"

  return (
    <Card className="overflow-hidden h-full border-0 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 group">
      <div className={`h-1.5 bg-gradient-to-r ${categoryGradient}`}></div>
      <CardContent className="p-5">
        <h4 className="font-bold text-lg mb-2 group-hover:text-blue-400 transition-colors">{skill.name}</h4>

        <div className="flex items-center gap-2 mb-3">
          <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-2.5 rounded-full bg-gradient-to-r ${categoryGradient}`}
              style={{
                width: `${skill.proficiency * 10}%`,
              }}
            ></div>
          </div>
          <span className="text-xs font-medium text-gray-300">{skill.proficiency * 10}%</span>
        </div>

        {skill.description && (
          <p className="text-sm text-gray-400 line-clamp-2 group-hover:text-gray-300 transition-colors">
            {skill.description}
          </p>
        )}

        {skill.is_featured && (
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-amber-500 to-yellow-500 text-white">
              Featured
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
