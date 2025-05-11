import { Suspense } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Organizations } from "@/components/organizations";
import { SkillsDatabase } from "@/components/skills-database";
import { CurrentProjects } from "@/components/current-projects";
import dynamic from "next/dynamic";

// Dynamic imports for components that can be loaded after initial page render
const Projects = dynamic(
  () => import("@/components/projects").then((mod) => mod.Projects),
  {
    ssr: true,
    loading: () => (
      <div className="min-h-[400px] flex items-center justify-center">
        Loading projects...
      </div>
    ),
  }
);

// Use the enhanced version of featured projects for better image handling
const EnhancedFeaturedProjects = dynamic(
  () =>
    import("@/components/enhanced-featured-projects").then(
      (mod) => mod.EnhancedFeaturedProjects
    ),
  {
    ssr: true,
    loading: () => (
      <div className="min-h-[400px] flex items-center justify-center">
        Loading featured projects...
      </div>
    ),
  }
);

const Contact = dynamic(
  () => import("@/components/contact").then((mod) => mod.Contact),
  {
    ssr: true,
  }
);

// Disable revalidation caching during development to see changes immediately
export const revalidate = process.env.NODE_ENV === "development" ? 0 : 21600;

export const metadata = {
  title: "Ahmad Firas - Portfolio",
  description:
    "Personal portfolio showcasing projects in computer science, engineering, and mathematics",
};

export default function HomePage() {
  return (
    <>
      <div className="relative z-10">
        <Header />
        <main>
          <Hero />
          <About />
          <Organizations />
          <SkillsDatabase />
          <CurrentProjects />

          {/* Use EnhancedFeaturedProjects for better image handling */}
          <Suspense
            fallback={
              <div className="min-h-[400px] flex items-center justify-center">
                Loading featured projects...
              </div>
            }
          >
            <EnhancedFeaturedProjects />
          </Suspense>

          {/* All other projects section */}
          <Suspense
            fallback={
              <div className="min-h-[400px] flex items-center justify-center">
                Loading more projects...
              </div>
            }
          >
            <Projects />
          </Suspense>

          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}
