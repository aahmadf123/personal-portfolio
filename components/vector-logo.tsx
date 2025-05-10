"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface VectorLogoProps {
  size?: number
  className?: string
  animated?: boolean
  color?: string
}

export function VectorLogo({ size = 40, className, animated = true, color = "#38bdf8" }: VectorLogoProps) {
  const svgSize = size

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {animated ? (
        <motion.svg
          width={svgSize}
          height={svgSize}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          initial={{ opacity: 0.9, scale: 0.95 }}
          animate={{
            opacity: 1,
            scale: [0.98, 1.02, 0.99, 1],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          className="relative"
        >
          <motion.path
            d="M50 10C27.91 10 10 27.91 10 50C10 72.09 27.91 90 50 90C72.09 90 90 72.09 90 50C90 27.91 72.09 10 50 10ZM50 20C66.57 20 80 33.43 80 50C80 66.57 66.57 80 50 80C33.43 80 20 66.57 20 50C20 33.43 33.43 20 50 20Z"
            fill={color}
            fillOpacity="0.2"
          />
          <motion.path
            d="M50 15C30.67 15 15 30.67 15 50C15 69.33 30.67 85 50 85C69.33 85 85 69.33 85 50C85 30.67 69.33 15 50 15ZM50 25C63.81 25 75 36.19 75 50C75 63.81 63.81 75 50 75C36.19 75 25 63.81 25 50C25 36.19 36.19 25 50 25Z"
            fill={color}
            fillOpacity="0.4"
          />
          <motion.path
            d="M65 35C65 35 55 25 40 30C25 35 25 55 35 65C45 75 60 70 65 60"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          />
          <motion.path
            d="M65 35L75 25"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
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
          <path
            d="M50 10C27.91 10 10 27.91 10 50C10 72.09 27.91 90 50 90C72.09 90 90 72.09 90 50C90 27.91 72.09 10 50 10ZM50 20C66.57 20 80 33.43 80 50C80 66.57 66.57 80 50 80C33.43 80 20 66.57 20 50C20 33.43 33.43 20 50 20Z"
            fill={color}
            fillOpacity="0.2"
          />
          <path
            d="M50 15C30.67 15 15 30.67 15 50C15 69.33 30.67 85 50 85C69.33 85 85 69.33 85 50C85 30.67 69.33 15 50 15ZM50 25C63.81 25 75 36.19 75 50C75 63.81 63.81 75 50 75C36.19 75 25 63.81 25 50C25 36.19 36.19 25 50 25Z"
            fill={color}
            fillOpacity="0.4"
          />
          <path
            d="M65 35C65 35 55 25 40 30C25 35 25 55 35 65C45 75 60 70 65 60"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path d="M65 35L75 25" stroke={color} strokeWidth="4" strokeLinecap="round" />
        </svg>
      )}
    </div>
  )
}
