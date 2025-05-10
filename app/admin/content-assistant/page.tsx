import { AdminAIAssistant } from "@/components/admin/admin-ai-assistant"

export const metadata = {
  title: "Content Assistant | Admin",
  description: "AI-powered content assistant for your portfolio",
}

export default function ContentAssistantPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">AI Content Assistant</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        Use AI to help create content, generate images, brainstorm ideas, and work with templates for your portfolio.
      </p>

      <AdminAIAssistant />
    </div>
  )
}
