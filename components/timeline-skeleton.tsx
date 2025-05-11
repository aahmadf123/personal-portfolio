"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function TimelineSkeleton() {
  return (
    <div className="space-y-12">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="relative flex flex-col md:flex-row items-start gap-4 pb-8"
        >
          {/* Timeline dot */}
          <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-8 h-8 rounded-full border-2 border-border bg-background flex items-center justify-center z-10">
            <Skeleton className="h-5 w-5 rounded-full" />
          </div>

          {/* Timeline connector */}
          <div className="absolute left-4 md:left-1/2 top-8 bottom-0 w-0.5 bg-border" />

          {/* Date */}
          <div className="hidden md:block w-1/2 pt-1 text-right pr-8">
            <Skeleton className="h-6 w-28 rounded-full ml-auto" />
          </div>

          {/* Content */}
          <div className="w-full md:w-1/2 ml-10 md:ml-0 md:pl-8">
            <div className="p-5 border rounded-lg border-border">
              {/* Mobile date display */}
              <div className="block md:hidden mb-2">
                <Skeleton className="h-4 w-24 rounded-full" />
              </div>

              <div className="flex items-start justify-between mb-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>

              <Skeleton className="h-4 w-40 mt-1 mb-3" />

              <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>

              <div className="flex flex-wrap gap-1 mt-3">
                {[1, 2, 3].map((tag) => (
                  <Skeleton key={tag} className="h-4 w-16 rounded-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
