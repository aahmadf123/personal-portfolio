"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, FileText, Copy, Check, Save, RefreshCw } from "lucide-react"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

type ContentTarget = "bio" | "project" | "skill" | "experience" | "education" | "blog"
type ParsedContent = Record<string, any>

export function DocumentContentExtractor() {
  const [file, setFile] = useState<File | null>(null)
  const [extractedText, setExtractedText] = useState("")
  const [isExtracting, setIsExtracting] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [contentTarget, setContentTarget] = useState<ContentTarget>("bio")
  const [parsedContent, setParsedContent] = useState<ParsedContent>({})
  const [editedContent, setEditedContent] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setExtractedText("")
      setParsedContent({})
      setEditedContent("")
    }
  }

  const extractTextFromFile = async () => {
    if (!file) return

    setIsExtracting(true)
    setExtractedText("")

    try {
      // Create a FormData object to send the file
      const formData = new FormData()
      formData.append("file", file)

      // Send the file to the API for text extraction
      const response = await fetch("/api/admin/extract-document", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to extract text from document")
      }

      const data = await response.json()
      setExtractedText(data.text)
    } catch (error) {
      console.error("Error extracting text:", error)
      setExtractedText("Error extracting text from document. Please try again.")
    } finally {
      setIsExtracting(false)
    }
  }

  const processContent = async () => {
    if (!extractedText) return

    setIsProcessing(true)

    try {
      let prompt = ""

      switch (contentTarget) {
        case "bio":
          prompt = `Extract professional bio information from the following resume text. Format the response as JSON with fields for name, title, summary, highlights, and contact information:\n\n${extractedText}`
          break
        case "project":
          prompt = `Extract project information from the following text. Format the response as JSON with fields for title, description, technologies, challenges, outcomes, and dates:\n\n${extractedText}`
          break
        case "skill":
          prompt = `Extract technical skills from the following resume text. Format the response as JSON with categories like programming_languages, frameworks, tools, and domain_knowledge:\n\n${extractedText}`
          break
        case "experience":
          prompt = `Extract work experience from the following resume text. Format the response as JSON with an array of positions, each containing company, title, dates, responsibilities, and achievements:\n\n${extractedText}`
          break
        case "education":
          prompt = `Extract education information from the following resume text. Format the response as JSON with an array of education entries, each containing institution, degree, field, dates, and achievements:\n\n${extractedText}`
          break
        case "blog":
          prompt = `Generate a blog post outline based on the expertise shown in the following resume text. Format the response as JSON with fields for title, introduction, main_points (as an array), and conclusion:\n\n${extractedText}`
          break
      }

      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt,
        temperature: 0.3,
      })

      try {
        // Try to parse the response as JSON
        const jsonContent = JSON.parse(text)
        setParsedContent(jsonContent)
        setEditedContent(JSON.stringify(jsonContent, null, 2))
      } catch (e) {
        // If parsing fails, just use the text
        console.error("Failed to parse AI response as JSON:", e)
        setParsedContent({})
        setEditedContent(text)
      }
    } catch (error) {
      console.error("Error processing content:", error)
      setEditedContent("Error processing content. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(editedContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const resetForm = () => {
    setFile(null)
    setExtractedText("")
    setParsedContent({})
    setEditedContent("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const saveToDatabase = async () => {
    if (!editedContent) return

    setIsProcessing(true)

    try {
      const response = await fetch(`/api/admin/${contentTarget}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: editedContent,
      })

      if (!response.ok) {
        throw new Error(`Failed to save ${contentTarget} content`)
      }

      alert(`${contentTarget.charAt(0).toUpperCase() + contentTarget.slice(1)} content saved successfully!`)
    } catch (error) {
      console.error("Error saving content:", error)
      alert(`Error saving content: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Document Content Extractor</CardTitle>
        <CardDescription>
          Upload your resume or other documents to automatically extract and format content for your website
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <Label htmlFor="content-target">Select Content Target</Label>
            <Select value={contentTarget} onValueChange={(value) => setContentTarget(value as ContentTarget)}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bio">Professional Bio</SelectItem>
                <SelectItem value="project">Project Description</SelectItem>
                <SelectItem value="skill">Skills & Expertise</SelectItem>
                <SelectItem value="experience">Work Experience</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="blog">Blog Post Outline</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="document-upload">Upload Document</Label>
            <div className="flex items-center gap-2">
              <Input
                ref={fileInputRef}
                id="document-upload"
                type="file"
                accept=".pdf,.docx,.doc,.txt,.md"
                onChange={handleFileChange}
                className="flex-1"
              />
              <Button onClick={extractTextFromFile} disabled={!file || isExtracting} variant="outline">
                {isExtracting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Extracting...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Extract Text
                  </>
                )}
              </Button>
            </div>
            {file && (
              <p className="text-sm text-muted-foreground">
                Selected file: {file.name} ({Math.round(file.size / 1024)} KB)
              </p>
            )}
          </div>

          {extractedText && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Extracted Text</Label>
                <Button onClick={processContent} disabled={isProcessing} size="sm" variant="outline">
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-3 w-3" />
                      Process Content
                    </>
                  )}
                </Button>
              </div>
              <div className="p-3 bg-muted/30 rounded-md text-sm max-h-[200px] overflow-auto">{extractedText}</div>
            </div>
          )}

          {editedContent && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="processed-content">Processed Content</Label>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={copyToClipboard}>
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
              </div>
              <Tabs defaultValue="json" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="json">JSON</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="json" className="mt-2">
                  <Textarea
                    id="processed-content"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="font-mono text-sm h-[300px]"
                  />
                </TabsContent>
                <TabsContent value="preview" className="mt-2">
                  <div className="border rounded-md p-4 h-[300px] overflow-auto">
                    <ContentPreview content={parsedContent} type={contentTarget} />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </CardContent>
      {editedContent && (
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={resetForm}>
            Reset
          </Button>
          <Button onClick={saveToDatabase} disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save to Website
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

// Component to preview the parsed content based on its type
function ContentPreview({ content, type }: { content: Record<string, any>; type: ContentTarget }) {
  if (!content || Object.keys(content).length === 0) {
    return <p className="text-muted-foreground italic">No content to preview</p>
  }

  switch (type) {
    case "bio":
      return (
        <div className="space-y-4">
          {content.name && <h2 className="text-2xl font-bold">{content.name}</h2>}
          {content.title && <p className="text-lg text-cyan-500">{content.title}</p>}
          {content.summary && <p>{content.summary}</p>}
          {content.highlights && content.highlights.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Highlights</h3>
              <ul className="list-disc pl-5 space-y-1">
                {content.highlights.map((highlight: string, i: number) => (
                  <li key={i}>{highlight}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )

    case "project":
      return (
        <div className="space-y-4">
          {content.title && <h2 className="text-2xl font-bold">{content.title}</h2>}
          {content.description && <p>{content.description}</p>}
          {content.technologies && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(content.technologies) ? (
                  content.technologies.map((tech: string, i: number) => (
                    <span key={i} className="px-2 py-1 bg-cyan-100 text-cyan-800 rounded-full text-sm">
                      {tech}
                    </span>
                  ))
                ) : (
                  <p>{content.technologies}</p>
                )}
              </div>
            </div>
          )}
          {content.challenges && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Challenges</h3>
              {Array.isArray(content.challenges) ? (
                <ul className="list-disc pl-5 space-y-1">
                  {content.challenges.map((challenge: string, i: number) => (
                    <li key={i}>{challenge}</li>
                  ))}
                </ul>
              ) : (
                <p>{content.challenges}</p>
              )}
            </div>
          )}
        </div>
      )

    case "skill":
      return (
        <div className="space-y-4">
          {Object.entries(content).map(([category, skills]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-2 capitalize">{category.replace(/_/g, " ")}</h3>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(skills) ? (
                  skills.map((skill: string, i: number) => (
                    <span key={i} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p>{String(skills)}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )

    case "experience":
      return (
        <div className="space-y-6">
          {Array.isArray(content) ? (
            content.map((job: any, i: number) => (
              <div key={i} className="border-l-2 border-cyan-500 pl-4">
                <h3 className="text-lg font-bold">{job.title}</h3>
                <h4 className="text-md">{job.company}</h4>
                <p className="text-sm text-muted-foreground">{job.dates}</p>
                {job.responsibilities && (
                  <div className="mt-2">
                    <h5 className="text-sm font-semibold">Responsibilities</h5>
                    <ul className="list-disc pl-5 text-sm">
                      {Array.isArray(job.responsibilities) ? (
                        job.responsibilities.map((resp: string, j: number) => <li key={j}>{resp}</li>)
                      ) : (
                        <li>{job.responsibilities}</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="border-l-2 border-cyan-500 pl-4">
              <h3 className="text-lg font-bold">{content.title || "Position"}</h3>
              <h4 className="text-md">{content.company || "Company"}</h4>
              <p className="text-sm text-muted-foreground">{content.dates || "Dates"}</p>
            </div>
          )}
        </div>
      )

    case "education":
      return (
        <div className="space-y-6">
          {Array.isArray(content) ? (
            content.map((edu: any, i: number) => (
              <div key={i} className="border-l-2 border-pink-500 pl-4">
                <h3 className="text-lg font-bold">{edu.institution}</h3>
                <h4 className="text-md">
                  {edu.degree} in {edu.field}
                </h4>
                <p className="text-sm text-muted-foreground">{edu.dates}</p>
              </div>
            ))
          ) : (
            <div className="border-l-2 border-pink-500 pl-4">
              <h3 className="text-lg font-bold">{content.institution || "Institution"}</h3>
              <h4 className="text-md">
                {content.degree || "Degree"} in {content.field || "Field"}
              </h4>
              <p className="text-sm text-muted-foreground">{content.dates || "Dates"}</p>
            </div>
          )}
        </div>
      )

    case "blog":
      return (
        <div className="space-y-4">
          {content.title && <h2 className="text-2xl font-bold">{content.title}</h2>}
          {content.introduction && (
            <div>
              <h3 className="text-lg font-semibold mb-1">Introduction</h3>
              <p>{content.introduction}</p>
            </div>
          )}
          {content.main_points && Array.isArray(content.main_points) && (
            <div>
              <h3 className="text-lg font-semibold mb-1">Main Points</h3>
              <ol className="list-decimal pl-5 space-y-2">
                {content.main_points.map((point: string, i: number) => (
                  <li key={i}>{point}</li>
                ))}
              </ol>
            </div>
          )}
          {content.conclusion && (
            <div>
              <h3 className="text-lg font-semibold mb-1">Conclusion</h3>
              <p>{content.conclusion}</p>
            </div>
          )}
        </div>
      )

    default:
      return <pre className="text-sm">{JSON.stringify(content, null, 2)}</pre>
  }
}
