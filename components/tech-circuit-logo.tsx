"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface TechCircuitLogoProps {
  size?: number
  className?: string
  animated?: boolean
  primaryColor?: string
  secondaryColor?: string
  tertiaryColor?: string
  interactive?: boolean
}

export function TechCircuitLogo({
  size = 40,
  className,
  animated = true,
  primaryColor = "#38bdf8",
  secondaryColor = "#0ea5e9",
  tertiaryColor = "#0284c7",
  interactive = false,
}: TechCircuitLogoProps) {
  const svgSize = size
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {animated ? (
        <motion.svg
          width={svgSize}
          height={svgSize}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          initial={{ opacity: 0.9 }}
          animate={{
            opacity: 1,
            scale: interactive && isHovered ? 1.05 : 1,
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
          className="relative"
        >
          {/* Main circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="40"
            stroke={primaryColor}
            strokeWidth="2"
            fill="transparent"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 2,
              ease: "easeInOut",
            }}
          />

          {/* Circuit patterns */}
          <motion.path
            d="M50 10L50 20"
            stroke={primaryColor}
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
          <motion.path
            d="M50 80L50 90"
            stroke={primaryColor}
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
          <motion.path
            d="M10 50L20 50"
            stroke={primaryColor}
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          />
          <motion.path
            d="M80 50L90 50"
            stroke={primaryColor}
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          />

          {/* Circuit nodes */}
          <motion.circle
            cx="50"
            cy="20"
            r="3"
            fill={secondaryColor}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          />
          <motion.circle
            cx="50"
            cy="80"
            r="3"
            fill={secondaryColor}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          />
          <motion.circle
            cx="20"
            cy="50"
            r="3"
            fill={secondaryColor}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.8 }}
          />
          <motion.circle
            cx="80"
            cy="50"
            r="3"
            fill={secondaryColor}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.9 }}
          />

          {/* Diagonal circuit lines */}
          <motion.path
            d="M30 30L20 20"
            stroke={primaryColor}
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          />
          <motion.path
            d="M70 30L80 20"
            stroke={primaryColor}
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 1.1 }}
          />
          <motion.path
            d="M30 70L20 80"
            stroke={primaryColor}
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          />
          <motion.path
            d="M70 70L80 80"
            stroke={primaryColor}
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 1.3 }}
          />

          {/* Diagonal circuit nodes */}
          <motion.circle
            cx="20"
            cy="20"
            r="2"
            fill={tertiaryColor}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 1.4 }}
          />
          <motion.circle
            cx="80"
            cy="20"
            r="2"
            fill={tertiaryColor}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 1.5 }}
          />
          <motion.circle
            cx="20"
            cy="80"
            r="2"
            fill={tertiaryColor}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 1.6 }}
          />
          <motion.circle
            cx="80"
            cy="80"
            r="2"
            fill={tertiaryColor}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 1.7 }}
          />

          {/* Central spiral */}
          <motion.path
            d="M50 30C40 30 30 40 30 50C30 60 40 70 50 70C60 70 70 60 70 50"
            stroke={secondaryColor}
            strokeWidth="3"
            strokeLinecap="round"
            fill="transparent"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 1.5,
              delay: 1.8,
              ease: "easeInOut",
            }}
          />

          {/* Central node */}
          <motion.circle
            cx="50"
            cy="50"
            r="5"
            fill={primaryColor}
            initial={{ scale: 0 }}
            animate={{
              scale: 1,
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              scale: { duration: 0.5, delay: 2.0 },
              opacity: { duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" },
            }}
          />

          {/* Pulse effect */}
          <motion.circle
            cx="50"
            cy="50"
            r="15"
            stroke={primaryColor}
            strokeWidth="1"
            fill="transparent"
            animate={{
              r: [15, 25, 15],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />

          {/* Data flow animations */}
          {[0, 90, 180, 270].map((angle, i) => (
            <motion.circle
              key={i}
              r="2"
              fill={i % 2 === 0 ? secondaryColor : tertiaryColor}
              animate={{
                cx: [50, 50 + 35 * Math.cos((angle * Math.PI) / 180)],
                cy: [50, 50 + 35 * Math.sin((angle * Math.PI) / 180)],
                opacity: [1, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.5,
                ease: "easeOut",
              }}
            />
          ))}
        </motion.svg>
      ) : (
        <svg
          width={svgSize}
          height={svgSize}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative"
        >
          <circle cx="50" cy="50" r="40" stroke={primaryColor} strokeWidth="2" fill="transparent" />
          <path d="M50 10L50 20" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" />
          <path d="M50 80L50 90" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" />
          <path d="M10 50L20 50" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" />
          <path d="M80 50L90 50" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" />
          <circle cx="50" cy="20" r="3" fill={secondaryColor} />
          <circle cx="50" cy="80" r="3" fill={secondaryColor} />
          <circle cx="20" cy="50" r="3" fill={secondaryColor} />
          <circle cx="80" cy="50" r="3" fill={secondaryColor} />
          <path d="M30 30L20 20" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" />
          <path d="M70 30L80 20" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" />
          <path d="M30 70L20 80" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" />
          <path d="M70 70L80 80" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" />
          <circle cx="20" cy="20" r="2" fill={tertiaryColor} />
          <circle cx="80" cy="20" r="2" fill={tertiaryColor} />
          <circle cx="20" cy="80" r="2" fill={tertiaryColor} />
          <circle cx="80" cy="80" r="2" fill={tertiaryColor} />
          <path
            d="M50 30C40 30 30 40 30 50C30 60 40 70 50 70C60 70 70 60 70 50"
            stroke={secondaryColor}
            strokeWidth="3"
            strokeLinecap="round"
            fill="transparent"
          />
          <circle cx="50" cy="50" r="5" fill={primaryColor} />
        </svg>
      )}
    </div>
  )
}
