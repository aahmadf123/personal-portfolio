"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { SiteLogo } from "./site-logo"
import { motion } from "framer-motion"

export function Breadcrumb() {
  const pathname = usePathname()

  if (pathname === "/") return null

  const segments = pathname.split("/").filter(Boolean)

  return (
    <nav aria-label="Breadcrumb" className="py-2 px-4 md:px-6 bg-black/20 backdrop-blur-sm">
      <ol className="flex items-center space-x-1 text-sm">
        <li className="flex items-center">
          <Link href="/" className="flex items-center text-muted-foreground hover:text-white transition-colors">
            <motion.div whileHover={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 0.5 }}>
              <SiteLogo size={18} animated={false} variant="minimal" />
            </motion.div>
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join("/")}`
          const isLast = index === segments.length - 1
          const isId = segment.match(/^[a-f0-9-]{7,}$/) !== null

          let label = segment.replace(/-/g, " ")
          label = isId ? "View" : label.charAt(0).toUpperCase() + label.slice(1)

          return (
            <li key={segment} className="flex items-center">
              <ChevronRight className="h-3 w-3 text-muted-foreground mx-1" />
              {isLast ? (
                <span className="font-medium text-white">{label}</span>
              ) : (
                <Link href={href} className="text-muted-foreground hover:text-white transition-colors">
                  {label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
