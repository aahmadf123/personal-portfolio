import { createClient } from "@/lib/supabase"
import { DataTable } from "@/components/admin/data-table"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { deleteCaseStudy } from "./actions"

export default async function CaseStudiesAdmin() {
  const supabase = createClient()

  const { data: caseStudies } = await supabase
    .from("case_studies")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Manage Case Studies</h1>

      <DataTable
        data={caseStudies || []}
        columns={[
          {
            key: "title",
            header: "Title",
            cell: (caseStudy) => (
              <Link href={`/admin/case-studies/${caseStudy.id}/edit`} className="font-medium hover:underline">
                {caseStudy.title}
              </Link>
            ),
          },
          {
            key: "featured",
            header: "Featured",
            cell: (caseStudy) =>
              caseStudy.featured ? <Badge variant="default">Featured</Badge> : <span className="text-gray-500">-</span>,
          },
          {
            key: "created_at",
            header: "Created",
            cell: (caseStudy) => formatDate(caseStudy.created_at),
          },
        ]}
        createHref="/admin/case-studies/new"
        onDelete={deleteCaseStudy}
      />
    </div>
  )
}
