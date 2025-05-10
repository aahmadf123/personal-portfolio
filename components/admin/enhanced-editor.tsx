"use client"

import { useState, useEffect, useRef } from "react"
import ReactMarkdown from "react-markdown"
import { Button } from "@/components/ui/button"
import {
  Bold,
  Italic,
  LinkIcon,
  List,
  ListOrdered,
  ImageIcon,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  EyeIcon,
  Edit3,
  Columns,
  RotateCcw,
  Save,
  ImageIcon as ImageLucide,
} from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ImageGalleryPicker } from "./image-gallery-picker"
// Note: You would normally import 'react-image-crop/dist/ReactCrop.css' here,
// but for this implementation we'll assume it's imported in globals.css

interface EnhancedEditorProps {
  initialValue: string
  onChange: (value: string) => void
  onSave?: () => void
  height?: string
  placeholder?: string
}

export function EnhancedEditor({
  initialValue = "",
  onChange,
  onSave,
  height = "600px",
  placeholder = "Write your content here...",
}: EnhancedEditorProps) {
  const [content, setContent] = useState(initialValue)
  const [viewMode, setViewMode] = useState<"edit" | "preview" | "split">("edit")
  const [selection, setSelection] = useState<{ start: number; end: number }>({ start: 0, end: 0 })
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [undoStack, setUndoStack] = useState<string[]>([initialValue])
  const [undoIndex, setUndoIndex] = useState(0)
  const [imageUrl, setImageUrl] = useState("")
  const [imageAlt, setImageAlt] = useState("")
  const [linkUrl, setLinkUrl] = useState("")
  const [linkText, setLinkText] = useState("")
  const [previewKey, setPreviewKey] = useState(0)
  const [galleryOpen, setGalleryOpen] = useState(false)

  useEffect(() => {
    onChange(content)
  }, [content, onChange])

  // Refresh preview when content changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setPreviewKey((prev) => prev + 1)
    }, 500)

    return () => clearTimeout(timer)
  }, [content])

  const saveSelection = () => {
    if (textareaRef.current) {
      setSelection({
        start: textareaRef.current.selectionStart,
        end: textareaRef.current.selectionEnd,
      })
    }
  }

  const insertText = (before: string, after = "") => {
    saveSelection()
    const newContent =
      content.substring(0, selection.start) +
      before +
      content.substring(selection.start, selection.end) +
      after +
      content.substring(selection.end)

    pushToUndoStack(newContent)

    // Set cursor position after insertion
    setTimeout(() => {
      if (textareaRef.current) {
        const newPosition = selection.start + before.length + (selection.end - selection.start) + after.length
        textareaRef.current.focus()
        textareaRef.current.setSelectionRange(newPosition, newPosition)
      }
    }, 0)
  }

  const pushToUndoStack = (newContent: string) => {
    // Remove any redo states
    const newStack = undoStack.slice(0, undoIndex + 1)
    newStack.push(newContent)

    setUndoStack(newStack)
    setUndoIndex(newStack.length - 1)
    setContent(newContent)
  }

  const handleUndo = () => {
    if (undoIndex > 0) {
      setUndoIndex(undoIndex - 1)
      setContent(undoStack[undoIndex - 1])
    }
  }

  const handleRedo = () => {
    if (undoIndex < undoStack.length - 1) {
      setUndoIndex(undoIndex + 1)
      setContent(undoStack[undoIndex + 1])
    }
  }

  const insertImage = () => {
    if (imageUrl) {
      insertText(`![${imageAlt}](${imageUrl})`)
      setImageUrl("")
      setImageAlt("")
    }
  }

  const insertLink = () => {
    if (linkUrl) {
      const text = linkText || linkUrl
      insertText(`[${text}](${linkUrl})`)
      setLinkUrl("")
      setLinkText("")
    }
  }

  const handleSelectFromGallery = (url: string, alt?: string) => {
    insertText(`![${alt || "Image"}](${url})`)
  }

  return (
    <div className="border rounded-md bg-card">
      <div className="flex items-center justify-between p-2 border-b">
        <div className="flex items-center space-x-1">
          <TooltipProvider>
            <div className="flex items-center space-x-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => insertText("**", "**")}>
                    <Bold className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Bold</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => insertText("*", "*")}>
                    <Italic className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Italic</TooltipContent>
              </Tooltip>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Insert Link</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="link-url">URL</Label>
                      <Input
                        id="link-url"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        placeholder="https://example.com"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="link-text">Text (optional)</Label>
                      <Input
                        id="link-text"
                        value={linkText}
                        onChange={(e) => setLinkText(e.target.value)}
                        placeholder="Link text"
                      />
                    </div>
                  </div>
                  <DialogClose asChild>
                    <Button onClick={insertLink}>Insert Link</Button>
                  </DialogClose>
                </DialogContent>
              </Dialog>

              <div className="flex items-center space-x-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => setGalleryOpen(true)}>
                      <ImageLucide className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Image Gallery</TooltipContent>
                </Tooltip>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Insert Image</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="image-url">Image URL</Label>
                        <Input
                          id="image-url"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="image-alt">Alt Text</Label>
                        <Input
                          id="image-alt"
                          value={imageAlt}
                          onChange={(e) => setImageAlt(e.target.value)}
                          placeholder="Image description"
                        />
                      </div>
                    </div>
                    <DialogClose asChild>
                      <Button onClick={insertImage}>Insert Image</Button>
                    </DialogClose>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="h-4 border-r mx-1" />

            <div className="flex items-center space-x-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => insertText("# ")}>
                    <Heading1 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Heading 1</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => insertText("## ")}>
                    <Heading2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Heading 2</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => insertText("### ")}>
                    <Heading3 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Heading 3</TooltipContent>
              </Tooltip>
            </div>

            <div className="h-4 border-r mx-1" />

            <div className="flex items-center space-x-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => insertText("- ")}>
                    <List className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Bullet List</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => insertText("1. ")}>
                    <ListOrdered className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Numbered List</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => insertText("> ")}>
                    <Quote className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Quote</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => insertText("```\n", "\n```")}>
                    <Code className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Code Block</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>

        <div className="flex items-center space-x-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleUndo} disabled={undoIndex === 0}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode("edit")}
                data-active={viewMode === "edit"}
                className={viewMode === "edit" ? "bg-muted" : ""}
              >
                <Edit3 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit Mode</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode("preview")}
                data-active={viewMode === "preview"}
                className={viewMode === "preview" ? "bg-muted" : ""}
              >
                <EyeIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Preview Mode</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode("split")}
                data-active={viewMode === "split"}
                className={viewMode === "split" ? "bg-muted" : ""}
              >
                <Columns className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Split View</TooltipContent>
          </Tooltip>

          {onSave && (
            <>
              <div className="h-4 border-r mx-1" />
              <Button size="sm" onClick={onSave}>
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="p-0">
        {viewMode === "edit" && (
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => {
              const newContent = e.target.value
              pushToUndoStack(newContent)
            }}
            onClick={saveSelection}
            onKeyUp={saveSelection}
            placeholder={placeholder}
            className="min-h-[100px] font-mono border-0 rounded-none resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
            style={{ height }}
          />
        )}

        {viewMode === "preview" && (
          <div key={previewKey} className="prose dark:prose-invert max-w-none p-4 overflow-auto" style={{ height }}>
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}

        {viewMode === "split" && (
          <div className="grid grid-cols-2 h-full">
            <Textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => {
                const newContent = e.target.value
                pushToUndoStack(newContent)
              }}
              onClick={saveSelection}
              onKeyUp={saveSelection}
              placeholder={placeholder}
              className="min-h-[100px] font-mono border-0 rounded-none resize-none focus-visible:ring-0 focus-visible:ring-offset-0 border-r"
              style={{ height }}
            />
            <div key={previewKey} className="prose dark:prose-invert max-w-none p-4 overflow-auto" style={{ height }}>
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      <ImageGalleryPicker open={galleryOpen} onOpenChange={setGalleryOpen} onSelectImage={handleSelectFromGallery} />
    </div>
  )
}
