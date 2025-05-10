"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "@/components/ui/use-toast"
import { Pencil, Save, Plus, Trash2, RefreshCw } from "lucide-react"
import type { Skill } from "@/types/skills"

export default function SkillsQuickEditPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [newSkill, setNewSkill] = useState<Partial<Skill>>({
    name: "",
    category: "",
    proficiency: 5,
    is_featured: false,
    color: "#3b82f6",
    description: "",
    order_index: 0,
  })
  const [editedSkill, setEditedSkill] = useState<Partial<Skill>>({})
  const [categories, setCategories] = useState<string[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const supabase = createClientComponentClient()

  const fetchSkills = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("category")
        .order("order_index")
        .order("name")

      if (error) throw error
      setSkills(data || [])

      // Extract unique categories
      const uniqueCategories = Array.from(new Set(data?.map((skill) => skill.category) || []))
      setCategories(uniqueCategories)
    } catch (error) {
      console.error("Error fetching skills:", error)
      toast({
        title: "Error",
        description: "Failed to load skills",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSkills()
  }, [])

  const handleEdit = (skill: Skill) => {
    setEditingId(skill.id)
    setEditedSkill({ ...skill })
  }

  const handleSave = async () => {
    if (!editingId) return

    try {
      const { error } = await supabase.from("skills").update(editedSkill).eq("id", editingId)

      if (error) throw error

      toast({
        title: "Success",
        description: "Skill updated successfully",
      })

      // Refresh skills and reset editing state
      await fetchSkills()
      setEditingId(null)
      setEditedSkill({})

      // Trigger revalidation of the skills API
      await fetch("/api/skills/revalidate", {
        method: "POST",
      })
    } catch (error) {
      console.error("Error updating skill:", error)
      toast({
        title: "Error",
        description: "Failed to update skill",
        variant: "destructive",
      })
    }
  }

  const handleAddSkill = async () => {
    try {
      if (!newSkill.name || !newSkill.category) {
        toast({
          title: "Error",
          description: "Name and category are required",
          variant: "destructive",
        })
        return
      }

      const { error } = await supabase.from("skills").insert([newSkill])

      if (error) throw error

      toast({
        title: "Success",
        description: "Skill added successfully",
      })

      // Reset new skill form and refresh skills
      setNewSkill({
        name: "",
        category: "",
        proficiency: 5,
        is_featured: false,
        color: "#3b82f6",
        description: "",
        order_index: 0,
      })
      await fetchSkills()

      // Trigger revalidation of the skills API
      await fetch("/api/skills/revalidate", {
        method: "POST",
      })
    } catch (error) {
      console.error("Error adding skill:", error)
      toast({
        title: "Error",
        description: "Failed to add skill",
        variant: "destructive",
      })
    }
  }

  const handleDeleteSkill = async (id: number) => {
    if (!confirm("Are you sure you want to delete this skill?")) return

    try {
      const { error } = await supabase.from("skills").delete().eq("id", id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Skill deleted successfully",
      })

      // Refresh skills
      await fetchSkills()

      // Trigger revalidation of the skills API
      await fetch("/api/skills/revalidate", {
        method: "POST",
      })
    } catch (error) {
      console.error("Error deleting skill:", error)
      toast({
        title: "Error",
        description: "Failed to delete skill",
        variant: "destructive",
      })
    }
  }

  const handleRefreshWebsite = async () => {
    try {
      setRefreshing(true)

      // Trigger revalidation of the skills API
      const response = await fetch("/api/skills/revalidate", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to revalidate")
      }

      toast({
        title: "Success",
        description: "Website data refreshed successfully",
      })
    } catch (error) {
      console.error("Error refreshing website:", error)
      toast({
        title: "Error",
        description: "Failed to refresh website data",
        variant: "destructive",
      })
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Skills Quick Edit</h1>
        <button
          onClick={handleRefreshWebsite}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Refreshing..." : "Refresh Website"}
        </button>
      </div>

      <div className="bg-card border rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Skill</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              className="w-full p-2 border rounded-md"
              placeholder="Skill name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input
              type="text"
              list="categories"
              value={newSkill.category}
              onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
              className="w-full p-2 border rounded-md"
              placeholder="Category"
            />
            <datalist id="categories">
              {categories.map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Proficiency (0-10)</label>
            <input
              type="number"
              min="0"
              max="10"
              value={newSkill.proficiency}
              onChange={(e) => setNewSkill({ ...newSkill, proficiency: Number(e.target.value) })}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Color</label>
            <input
              type="color"
              value={newSkill.color}
              onChange={(e) => setNewSkill({ ...newSkill, color: e.target.value })}
              className="w-full p-2 border rounded-md h-10"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Order Index</label>
            <input
              type="number"
              value={newSkill.order_index}
              onChange={(e) => setNewSkill({ ...newSkill, order_index: Number(e.target.value) })}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="flex items-center mt-6">
            <input
              type="checkbox"
              id="is_featured"
              checked={newSkill.is_featured}
              onChange={(e) => setNewSkill({ ...newSkill, is_featured: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="is_featured" className="text-sm font-medium">
              Featured Skill
            </label>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={newSkill.description}
            onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
            className="w-full p-2 border rounded-md"
            rows={3}
            placeholder="Skill description"
          />
        </div>
        <button
          onClick={handleAddSkill}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Skill
        </button>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Category</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Proficiency</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Featured</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Color</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Order</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center">
                    <div className="flex justify-center">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </td>
                </tr>
              ) : (
                skills.map((skill) => (
                  <tr key={skill.id} className="hover:bg-muted/50">
                    {editingId === skill.id ? (
                      // Editing mode
                      <>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={editedSkill.name || ""}
                            onChange={(e) => setEditedSkill({ ...editedSkill, name: e.target.value })}
                            className="w-full p-1.5 border rounded-md"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            list="edit-categories"
                            value={editedSkill.category || ""}
                            onChange={(e) => setEditedSkill({ ...editedSkill, category: e.target.value })}
                            className="w-full p-1.5 border rounded-md"
                          />
                          <datalist id="edit-categories">
                            {categories.map((category) => (
                              <option key={category} value={category} />
                            ))}
                          </datalist>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="0"
                            max="10"
                            value={editedSkill.proficiency || 0}
                            onChange={(e) => setEditedSkill({ ...editedSkill, proficiency: Number(e.target.value) })}
                            className="w-20 p-1.5 border rounded-md"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={editedSkill.is_featured || false}
                            onChange={(e) => setEditedSkill({ ...editedSkill, is_featured: e.target.checked })}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="color"
                            value={editedSkill.color || "#000000"}
                            onChange={(e) => setEditedSkill({ ...editedSkill, color: e.target.value })}
                            className="w-16 h-8"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={editedSkill.order_index || 0}
                            onChange={(e) => setEditedSkill({ ...editedSkill, order_index: Number(e.target.value) })}
                            className="w-16 p-1.5 border rounded-md"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={handleSave}
                            className="p-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors mr-2"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1.5 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                          >
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      // View mode
                      <>
                        <td className="px-4 py-3">{skill.name}</td>
                        <td className="px-4 py-3">{skill.category}</td>
                        <td className="px-4 py-3">{skill.proficiency}/10</td>
                        <td className="px-4 py-3">{skill.is_featured ? "Yes" : "No"}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: skill.color }}></div>
                            <span>{skill.color}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">{skill.order_index}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleEdit(skill)}
                            className="p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors mr-2"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSkill(skill.id)}
                            className="p-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
