"use client";
import { usePathname } from "next/navigation";
import { getCriticalCSSForRoute } from "@/lib/critical-css";

export function CriticalCSSHead() {
  const pathname = usePathname();
  const criticalCSS = getCriticalCSSForRoute(pathname);

  // Only render if we have critical CSS
  if (!criticalCSS) return null;

  return (
    <style
      data-critical="true"
      dangerouslySetInnerHTML={{ __html: criticalCSS }}
    />
  );
}
