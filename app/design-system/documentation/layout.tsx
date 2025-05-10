import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Design System Documentation",
  description: "Detailed usage examples for design system components",
}

export default function DocumentationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
