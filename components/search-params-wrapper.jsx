"use client"

import { Suspense } from "react"

export function SearchParamsWrapper({ children }) {
  return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
}
