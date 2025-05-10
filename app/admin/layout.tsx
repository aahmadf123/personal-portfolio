import type { ReactNode } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { adminNavItems, SidebarNav } from "@/components/admin/sidebar-nav"

export const metadata: Metadata = {
  title: "Admin Dashboard | Portfolio",
  description: "Admin dashboard for managing portfolio content",
}

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-card/50">
          <div className="flex items-center flex-shrink-0 px-4 mb-5">
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-foreground flex items-center justify-center text-white font-bold">
                A
              </div>
              <span className="text-xl font-bold">Admin Portal</span>
            </Link>
          </div>

          <div className="px-4 mb-6">
            <div className="flex items-center space-x-3 py-3 px-4 rounded-lg bg-muted/50">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Admin User</p>
              </div>
            </div>
          </div>

          <div className="mt-1 flex-grow flex flex-col">
            <nav className="flex-1 px-2 pb-4">
              <SidebarNav items={adminNavItems} />
            </nav>

            <div className="px-3 py-4 border-t">
              <div className="flex items-center justify-between">
                <Link
                  href="/"
                  className="group flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <span className="mr-3 text-muted-foreground group-hover:text-accent-foreground transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                  </span>
                  View Site
                </Link>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">{children}</div>
          </div>
        </main>
      </div>
    </div>
  )
}
