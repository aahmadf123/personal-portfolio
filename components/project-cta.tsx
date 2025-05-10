"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Send, CheckCircle, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"

interface ProjectCTAProps {
  title?: string
  description?: string
}

export function ProjectCTA({
  title = "Interested in working together?",
  description = "I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.",
}: ProjectCTAProps) {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [formState, setFormState] = useState<{
    pending: boolean
    success?: boolean
    message?: string
  }>({
    pending: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setFormState({
        pending: false,
        success: false,
        message: "Please enter your email address.",
      })
      return
    }

    setFormState({ pending: true })

    try {
      // Create a FormData object to use with your existing contact form handler
      const formData = new FormData()
      formData.append("email", email)
      formData.append("name", "Project Inquiry") // Default name for quick inquiries
      formData.append("message", message || "I'm interested in discussing a project. Please contact me.")

      // Use your existing contact form submission function
      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to send inquiry")
      }

      const result = await response.json()

      setFormState({
        pending: false,
        success: true,
        message: "Thanks for your inquiry! I'll get back to you soon.",
      })

      // Reset form
      setEmail("")
      setMessage("")
    } catch (error) {
      setFormState({
        pending: false,
        success: false,
        message: "Something went wrong. Please try again or contact me directly.",
      })
    }
  }

  return (
    <section className="py-16 relative overflow-hidden bg-gradient-to-b from-gray-900 to-black">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-cyan-500 rounded-full filter blur-3xl"></div>
      </div>

      <div className="container px-4 mx-auto relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
              {title}
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">{description}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 shadow-xl">
                <h3 className="text-xl font-semibold mb-4 text-white">Quick Project Inquiry</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white"
                      placeholder="your.email@example.com"
                      disabled={formState.pending}
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                      Message (Optional)
                    </label>
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white min-h-[100px]"
                      placeholder="Tell me briefly about your project idea..."
                      disabled={formState.pending}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium rounded-lg flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1"
                    disabled={formState.pending}
                  >
                    {formState.pending ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Inquiry <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </button>

                  {formState.message && (
                    <div
                      className={`mt-4 p-4 rounded-lg flex items-start ${
                        formState.success
                          ? "bg-green-900/30 text-green-400 border border-green-800"
                          : "bg-red-900/30 text-red-400 border border-red-800"
                      }`}
                      role="status"
                      aria-live="polite"
                    >
                      {formState.success ? (
                        <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                      )}
                      <span>{formState.message}</span>
                    </div>
                  )}
                </form>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="space-y-6"
            >
              <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800 hover:border-blue-500/50 transition-colors">
                <h4 className="text-lg font-medium text-white mb-2">Direct Contact</h4>
                <p className="text-gray-400 mb-4">Prefer to reach out directly? Feel free to contact me via email.</p>
                <a
                  href="mailto:contact@example.com"
                  className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                >
                  contact@example.com
                  <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800 hover:border-blue-500/50 transition-colors">
                <h4 className="text-lg font-medium text-white mb-2">Schedule a Call</h4>
                <p className="text-gray-400 mb-4">Want to discuss your project in detail? Let's schedule a call.</p>
                <Link
                  href="/contact"
                  className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Schedule a call
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800 hover:border-blue-500/50 transition-colors">
                <h4 className="text-lg font-medium text-white mb-2">View My Work</h4>
                <p className="text-gray-400 mb-4">Check out my portfolio to see more examples of my work.</p>
                <Link
                  href="/projects"
                  className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Browse portfolio
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
