import type React from "react"
import {
  Zap,
  Code,
  Database,
  LineChart,
  Globe,
  Cpu,
  Palette,
  Server,
  Cloud,
  Smartphone,
  Braces,
  BarChart,
  FileJson,
  Figma,
  Github,
  GitBranch,
  PenTool,
  Workflow,
  Gauge,
  Microscope,
  Atom,
  Binary,
  Boxes,
  Cog,
  Network,
  Sigma,
  Webhook,
} from "lucide-react"

// Map to determine icons based on skill name
export const getIconForSkill = (skillName: string): React.ReactNode => {
  const name = skillName.toLowerCase()

  // Programming languages
  if (name.includes("python")) return <Code size={18} />
  if (name.includes("javascript") || name.includes("js")) return <Braces size={18} />
  if (name.includes("typescript") || name.includes("ts")) return <FileJson size={18} />
  if (name.includes("java")) return <Coffee size={18} />
  if (name.includes("c++") || name.includes("c#")) return <Binary size={18} />
  if (name.includes("rust")) return <Cog size={18} />
  if (name.includes("go")) return <Boxes size={18} />

  // Web development
  if (name.includes("react")) return <Atom size={18} />
  if (name.includes("angular")) return <Gauge size={18} />
  if (name.includes("vue")) return <PenTool size={18} />
  if (name.includes("node")) return <Server size={18} />
  if (name.includes("html") || name.includes("css")) return <Globe size={18} />
  if (name.includes("next.js") || name.includes("nextjs")) return <Network size={18} />

  // Data science & ML
  if (name.includes("tensorflow") || name.includes("pytorch")) return <Cpu size={18} />
  if (name.includes("machine learning")) return <Cpu size={18} />
  if (name.includes("data")) return <BarChart size={18} />
  if (name.includes("analytics")) return <LineChart size={18} />
  if (name.includes("statistics")) return <Sigma size={18} />

  // Databases
  if (name.includes("sql") || name.includes("database")) return <Database size={18} />
  if (name.includes("mongo")) return <Database size={18} />

  // Cloud & DevOps
  if (name.includes("aws") || name.includes("azure") || name.includes("cloud")) return <Cloud size={18} />
  if (name.includes("docker") || name.includes("kubernetes")) return <Boxes size={18} />
  if (name.includes("ci/cd") || name.includes("pipeline")) return <Workflow size={18} />
  if (name.includes("git")) return <GitBranch size={18} />

  // Design
  if (name.includes("ui") || name.includes("ux") || name.includes("design")) return <Palette size={18} />
  if (name.includes("figma")) return <Figma size={18} />

  // Quantum computing
  if (name.includes("quantum")) return <Microscope size={18} />

  // Mobile
  if (name.includes("mobile") || name.includes("android") || name.includes("ios")) return <Smartphone size={18} />

  // Tools & platforms
  if (name.includes("github")) return <Github size={18} />
  if (name.includes("api")) return <Webhook size={18} />

  // Default icon
  return <Zap size={18} />
}

// Custom Coffee icon for Java
function Coffee({ size = 24 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
      <line x1="6" y1="2" x2="6" y2="4" />
      <line x1="10" y1="2" x2="10" y2="4" />
      <line x1="14" y1="2" x2="14" y2="4" />
    </svg>
  )
}
