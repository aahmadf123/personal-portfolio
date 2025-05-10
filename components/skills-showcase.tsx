"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Cpu, LineChart, Code, Database, Server, Zap } from "lucide-react"
import styles from "./skills-showcase.module.css"

interface Skill {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  proficiency: number
  category: string
  colorClass: string
}

export function SkillsShowcase() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const skills: Skill[] = [
    {
      id: "ml",
      name: "Machine Learning",
      icon: <Cpu className="h-6 w-6" />,
      description: "Building and deploying machine learning models for various applications",
      proficiency: 85,
      category: "AI & Data",
      colorClass: styles.ml,
    },
    {
      id: "ds",
      name: "Data Science",
      icon: <LineChart className="h-6 w-6" />,
      description: "Analyzing and visualizing data to extract meaningful insights",
      proficiency: 90,
      category: "AI & Data",
      colorClass: styles.ds,
    },
    {
      id: "web",
      name: "Web Development",
      icon: <Code className="h-6 w-6" />,
      description: "Creating responsive and interactive web applications",
      proficiency: 80,
      category: "Development",
      colorClass: styles.web,
    },
    {
      id: "db",
      name: "Database Management",
      icon: <Database className="h-6 w-6" />,
      description: "Designing and optimizing database systems for performance",
      proficiency: 75,
      category: "Development",
      colorClass: styles.db,
    },
    {
      id: "backend",
      name: "Backend Development",
      icon: <Server className="h-6 w-6" />,
      description: "Building robust server-side applications and APIs",
      proficiency: 80,
      category: "Development",
      colorClass: styles.backend,
    },
    {
      id: "quantum",
      name: "Quantum Computing",
      icon: <Zap className="h-6 w-6" />,
      description: "Exploring quantum algorithms and their applications",
      proficiency: 70,
      category: "Research",
      colorClass: styles.quantum,
    },
  ]

  // Get unique categories
  const categories = Array.from(new Set(skills.map((skill) => skill.category)))

  // Filter skills based on active category
  const filteredSkills = activeCategory ? skills.filter((skill) => skill.category === activeCategory) : skills

  if (!mounted) return null

  return (
    <section className={styles.skillsSection} id="skills">
      <div className={styles.backgroundEffect}></div>

      {/* Particle background */}
      <div className={styles.particles}>
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className={styles.particle}
            style={{
              width: Math.random() * 4 + 1,
              height: Math.random() * 4 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * -30 - 10, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className={styles.container}>
        <div className={styles.header}>
          <motion.h2
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Skills & Expertise
          </motion.h2>
          <motion.div
            className={styles.divider}
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: 120 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            A showcase of my technical abilities and areas of expertise in software development, data science, and more.
          </motion.p>
        </div>

        {/* Category navigation */}
        <motion.div
          className={styles.skillsNav}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <button
            className={`${styles.skillsNavItem} ${activeCategory === null ? styles.skillsNavItemActive : ""}`}
            onClick={() => setActiveCategory(null)}
          >
            All Skills
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className={`${styles.skillsNavItem} ${activeCategory === category ? styles.skillsNavItemActive : ""}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </motion.div>

        <div className={styles.skillsGrid}>
          <AnimatePresence>
            {filteredSkills.map((skill, index) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                layout
              >
                <div className={styles.skillCard}>
                  <div className={styles.cardContent}>
                    <div className={styles.iconWrapper}>
                      <div className={styles.icon}>{skill.icon}</div>
                    </div>
                    <h3 className={styles.skillName}>{skill.name}</h3>
                    <p className={styles.skillDescription}>{skill.description}</p>
                    <div className={styles.progressContainer}>
                      <div className={styles.progressHeader}>
                        <span className={styles.progressLabel}>Proficiency</span>
                        <span className={styles.progressValue}>{skill.proficiency}%</span>
                      </div>
                      <div className={styles.progressBar}>
                        <motion.div
                          className={`${styles.progressFill} ${skill.colorClass}`}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.proficiency}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
