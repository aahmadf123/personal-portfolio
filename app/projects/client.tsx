"use client"

import type React from "react"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"

function ProjectsFilterClient({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()
  const category = searchParams.get("category")
  const tag = searchParams.get("tag")

  // You can use the category and tag here for filtering

  return <>{children}</>
}

export function ProjectsClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>Loading projects...</div>}>
      <ProjectsFilterClient>{children}</ProjectsFilterClient>
    </Suspense>
  )
}
