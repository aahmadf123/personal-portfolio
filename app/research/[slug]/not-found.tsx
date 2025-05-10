import Link from "next/link"
import { AlertCircle } from "lucide-react"

export default function ResearchProjectNotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="flex justify-center mb-6">
          <AlertCircle className="h-16 w-16 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Research Project Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The research project you're looking for doesn't exist or may have been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/research"
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            View All Research Projects
          </Link>
          <Link href="/" className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-md transition-colors">
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  )
}
