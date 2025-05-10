"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import { Modal } from "./ui/modal"
import type { TimelineEntry } from "./interactive_timeline"

interface TimelineDetailProps {
  entry: TimelineEntry
}

export function TimelineDetail({ entry }: TimelineDetailProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Get color based on entry type
  const getColor = (type: string) => {
    switch (type) {
      case "education":
        return "tertiary"
      case "work":
        return "quaternary"
      case "project":
        return "secondary"
      case "achievement":
        return "accent"
      default:
        return "tertiary"
    }
  }

  const color = getColor(entry.type)

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center mt-3 text-xs font-medium text-${color} hover:underline`}
        whileHover={{ x: 3 }}
      >
        Learn more
        <motion.div
          animate={{ x: [0, 3, 0] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
        >
          <ChevronRight className="h-3 w-3 ml-1" />
        </motion.div>
      </motion.button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={entry.title}>
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-${color}/10 text-${color}`}
            >
              {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-${color}/10 text-${color}`}
            >
              {entry.startDate} - {entry.endDate}
            </span>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-1">{entry.title}</h3>
            <p className={`text-${color} font-medium`}>{entry.organization}</p>
          </div>

          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p>{entry.description}</p>

            {/* Additional content based on entry type */}
            {entry.type === "education" && (
              <div className="mt-4 space-y-4">
                <h4 className="text-base font-semibold">Courses & Achievements</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Advanced coursework in machine learning and artificial intelligence</li>
                  <li>Graduated with honors, top 5% of class</li>
                  <li>Research assistant for quantum computing applications</li>
                  <li>Published paper on neural network optimization techniques</li>
                </ul>
              </div>
            )}

            {entry.type === "work" && (
              <div className="mt-4 space-y-4">
                <h4 className="text-base font-semibold">Key Responsibilities</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Led development of computer vision algorithms for autonomous systems</li>
                  <li>Collaborated with cross-functional teams to implement ML solutions</li>
                  <li>Optimized neural network performance for edge devices</li>
                  <li>Mentored junior engineers and interns</li>
                </ul>

                <h4 className="text-base font-semibold">Achievements</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Reduced model inference time by 40% through optimization</li>
                  <li>Implemented CI/CD pipeline reducing deployment time by 60%</li>
                  <li>Awarded employee of the quarter for exceptional contributions</li>
                </ul>
              </div>
            )}

            {entry.type === "project" && (
              <div className="mt-4 space-y-4">
                <h4 className="text-base font-semibold">Project Details</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Developed novel algorithms for real-time object detection</li>
                  <li>Implemented system using PyTorch and TensorFlow</li>
                  <li>Achieved 95% accuracy on benchmark datasets</li>
                  <li>Open-sourced code with over 500 GitHub stars</li>
                </ul>

                <div className="mt-4">
                  <h4 className="text-base font-semibold">Technologies Used</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {entry.tags?.map((tag) => (
                      <span
                        key={tag}
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-${color}/10 text-${color}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {entry.type === "achievement" && (
              <div className="mt-4 space-y-4">
                <h4 className="text-base font-semibold">Achievement Details</h4>
                <p>
                  This recognition highlights exceptional contributions to the field and demonstrates expertise in
                  cutting-edge technologies and methodologies.
                </p>

                <div className="p-4 border rounded-md bg-gradient-to-r from-primary/5 to-secondary/5">
                  <h5 className="text-sm font-semibold mb-2">Impact</h5>
                  <p className="text-sm">
                    This achievement has opened doors to collaboration with leading researchers and institutions,
                    furthering the advancement of technology in this domain.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          {entry.tags && entry.tags.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2">Related Skills</h4>
              <div className="flex flex-wrap gap-2">
                {entry.tags.map((tag, index) => (
                  <span
                    key={tag}
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-${index % 4 === 0 ? "primary" : index % 4 === 1 ? "secondary" : index % 4 === 2 ? "tertiary" : "quaternary"}/10 text-${index % 4 === 0 ? "primary" : index % 4 === 1 ? "secondary" : index % 4 === 2 ? "tertiary" : "quaternary"}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  )
}
