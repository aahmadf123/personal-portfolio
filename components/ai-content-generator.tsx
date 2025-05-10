"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Sparkles, Copy, Check } from "lucide-react"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

type ContentType = "blog" | "project" | "bio"

export function AIContentGenerator() {
  const [prompt, setPrompt] = useState("")
  const [generatedContent, setGeneratedContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [contentType, setContentType] = useState<ContentType>("blog")
  const [copied, setCopied] = useState(false)

  const generateContent = async () => {
    if (!prompt.trim() || isGenerating) return

    setIsGenerating(true)
    setGeneratedContent("")

    try {
      let systemPrompt = ""

      switch (contentType) {
        case "blog":
          systemPrompt =
            "Generate a professional blog post about the following topic for a technical portfolio website focused on AI, quantum computing, and aerospace engineering:"
          break
        case "project":
          systemPrompt =
            "Create a detailed project description for a portfolio website, including objectives, technologies used, challenges, and outcomes:"
          break
        case "bio":
          systemPrompt =
            "Write a professional bio highlighting expertise in AI, quantum computing, and aerospace engineering based on the following information:"
          break
      }

      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: `${systemPrompt}\n\n${prompt}\n\nMake it professional, engaging, and technically accurate.`,
        maxTokens: 1000,
      })

      setGeneratedContent(text)
    } catch (error) {
      console.error("Error generating content:", error)
      setGeneratedContent("Error generating content. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card/30 backdrop-blur-sm">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">AI Content Generator</h2>
        <p className="text-muted-foreground mb-6">
          Generate professional content for your portfolio with AI assistance.
        </p>

        <Tabs defaultValue="blog" onValueChange={(value) => setContentType(value as ContentType)} className="mb-6">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="blog">Blog Post</TabsTrigger>
            <TabsTrigger value="project">Project Description</TabsTrigger>
            <TabsTrigger value="bio">Professional Bio</TabsTrigger>
          </TabsList>

          <TabsContent value="blog" className="mt-0">
            <p className="text-sm text-muted-foreground mb-4">
              Generate a professional blog post about AI, quantum computing, or aerospace engineering.
            </p>
          </TabsContent>

          <TabsContent value="project" className="mt-0">
            <p className="text-sm text-muted-foreground mb-4">
              Create a detailed project description including objectives, technologies, and outcomes.
            </p>
          </TabsContent>

          <TabsContent value="bio" className="mt-0">
            <p className="text-sm text-muted-foreground mb-4">
              Write a professional bio highlighting your expertise and accomplishments.
            </p>
          </TabsContent>
        </Tabs>

        <div className="space-y-4">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium mb-2">
              Your Prompt
            </label>
            <Textarea
              id="prompt"
              placeholder={
                contentType === "blog"
                  ? "Enter a topic or outline for your blog post..."
                  : contentType === "project"
                    ? "Describe your project idea or requirements..."
                    : "Provide key information about your background and expertise..."
              }
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <Button
            onClick={generateContent}
            disabled={isGenerating || !prompt.trim()}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Content
              </>
            )}
          </Button>

          {generatedContent && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">Generated Content</label>
                <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-8 px-2 text-xs">
                  {copied ? (
                    <>
                      <Check className="mr-1 h-3 w-3" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="mr-1 h-3 w-3" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <div className="p-4 bg-muted/30 rounded-md overflow-auto max-h-[400px]">
                <pre className="text-sm whitespace-pre-wrap">{generatedContent}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
