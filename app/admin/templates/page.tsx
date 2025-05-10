import { TemplateManager } from "@/components/admin/template-manager"
import { CategoryManager } from "@/components/admin/category-manager"

export default function TemplatesPage() {
  return (
    <div className="container py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Template Management</h1>

      <CategoryManager />

      <TemplateManager />
    </div>
  )
}
