"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowDown, Github, Linkedin, VideoIcon as Vimeo } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeroParticles } from "./hero-particles"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import styles from "./hero.module.css"

export function Hero() {
  const [mounted, setMounted] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 300], [1, 0])
  const y = useTransform(scrollY, [0, 300], [0, 100])
  const scale = useTransform(scrollY, [0, 300], [1, 0.8])

  useEffect(() => {
    setMounted(true)
  }, [])

  // Generic smooth scroll function for any section
  const smoothScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const section = document.getElementById(id)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
  }

  if (!mounted) return null

  return (
    <section className={styles.heroSection} id="home">
      {/* Background particles */}
      {!prefersReducedMotion && <HeroParticles />}

      {/* Content */}
      <div className="container px-4 md:px-6 relative z-10 @container">
        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={prefersReducedMotion ? {} : { opacity, y, scale }}
        >
          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Welcome to My Portfolio
          </motion.h1>

          <motion.p
            className={styles.heroSubtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Computer Science & Engineering Student specializing in{" "}
            <span className="text-blue-400 font-medium">Artificial Intelligence</span>,{" "}
            <span className="text-cyan-400 font-medium">Data Science</span>, and{" "}
            <span className="text-teal-400 font-medium">Software Engineering</span>
          </motion.p>

          <motion.div
            className={styles.buttonContainer}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button asChild size="lg" className={styles.primaryButton}>
              <a href="#projects" onClick={(e) => smoothScrollTo(e, "projects")}>
                View My Projects
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className={styles.secondaryButton}>
              <a href="#contact" onClick={(e) => smoothScrollTo(e, "contact")}>
                Contact Me
              </a>
            </Button>
          </motion.div>

          <motion.div
            className={styles.socialContainer}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <a
              href={process.env.NEXT_PUBLIC_GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialIcon}
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href={process.env.NEXT_PUBLIC_LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialIcon}
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href={process.env.NEXT_PUBLIC_TWITTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialIcon}
              aria-label="Vimeo"
            >
              <Vimeo className="h-5 w-5" />
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#about"
        onClick={(e) => smoothScrollTo(e, "about")}
        className={styles.scrollIndicator}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
      >
        <ArrowDown className="h-6 w-6" />
      </motion.a>
    </section>
  )
}
