"use client";

import type React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BarChart,
  FileText,
  ImageIcon,
  Database,
  Code,
  Briefcase,
  Lightbulb,
  MessageSquare,
  RefreshCw,
  FlaskRoundIcon as Flask,
  Clock,
  Award,
} from "lucide-react";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
    icon?: React.ReactNode;
  }[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            pathname === item.href
              ? "bg-accent text-accent-foreground"
              : "transparent"
          )}
        >
          {item.icon && <span className="mr-2 h-4 w-4">{item.icon}</span>}
          {item.title}
        </Link>
      ))}
    </nav>
  );
}

export const adminNavItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: <BarChart className="h-4 w-4" />,
  },
  {
    title: "Projects",
    href: "/admin/projects",
    icon: <Briefcase className="h-4 w-4" />,
  },
  {
    title: "Research Projects",
    href: "/admin/research-projects",
    icon: <Flask className="h-4 w-4" />,
  },
  {
    title: "Blog",
    href: "/admin/blog",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    title: "Skills",
    href: "/admin/skills",
    icon: <Code className="h-4 w-4" />,
  },
  {
    title: "Case Studies",
    href: "/admin/case-studies",
    icon: <Lightbulb className="h-4 w-4" />,
  },
  {
    title: "Timeline",
    href: "/admin/timeline",
    icon: <Clock className="h-4 w-4" />,
  },
  {
    title: "Achievements",
    href: "/admin/achievements",
    icon: <Award className="h-4 w-4" />,
  },
  {
    title: "Media Library",
    href: "/admin/media-library",
    icon: <ImageIcon className="h-4 w-4" />,
  },
  {
    title: "Content Assistant",
    href: "/admin/content-assistant",
    icon: <MessageSquare className="h-4 w-4" />,
  },
  {
    title: "Database Tools",
    href: "/admin/database-schema",
    icon: <Database className="h-4 w-4" />,
  },
  {
    title: "Content Revalidation",
    href: "/admin/content-revalidation",
    icon: <RefreshCw className="h-4 w-4" />,
  },
];
