import { Suspense } from "react"
import { createServerSupabaseClient } from "@/lib/supabase"
import { redirect } from "next/navigation"
import ResearchProjectsAdminClient from "./ResearchProjectsAdminClient"
import { Loader2 } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function ResearchProjectsAdminPage({
  searchParams,
}: {
  searchParams: { q?: string; status?: string; sort?: string }
}) {
  const supabase = createServerSupabaseClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <Suspense
      fallback={
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <ResearchProjectsAdminClient searchParams={searchParams} />
    </Suspense>
  )
}
