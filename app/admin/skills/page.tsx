import { createClient } from "@/lib/supabase"
import { DataTable } from "@/components/admin/data-table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { deleteSkill } from "./actions"

export default async function SkillsAdmin() {
  const supabase = createClient()

  const { data: skills } = await supabase
    .from("skills")
    .select("*")
    .order("category")
    .order("level", { ascending: false })

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Manage Skills</h1>

      <DataTable
        data={skills || []}
        columns={[
          {
            key: "name",
            header: "Name",
            cell: (skill) => (
              <Link href={`/admin/skills/${skill.id}/edit`} className="font-medium hover:underline">
                {skill.name}
              </Link>
            ),
          },
          {
            key: "category",
            header: "Category",
            cell: (skill) => (
              <Badge
                variant="outline"
                style={{ backgroundColor: `var(--${skill.color}-100)`, color: `var(--${skill.color}-800)` }}
              >
                {skill.category}
              </Badge>
            ),
          },
          {
            key: "level",
            header: "Level",
            cell: (skill) => (
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full"
                  style={{
                    width: `${skill.level}%`,
                    backgroundColor: `var(--${skill.color}-500)`,
                  }}
                ></div>
              </div>
            ),
          },
          {
            key: "featured",
            header: "Featured",
            cell: (skill) =>
              skill.featured ? <Badge variant="default">Featured</Badge> : <span className="text-gray-500">-</span>,
          },
        ]}
        createHref="/admin/skills/new"
        onDelete={deleteSkill}
      />
    </div>
  )
}
