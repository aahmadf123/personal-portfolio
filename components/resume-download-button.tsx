"use client"

import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"

interface ResumeDownloadButtonProps {
  resumeUrl: string
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export function ResumeDownloadButton({
  resumeUrl,
  className,
  variant = "default",
  size = "default",
}: ResumeDownloadButtonProps) {
  return (
    <Button variant={variant} size={size} className={className} onClick={() => window.open(resumeUrl, "_blank")}>
      <FileDown className="mr-2 h-4 w-4" />
      Download Resume
    </Button>
  )
}
