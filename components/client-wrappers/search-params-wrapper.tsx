"use client"

import type React from "react"

import { Suspense } from "react"

interface SearchParamsWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function SearchParamsWrapper({ children, fallback = <div>Loading...</div> }: SearchParamsWrapperProps) {
  return <Suspense fallback={fallback}>{children}</Suspense>
}
