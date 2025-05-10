"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const skillSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  proficiency: z.number().min(1).max(10),
  is_featured: z.boolean().default(false),
  order_index: z.number().int().default(0),
})

type SkillFormValues = z.infer<typeof skillSchema>

interface SkillEditorProps {
  skill: any | null
  onSave: (data: SkillFormValues) => Promise<void>
  onCancel: () => void
}

export function SkillEditor({ skill, onSave, onCancel }: SkillEditorProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<string[]>([])

  const form = useForm<SkillFormValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: skill?.name || "",
      category: skill?.category || "",
      description: skill?.description || "",
      icon: skill?.icon || "",
      color: skill?.color || "#3b82f6",
      proficiency: skill?.proficiency || 5,
      is_featured: skill?.is_featured || false,
      order_index: skill?.order_index || 0,
    },
  })

  useEffect(() => {
    // Fetch existing categories for autocomplete
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/admin/skills/categories")
        if (response.ok) {
          const data = await response.json()
          setCategories(data)
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }

    fetchCategories()
  }, [])

  const onSubmit = async (values: SkillFormValues) => {
    try {
      setIsLoading(true)
      await onSave(values)
    } catch (error) {
      console.error("Error saving skill:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Predefined color options
  const colorOptions = [
    { name: "Blue", value: "#3b82f6" },
    { name: "Purple", value: "#8b5cf6" },
    { name: "Green", value: "#10b981" },
    { name: "Amber", value: "#f59e0b" },
    { name: "Cyan", value: "#06b6d4" },
    { name: "Pink", value: "#ec4899" },
    { name: "Red", value: "#ef4444" },
    { name: "Slate", value: "#64748b" },
  ]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Skill name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Programming, Design, etc." list="categories" {...field} />
              </FormControl>
              <datalist id="categories">
                {categories.map((category) => (
                  <option key={category} value={category} />
                ))}
              </datalist>
              <FormDescription>Group related skills under the same category</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brief description of this skill and your experience with it"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>Provide context about your experience with this skill</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icon URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} value={field.value || ""} />
                </FormControl>
                <FormDescription>URL to an icon representing this skill (optional)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-10 p-0 border-dashed" type="button">
                          <div className="h-4 w-4 rounded-full" style={{ backgroundColor: field.value || "#3b82f6" }} />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64">
                        <div className="grid grid-cols-4 gap-2">
                          {colorOptions.map((color) => (
                            <div
                              key={color.value}
                              className="cursor-pointer rounded-md p-2 flex flex-col items-center gap-1 hover:bg-muted"
                              onClick={() => field.onChange(color.value)}
                            >
                              <div className="h-8 w-8 rounded-full" style={{ backgroundColor: color.value }} />
                              <span className="text-xs">{color.name}</span>
                            </div>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                    <Input {...field} value={field.value || ""} placeholder="#3b82f6" />
                  </div>
                </FormControl>
                <FormDescription>Choose a color for visual representation</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="proficiency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Proficiency Level: {field.value} / 10</FormLabel>
              <FormControl>
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  defaultValue={[field.value]}
                  onValueChange={(values) => field.onChange(values[0])}
                />
              </FormControl>
              <FormDescription>Rate your proficiency from 1 (beginner) to 10 (expert)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_featured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Featured</FormLabel>
                <FormDescription>Highlight this skill on your portfolio</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="order_index"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Order</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  {...field}
                  onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                />
              </FormControl>
              <FormDescription>Lower numbers appear first</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </div>
      </form>
    </Form>
  )
}
