"use client"

import { useState } from "react"
import { submitContactForm } from "@/app/actions/contact"
import { Send, Mail, Github, Linkedin, Twitter, ArrowRight, CheckCircle, AlertCircle } from "lucide-react"

export function Contact() {
  const [formState, setFormState] = useState<{
    pending: boolean
    success?: boolean
    message?: string
  }>({
    pending: false,
  })

  async function handleSubmit(formData: FormData) {
    setFormState({ pending: true })

    try {
      const result = await submitContactForm(formData)
      setFormState({
        pending: false,
        success: result.success,
        message: result.message,
      })
    } catch (error) {
      setFormState({
        pending: false,
        success: false,
        message: "An unexpected error occurred. Please try again.",
      })
    }
  }

  return (
    <section id="contact" className="relative py-20 overflow-hidden bg-gradient-to-b from-black to-gray-900">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500 rounded-full filter blur-3xl"></div>
      </div>

      <div className="container relative z-10 px-4 mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
            Get In Touch
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">
            Have a question or want to work together? Feel free to reach out!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 shadow-xl">
            <h3 className="text-2xl font-semibold mb-6 text-white">Send a Message</h3>

            <form action={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white"
                  placeholder="Your name"
                  disabled={formState.pending}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white"
                  placeholder="Your email address"
                  disabled={formState.pending}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white min-h-[120px]"
                  placeholder="Your message"
                  rows={5}
                  disabled={formState.pending}
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium rounded-lg flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1"
                disabled={formState.pending}
                aria-disabled={formState.pending}
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
                    Send Message <Send className="ml-2 h-4 w-4" />
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

          {/* Contact Info */}
          <div className="flex flex-col justify-between">
            <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 shadow-xl mb-8">
              <h3 className="text-2xl font-semibold mb-6 text-white">Contact Information</h3>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-white">Email</h4>
                    <a
                      href="mailto:aahmadf@rockets.utoledo.edu"
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      aahmadf@rockets.utoledo.edu
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 shadow-xl">
              <h3 className="text-2xl font-semibold mb-6 text-white">Connect</h3>

              <div className="space-y-4">
                <a
                  href={process.env.NEXT_PUBLIC_GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-all group"
                >
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                    <Github className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-4 flex-grow">
                    <h4 className="text-lg font-medium text-white">GitHub</h4>
                    <p className="text-gray-400">Check out my repositories</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-500 group-hover:text-blue-400 transition-all transform group-hover:translate-x-1" />
                </a>

                <a
                  href={process.env.NEXT_PUBLIC_LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-all group"
                >
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                    <Linkedin className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-4 flex-grow">
                    <h4 className="text-lg font-medium text-white">LinkedIn</h4>
                    <p className="text-gray-400">Connect professionally</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-500 group-hover:text-blue-400 transition-all transform group-hover:translate-x-1" />
                </a>

                <a
                  href={process.env.NEXT_PUBLIC_TWITTER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-all group"
                >
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                    <Twitter className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-4 flex-grow">
                    <h4 className="text-lg font-medium text-white">Twitter</h4>
                    <p className="text-gray-400">Follow for updates</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-500 group-hover:text-blue-400 transition-all transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
