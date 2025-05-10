"use client"

import { useEffect, useState } from "react"
import { LazyStyles } from "./lazy-styles"

interface ConditionalStylesProps {
  condition: boolean
  href: string
  fallbackHref?: string
  id?: string
}

export function ConditionalStyles({ condition, href, fallbackHref, id }: ConditionalStylesProps) {
  const [styleUrl, setStyleUrl] = useState<string | null>(null)

  useEffect(() => {
    setStyleUrl(condition ? href : fallbackHref || null)
  }, [condition, href, fallbackHref])

  if (!styleUrl) return null

  return <LazyStyles href={styleUrl} id={id} />
}

// Example usage:
// <ConditionalStyles
//   condition={isDarkMode}
//   href="/css/dark-theme.css"
//   fallbackHref="/css/light-theme.css"
// />
