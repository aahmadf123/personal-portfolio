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

export function SimpleSkillsSection() {
  const [skills, setSkills] = useState<Record<string, Skill[]>>({})
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

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
    <section id="skills" className="py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold mb-8 text-center">Skills & Expertise</h2>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <Badge
            variant={activeCategory === null ? "default" : "outline"}
            className="cursor-pointer text-sm px-3 py-1"
            onClick={() => setActiveCategory(null)}
          >
            All Categories
          </Badge>

          {categories.map((category) => (
            <Badge
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              className="cursor-pointer text-sm px-3 py-1"
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
          <div className="space-y-12">
            {displayedCategories.map((category) => (
              <div key={category} className="space-y-4">
                <h3 className="text-2xl font-semibold">{category}</h3>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {skills[category]?.map((skill) => (
                    <SkillCard key={skill.id} skill={skill} />
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

function SkillCard({ skill }: { skill: Skill }) {
  // Default color if none is provided
  const skillColor = skill.color || "#3b82f6"

  return (
    <Card className="overflow-hidden h-full border border-border hover:border-primary/50 transition-colors">
      <div className="h-1.5" style={{ backgroundColor: skillColor }}></div>
      <CardContent className="p-4">
        <h4 className="font-medium text-lg mb-1">{skill.name}</h4>

        <div className="flex items-center gap-1.5 mb-3">
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="h-2 rounded-full"
              style={{
                width: `${skill.proficiency * 10}%`,
                backgroundColor: skillColor,
              }}
            ></div>
          </div>
          <span className="text-xs font-medium">{skill.proficiency * 10}%</span>
        </div>

        {skill.description && <p className="text-sm text-muted-foreground line-clamp-2">{skill.description}</p>}
      </CardContent>
    </Card>
  )
}
