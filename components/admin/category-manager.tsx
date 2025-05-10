"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  defaultCategories,
  type ContentCategory,
  getInitialCustomCategories,
  saveCustomCategories,
} from "@/data/content-templates"

export function CategoryManager() {
  const [customCategories, setCustomCategories] = useState<ContentCategory[]>([])
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<ContentCategory | null>(null)
  const [isNewCategory, setIsNewCategory] = useState(false)

  // Load custom categories on component mount
  useEffect(() => {
    setCustomCategories(getInitialCustomCategories())
  }, [])

  // Save custom categories when they change
  useEffect(() => {
    if (customCategories.length > 0) {
      saveCustomCategories(customCategories)
    }
  }, [customCategories])

  const handleCreateCategory = () => {
    const newCategory: ContentCategory = {
      id: `custom-${Date.now()}`,
      name: "",
      description: "",
      color: getRandomColor(),
    }
    setCurrentCategory(newCategory)
    setIsNewCategory(true)
    setEditDialogOpen(true)
  }

  const handleEditCategory = (category: ContentCategory) => {
    setCurrentCategory({ ...category })
    setIsNewCategory(false)
    setEditDialogOpen(true)
  }

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm("Are you sure you want to delete this category? Templates in this category will not be deleted.")) {
      setCustomCategories(customCategories.filter((c) => c.id !== categoryId))
    }
  }

  const handleSaveCategory = () => {
    if (!currentCategory) return

    if (isNewCategory) {
      setCustomCategories([...customCategories, currentCategory])
    } else {
      setCustomCategories(customCategories.map((c) => (c.id === currentCategory.id ? currentCategory : c)))
    }

    setEditDialogOpen(false)
    setCurrentCategory(null)
  }

  const updateCategoryField = (field: keyof ContentCategory, value: string) => {
    if (!currentCategory) return
    setCurrentCategory({
      ...currentCategory,
      [field]: value,
    })
  }

  // Generate a random color for new categories
  const getRandomColor = () => {
    const colors = [
      "#ef4444", // red
      "#f97316", // orange
      "#f59e0b", // amber
      "#84cc16", // lime
      "#10b981", // emerald
      "#06b6d4", // cyan
      "#3b82f6", // blue
      "#8b5cf6", // violet
      "#d946ef", // fuchsia
      "#ec4899", // pink
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  return (
    <>
      <Card className="w-full mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Template Categories</CardTitle>
              <CardDescription>Manage your template categories</CardDescription>
            </div>
            <Button onClick={handleCreateCategory}>
              <Plus className="h-4 w-4 mr-2" />
              New Category
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Default Categories</h3>
              <div className="space-y-2">
                {defaultCategories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
                      <div>
                        <p className="font-medium">{category.name}</p>
                        <p className="text-sm text-gray-500">{category.description}</p>
                      </div>
                    </div>
                    <Badge variant="outline">Default</Badge>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Custom Categories</h3>
              {customCategories.length === 0 ? (
                <div className="p-6 border rounded-md text-center text-gray-500">
                  <p>No custom categories yet</p>
                  <Button variant="outline" size="sm" className="mt-2" onClick={handleCreateCategory}>
                    <Plus className="h-4 w-4 mr-1" />
                    Create Category
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {customCategories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
                        <div>
                          <p className="font-medium">{category.name}</p>
                          <p className="text-sm text-gray-500">{category.description}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEditCategory(category)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteCategory(category.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isNewCategory ? "Create New Category" : "Edit Category"}</DialogTitle>
            <DialogDescription>
              {isNewCategory ? "Create a new category for organizing your templates" : "Edit your custom category"}
            </DialogDescription>
          </DialogHeader>

          {currentCategory && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Category Name
                </label>
                <Input
                  id="name"
                  value={currentCategory.name}
                  onChange={(e) => updateCategoryField("name", e.target.value)}
                  placeholder="e.g., Frontend, Backend, Documentation"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Input
                  id="description"
                  value={currentCategory.description}
                  onChange={(e) => updateCategoryField("description", e.target.value)}
                  placeholder="Brief description of this category"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="color" className="text-sm font-medium">
                  Color
                </label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="color"
                    type="color"
                    value={currentCategory.color}
                    onChange={(e) => updateCategoryField("color", e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={currentCategory.color}
                    onChange={(e) => updateCategoryField("color", e.target.value)}
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSaveCategory}>
              <Save className="h-4 w-4 mr-2" />
              Save Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
