import { DataTableSkeleton } from "@/components/skeleton/data-table-skeleton"

export default function ProjectsLoading() {
  return (
    <div className="container mx-auto py-10 space-y-4">
      <div className="flex justify-between">
        <div className="h-10 w-64 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
        <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
      </div>
      <DataTableSkeleton />
    </div>
  )
}
