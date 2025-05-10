"use client"

import type React from "react"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronUp, Maximize2, Minimize2 } from "lucide-react"
import Image from "next/image"

/**
 * NestedContainerDemo - A component that demonstrates the power of nested container queries
 * This showcases how components can adapt to multiple container contexts simultaneously
 */
export function NestedContainerDemo() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    section1: true,
    section2: true,
    section3: true,
  })

  const toggleSection = (section: string) => {
    setExpanded((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <section className="py-16 @container">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-4xl @md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-teal-500 to-cyan-500 text-transparent bg-clip-text inline-block mb-4 text-balance">
            Nested Container Queries
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 via-teal-500 to-cyan-500 mx-auto rounded-full"></div>
        </div>

        <p className="text-muted-foreground max-w-3xl mx-auto text-center mb-12 text-lg text-pretty">
          This demo showcases how nested container queries enable sophisticated layouts that adapt at multiple levels
          simultaneously. Resize your browser or toggle sections to see the magic happen.
        </p>

        {/* Main container with its own container query context */}
        <div className="grid @md:grid-cols-[1fr_2fr] @xl:grid-cols-[1fr_3fr] gap-6 mb-8">
          {/* Sidebar - adapts based on its own container size */}
          <div className="rounded-xl border border-border bg-card/30 backdrop-blur-sm p-4 @container">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg @sm:text-xl font-semibold">Navigation</h3>
              <button
                onClick={() => toggleSection("section1")}
                className="p-1 rounded-full hover:bg-gray-200/10"
                aria-label={expanded.section1 ? "Collapse navigation" : "Expand navigation"}
              >
                {expanded.section1 ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>

            {expanded.section1 && (
              <div className="space-y-1">
                {/* Navigation items that adapt based on sidebar width */}
                <NavItem label="Dashboard" active />
                <NavItem label="Projects" />
                <NavItem label="Skills" />
                <NavItem label="Timeline" />
                <NavItem label="Blog" />

                {/* These items only show when sidebar is wider */}
                <div className="@md:block hidden">
                  <NavItem label="Organizations" />
                  <NavItem label="Contact" />
                </div>

                {/* Compact view when sidebar is narrow */}
                <div className="@md:hidden block pt-2">
                  <NavItem label="More..." icon={<ChevronDown size={14} />} />
                </div>
              </div>
            )}
          </div>

          {/* Main content area - adapts based on its container size */}
          <div className="rounded-xl border border-border bg-card/30 backdrop-blur-sm p-4 @container">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg @sm:text-xl font-semibold">Dashboard</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleSection("section2")}
                  className="p-1 rounded-full hover:bg-gray-200/10"
                  aria-label={expanded.section2 ? "Collapse dashboard" : "Expand dashboard"}
                >
                  {expanded.section2 ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
              </div>
            </div>

            {expanded.section2 && (
              <div className="@container">
                {/* Stats row - adapts based on main content width */}
                <div className="grid @sm:grid-cols-2 @lg:grid-cols-4 gap-4 mb-6">
                  <StatCard title="Projects" value="12" change="+2" positive />
                  <StatCard title="Blog Posts" value="8" change="+3" positive />
                  <StatCard title="Skills" value="24" change="+5" positive />
                  <StatCard title="Visitors" value="1.2k" change="+18%" positive />
                </div>

                {/* Nested grid - adapts based on main content width */}
                <div className="grid @md:grid-cols-2 gap-6">
                  {/* Recent projects - adapts based on its own container size */}
                  <div className="rounded-lg border border-border p-4 @container">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Recent Projects</h4>
                      <button
                        onClick={() => toggleSection("section3")}
                        className="p-1 rounded-full hover:bg-gray-200/10"
                        aria-label={expanded.section3 ? "Collapse projects" : "Expand projects"}
                      >
                        {expanded.section3 ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>

                    {expanded.section3 && (
                      <div className="space-y-4">
                        {/* Project cards - adapt based on their container */}
                        <MiniProjectCard
                          title="AI Portfolio Website"
                          description="Personal portfolio with AI-powered features"
                          image="/ai-portfolio-website.png"
                          progress={90}
                        />
                        <MiniProjectCard
                          title="Security Data Tool"
                          description="Data analysis tool for security applications"
                          image="/security-data-tool.png"
                          progress={75}
                        />
                        <MiniProjectCard
                          title="ChemE Car Project"
                          description="Chemical engineering competition project"
                          image="/cheme-car-project.png"
                          progress={100}
                        />
                      </div>
                    )}
                  </div>

                  {/* Recent activity - adapts based on its own container size */}
                  <div className="rounded-lg border border-border p-4 @container">
                    <h4 className="font-medium mb-4">Recent Activity</h4>
                    <div className="space-y-4">
                      <ActivityItem
                        title="New Blog Post Published"
                        description="Introduction to Quantum Computing"
                        time="2 hours ago"
                        icon="📝"
                      />
                      <ActivityItem
                        title="Project Updated"
                        description="Added new features to AI Portfolio Website"
                        time="1 day ago"
                        icon="🚀"
                      />
                      <ActivityItem
                        title="Skill Added"
                        description="Added TensorFlow to skills list"
                        time="3 days ago"
                        icon="🧠"
                      />
                      <ActivityItem
                        title="Timeline Updated"
                        description="Added new work experience entry"
                        time="1 week ago"
                        icon="📅"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Explanation of the nested container queries */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6 mt-8">
          <h3 className="text-xl font-semibold mb-4 text-balance">How This Works</h3>
          <p className="mb-4 text-pretty">
            This demo uses nested container queries to create a sophisticated layout that adapts at multiple levels:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>The outer section adapts its layout based on its container width</li>
            <li>The sidebar and main content areas adapt based on their individual widths</li>
            <li>The dashboard components adapt based on the main content area's width</li>
            <li>The project cards and activity items adapt based on their individual container widths</li>
          </ul>
          <p className="text-pretty">
            This creates a truly responsive design that works regardless of where these components are placed in your
            application.
          </p>
        </div>
      </div>
    </section>
  )
}

// Helper components

function NavItem({ label, active, icon }: { label: string; active?: boolean; icon?: React.ReactNode }) {
  return (
    <div
      className={cn(
        "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
        active
          ? "bg-primary/10 text-primary font-medium"
          : "text-muted-foreground hover:bg-primary/5 hover:text-foreground",
      )}
    >
      <span className="truncate">{label}</span>
      {icon && <span className="ml-auto">{icon}</span>}
    </div>
  )
}

function StatCard({
  title,
  value,
  change,
  positive,
}: {
  title: string
  value: string
  change: string
  positive: boolean
}) {
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="text-sm text-muted-foreground">{title}</p>
      <div className="flex items-baseline justify-between mt-1">
        <p className="text-2xl font-semibold">{value}</p>
        <span className={cn("text-xs font-medium", positive ? "text-green-500" : "text-red-500")}>{change}</span>
      </div>
    </div>
  )
}

function MiniProjectCard({
  title,
  description,
  image,
  progress,
}: {
  title: string
  description: string
  image: string
  progress: number
}) {
  return (
    <div className="rounded-lg border border-border overflow-hidden @container">
      <div className="flex @md:flex-row flex-col">
        <div className="relative @md:w-24 @md:h-auto h-24 @md:shrink-0">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/broken-image-icon.png"
            }}
          />
        </div>
        <div className="p-3 flex-1">
          <div className="flex items-start justify-between">
            <h5 className="font-medium text-sm @md:text-base truncate">{title}</h5>
            <span className="text-xs font-medium text-green-500 @md:block hidden">{progress}%</span>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 @md:line-clamp-1 mt-1">{description}</p>
          <div className="mt-2 @md:flex items-center hidden">
            <div className="w-full bg-muted/30 rounded-full h-1.5 mr-2 overflow-hidden flex-1">
              <div
                className="h-1.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-700"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="text-xs font-medium text-green-500 @md:hidden block">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ActivityItem({
  title,
  description,
  time,
  icon,
}: {
  title: string
  description: string
  time: string
  icon: string
}) {
  return (
    <div className="flex items-start @container">
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mr-3">
        <span className="text-sm">{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h5 className="font-medium text-sm truncate">{title}</h5>
          <span className="text-xs text-muted-foreground @md:block hidden">{time}</span>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{description}</p>
        <span className="text-xs text-muted-foreground @md:hidden block mt-1">{time}</span>
      </div>
    </div>
  )
}
