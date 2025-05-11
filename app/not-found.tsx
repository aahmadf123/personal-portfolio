import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a1218] text-white flex items-center justify-center">
      <div className="container px-4 md:px-6 py-16 text-center">
        <h1 className="text-6xl font-bold mb-6">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-gray-400 max-w-md mx-auto mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-md transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/projects"
            className="px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-md transition-colors"
          >
            View Projects
          </Link>
          <Link
            href="/blog"
            className="px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-md transition-colors"
          >
            Read Blog
          </Link>
        </div>
      </div>
    </div>
  );
}
