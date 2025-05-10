"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  contentTemplates,
  type ContentTemplate,
  type ContentCategory,
  getAllCategories,
  defaultCategories,
} from "@/data/content-templates"

export function TemplateManager() {
  const [templates, setTemplates] = useState<ContentTemplate[]>(contentTemplates)
  const [allCategories, setAllCategories] = useState<ContentCategory[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all")
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [currentTemplate, setCurrentTemplate] = useState<ContentTemplate | null>(null)
  const [isNewTemplate, setIsNewTemplate] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([])

  // Load all categories on component mount
  useEffect(() => {
    setAllCategories(getAllCategories())
  }, [])

  // Save templates to localStorage when they change
  useEffect(() => {
    if (templates.length > 0) {
      localStorage.setItem("contentTemplates", JSON.stringify(templates))
    }
  }, [templates])

  // Load templates from localStorage on component mount
  useEffect(() => {
    const storedTemplates = localStorage.getItem("contentTemplates")
    if (storedTemplates) {
      try {
        setTemplates(JSON.parse(storedTemplates))
      } catch (e) {
        console.error("Failed to parse stored templates", e)
      }
    }
  }, [])

  const filteredTemplates = templates.filter((template) => {
    // Filter by selected category
    const categoryMatch = selectedCategoryId === "all" || template.categoryIds.includes(selectedCategoryId)

    // Filter by search term
    const searchMatch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase())

    return categoryMatch && searchMatch
  })

  const handleEditTemplate = (template: ContentTemplate) => {
    setCurrentTemplate(template)
    setSelectedCategoryIds(template.categoryIds)
    setIsNewTemplate(false)
    setEditDialogOpen(true)
  }

  const handleCreateTemplate = () => {
    const newId = `template-${Date.now()}`
    const initialCategoryId = selectedCategoryId === "all" ? defaultCategories[0].id : selectedCategoryId
    const newTemplate: ContentTemplate = {
      id: newId,
      name: "",
      description: "",
      category: initialCategoryId, // For backward compatibility
      categoryIds: [initialCategoryId],
      template: "",
    }
    setCurrentTemplate(newTemplate)
    setSelectedCategoryIds([initialCategoryId])
    setIsNewTemplate(true)
    setEditDialogOpen(true)
  }

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      setTemplates(templates.filter((t) => t.id !== templateId))
    }
  }

  const handleSaveTemplate = () => {
    if (!currentTemplate || selectedCategoryIds.length === 0) return

    const updatedTemplate = {
      ...currentTemplate,
      categoryIds: selectedCategoryIds,
      category: selectedCategoryIds[0], // For backward compatibility
    }

    if (isNewTemplate) {
      setTemplates([...templates, updatedTemplate])
    } else {
      setTemplates(templates.map((t) => (t.id === updatedTemplate.id ? updatedTemplate : t)))
    }

    setEditDialogOpen(false)
    setCurrentTemplate(null)
  }

  const updateTemplateField = (field: keyof ContentTemplate, value: string) => {
    if (!currentTemplate) return
    setCurrentTemplate({
      ...currentTemplate,
      [field]: value,
    })
  }

  const toggleCategorySelection = (categoryId: string) => {
    setSelectedCategoryIds((prev) => {
      if (prev.includes(categoryId)) {
        // Don't allow removing the last category
        if (prev.length === 1) return prev
        return prev.filter((id) => id !== categoryId)
      } else {
        return [...prev, categoryId]
      }
    })
  }

  const getCategoryById = (categoryId: string) => {
    return allCategories.find((cat) => cat.id === categoryId)
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Content Templates</CardTitle>
              <CardDescription>Manage your content templates</CardDescription>
            </div>
            <Button onClick={handleCreateTemplate}>
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </Button>
          </div>
        </CardHeader>
        <CardContent>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="overflow-hidden">
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
                  <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded-md max-h-[100px] overflow-hidden text-xs font-mono">
                    {template.template.substring(0, 150)}
                    {template.template.length > 150 ? "..." : ""}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditTemplate(template)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteTemplate(template.id)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{isNewTemplate ? "Create New Template" : "Edit Template"}</DialogTitle>
            <DialogDescription>
              {isNewTemplate
                ? "Create a new content template for your portfolio"
                : "Edit your existing content template"}
            </DialogDescription>
          </DialogHeader>

          {currentTemplate && (
            <div className="grid grid-cols-1 gap-4 mt-4 overflow-y-auto pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Template Name</label>
                  <Input
                    value={currentTemplate.name}
                    onChange={(e) => updateTemplateField("name", e.target.value)}
                    placeholder="Template name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Categories</label>
                  <div className="border rounded-md p-2 max-h-[150px] overflow-y-auto">
                    <div className="space-y-2">
                      {allCategories.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${category.id}`}
                            checked={selectedCategoryIds.includes(category.id)}
                            onCheckedChange={() => toggleCategorySelection(category.id)}
                          />
                          <label
                            htmlFor={`category-${category.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                          >
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                            {category.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Description</label>
                <Input
                  value={currentTemplate.description}
                  onChange={(e) => updateTemplateField("description", e.target.value)}
                  placeholder="Brief description of this template"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Template Content</label>
                <Textarea
                  value={currentTemplate.template}
                  onChange={(e) => updateTemplateField("template", e.target.value)}
                  placeholder="Enter your template content here..."
                  className="min-h-[300px] font-mono"
                />
              </div>
            </div>
          )}

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSaveTemplate} disabled={!currentTemplate || selectedCategoryIds.length === 0}>
              <Save className="h-4 w-4 mr-2" />
              Save Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
