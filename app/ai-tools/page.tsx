import type { Metadata } from "next"
import { OpenAIChatAssistant } from "@/components/openai-chat-assistant"
import { OpenAIImageGenerator } from "@/components/openai-image-generator"
import { OpenAICodeAssistant } from "@/components/openai-code-assistant"
import { Brain, Sparkles, Code, ImageIcon, MessageSquare } from "lucide-react"

export const metadata: Metadata = {
  title: "AI Tools | Personal Portfolio",
  description: "Explore AI-powered tools integrated with OpenAI",
}

export default function AIToolsPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <div className="container px-4 py-16 mx-auto">
        <div className="max-w-4xl mx-auto mb-16 text-center">
          <div className="inline-block p-2 bg-cyan-500/10 rounded-full mb-4">
            <Brain className="h-8 w-8 text-cyan-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4">OpenAI-Powered Tools</h1>
          <p className="text-xl text-muted-foreground">
            Explore the capabilities of OpenAI through these interactive tools
          </p>
        </div>

        <div className="grid gap-16">
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/10">
                <Code className="h-5 w-5 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold">Code Assistant</h2>
            </div>
            <OpenAICodeAssistant />
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/10">
                <ImageIcon className="h-5 w-5 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold">Image Generator</h2>
            </div>
            <OpenAIImageGenerator />
          </section>

          <section className="mb-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/10">
                <MessageSquare className="h-5 w-5 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold">Chat Assistant</h2>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8 text-center">
              <Sparkles className="h-12 w-12 mx-auto text-cyan-400 mb-4" />
              <h3 className="text-xl font-medium mb-2">AI Chat Assistant</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                The OpenAI-powered chat assistant is available via the chat button in the bottom right corner of the
                screen. Click it to start a conversation with the AI assistant.
              </p>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute -right-2 -top-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                    </span>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg">
                    <MessageSquare className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* The chat assistant is always available */}
      <OpenAIChatAssistant />
    </main>
  )
}
