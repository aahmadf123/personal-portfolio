"use client"

import { useState, useEffect } from "react"
import { createClientSupabaseClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, RefreshCw, Edit, Trash2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function SkillsManager() {
  const [skills, setSkills] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const supabase = createClientSupabaseClient()

  const fetchSkills = async () => {
    try {
      setLoading(true)

      const { data: skillsData, error: skillsError } = await supabase
        .from("skills")
        .select(`
          *,
          category:category_id(id, name)
        `)
        .order("name")

      if (skillsError) throw skillsError

      const { data: categoriesData, error: categoriesError } = await supabase
        .from("skill_categories")
        .select("*")
        .order("name")

      if (categoriesError) throw categoriesError

      setSkills(skillsData || [])
      setCategories(categoriesData || [])
    } catch (err) {
      console.error("Error fetching skills data:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSkills()
  }, [])

  const filteredSkills = skills.filter((skill) => {
    // Filter by search query
    if (searchQuery && !skill.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Filter by category tab
    if (activeTab !== "all" && skill.category_id !== Number.parseInt(activeTab)) {
      return false
    }

    return true
  })

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search skills..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchSkills} variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Skill
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6">
          <p>{error}</p>
        </div>
      )}

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 flex flex-wrap">
          <TabsTrigger value="all">All Skills</TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id.toString()}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab}>
          {loading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : filteredSkills.length > 0 ? (
            <div className="bg-card rounded-lg border shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4">Name</th>
                      <th className="text-left py-3 px-4">Category</th>
                      <th className="text-left py-3 px-4">Proficiency</th>
                      <th className="text-left py-3 px-4">Years Experience</th>
                      <th className="text-right py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSkills.map((skill) => (
                      <tr key={skill.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div className="font-medium">{skill.name}</div>
                        </td>
                        <td className="py-3 px-4">{skill.category?.name || "Uncategorized"}</td>
                        <td className="py-3 px-4">
                          <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                            <div
                              className="h-2 rounded-full bg-primary"
                              style={{ width: `${skill.proficiency || 0}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-right mt-1">{skill.proficiency || 0}%</div>
                        </td>
                        <td className="py-3 px-4">{skill.years_experience || 0} years</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/20 rounded-lg border">
              <h3 className="text-lg font-medium mb-2">No skills found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? "Try adjusting your search query." : "Get started by adding your first skill."}
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Skill
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
