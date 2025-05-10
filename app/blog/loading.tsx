"use client"

import { SiteLogo } from "@/components/site-logo"
import { motion } from "framer-motion"

export default function BlogLoading() {
  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        className="flex flex-col items-center justify-center py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <SiteLogo size={80} animated={true} />

        <div className="mt-6 flex space-x-2">
          <motion.div
            className="w-2 h-2 bg-cyan-500 rounded-full"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0 }}
          />
          <motion.div
            className="w-2 h-2 bg-blue-500 rounded-full"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.2 }}
          />
          <motion.div
            className="w-2 h-2 bg-purple-500 rounded-full"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.4 }}
          />
        </div>

        <motion.p
          className="mt-4 text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Loading blog posts...
        </motion.p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="border border-gray-800 rounded-lg overflow-hidden bg-gray-900/50">
              <div className="w-full h-48 bg-gray-800 animate-pulse"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-800 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-800 rounded animate-pulse w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-800 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-800 rounded animate-pulse w-5/6"></div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
