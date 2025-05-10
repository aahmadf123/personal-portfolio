"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Github, Linkedin, VideoIcon as Vimeo } from "lucide-react"
import { cn } from "@/lib/utils"
import { EnhancedVectorLogo } from "./enhanced-vector-logo"
import { TechCircuitLogo } from "./tech-circuit-logo"
import { NeuralLogo } from "./neural-logo"
import styles from "./header.module.css"

const navItems = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/timeline", label: "Timeline" },
  { href: "/ai-assistant", label: "AI Assistant" },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const [logoHovered, setLogoHovered] = useState(false)
  const [logoVariant, setLogoVariant] = useState<number>(0)

  // Cycle through logo variants
  useEffect(() => {
    const interval = setInterval(() => {
      setLogoVariant((prev) => (prev + 1) % 3)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  // Render the appropriate logo based on the current variant
  const renderLogo = () => {
    switch (logoVariant) {
      case 0:
        return (
          <EnhancedVectorLogo
            size={40}
            animated={true}
            variant="tech"
            color="#38bdf8"
            secondaryColor="#0ea5e9"
            interactive={logoHovered}
            className="transition-all duration-300"
          />
        )
      case 1:
        return (
          <TechCircuitLogo
            size={40}
            animated={true}
            primaryColor="#38bdf8"
            secondaryColor="#0ea5e9"
            tertiaryColor="#0284c7"
            interactive={logoHovered}
            className="transition-all duration-300"
          />
        )
      case 2:
        return (
          <NeuralLogo
            size={40}
            animated={true}
            primaryColor="#38bdf8"
            secondaryColor="#0ea5e9"
            tertiaryColor="#0284c7"
            interactive={logoHovered}
            complexity="medium"
            className="transition-all duration-300"
          />
        )
      default:
        return (
          <EnhancedVectorLogo
            size={40}
            animated={true}
            variant="tech"
            color="#38bdf8"
            secondaryColor="#0ea5e9"
            interactive={logoHovered}
            className="transition-all duration-300"
          />
        )
    }
  }

  return (
    <header className={cn(styles.header, scrolled ? styles.headerScrolled : styles.headerTransparent)}>
      <div className={styles.container}>
        <Link
          href="/"
          className={styles.logoLink}
          onClick={() => setIsOpen(false)}
          onMouseEnter={() => setLogoHovered(true)}
          onMouseLeave={() => setLogoHovered(false)}
        >
          <motion.div animate={logoHovered ? { scale: 1.05 } : { scale: 1 }} transition={{ duration: 0.2 }}>
            {renderLogo()}
          </motion.div>
          <motion.span
            className={styles.logoText}
            animate={logoHovered ? { y: -2 } : { y: 0 }}
            transition={{ duration: 0.2 }}
          >
            Ahmad Firas
          </motion.span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(styles.navLink, pathname === item.href ? styles.navLinkActive : styles.navLinkInactive)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.desktopSocial}>
          <SocialLinks />
        </div>

        {/* Mobile Menu Button */}
        <button
          className={styles.menuButton}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className={styles.mobileMenu}
            >
              <nav className={styles.mobileNav}>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      styles.mobileNavLink,
                      pathname === item.href ? styles.mobileNavLinkActive : styles.mobileNavLinkInactive,
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className={styles.mobileSocial}>
                <SocialLinks />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

function SocialLinks() {
  return (
    <>
      <a
        href={process.env.NEXT_PUBLIC_GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.socialLink}
        aria-label="GitHub"
      >
        <Github className="h-5 w-5" />
      </a>
      <a
        href={process.env.NEXT_PUBLIC_LINKEDIN_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.socialLink}
        aria-label="LinkedIn"
      >
        <Linkedin className="h-5 w-5" />
      </a>
      <a
        href={process.env.NEXT_PUBLIC_TWITTER_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.socialLink}
        aria-label="Vimeo"
      >
        <Vimeo className="h-5 w-5" />
      </a>
    </>
  )
}
