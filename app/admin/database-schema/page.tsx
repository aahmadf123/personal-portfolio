import { DatabaseSchemaViewer } from "@/components/admin/database-schema-viewer"

export default function DatabaseSchemaPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Database Schema</h1>
      <DatabaseSchemaViewer />
    </div>
  )
}
