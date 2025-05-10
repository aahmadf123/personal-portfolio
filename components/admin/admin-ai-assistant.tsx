"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Tabs, TabsList } from "@/components/ui/tabs"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  contentTemplates,
  type ContentTemplate,
  type ContentCategory,
  getAllCategories,
} from "@/data/content-templates"

type Message = {
  role: "user" | "assistant" | "system"
  content: string
}

export function AdminAIAssistant() {
  // Toast notification
  const { toast } = useToast()

  // Chat state
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your admin AI assistant. I can help you create content, generate images, brainstorm ideas, and work with templates. How can I assist you today?",
    },
  ])
  const [chatInput, setChatInput] = useState("")
  const [isChatLoading, setIsChatLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Content generator state
  const [contentType, setContentType] = useState("blog-post")
  const [contentTopic, setContentTopic] = useState("")
  const [contentLength, setContentLength] = useState(500)
  const [contentTone, setContentTone] = useState("professional")
  const [generatedContent, setGeneratedContent] = useState("")
  const [isGeneratingContent, setIsGeneratingContent] = useState(false)
  const [contentCopied, setContentCopied] = useState(false)

  // Image generator state
  const [imagePrompt, setImagePrompt] = useState("")
  const [imageStyle, setImageStyle] = useState("photorealistic")
  const [imageSize, setImageSize] = useState("1024x1024")
  const [imageQuality, setImageQuality] = useState("standard")
  const [generatedImageUrl, setGeneratedImageUrl] = useState("")
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)

  // Idea brainstorming state
  const [ideaType, setIdeaType] = useState("blog-ideas")
  const [ideaTopic, setIdeaTopic] = useState("")
  const [generatedIdeas, setGeneratedIdeas] = useState<string[]>([])
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false)

  // Template integration state
  const [allTemplates, setAllTemplates] = useState<ContentTemplate[]>(contentTemplates)
  const [allCategories, setAllCategories] = useState<ContentCategory[]>([])
  const [selectedTemplateId, setSelectedTemplateId] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null)
  const [templateContent, setTemplateContent] = useState("")
  const [templatePrompt, setTemplatePrompt] = useState("")
  const [isGeneratingTemplateContent, setIsGeneratingTemplateContent] = useState(false)
  const [templateSearchTerm, setTemplateSearchTerm] = useState("")
  const [selectedCategoryId, setSelectedCategoryId] = useState("all")
  const [newTemplateName, setNewTemplateName] = useState("")
  const [newTemplateDescription, setNewTemplateDescription] = useState("")
  const [newTemplateCategoryIds, setNewTemplateCategoryIds] = useState<string[]>([])
  const [isSavingTemplate, setIsSavingTemplate] = useState(false)

  // Load templates and categories on mount
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

  // Auto-scroll chat to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Update selected template when ID changes
  useEffect(() => {
    if (selectedTemplateId) {
      const template = allTemplates.find((t) => t.id === selectedTemplateId)
      if (template) {
        setSelectedTemplate(template)
        setTemplateContent(template.template)
        // Set default prompt based on template
        setTemplatePrompt(
          `Help me create content for "${template.name}" about ${
            contentTopic || "[my topic]"
          }. The content should be in a ${contentTone} tone.`,
        )
        // Set default category IDs for new template
        setNewTemplateCategoryIds(template.categoryIds)
      }
    } else {
      setSelectedTemplate(null)
      setTemplateContent("")
      setTemplatePrompt("")
    }
  }, [selectedTemplateId, allTemplates, contentTopic, contentTone])

  // Filter templates based on search and category
  const filteredTemplates = allTemplates.filter((template) => {
    // Filter by selected category
    const categoryMatch = selectedCategoryId === "all" || template.categoryIds.includes(selectedCategoryId)

    // Filter by search term
    const searchMatch =
      templateSearchTerm === "" ||
      template.name.toLowerCase().includes(templateSearchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(templateSearchTerm.toLowerCase())

    return categoryMatch && searchMatch
  })

  // Chat functions
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim() || isChatLoading) return

    const userMessage = chatInput.trim()
    setChatInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsChatLoading(true)

    try {
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
      setIsChatLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Hello! I'm your admin AI assistant. I can help you create content, generate images, brainstorm ideas, and work with templates. How can I assist you today?",
      },
    ])
  }

  // Content generator functions
  const generateContent = async () => {
    if (!contentTopic.trim() || isGeneratingContent) return

    setIsGeneratingContent(true)
    setGeneratedContent("")

    try {
      const response = await fetch("/api/admin/content-generator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: contentType,
          topic: contentTopic,
          length: contentLength,
          tone: contentTone,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate content")
      }

      const data = await response.json()
      setGeneratedContent(data.content || "Failed to generate content. Please try again.")
    } catch (error) {
      console.error("Error generating content:", error)
      setGeneratedContent("An error occurred while generating content. Please try again later.")
    } finally {
      setIsGeneratingContent(false)
    }
  }

  const copyContent = () => {
    navigator.clipboard.writeText(generatedContent)
    setContentCopied(true)
    setTimeout(() => setContentCopied(false), 2000)
    toast({
      title: "Content copied",
      description: "The generated content has been copied to your clipboard.",
    })
  }

  // Image generator functions
  const generateImage = async () => {
    if (!imagePrompt.trim() || isGeneratingImage) return

    setIsGeneratingImage(true)
    setGeneratedImageUrl("")

    try {
      const response = await fetch("/api/admin/image-generator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: imagePrompt,
          style: imageStyle,
          size: imageSize,
          quality: imageQuality,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate image")
      }

      const data = await response.json()
      setGeneratedImageUrl(data.imageUrl || "")
    } catch (error) {
      console.error("Error generating image:", error)
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingImage(false)
    }
  }

  const downloadImage = async () => {
    if (!generatedImageUrl) return

    try {
      const response = await fetch(generatedImageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `generated-image-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error downloading image:", error)
      toast({
        title: "Error",
        description: "Failed to download image. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Idea brainstorming functions
  const generateIdeas = async () => {
    if (isGeneratingIdeas) return

    setIsGeneratingIdeas(true)
    setGeneratedIdeas([])

    try {
      const response = await fetch("/api/admin/content-generator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: ideaType,
          topic: ideaTopic || "general",
          format: "ideas",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate ideas")
      }

      const data = await response.json()
      if (data.ideas && Array.isArray(data.ideas)) {
        setGeneratedIdeas(data.ideas)
      } else if (data.content) {
        // Parse content as ideas if it's a string
        const ideasArray = data.content
          .split("\n")
          .filter((line: string) => line.trim().length > 0)
          .map((line: string) => line.replace(/^\d+\.\s*/, "").trim())
        setGeneratedIdeas(ideasArray)
      } else {
        setGeneratedIdeas([])
        toast({
          title: "Error",
          description: "Failed to generate ideas in the expected format.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error generating ideas:", error)
      toast({
        title: "Error",
        description: "Failed to generate ideas. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingIdeas(false)
    }
  }

  const useIdea = (idea: string) => {
    setContentTopic(idea)
    toast({
      title: "Idea selected",
      description: "The idea has been added to the content generator.",
    })
  }

  // Template functions
  const generateTemplateContent = async () => {
    if (!selectedTemplate || !templatePrompt.trim() || isGeneratingTemplateContent) return

    setIsGeneratingTemplateContent(true)

    try {
      const response = await fetch("/api/admin/content-generator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "template-content",
          template: selectedTemplate,
          prompt: templatePrompt,
          tone: contentTone,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate template content")
      }

      const data = await response.json()
      if (data.content) {
        setTemplateContent(data.content)
      } else {
        toast({
          title: "Error",
          description: "Failed to generate template content.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error generating template content:", error)
      toast({
        title: "Error",
        description: "Failed to generate template content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingTemplateContent(false)
    }
  }

  const saveAsNewTemplate = async () => {
    if (!templateContent.trim() || !newTemplateName.trim() || isSavingTemplate) return

    if (newTemplateCategoryIds.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one category for the template.",
        variant: "destructive",
      })
      return
    }

    setIsSavingTemplate(true)

    try {
      const newTemplate: ContentTemplate = {
        id: `template-${Date.now()}`,
        name: newTemplateName,
        description: newTemplateDescription || `AI-generated template for ${newTemplateName}`,
        category: newTemplateCategoryIds[0], // For backward compatibility
        categoryIds: newTemplateCategoryIds,
        template: templateContent,
      }

      // Add to templates array
      const updatedTemplates = [...allTemplates, newTemplate]
      setAllTemplates(updatedTemplates)

      // Save to localStorage
      localStorage.setItem("contentTemplates", JSON.stringify(updatedTemplates))

      toast({
        title: "Template saved",
        description: "Your new template has been saved successfully.",
      })

      // Reset form
      setNewTemplateName("")
      setNewTemplateDescription("")
    } catch (error) {
      console.error("Error saving template:", error)
      toast({
        title: "Error",
        description: "Failed to save template. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSavingTemplate(false)
    }
  }

  const copyTemplateContent = () => {
    navigator.clipboard.writeText(templateContent)
    toast({
      title: "Content copied",
      description: "The template content has been copied to your clipboard.",
    })
  }

  const toggleCategorySelection = (categoryId: string) => {
    setNewTemplateCategoryIds((prev) => {
      if (prev.includes(categoryId)) {
        // Don't allow removing the last category
        if (prev.length === 1) return prev
        return prev.filter((id) => id !== categoryId)
      } else {
        return [...prev, categoryId]
      }
    })
  }

  return (
    <Card className="w-full border-gray-800 bg-gradient-to-b from-gray-900 to-black text-white">
      <CardHeader className="border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Admin AI Assistant</CardTitle>
            <CardDescription className="text-gray-400">
              Your AI-powered assistant for content creation and management
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-blue-900/30 text-blue-400 border-blue-800">
            Admin Only
          </Badge>
        </div>
      </CardHeader>

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="w-full grid grid-cols-4 bg-gray-800 rounded-none border-b border-gray-700">
          {/* Chat Assistant Tab */}
          {/* Content Generator Tab */}
          {/* Image Generator Tab */}
          {/* Idea Brainstorming Tab */}
        </TabsList>

        {/* Chat Assistant Tab */}
        {/* Content Generator Tab */}
        {/* Image Generator Tab */}
        {/* Idea Brainstorming Tab */}
      </Tabs>
    </Card>
  )
}
