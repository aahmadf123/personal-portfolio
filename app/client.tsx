"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Suspense, lazy, useState, useEffect } from "react"
import { PerformanceProvider } from "@/contexts/performance-context"
import Preload from "./preload"
import { Analytics } from "@/components/analytics"
import { ErrorBoundary } from "@/components/error-boundary"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { RAGChatAssistant } from "@/components/rag-chat-assistant"
import { CustomCursor } from "@/components/custom-cursor"
import { usePathname } from "next/navigation"
// import { PageLoadingIndicator } from "@/components/page-loading-indicator"

// Import VisibleTechBackground directly to ensure it's loaded
import { VisibleTechBackground } from "@/components/visible-tech-background"

// Lazy load components that aren't needed for initial render
const MicroInteractions = lazy(() =>
  import("@/components/micro-interactions").then((mod) => ({ default: mod.MicroInteractions || (() => null) })),
)
const ScrollAnimations = lazy(() =>
  import("@/components/scroll-animations").then((mod) => ({ default: mod.ScrollAnimations || (() => null) })),
)
const ServiceWorkerRegistration = lazy(() =>
  import("./service-worker-registration").then((mod) => ({ default: mod.ServiceWorkerRegistration })),
)

const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Optimize font loading
  preload: true,
})

function RootLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHomePage = pathname === "/"
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <>
      <CustomCursor />
      <Preload />
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        <PerformanceProvider>
          <ErrorBoundary>
            {/* Background with fallback */}
            <VisibleTechBackground />

            {/* Content */}
            <div className="relative z-10 flex flex-col min-h-screen">
              <Header />
              <ErrorBoundary fallback={<div className="sr-only">Animation error</div>}>
                <Suspense fallback={null}>{isClient && <MicroInteractions />}</Suspense>
              </ErrorBoundary>
              <ErrorBoundary fallback={<div className="sr-only">Animation error</div>}>
                <Suspense fallback={null}>{isClient && <ScrollAnimations />}</Suspense>
              </ErrorBoundary>
              <main className="flex-grow">{children}</main>
              {!isHomePage && <Footer />}
            </div>
          </ErrorBoundary>
        </PerformanceProvider>
      </ThemeProvider>
      <RAGChatAssistant />
      <Analytics />
      <Suspense fallback={null}>
        <ServiceWorkerRegistration />
      </Suspense>
    </>
  )
}

function ClientWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Temporarily removed PageLoadingIndicator */}
      {/* <PageLoadingIndicator /> */}
      {children}
    </>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-black min-h-screen`}>
        <ClientWrapper>
          <RootLayoutInner>{children}</RootLayoutInner>
        </ClientWrapper>
      </body>
    </html>
  )
}
