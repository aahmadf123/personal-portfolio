import { DocumentUploader } from "@/components/admin/document-uploader"

export default function DocumentsPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Document Management</h1>
      <p className="text-muted-foreground mb-8">
        Upload and manage documents like your resume, certificates, or other files you want to make available for
        download.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <DocumentUploader />
      </div>
    </div>
  )
}
