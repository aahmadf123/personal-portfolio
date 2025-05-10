"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Loader2, Send, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  contentTemplates,
  type ContentTemplate,
  type ContentCategory,
  getAllCategories,
} from "@/data/content-templates"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

type Message = {
  role: "user" | "assistant" | "system"
  content: string
}

export function ContentAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi there! I'm your content assistant. I can help you create, edit, or brainstorm content for your portfolio. What would you like help with today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all")
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null)
  const [allCategories, setAllCategories] = useState<ContentCategory[]>([])
  const [allTemplates, setAllTemplates] = useState<ContentTemplate[]>(contentTemplates)
  const [searchTerm, setSearchTerm] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load all categories and templates on component mount
  useEffect(() => {
    setAllCategories(getAllCategories())

    // Load templates from localStorage if available
    const storedTemplates = localStorage.getItem("contentTemplates")
    if (storedTemplates) {
      try {
        setAllTemplates(JSON.parse(storedTemplates))
      } catch (e) {
        console.error("Failed to parse stored templates", e)
      }
    }
  }, [])

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    try {
      // Call the admin assistant API endpoint
      const response = await fetch("/api/admin/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMessage }],
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response || "I'm sorry, I couldn't process your request at this time.",
        },
      ])
    } catch (error) {
      console.error("Error:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm sorry, I encountered an error while processing your request. Please try again later.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Hi there! I'm your content assistant. I can help you create, edit, or brainstorm content for your portfolio. What would you like help with today?",
      },
    ])
  }

  const openTemplateDialog = () => {
    setTemplateDialogOpen(true)
    setSelectedCategoryId("all")
    setSearchTerm("")
  }

  const closeTemplateDialog = () => {
    setTemplateDialogOpen(false)
    setSelectedTemplate(null)
  }

  const applyTemplate = () => {
    if (selectedTemplate) {
      setInput(selectedTemplate.template)
      closeTemplateDialog()
    }
  }

  const filteredTemplates = allTemplates.filter((template) => {
    // Filter by selected category
    const categoryMatch = selectedCategoryId === "all" || template.categoryIds.includes(selectedCategoryId)

    // Filter by search term
    const searchMatch =
      searchTerm === "" ||
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase())

    return categoryMatch && searchMatch
  })

  const handleTemplateSelect = (templateId: string) => {
    const template = allTemplates.find((t) => t.id === templateId)
    if (template) {
      setSelectedTemplate(template)
    }
  }

  const getCategoryById = (categoryId: string) => {
    return allCategories.find((cat) => cat.id === categoryId)
  }

  return (
    <>
      <Card className="w-full h-[700px] max-h-[80vh] flex flex-col">
        <CardHeader>
          <CardTitle>Content Assistant</CardTitle>
          <CardDescription>Ask for help with creating or editing content for your portfolio</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </CardContent>
        <CardFooter className="border-t p-4">
          <form onSubmit={handleSubmit} className="w-full space-y-2">
            <div className="flex justify-between items-center mb-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={openTemplateDialog}
                className="flex items-center gap-1"
              >
                <FileText className="h-4 w-4" />
                Use Template
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={clearChat}>
                Clear Chat
              </Button>
            </div>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for help with content creation, editing, or ideas..."
              className="min-h-[150px] resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.metaKey) {
                  handleSubmit(e)
                }
              }}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={!input.trim() || isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                Send
              </Button>
            </div>
          </form>
        </CardFooter>
      </Card>

      <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Content Templates</DialogTitle>
            <DialogDescription>Choose a template to get started with your content creation</DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-hidden">
            <div className="mb-4 flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
              <div className="flex-1">
                <Tabs defaultValue="all" value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                  <TabsList className="mb-4 flex flex-wrap">
                    <TabsTrigger value="all">All Categories</TabsTrigger>
                    {allCategories.map((category) => (
                      <TabsTrigger key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                          {category.name}
                        </div>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto max-h-[50vh] p-1">
              {filteredTemplates.map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all ${
                    selectedTemplate?.id === template.id ? "ring-2 ring-purple-500 shadow-lg" : "hover:shadow-md"
                  }`}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {template.categoryIds.map((catId) => {
                        const category = getCategoryById(catId)
                        return category ? (
                          <Badge
                            key={catId}
                            variant="outline"
                            style={{
                              borderColor: category.color,
                              color: category.color,
                            }}
                          >
                            {category.name}
                          </Badge>
                        ) : null
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {selectedTemplate && (
            <div className="mt-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-900 max-h-[200px] overflow-y-auto">
              <h4 className="font-medium mb-2">Preview:</h4>
              <pre className="text-sm whitespace-pre-wrap font-mono text-gray-700 dark:text-gray-300">
                {selectedTemplate.template.substring(0, 300)}
                {selectedTemplate.template.length > 300 ? "..." : ""}
              </pre>
            </div>
          )}

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={closeTemplateDialog}>
              Cancel
            </Button>
            <Button onClick={applyTemplate} disabled={!selectedTemplate}>
              Use Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
