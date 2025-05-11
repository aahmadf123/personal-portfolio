"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
import styles from "./about.module.css";

// Resume URL from Supabase storage
const RESUME_URL =
  "https://lknrbdxbdhuwlelrmszq.supabase.co/storage/v1/object/public/profolio-bucket//AhmadFirasAzfarAhmadFerRouse%20-%20Resume%20MAY25.pdf";

export function About() {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <section id="about" className={styles.aboutSection}>
      <div className={`container px-4 md:px-6 ${styles.container}`}>
        <div className={styles.contentGrid}>
          <motion.div
            className={styles.imageContainer}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.imageWrapper}>
              <div className={styles.imageBorder}></div>
              <Image
                src="/professional-headshot.jpg"
                alt="Ahmad Firas Azfar"
                fill
                className={styles.image}
                onLoad={() => setImageLoaded(true)}
                priority
              />
            </div>
          </motion.div>

          <motion.div
            className={styles.contentContainer}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className={styles.sectionTitle}>About Me</h2>
            <p className={styles.sectionSubtitle}>
              Computer Science & Engineering Student exploring AI, Autonomy, and
              Next-Gen Technologies
            </p>

            <p className={styles.paragraph}>
              Hi, I'm{" "}
              <span className={styles.highlightText}>Ahmad Firas Azfar</span>, a
              Computer Science and Engineering student with a passion for
              Artificial Intelligence, Data Science, and Software Engineering. I
              focus on building intelligent systems that solve real-world
              problems with elegance and efficiency.
            </p>

            <p className={styles.paragraph}>
              While I'm still early in my journey with quantum computing, I'm
              deeply curious about its potential. My interests span AI-driven
              autonomy, drone systems, and interdisciplinary approaches that
              merge software, data, and human insight. I believe in learning
              fast, building boldly, and creating technologies that shape the
              future.
            </p>

            <div className={styles.statsList}>
              <div className={styles.statItem}>
                <span className={styles.statValue}>3+</span>
                <span className={styles.statLabel}>Years of Experience</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>15+</span>
                <span className={styles.statLabel}>Projects Completed</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>10+</span>
                <span className={styles.statLabel}>Technologies Mastered</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>3+</span>
                <span className={styles.statLabel}>Research Projects</span>
              </div>
            </div>

            <div className={styles.buttonContainer}>
              <Link
                href={RESUME_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.primaryButton}
              >
                <Download className="h-4 w-4" />
                Download Resume
              </Link>
              <Link href="#contact" className={styles.secondaryButton}>
                Contact Me
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
