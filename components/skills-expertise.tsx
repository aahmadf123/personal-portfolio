"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Code, Database, LineChart, Server, Cpu, Zap, Layers } from "lucide-react"
import styles from "./skills-expertise.module.css"
import { createClientSupabaseClient } from "@/lib/supabase"

interface Skill {
  id: number
  name: string
  description: string
  proficiency: number
  category_id?: number
  category?: {
    id: number
    name: string
  }
  icon?: string
  color?: string
}

export function SkillsExpertise() {
  const [isClient, setIsClient] = useState(false)
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientSupabaseClient()

  // Map of category names to icons
  const categoryIcons: Record<string, any> = {
    "Machine Learning": Cpu,
    "Data Science": LineChart,
    "Web Development": Code,
    Database: Database,
    Backend: Server,
    "Quantum Computing": Zap,
  }

  // Map of category names to gradient colors
  const categoryColors: Record<string, string> = {
    "Machine Learning": "from-purple-500 to-pink-500",
    "Data Science": "from-blue-500 to-cyan-500",
    "Web Development": "from-amber-500 to-orange-500",
    Database: "from-emerald-500 to-green-500",
    Backend: "from-red-500 to-rose-500",
    "Quantum Computing": "from-indigo-500 to-violet-500",
  }

  useEffect(() => {
    setIsClient(true)
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      setLoading(true)

      const { data, error } = await supabase
        .from("skills")
        .select(`
          *,
          category:category_id(id, name)
        `)
        .order("proficiency", { ascending: false })
        .limit(6)

      if (error) throw error

      setSkills(data || [])
    } catch (err) {
      console.error("Error fetching skills:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  // Get icon for a skill based on its category
  const getSkillIcon = (skill: Skill) => {
    const categoryName = skill.category?.name || ""
    const IconComponent = categoryIcons[categoryName] || Layers
    return <IconComponent className="h-6 w-6" />
  }

  // Get color gradient for a skill based on its category
  const getSkillColor = (skill: Skill) => {
    const categoryName = skill.category?.name || ""
    return categoryColors[categoryName] || "from-gray-500 to-gray-700"
  }

  if (!isClient) {
    return null
  }

  if (loading) {
    return (
      <section className={styles.skillsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.title}>Skills & Expertise</h2>
            <p className={styles.subtitle}>Loading skills...</p>
          </div>
          <div className={styles.skillsGrid}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={`${styles.skillCard} animate-pulse`}>
                <div className="h-40 bg-gray-700/50 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    console.error("Skills loading error:", error)
  }

  return (
    <section className={styles.skillsSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.title}>Skills & Expertise</h2>
          <p className={styles.subtitle}>
            A showcase of my technical abilities and areas of expertise in software development, data science, and more.
          </p>
        </div>

        <div className={styles.skillsGrid}>
          {skills.map((skill, index) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className={styles.skillCard}>
                <div className={styles.skillIcon}>{getSkillIcon(skill)}</div>
                <h3 className={styles.skillName}>{skill.name}</h3>
                <p className={styles.skillDescription}>{skill.description}</p>
                <div className={styles.progressContainer}>
                  <div className={styles.progressLabel}>
                    <span className={styles.progressText}>Proficiency</span>
                    <span className={styles.progressValue}>{skill.proficiency}%</span>
                  </div>
                  <div className={styles.progressBar}>
                    <motion.div
                      className={styles.progressFill}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.proficiency}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className={`${styles.backgroundDecoration} ${styles.decoration1}`}></div>
      <div className={`${styles.backgroundDecoration} ${styles.decoration2}`}></div>
    </section>
  )
}
