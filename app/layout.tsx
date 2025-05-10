import type React from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Suspense, lazy } from "react";
import { Favicon } from "./favicon";
import { PerformanceProvider } from "@/contexts/performance-context";
import Preload from "./preload";
import { Analytics } from "@/components/analytics";
import { ErrorBoundary } from "@/components/error-boundary";
import { SeoSchema } from "@/components/seo-schema";
import { RAGChatAssistant } from "@/components/rag-chat-assistant";
import { CustomCursor } from "@/components/custom-cursor";
import { CriticalCSSHead } from "@/components/critical-css-head";
import { CSSPerformanceMonitor } from "@/components/css-performance-monitor";
import { Header } from "@/components/header"; // Import the Header component
import dynamic from "next/dynamic";

// Dynamic import the RouterProvider with no SSR to avoid hydration issues
const RouterProvider = dynamic(
  () =>
    import("@/components/client-wrappers/router-provider").then(
      (mod) => mod.RouterProvider
    ),
  { ssr: false }
);

// Import VisibleTechBackground directly to ensure it's loaded
import { VisibleTechBackground } from "@/components/visible-tech-background";

// Lazy load components that aren't needed for initial render
const MicroInteractions = lazy(() =>
  import("@/components/micro-interactions").then((mod) => ({
    default: mod.MicroInteractions || (() => null),
  }))
);
const ScrollAnimations = lazy(() =>
  import("@/components/scroll-animations").then((mod) => ({
    default: mod.ScrollAnimations || (() => null),
  }))
);
const ServiceWorkerRegistration = lazy(() =>
  import("./service-worker-registration").then((mod) => ({
    default: mod.ServiceWorkerRegistration,
  }))
);

// Optimize font loading with display swap
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
  adjustFontFallback: true, // New in Next.js 14
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#000000",
  colorScheme: "dark light", // Support both color schemes
};

export const metadata: Metadata = {
  title: {
    template: "%s | Ahmad Firas",
    default: "Ahmad Firas - Portfolio",
  },
  description:
    "Personal portfolio showcasing projects in computer science, engineering, and mathematics",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://yourdomain.com"
  ),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
    },
  },
  openGraph: {
    title: "Ahmad Firas - Portfolio",
    description:
      "Personal portfolio showcasing projects in computer science, engineering, and mathematics",
    url: process.env.NEXT_PUBLIC_BASE_URL,
    siteName: "Ahmad Firas Portfolio",
    images: [
      {
        url: "/professional-headshot.jpg",
        width: 1200,
        height: 630,
        alt: "Ahmad Firas",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahmad Firas - Portfolio",
    description:
      "Personal portfolio showcasing projects in computer science, engineering, and mathematics",
    creator: "@ahmadfirasazfar",
    images: ["/professional-headshot.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code", // Replace with your verification code
  },
  generator: "v0.dev",
};

// Organization affiliations data
const organizationAffiliations = [
  {
    name: "IEEE",
    url: "https://www.ieee.org",
    logo: "/placeholder.svg?key=c0svp",
    role: "Student Member",
    period: "2020 - Present",
  },
  {
    name: "ACM",
    url: "https://www.acm.org",
    logo: "/placeholder.svg?key=awit9",
    role: "Professional Member",
    period: "2019 - Present",
  },
  {
    name: "AIAA",
    url: "https://www.aiaa.org",
    logo: "/placeholder.svg?key=weagy",
    role: "Associate Member",
    period: "2021 - Present",
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <CriticalCSSHead />
        <Favicon />
        {/* Preconnect to domains for faster resource loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="stylesheet" href="/css/print.css" media="print" />
      </head>
      <body className={`${inter.className} bg-black min-h-screen`}>
        {/* SEO Schema */}
        <SeoSchema
          name="Ahmad Firas Azfar"
          description="Computer Science & Engineering Student | Math Minor | AI/ML Enthusiast"
          profileImage="/professional-headshot.jpg"
          sameAs={[
            process.env.NEXT_PUBLIC_GITHUB_URL,
            process.env.NEXT_PUBLIC_LINKEDIN_URL ||
              "https://www.linkedin.com/in/ahmadfirasazfar",
            process.env.NEXT_PUBLIC_TWITTER_URL,
          ]}
          jobTitle="Computer Science & Engineering Student"
          organization="The University of Toledo"
          affiliations={organizationAffiliations}
        />

        {/* Custom cursor component */}
        <CustomCursor />
        <Preload />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <PerformanceProvider>
            <ErrorBoundary>
              {/* Wrap the entire app with RouterProvider to ensure router is mounted */}
              <RouterProvider>
                {/* Background with fallback */}
                <VisibleTechBackground />

                {/* Content */}
                <div className="relative z-10 flex flex-col min-h-screen">
                  {/* Add Header component here */}
                  <Header />
                  <main className="flex-grow">{children}</main>
                </div>
              </RouterProvider>
            </ErrorBoundary>
          </PerformanceProvider>
        </ThemeProvider>
        <RAGChatAssistant />
        {process.env.NODE_ENV === "development" && <CSSPerformanceMonitor />}
        <Analytics />
        <Suspense fallback={null}>
          <ServiceWorkerRegistration />
        </Suspense>
      </body>
    </html>
  );
}
