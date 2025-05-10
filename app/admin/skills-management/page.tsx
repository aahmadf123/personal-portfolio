import { Suspense } from "react"
import { createServerSupabaseClient } from "@/lib/supabase"
import { redirect } from "next/navigation"
import { SkillsManager } from "@/components/admin/skills-manager"
import { Loader2 } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function SkillsManagementPage() {
  const supabase = createServerSupabaseClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Skills Management</h1>
          <p className="text-muted-foreground">Manage your skills and expertise</p>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="flex justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        }
      >
        <SkillsManager />
      </Suspense>
    </div>
  )
}
