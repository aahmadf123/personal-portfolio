"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import ReactMarkdown from "react-markdown"

interface MarkdownEditorProps {
  name: string
  defaultValue?: string
  placeholder?: string
  rows?: number
  required?: boolean
}

export function MarkdownEditor({
  name,
  defaultValue = "",
  placeholder = "Write your content here...",
  rows = 10,
  required = false,
}: MarkdownEditorProps) {
  const [content, setContent] = useState(defaultValue)

  return (
    <Tabs defaultValue="write">
      <TabsList className="mb-2">
        <TabsTrigger value="write">Write</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>
      <TabsContent value="write">
        <Textarea
          name={name}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          required={required}
          className="font-mono"
        />
      </TabsContent>
      <TabsContent value="preview">
        <div className="border rounded-md p-4 min-h-[200px] prose max-w-none">
          {content ? (
            <ReactMarkdown>{content}</ReactMarkdown>
          ) : (
            <p className="text-gray-400 italic">No content to preview</p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  )
}
