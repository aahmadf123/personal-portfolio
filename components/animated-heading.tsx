"use client"

import type React from "react"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedHeadingProps {
  title?: string
  children?: React.ReactNode
  className?: string
  withDivider?: boolean
  dividerClassName?: string
  headingClassName?: string
}

export function AnimatedHeading({
  title,
  children,
  className,
  withDivider = false,
  dividerClassName,
  headingClassName,
}: AnimatedHeadingProps) {
  const content = title || children

  return (
    <div className={cn("relative", className)}>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className={cn("text-3xl md:text-4xl font-bold text-center", headingClassName)}
      >
        {content}
      </motion.h2>

      {withDivider && (
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={cn(
            "h-1 w-24 bg-gradient-to-r from-blue-500 to-teal-500 mx-auto mt-4 rounded-full",
            dividerClassName,
          )}
        />
      )}
    </div>
  )
}
