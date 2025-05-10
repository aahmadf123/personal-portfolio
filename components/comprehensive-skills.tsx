"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Code, Database, Laptop, LineChart, Server, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface Skill {
  name: string
  level: number // 1-5
  category: string
}

export function ComprehensiveSkills() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)

  const skills: Skill[] = [
    // Programming Languages
    { name: "Python", level: 5, category: "Programming Languages" },
    { name: "Java", level: 4, category: "Programming Languages" },
    { name: "C++", level: 3, category: "Programming Languages" },
    { name: "TypeScript", level: 4, category: "Programming Languages" },
    { name: "JavaScript", level: 4, category: "Programming Languages" },
    { name: "HTML/CSS", level: 4, category: "Programming Languages" },

    // Data Science & ML
    { name: "Machine Learning", level: 4, category: "Data Science & ML" },
    { name: "Deep Learning", level: 3, category: "Data Science & ML" },
    { name: "TensorFlow", level: 4, category: "Data Science & ML" },
    { name: "PyTorch", level: 3, category: "Data Science & ML" },
    { name: "Pandas", level: 5, category: "Data Science & ML" },
    { name: "NumPy", level: 5, category: "Data Science & ML" },
    { name: "Data Visualization", level: 4, category: "Data Science & ML" },
    { name: "MATLAB", level: 3, category: "Data Science & ML" },

    // Databases
    { name: "SQL", level: 4, category: "Databases" },
    { name: "PostgreSQL", level: 4, category: "Databases" },
    { name: "MySQL", level: 4, category: "Databases" },
    { name: "MSSQL Server", level: 3, category: "Databases" },
    { name: "Supabase", level: 3, category: "Databases" },

    // Web Development
    { name: "React", level: 4, category: "Web Development" },
    { name: "Next.js", level: 4, category: "Web Development" },
    { name: "Tailwind CSS", level: 4, category: "Web Development" },
    { name: "RESTful APIs", level: 4, category: "Web Development" },

    // Tools & Platforms
    { name: "Git/GitHub", level: 4, category: "Tools & Platforms" },
    { name: "Anaconda", level: 4, category: "Tools & Platforms" },
    { name: "CUDA", level: 3, category: "Tools & Platforms" },
    { name: "CI/CD", level: 3, category: "Tools & Platforms" },

    // Office & Productivity
    { name: "Microsoft Word", level: 5, category: "Office & Productivity" },
    { name: "Microsoft Excel", level: 5, category: "Office & Productivity" },
    { name: "Microsoft PowerPoint", level: 5, category: "Office & Productivity" },
  ]

  const categories = Array.from(new Set(skills.map((skill) => skill.category)))

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Programming Languages":
        return <Code className="h-5 w-5" />
      case "Data Science & ML":
        return <LineChart className="h-5 w-5" />
      case "Databases":
        return <Database className="h-5 w-5" />
      case "Web Development":
        return <Server className="h-5 w-5" />
      case "Tools & Platforms":
        return <Wrench className="h-5 w-5" />
      case "Office & Productivity":
        return <Laptop className="h-5 w-5" />
      default:
        return <Code className="h-5 w-5" />
    }
  }

  const getSkillLevelText = (level: number) => {
    switch (level) {
      case 1:
        return "Beginner"
      case 2:
        return "Basic"
      case 3:
        return "Intermediate"
      case 4:
        return "Advanced"
      case 5:
        return "Expert"
      default:
        return "Intermediate"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Programming Languages":
        return "from-blue-500 to-indigo-600"
      case "Data Science & ML":
        return "from-purple-500 to-pink-600"
      case "Databases":
        return "from-emerald-500 to-teal-600"
      case "Web Development":
        return "from-amber-500 to-orange-600"
      case "Tools & Platforms":
        return "from-cyan-500 to-blue-600"
      case "Office & Productivity":
        return "from-rose-500 to-red-600"
      default:
        return "from-gray-500 to-slate-600"
    }
  }

  const filteredSkills = activeCategory ? skills.filter((skill) => skill.category === activeCategory) : skills

  const displayedSkills = showAll ? filteredSkills : filteredSkills.filter((skill) => skill.level >= 4)

  return (
    <section id="skills" className="py-16 md:py-24 relative">
      <div className="container px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-teal-500 to-cyan-500 text-transparent bg-clip-text inline-block mb-4">
            Technical Skills
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 via-teal-500 to-cyan-500 mx-auto rounded-full"></div>
        </div>

        <p className="text-muted-foreground max-w-3xl mx-auto text-center mb-8 text-lg">
          My technical expertise spans programming languages, data science, machine learning, and web development.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <Button
            variant={activeCategory === null ? "default" : "outline"}
            onClick={() => setActiveCategory(null)}
            className="rounded-full"
          >
            All Categories
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              onClick={() => setActiveCategory(category)}
              className="rounded-full"
            >
              {getCategoryIcon(category)}
              <span className="ml-2">{category}</span>
            </Button>
          ))}
        </div>

        <div className="flex justify-center mb-8">
          <Button variant="outline" onClick={() => setShowAll(!showAll)} className="rounded-full">
            {showAll ? "Show Top Skills" : "Show All Skills"}
          </Button>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {categories
            .filter((category) => !activeCategory || category === activeCategory)
            .map((category) => {
              const categorySkills = skills
                .filter((skill) => skill.category === category)
                .filter((skill) => showAll || skill.level >= 4)

              if (categorySkills.length === 0) return null

              return (
                <Card
                  key={category}
                  className="overflow-hidden border-t-4 bg-card/30 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
                  style={{
                    borderTopColor:
                      category === "Programming Languages"
                        ? "#3b82f6"
                        : category === "Data Science & ML"
                          ? "#8b5cf6"
                          : category === "Databases"
                            ? "#10b981"
                            : category === "Web Development"
                              ? "#f59e0b"
                              : category === "Tools & Platforms"
                                ? "#06b6d4"
                                : "#f43f5e",
                  }}
                >
                  <div className="p-6 border-b border-border">
                    <div className="flex items-center gap-3">
                      {getCategoryIcon(category)}
                      <h3 className="text-xl font-semibold">{category}</h3>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {categorySkills.map((skill) => (
                        <div key={`${category}-${skill.name}`} className="group">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">{skill.name}</span>
                            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                              {getSkillLevelText(skill.level)}
                            </span>
                          </div>
                          <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(skill.level / 5) * 100}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className={`h-2 rounded-full bg-gradient-to-r ${getCategoryColor(category)}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute -top-10 -right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl opacity-30"></div>
    </section>
  )
}
