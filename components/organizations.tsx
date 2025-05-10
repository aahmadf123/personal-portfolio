"use client"

import { useState, useEffect } from "react"
import { usePerformance } from "@/contexts/performance-context"
import { FallbackImage } from "@/components/fallback-image"

export function Organizations() {
  const { performanceLevel } = usePerformance()
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    // Mark component as loaded after a short delay
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Simple fallback if there's an error
  if (hasError) {
    return (
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-balance">Professional Affiliations</h2>
          <p className="text-center text-pretty">Unable to load organizations. Please refresh the page.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-4 relative @container">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-2 text-balance">Professional Affiliations</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-teal-400 mx-auto mb-8"></div>

        <p className="text-center text-gray-600 dark:text-gray-300 mb-12 text-pretty max-w-2xl mx-auto">
          Organizations I'm proud to be associated with and contribute to
        </p>

        <div className="grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 gap-8">
          {/* Pi Sigma Epsilon Card */}
          <div
            className="rounded-lg p-6 transition-all duration-300 flex flex-col h-full @container"
            style={{
              backgroundColor: "rgba(138, 43, 226, 0.1)",
              border: "1px solid rgba(138, 43, 226, 0.2)",
            }}
          >
            <div className="flex flex-col items-center justify-center h-full">
              <div className="mb-4 @sm:w-24 @md:w-28 @lg:w-32">
                <FallbackImage
                  src="/logos/pse-logo.jpeg"
                  alt="Pi Sigma Epsilon Logo"
                  width={100}
                  height={100}
                  className="object-contain"
                  onError={() => setHasError(true)}
                  loading="lazy"
                />
              </div>
              <h3 className="text-xl @md:text-2xl font-bold mb-1 text-center text-balance">Pi Sigma Epsilon</h3>
              <p className="text-sm @md:text-base text-gray-600 dark:text-gray-400 mb-4 text-center">
                Epsilon Delta Chapter, Member
              </p>
              <p className="text-sm @md:text-base text-gray-700 dark:text-gray-300 text-center text-pretty">
                National professional fraternity in marketing, sales, and management
              </p>
            </div>
          </div>

          {/* IEEE Card */}
          <div className="bg-gray-900 rounded-lg p-6 transition-all duration-300 flex flex-col h-full @container">
            <div className="flex flex-col items-center justify-center h-full">
              <div className="mb-4 @sm:w-24 @md:w-28 @lg:w-32">
                <FallbackImage
                  src="/logos/ieee-logo.png"
                  alt="IEEE Logo"
                  width={100}
                  height={100}
                  className="object-contain"
                  onError={() => setHasError(true)}
                  loading="lazy"
                />
              </div>
              <h3 className="text-xl @md:text-2xl font-bold mb-1 text-center text-balance">IEEE</h3>
              <p className="text-sm @md:text-base text-gray-400 mb-4 text-center">Member</p>
              <p className="text-sm @md:text-base text-gray-300 text-center text-pretty">
                World's largest technical professional organization for electronics and electrical engineering
              </p>
            </div>
          </div>

          {/* AIChE Card */}
          <div className="bg-gray-900 rounded-lg p-6 transition-all duration-300 flex flex-col h-full @container">
            <div className="flex flex-col items-center justify-center h-full">
              <div className="mb-4 @sm:w-24 @md:w-28 @lg:w-32">
                <FallbackImage
                  src="/logos/aiche-logo.png"
                  alt="AIChE Logo"
                  width={100}
                  height={100}
                  className="object-contain"
                  onError={() => setHasError(true)}
                  loading="lazy"
                />
              </div>
              <h3 className="text-xl @md:text-2xl font-bold mb-1 text-center text-balance">AIChE</h3>
              <p className="text-sm @md:text-base text-gray-400 mb-4 text-center">Member</p>
              <p className="text-sm @md:text-base text-gray-300 text-center text-pretty">
                Leading organization for chemical engineering professionals worldwide
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
