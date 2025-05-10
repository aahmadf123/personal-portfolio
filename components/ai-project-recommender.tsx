"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Sparkles, Brain } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { createClientSupabaseClient } from "@/lib/supabase"
import type { Project } from "@/types/projects"
import type { Skill } from "@/types/skills"

export function AIProjectRecommender() {
  const [projects, setProjects] = useState<Project[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [recommendedProjects, setRecommendedProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [recommending, setRecommending] = useState(false)
  const supabase = createClientSupabaseClient()

  useEffect(() => {
    async function fetchData() {
      try {
        const [projectsResponse, skillsResponse] = await Promise.all([
          supabase.from("projects").select("*").order("created_at", { ascending: false }),
          supabase.from("skills").select("*").order("name"),
        ])

        if (projectsResponse.error) throw projectsResponse.error
        if (skillsResponse.error) throw skillsResponse.error

        setProjects(projectsResponse.data || [])
        setSkills(skillsResponse.data || [])
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [supabase])

  const toggleSkill = (skillId: string) => {
    setSelectedSkills((prev) => (prev.includes(skillId) ? prev.filter((id) => id !== skillId) : [...prev, skillId]))
  }

  const getRecommendations = async () => {
    if (selectedSkills.length === 0 || recommending) return

    setRecommending(true)

    try {
      // In a real implementation, you would call an AI model to get personalized recommendations
      // For this example, we'll simulate AI recommendations with a simple algorithm

      // Get the selected skill objects
      const selectedSkillObjects = skills.filter((skill) => selectedSkills.includes(skill.id.toString()))

      // Simple recommendation algorithm: score projects based on skill match
      const scoredProjects = projects.map((project) => {
        // In a real implementation, you would have a project_skills junction table
        // For this example, we'll use tags as a proxy for skills
        const projectTags = project.tags || []
        const skillNames = selectedSkillObjects.map((skill) => skill.name.toLowerCase())

        // Calculate a simple score based on tag matches
        let score = 0
        projectTags.forEach((tag) => {
          if (skillNames.some((skill) => tag.toLowerCase().includes(skill))) {
            score += 1
          }
        })

        return { project, score }
      })

      // Sort by score and take top 3
      const topProjects = scoredProjects
        .sort((a, b) => b.score - a.score)
        .filter((item) => item.score > 0)
        .slice(0, 3)
        .map((item) => item.project)

      setRecommendedProjects(topProjects)
    } catch (error) {
      console.error("Error getting recommendations:", error)
    } finally {
      setRecommending(false)
    }
  }

  return (
    <section className="py-16">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2 flex items-center">
              <Brain className="mr-2 h-6 w-6 text-cyan-400" />
              AI Project Recommender
            </h2>
            <p className="text-muted-foreground">
              Select your interests and skills to get personalized project recommendations
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Select Your Interests</h3>

                <Tabs defaultValue="all" className="mb-6">
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="technical">Technical</TabsTrigger>
                    <TabsTrigger value="domain">Domain</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {loading ? (
                        <div className="w-full text-center py-8">Loading skills...</div>
                      ) : (
                        skills.map((skill) => (
                          <Button
                            key={skill.id}
                            variant={selectedSkills.includes(skill.id.toString()) ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleSkill(skill.id.toString())}
                            className={
                              selectedSkills.includes(skill.id.toString()) ? "bg-cyan-600 hover:bg-cyan-700" : ""
                            }
                          >
                            {skill.name}
                          </Button>
                        ))
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="technical" className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {loading ? (
                        <div className="w-full text-center py-8">Loading skills...</div>
                      ) : (
                        skills
                          .filter((skill) => skill.category === "technical")
                          .map((skill) => (
                            <Button
                              key={skill.id}
                              variant={selectedSkills.includes(skill.id.toString()) ? "default" : "outline"}
                              size="sm"
                              onClick={() => toggleSkill(skill.id.toString())}
                              className={
                                selectedSkills.includes(skill.id.toString()) ? "bg-cyan-600 hover:bg-cyan-700" : ""
                              }
                            >
                              {skill.name}
                            </Button>
                          ))
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="domain" className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {loading ? (
                        <div className="w-full text-center py-8">Loading skills...</div>
                      ) : (
                        skills
                          .filter((skill) => skill.category === "domain")
                          .map((skill) => (
                            <Button
                              key={skill.id}
                              variant={selectedSkills.includes(skill.id.toString()) ? "default" : "outline"}
                              size="sm"
                              onClick={() => toggleSkill(skill.id.toString())}
                              className={
                                selectedSkills.includes(skill.id.toString()) ? "bg-cyan-600 hover:bg-cyan-700" : ""
                              }
                            >
                              {skill.name}
                            </Button>
                          ))
                      )}
                    </div>
                  </TabsContent>
                </Tabs>

                <Button
                  onClick={getRecommendations}
                  disabled={selectedSkills.length === 0 || recommending}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Get Recommendations
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Recommended Projects</h3>

                {recommendedProjects.length > 0 ? (
                  <div className="space-y-6">
                    {recommendedProjects.map((project, index) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex flex-col md:flex-row gap-4 border border-border rounded-lg p-4 hover:border-cyan-500/30 transition-colors"
                      >
                        <div className="relative h-40 md:h-auto md:w-1/3 rounded-md overflow-hidden">
                          <Image
                            src={project.image_url || "/placeholder.svg?height=200&width=300&query=tech project"}
                            alt={project.title}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1">
                          <h4 className="text-xl font-bold mb-2">{project.title}</h4>
                          <p className="text-muted-foreground mb-4 line-clamp-2">{project.description}</p>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.tags &&
                              project.tags.map((tag, i) => (
                                <span key={i} className="px-2 py-1 bg-cyan-500/10 text-cyan-400 rounded-full text-xs">
                                  {tag}
                                </span>
                              ))}
                          </div>

                          <div className="flex justify-end">
                            <Button asChild variant="ghost" size="sm">
                              <Link href={`/projects/${project.slug}`} className="flex items-center">
                                View Project
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border border-dashed border-border rounded-lg">
                    <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h4 className="text-lg font-medium mb-2">No Recommendations Yet</h4>
                    <p className="text-muted-foreground mb-4">
                      Select your interests and skills to get personalized project recommendations
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
