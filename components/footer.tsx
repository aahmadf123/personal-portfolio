"use client";

import Link from "next/link";
import { Github, Linkedin, VideoIcon as Vimeo } from "lucide-react";
import styles from "./footer.module.css";

// Resume URL from Supabase storage
const RESUME_URL =
  "https://lknrbdxbdhuwlelrmszq.supabase.co/storage/v1/object/public/profolio-bucket//AhmadFirasAzfarAhmadFerRouse%20-%20Resume%20MAY25.pdf";

export function Footer() {
  const currentYear = new Date().getFullYear();

  // Social media URLs from environment variables
  const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com";
  const linkedinUrl =
    process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://linkedin.com";
  const twitterUrl =
    process.env.NEXT_PUBLIC_TWITTER_URL || "https://twitter.com";

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* About */}
          <div className={styles.aboutSection}>
            <h3 className={styles.sectionTitle}>Ahmad Firas Azfar</h3>
            <p className={styles.aboutText}>
              Computer Science and Engineering student with a passion for AI,
              data science, and quantum computing. Building innovative solutions
              to complex problems.
            </p>
            <div className={styles.socialLinks}>
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Vimeo"
              >
                <Vimeo className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={styles.sectionTitle}>Quick Links</h3>
            <ul className={styles.linkList}>
              <li>
                <Link href="/#about" className={styles.link}>
                  About
                </Link>
              </li>
              <li>
                <Link href="/#projects" className={styles.link}>
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/#skills" className={styles.link}>
                  Skills
                </Link>
              </li>
              <li>
                <Link href="/#blog" className={styles.link}>
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/#contact" className={styles.link}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className={styles.sectionTitle}>Resources</h3>
            <ul className={styles.linkList}>
              <li>
                <Link href="/blog" className={styles.link}>
                  All Articles
                </Link>
              </li>
              <li>
                <Link href="/projects" className={styles.link}>
                  All Projects
                </Link>
              </li>
              <li>
                <Link href="/quantum-concepts" className={styles.link}>
                  Quantum Concepts
                </Link>
              </li>
              <li>
                <Link href="/skills" className={styles.link}>
                  Skills & Expertise
                </Link>
              </li>
              <li>
                <Link href="/demos/nested-containers" className={styles.link}>
                  Container Queries Demo
                </Link>
              </li>
              <li>
                <a
                  href={RESUME_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Resume
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            &copy; {currentYear} Ahmad Firas Azfar. All rights reserved.
          </p>
          <div className={styles.techStack}>
            <span>Built with Next.js, Tailwind CSS, and Framer Motion</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
