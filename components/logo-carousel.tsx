"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { EnhancedVectorLogo } from "./enhanced-vector-logo"
import { TechCircuitLogo } from "./tech-circuit-logo"
import { NeuralLogo } from "./neural-logo"
import { QuantumParticleLogo } from "./quantum-particle-logo"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface LogoCarouselProps {
  size?: number
  autoRotate?: boolean
  interval?: number
  showControls?: boolean
  showLabels?: boolean
}

export function LogoCarousel({
  size = 80,
  autoRotate = true,
  interval = 5000,
  showControls = true,
  showLabels = true,
}: LogoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const logos = [
    {
      id: "enhanced-quantum",
      name: "Quantum Logo",
      component: (
        <EnhancedVectorLogo
          size={size}
          animated={true}
          color="#38bdf8"
          secondaryColor="#0ea5e9"
          variant="quantum"
          interactive={false}
        />
      ),
    },
    {
      id: "tech-circuit",
      name: "Circuit Logo",
      component: (
        <TechCircuitLogo
          size={size}
          animated={true}
          primaryColor="#38bdf8"
          secondaryColor="#0ea5e9"
          tertiaryColor="#0284c7"
          interactive={false}
        />
      ),
    },
    {
      id: "neural-medium",
      name: "Neural Logo",
      component: (
        <NeuralLogo
          size={size}
          animated={true}
          primaryColor="#38bdf8"
          secondaryColor="#0ea5e9"
          tertiaryColor="#0284c7"
          interactive={false}
          complexity="medium"
        />
      ),
    },
    {
      id: "quantum-particle",
      name: "Particle Logo",
      component: (
        <QuantumParticleLogo
          size={size}
          animated={true}
          primaryColor="#38bdf8"
          secondaryColor="#0ea5e9"
          tertiaryColor="#0284c7"
          interactive={false}
          particleCount={15}
        />
      ),
    },
  ]

  useEffect(() => {
    if (!autoRotate) return

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % logos.length)
    }, interval)

    return () => clearInterval(timer)
  }, [autoRotate, interval, logos.length])

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + logos.length) % logos.length)
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % logos.length)
  }

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative w-full flex justify-center items-center">
        {showControls && (
          <button
            onClick={handlePrevious}
            className="absolute left-0 z-10 p-2 rounded-full bg-gray-900/50 hover:bg-gray-800/70 transition-colors"
            aria-label="Previous logo"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}

        <div className="relative h-[120px] w-[120px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {logos[currentIndex].component}
            </motion.div>
          </AnimatePresence>
        </div>

        {showControls && (
          <button
            onClick={handleNext}
            className="absolute right-0 z-10 p-2 rounded-full bg-gray-900/50 hover:bg-gray-800/70 transition-colors"
            aria-label="Next logo"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>

      {showLabels && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mt-4 text-center"
          >
            <p className="text-lg font-medium">{logos[currentIndex].name}</p>
          </motion.div>
        </AnimatePresence>
      )}

      {showControls && (
        <div className="flex mt-4 gap-2">
          {logos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-cyan-500 w-4" : "bg-gray-600 hover:bg-gray-500"
              }`}
              aria-label={`Go to logo ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
