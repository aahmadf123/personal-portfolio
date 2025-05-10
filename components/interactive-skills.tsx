"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Skill } from "@/types/skills"

interface Category {
  name: string
  color: string
  icon: string
}

export function InteractiveSkills() {
  // Hardcoded skills data with enhanced color palette
  const hardcodedSkills: Skill[] = [
    {
      id: 1,
      name: "Python",
      slug: "python",
      description: "Proficient in Python for data science, machine learning, and general programming",
      level: 85,
      category: "Programming",
      color: "#3B82F6", // Blue
      featured: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      name: "MATLAB",
      slug: "matlab",
      description: "Experience with MATLAB for mathematical modeling and simulation",
      level: 80,
      category: "Programming",
      color: "#8B5CF6", // Purple
      featured: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 3,
      name: "PostgreSQL",
      slug: "postgresql",
      description: "Proficient in PostgreSQL database design and management",
      level: 80,
      category: "Databases",
      color: "#10B981", // Green
      featured: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 4,
      name: "TensorFlow",
      slug: "tensorflow",
      description: "Experience with TensorFlow for deep learning models",
      level: 75,
      category: "AI & ML",
      color: "#F59E0B", // Amber
      featured: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 5,
      name: "Deep Learning",
      slug: "deep-learning",
      description: "Knowledge of deep learning principles and applications",
      level: 75,
      category: "AI & ML",
      color: "#EC4899", // Pink
      featured: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 6,
      name: "Pandas",
      slug: "pandas",
      description: "Proficient in Pandas for data manipulation and analysis",
      level: 85,
      category: "Data Science",
      color: "#06B6D4", // Cyan
      featured: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 7,
      name: "React",
      slug: "react",
      description: "Building interactive user interfaces with React",
      level: 90,
      category: "Frontend",
      color: "#0EA5E9", // Sky
      featured: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 8,
      name: "Next.js",
      slug: "nextjs",
      description: "Full-stack web development with Next.js",
      level: 85,
      category: "Frontend",
      color: "#64748B", // Slate
      featured: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 9,
      name: "Quantum Computing",
      slug: "quantum-computing",
      description: "Research and implementation of quantum algorithms",
      level: 70,
      category: "Quantum",
      color: "#9333EA", // Purple
      featured: true,
      created_at: new Date().toISOString(),
    },
  ]

  const categories: Category[] = [
    { name: "All", color: "#3B82F6", icon: "🌟" },
    { name: "Programming", color: "#3B82F6", icon: "💻" },
    { name: "Databases", color: "#10B981", icon: "🗄️" },
    { name: "AI & ML", color: "#F59E0B", icon: "🧠" },
    { name: "Data Science", color: "#06B6D4", icon: "📊" },
    { name: "Frontend", color: "#0EA5E9", icon: "🎨" },
    { name: "Quantum", color: "#9333EA", icon: "⚛️" },
  ]

  const [selectedCategory, setSelectedCategory] = useState("All")
  const [filteredSkills, setFilteredSkills] = useState(hardcodedSkills)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    if (selectedCategory === "All") {
      setFilteredSkills(hardcodedSkills)
    } else {
      setFilteredSkills(hardcodedSkills.filter((skill) => skill.category === selectedCategory))
    }
  }, [selectedCategory])

  if (!isClient) return null

  return (
    <section className="py-16 md:py-24 relative">
      <div className="container px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text inline-block mb-4">
            Technical Expertise
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mx-auto rounded-full"></div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`px-4 py-2 rounded-full text-sm transition-all flex items-center gap-2 ${
                selectedCategory === category.name
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                  : "bg-card/50 hover:bg-card/80 border border-border"
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredSkills.map((skill) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="rounded-xl border border-border bg-card/30 backdrop-blur-sm p-6 hover:shadow-xl transition-all duration-300"
                style={{
                  borderColor: `${skill.color}30`,
                  boxShadow: `0 4px 20px ${skill.color}10`,
                }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: `0 8px 30px ${skill.color}20`,
                  borderColor: `${skill.color}50`,
                }}
              >
                <div className="flex items-center mb-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mr-4 text-white"
                    style={{ background: `linear-gradient(135deg, ${skill.color}90, ${skill.color})` }}
                  >
                    <span className="text-xl font-bold">{skill.name.charAt(0)}</span>
                  </div>
                  <h3 className="text-xl font-bold">{skill.name}</h3>
                </div>

                <p className="text-muted-foreground mb-6 text-sm">{skill.description}</p>

                <div className="relative">
                  <div className="w-full bg-muted/30 rounded-full h-2.5 mb-1 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${skill.color}80, ${skill.color})`,
                        boxShadow: `0 0 10px ${skill.color}50`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="font-medium">Proficiency</span>
                    <span className="font-bold" style={{ color: skill.color }}>
                      {skill.level}%
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl opacity-30 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-30 -z-10"></div>
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl opacity-20 -z-10"></div>
    </section>
  )
}
