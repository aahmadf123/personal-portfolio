import { DocumentContentExtractor } from "@/components/admin/document-content-extractor"

export default function AIToolsPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">AI Content Tools</h1>
      <div className="grid gap-8">
        <DocumentContentExtractor />
      </div>
    </div>
  )
}
