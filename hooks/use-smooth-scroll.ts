"use client"

import type React from "react"

import { useCallback } from "react"

export function useSmoothScroll() {
  const scrollTo = useCallback((id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  const handleAnchorClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault()
      scrollTo(id)
    },
    [scrollTo],
  )

  return { scrollTo, handleAnchorClick }
}
