import { DocumentContentExtractor } from "@/components/admin/document-content-extractor";
import { Suspense } from "react";

export default function AIToolsPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">AI Content Tools</h1>
      <div className="grid gap-8">
        <Suspense fallback={<div>Loading...</div>}>
          <DocumentContentExtractor />
        </Suspense>
      </div>
    </div>
  );
}
