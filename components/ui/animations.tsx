"use client"

import React from "react"

import { motion } from "framer-motion"

interface FadeInProps {
  children: React.ReactNode
  duration?: number
  delay?: number
  className?: string
}

export const FadeIn = ({ children, duration = 0.5, delay = 0, className = "" }: FadeInProps) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, delay }}
    >
      {children}
    </motion.div>
  )
}

interface SlideInProps {
  children: React.ReactNode
  direction: "left" | "right" | "top" | "bottom"
  distance?: number
  duration?: number
  delay?: number
  className?: string
}

export const SlideIn = ({
  children,
  direction,
  distance = 50,
  duration = 0.5,
  delay = 0,
  className = "",
}: SlideInProps) => {
  const initial = {
    x: direction === "left" ? -distance : direction === "right" ? distance : 0,
    y: direction === "top" ? -distance : direction === "bottom" ? distance : 0,
    opacity: 0,
  }
  const animate = {
    x: 0,
    y: 0,
    opacity: 1,
  }
  const transition = {
    duration,
    delay,
    ease: "easeOut",
  }

  return (
    <motion.div className={className} initial={initial} animate={animate} transition={transition}>
      {children}
    </motion.div>
  )
}

interface ScaleProps {
  children: React.ReactNode
  scale?: number
  duration?: number
  delay?: number
  className?: string
}

export const Scale = ({ children, scale = 1.1, duration = 0.3, delay = 0, className = "" }: ScaleProps) => {
  return (
    <motion.div
      className={className}
      whileHover={{ scale }}
      transition={{ duration, delay, type: "spring", stiffness: 100, damping: 15 }}
    >
      {children}
    </motion.div>
  )
}

interface StaggeredListProps {
  children: React.ReactNode
  staggerDelay?: number
  className?: string
}

export const StaggeredList = ({ children, staggerDelay = 0.1, className = "" }: StaggeredListProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 20,
      },
    },
  }

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {React.Children.map(children, (child) => (
        <motion.div variants={itemVariants}>{child}</motion.div>
      ))}
    </motion.div>
  )
}
