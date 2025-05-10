import { CacheControl } from "@/components/admin/cache-control"

export const metadata = {
  title: "Cache Control - Admin Dashboard",
  description: "Manage cache for your portfolio website",
}

export default function CacheControlPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Cache Control</h1>
      <div className="grid gap-6">
        <div className="p-6 bg-card rounded-lg border shadow-sm">
          <CacheControl />
        </div>
      </div>
    </div>
  )
}
