"use client";

import { useEffect, useState, ReactNode } from "react";
import { usePathname } from "next/navigation";

interface RouterProviderProps {
  children: ReactNode;
}

/**
 * This component ensures the router is properly initialized
 * before rendering children that might need router access.
 * Fixes "NextRouter was not mounted" errors in static pages with client components.
 */
export function RouterProvider({ children }: RouterProviderProps) {
  const pathname = usePathname();
  const [isRouterReady, setIsRouterReady] = useState(false);

  useEffect(() => {
    // If we have a pathname, the router is ready
    if (pathname) {
      setIsRouterReady(true);
    }
  }, [pathname]);

  // Only render children when router is ready
  // This prevents "NextRouter was not mounted" errors
  if (!isRouterReady) {
    return null;
  }

  return <>{children}</>;
}
