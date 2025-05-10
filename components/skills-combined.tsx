"use client"

import type React from "react"

import { useState, useRef, useEffect, useMemo, Suspense } from "react"
import { Brain, Rocket, Atom } from "lucide-react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text, Html } from "@react-three/drei"
import * as THREE from "three"
import { useInView } from "react-intersection-observer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"

interface Skill {
  name: string
  level: number
  category: string
  color: string
}

interface SkillsCombinedProps {
  skills: Skill[]
  title?: string
  subtitle?: string
}

export function SkillsCombined({
  skills,
  title = "Skills & Expertise",
  subtitle = "My interdisciplinary expertise spans cutting-edge technologies in AI, aerospace engineering, and quantum computing.",
}: SkillsCombinedProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [visualizationType, setVisualizationType] = useState<"galaxy" | "network" | "bubble" | "radar">("galaxy")
  const [isMounted, setIsMounted] = useState(false)
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  })

  // Get unique categories
  const categories = Array.from(new Set(skills.map((skill) => skill.category)))

  // Filter skills by active category
  const filteredSkills = activeCategory ? skills.filter((skill) => skill.category === activeCategory) : skills

  // Group skills by category for the conventional view
  const skillsByCategory = useMemo(() => {
    const grouped: Record<string, Skill[]> = {}
    skills.forEach((skill) => {
      if (!grouped[skill.category]) {
        grouped[skill.category] = []
      }
      grouped[skill.category].push(skill)
    })
    return grouped
  }, [skills])

  // Handle client-side rendering for Three.js
  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-background/80" id="skills" ref={ref}>
      <div className="container px-4 md:px-6 @container">
        <h2 className="section-title text-balance">{title}</h2>
        <p className="section-subtitle text-pretty">{subtitle}</p>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              activeCategory === null ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
            }`}
          >
            All Skills
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                activeCategory === category ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <Tabs defaultValue="conventional" className="w-full">
          <div className="flex justify-center mb-6">
            <TabsList>
              <TabsTrigger value="conventional">Conventional View</TabsTrigger>
              <TabsTrigger value="3d">3D Visualization</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="conventional" className="mt-0">
            <div className="grid @md:grid-cols-2 @lg:grid-cols-3 gap-6 lg:gap-10">
              {Object.entries(skillsByCategory)
                .filter(([category]) => !activeCategory || category === activeCategory)
                .map(([category, categorySkills]) => (
                  <SkillCategory
                    key={category}
                    icon={
                      category.includes("AI") ? (
                        <Brain className="h-8 w-8 text-primary" />
                      ) : category.includes("Aerospace") || category.includes("Robotics") ? (
                        <Rocket className="h-8 w-8 text-secondary" />
                      ) : (
                        <Atom className="h-8 w-8 text-accent" />
                      )
                    }
                    title={category}
                    skills={categorySkills}
                  />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="3d" className="mt-0">
            <div className="flex justify-end mb-4">
              <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                <button
                  onClick={() => setVisualizationType("galaxy")}
                  className={`p-2 rounded-md text-sm transition-all ${
                    visualizationType === "galaxy" ? "bg-card" : "hover:bg-card/50"
                  }`}
                >
                  Galaxy
                </button>
                <button
                  onClick={() => setVisualizationType("network")}
                  className={`p-2 rounded-md text-sm transition-all ${
                    visualizationType === "network" ? "bg-card" : "hover:bg-card/50"
                  }`}
                >
                  Network
                </button>
                <button
                  onClick={() => setVisualizationType("bubble")}
                  className={`p-2 rounded-md text-sm transition-all ${
                    visualizationType === "bubble" ? "bg-card" : "hover:bg-card/50"
                  }`}
                >
                  Bubble
                </button>
                <button
                  onClick={() => setVisualizationType("radar")}
                  className={`p-2 rounded-md text-sm transition-all ${
                    visualizationType === "radar" ? "bg-card" : "hover:bg-card/50"
                  }`}
                >
                  Radar
                </button>
              </div>
            </div>

            <div className="relative h-[600px] border border-border rounded-lg bg-card/30 backdrop-blur-sm overflow-hidden">
              {isMounted && visualizationType === "bubble" && (
                <BubbleVisualization skills={filteredSkills} inView={inView} />
              )}

              {isMounted && visualizationType === "radar" && (
                <RadarVisualization skills={filteredSkills} inView={inView} />
              )}

              {isMounted && (visualizationType === "galaxy" || visualizationType === "network") && (
                <Canvas
                  camera={{ position: [0, 0, 15], fov: 60 }}
                  gl={{ antialias: true, alpha: true }}
                  dpr={[1, 2]}
                  style={{ background: "transparent" }}
                >
                  <ambientLight intensity={0.5} />
                  <pointLight position={[10, 10, 10]} intensity={1} />
                  <pointLight position={[-10, -10, -10]} intensity={0.5} />
                  <Suspense fallback={<Html center>Loading 3D visualization...</Html>}>
                    {visualizationType === "galaxy" && <GalaxyVisualization skills={filteredSkills} inView={inView} />}
                    {visualizationType === "network" && (
                      <NetworkVisualization skills={filteredSkills} inView={inView} />
                    )}
                  </Suspense>
                  <OrbitControls
                    enableZoom={true}
                    enablePan={true}
                    enableRotate={true}
                    zoomSpeed={0.5}
                    rotateSpeed={0.5}
                    autoRotate={true}
                    autoRotateSpeed={0.5}
                  />
                </Canvas>
              )}

              <div className="absolute bottom-4 left-4 z-10 text-xs text-muted-foreground bg-background/50 backdrop-blur-sm rounded-md px-3 py-2">
                {visualizationType === "galaxy" || visualizationType === "network" ? (
                  <p>Drag to rotate • Scroll to zoom • Double-click to reset view</p>
                ) : (
                  <p>Hover over nodes to see skill details</p>
                )}
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-muted-foreground text-sm text-pretty">
                This interactive visualization represents my skills and their relationships. Each node's size
                corresponds to proficiency level.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

interface SkillCategoryProps {
  icon: React.ReactNode
  title: string
  skills: Skill[]
}

function SkillCategory({ icon, title, skills }: SkillCategoryProps) {
  return (
    <div className="skill-card @container">
      <div className="flex items-center gap-3 mb-6">
        {icon}
        <h3 className="text-xl @md:text-2xl font-bold text-balance">{title}</h3>
      </div>

      <p className="text-sm text-muted-foreground mb-6 text-pretty">
        Proficiency levels based on experience and projects
      </p>

      <div className="space-y-6">
        {skills.map((skill) => (
          <div key={skill.name}>
            <div className="flex justify-between mb-2">
              <span>{skill.name}</span>
              <span className="text-primary">{skill.level}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${skill.level}%`,
                  backgroundColor: title.includes("AI")
                    ? "hsl(var(--primary))"
                    : title.includes("Aerospace") || title.includes("Robotics")
                      ? "hsl(var(--secondary))"
                      : "hsl(var(--accent))",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function GalaxyVisualization({ skills, inView }: { skills: Skill[]; inView: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)
  const [clickedSkill, setClickedSkill] = useState<string | null>(null)

  // Group skills by category for color coordination
  const skillsByCategory = useMemo(() => {
    const grouped: Record<string, Skill[]> = {}
    skills.forEach((skill) => {
      if (!grouped[skill.category]) {
        grouped[skill.category] = []
      }
      grouped[skill.category].push(skill)
    })
    return grouped
  }, [skills])

  // Generate positions for skills in a spiral galaxy pattern
  const skillPositions = useMemo(() => {
    const positions: Record<string, THREE.Vector3> = {}
    let categoryIndex = 0

    Object.entries(skillsByCategory).forEach(([category, categorySkills]) => {
      // Each category forms an arm of the galaxy
      const armAngle = (categoryIndex * Math.PI * 2) / Object.keys(skillsByCategory).length
      const armLength = 10
      const spiralTightness = 0.7

      categorySkills.forEach((skill, skillIndex) => {
        const distanceFromCenter = 2 + (skillIndex / categorySkills.length) * armLength
        const angle = armAngle + spiralTightness * distanceFromCenter
        const x = Math.cos(angle) * distanceFromCenter
        const y = Math.sin(angle) * distanceFromCenter
        const z = (Math.random() - 0.5) * 2 // Add some variation in the z-axis

        positions[skill.name] = new THREE.Vector3(x, y, z)
      })

      categoryIndex++
    })

    return positions
  }, [skillsByCategory])

  // Animate the galaxy rotation
  useFrame((state) => {
    if (groupRef.current && inView) {
      groupRef.current.rotation.y += 0.001
    }
  })

  return (
    <group ref={groupRef}>
      {/* Central core of the galaxy */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#0099FF"
          emissive="#0099FF"
          emissiveIntensity={2}
          toneMapped={false}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Skills as stars in the galaxy */}
      {skills.map((skill) => {
        const position = skillPositions[skill.name]
        if (!position) return null

        const size = 0.1 + (skill.level / 100) * 0.3
        const isHovered = hoveredSkill === skill.name
        const isClicked = clickedSkill === skill.name

        return (
          <group key={skill.name} position={[position.x, position.y, position.z]}>
            <mesh
              onPointerOver={() => setHoveredSkill(skill.name)}
              onPointerOut={() => setHoveredSkill(null)}
              onClick={() => setClickedSkill(isClicked ? null : skill.name)}
            >
              <sphereGeometry args={[size, 16, 16]} />
              <meshStandardMaterial
                color={skill.color}
                emissive={skill.color}
                emissiveIntensity={isHovered || isClicked ? 3 : 1}
                toneMapped={false}
              />
            </mesh>

            {/* Skill name label */}
            {(isHovered || isClicked) && (
              <Text
                position={[0, size + 0.3, 0]}
                fontSize={0.3}
                color="white"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.02}
                outlineColor="#000000"
              >
                {skill.name} - {skill.level}%
              </Text>
            )}

            {/* Glow effect */}
            <pointLight
              position={[0, 0, 0]}
              distance={3}
              intensity={isHovered || isClicked ? 1 : 0.5}
              color={skill.color}
            />
          </group>
        )
      })}

      {/* Dust particles for galaxy effect */}
      {Array.from({ length: 200 }).map((_, i) => {
        const theta = Math.random() * Math.PI * 2
        const radius = 1 + Math.random() * 12
        const x = Math.cos(theta) * radius
        const y = Math.sin(theta) * radius
        const z = (Math.random() - 0.5) * 3

        return (
          <mesh key={`dust-${i}`} position={[x, y, z]}>
            <sphereGeometry args={[0.02 + Math.random() * 0.05, 8, 8]} />
            <meshStandardMaterial
              color={i % 3 === 0 ? "#0099FF" : i % 3 === 1 ? "#00AACC" : "#FF9900"}
              emissive={i % 3 === 0 ? "#0099FF" : i % 3 === 1 ? "#00AACC" : "#FF9900"}
              emissiveIntensity={0.5}
              transparent
              opacity={0.7}
            />
          </mesh>
        )
      })}
    </group>
  )
}

function NetworkVisualization({ skills, inView }: { skills: Skill[]; inView: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)
  const [clickedSkill, setClickedSkill] = useState<string | null>(null)
  const [positions, setPositions] = useState<Record<string, THREE.Vector3>>({})
  const [connections, setConnections] = useState<{ from: string; to: string; strength: number }[]>([])

  // Generate positions for skills in a 3D network
  useEffect(() => {
    const newPositions: Record<string, THREE.Vector3> = {}

    // Place skills in a spherical arrangement
    skills.forEach((skill, index) => {
      // Use fibonacci sphere algorithm for even distribution
      const phi = Math.acos(-1 + (2 * index) / skills.length)
      const theta = Math.sqrt(skills.length * Math.PI) * phi

      const radius = 7
      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)

      newPositions[skill.name] = new THREE.Vector3(x, y, z)
    })

    setPositions(newPositions)

    // Generate connections between related skills
    const newConnections: { from: string; to: string; strength: number }[] = []

    // Connect skills in the same category
    const skillsByCategory: Record<string, Skill[]> = {}
    skills.forEach((skill) => {
      if (!skillsByCategory[skill.category]) {
        skillsByCategory[skill.category] = []
      }
      skillsByCategory[skill.category].push(skill)
    })

    Object.values(skillsByCategory).forEach((categorySkills) => {
      for (let i = 0; i < categorySkills.length; i++) {
        for (let j = i + 1; j < categorySkills.length; j++) {
          newConnections.push({
            from: categorySkills[i].name,
            to: categorySkills[j].name,
            strength: 0.7,
          })
        }
      }
    })

    // Add some cross-category connections based on skill names
    for (let i = 0; i < skills.length; i++) {
      for (let j = i + 1; j < skills.length; j++) {
        const skill1 = skills[i]
        const skill2 = skills[j]

        // If skills have similar names or levels, connect them
        if (
          skill1.category !== skill2.category &&
          (Math.abs(skill1.level - skill2.level) < 10 ||
            skill1.name.includes(skill2.name) ||
            skill2.name.includes(skill1.name))
        ) {
          newConnections.push({
            from: skill1.name,
            to: skill2.name,
            strength: 0.3,
          })
        }
      }
    }

    setConnections(newConnections)
  }, [skills])

  // Animate the network
  useFrame((state) => {
    if (groupRef.current && inView) {
      // Use rotation.y += instead of directly modifying the rotation object
      groupRef.current.rotation.y += 0.001
    }
  })

  return (
    <group ref={groupRef}>
      {/* Central node */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={1} toneMapped={false} />
      </mesh>

      {/* Connections between skills */}
      {connections.map((connection, index) => {
        const fromPos = positions[connection.from]
        const toPos = positions[connection.to]

        if (!fromPos || !toPos) return null

        // Calculate the midpoint and direction for the cylinder
        const midPoint = new THREE.Vector3().addVectors(fromPos, toPos).multiplyScalar(0.5)
        const direction = new THREE.Vector3().subVectors(toPos, fromPos)
        const length = direction.length()

        // Create a quaternion to rotate the cylinder to point in the right direction
        const quaternion = new THREE.Quaternion()
        const upVector = new THREE.Vector3(0, 1, 0)
        direction.normalize()
        quaternion.setFromUnitVectors(upVector, direction)

        const isHighlighted =
          hoveredSkill === connection.from ||
          hoveredSkill === connection.to ||
          clickedSkill === connection.from ||
          clickedSkill === connection.to

        return (
          <mesh
            key={`connection-${index}`}
            position={midPoint}
            quaternion={quaternion}
            scale={[0.03, length / 2, 0.03]}
          >
            <cylinderGeometry args={[1, 1, 1, 8]} />
            <meshStandardMaterial
              color={isHighlighted ? "#FFFFFF" : "#666666"}
              transparent
              opacity={isHighlighted ? 0.8 : connection.strength * 0.5}
              emissive={isHighlighted ? "#FFFFFF" : "#666666"}
              emissiveIntensity={isHighlighted ? 1 : 0.2}
            />
          </mesh>
        )
      })}

      {/* Skills as nodes */}
      {skills.map((skill) => {
        const position = positions[skill.name]
        if (!position) return null

        const size = 0.1 + (skill.level / 100) * 0.4
        const isHovered = hoveredSkill === skill.name
        const isClicked = clickedSkill === skill.name

        return (
          <group key={skill.name} position={[position.x, position.y, position.z]}>
            <mesh
              onPointerOver={() => setHoveredSkill(skill.name)}
              onPointerOut={() => setHoveredSkill(null)}
              onClick={() => setClickedSkill(isClicked ? null : skill.name)}
            >
              <sphereGeometry args={[size, 32, 32]} />
              <meshStandardMaterial
                color={skill.color}
                emissive={skill.color}
                emissiveIntensity={isHovered || isClicked ? 3 : 1}
                toneMapped={false}
              />
            </mesh>

            {/* Skill name label */}
            {(isHovered || isClicked) && (
              <Text
                position={[0, size + 0.3, 0]}
                fontSize={0.3}
                color="white"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.02}
                outlineColor="#000000"
              >
                {skill.name} - {skill.level}%
              </Text>
            )}

            {/* Glow effect */}
            <pointLight
              position={[0, 0, 0]}
              distance={3}
              intensity={isHovered || isClicked ? 1 : 0.3}
              color={skill.color}
            />
          </group>
        )
      })}
    </group>
  )
}

function BubbleVisualization({ skills, inView }: { skills: Skill[]; inView: boolean }) {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 })

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      })
    }

    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        })
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Calculate random positions for bubbles
  const positions = useMemo(() => {
    return skills.map((skill) => {
      const padding = 80
      return {
        x: padding + Math.random() * (dimensions.width - padding * 2),
        y: padding + Math.random() * (dimensions.height - padding * 2),
        size: 60 + (skill.level / 100) * 80,
      }
    })
  }, [skills, dimensions])

  return (
    <div className="w-full h-full relative" ref={containerRef}>
      {skills.map((skill, index) => (
        <motion.div
          key={skill.name}
          className="absolute rounded-full flex items-center justify-center text-center p-2 text-xs md:text-sm font-medium cursor-pointer hover:scale-110 transition-transform"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
            x: [
              positions[index]?.x - positions[index]?.size / 2 || 0,
              positions[index]?.x - positions[index]?.size / 2 + Math.random() * 20 - 10 || 0,
            ],
            y: [
              positions[index]?.y - positions[index]?.size / 2 || 0,
              positions[index]?.y - positions[index]?.size / 2 + Math.random() * 20 - 10 || 0,
            ],
          }}
          transition={{
            duration: 0.5,
            delay: index * 0.05,
            x: {
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
            },
            y: {
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
            },
          }}
          style={{
            width: positions[index]?.size || 60,
            height: positions[index]?.size || 60,
            backgroundColor: skill.color,
            color: "#fff",
            textShadow: "0 1px 2px rgba(0,0,0,0.5)",
            boxShadow: `0 0 20px ${skill.color}80`,
          }}
          onMouseEnter={() => setHoveredSkill(skill.name)}
          onMouseLeave={() => setHoveredSkill(null)}
        >
          {skill.name}
          {hoveredSkill === skill.name && (
            <div className="absolute top-full mt-2 bg-background/90 text-foreground px-2 py-1 rounded text-xs whitespace-nowrap">
              {skill.level}% proficiency
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}

function RadarVisualization({ skills, inView }: { skills: Skill[]; inView: boolean }) {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 })

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      })
    }

    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        })
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Group skills by category
  const skillsByCategory = useMemo(() => {
    const grouped: Record<string, Skill[]> = {}
    skills.forEach((skill) => {
      if (!grouped[skill.category]) {
        grouped[skill.category] = []
      }
      grouped[skill.category].push(skill)
    })
    return grouped
  }, [skills])

  const categories = Object.keys(skillsByCategory)
  const centerX = dimensions.width / 2
  const centerY = dimensions.height / 2
  const maxRadius = Math.min(dimensions.width, dimensions.height) * 0.4

  return (
    <div className="w-full h-full relative" ref={containerRef}>
      {/* Background circles */}
      {[0.2, 0.4, 0.6, 0.8, 1].map((ratio, i) => (
        <motion.div
          key={`circle-${i}`}
          className="absolute border border-border/30 rounded-full"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          style={{
            width: maxRadius * 2 * ratio,
            height: maxRadius * 2 * ratio,
            left: centerX - maxRadius * ratio,
            top: centerY - maxRadius * ratio,
          }}
        />
      ))}

      {/* Category axes */}
      {categories.map((category, i) => {
        const angle = (i * 2 * Math.PI) / categories.length

        return (
          <motion.div
            key={`axis-${category}`}
            className="absolute bg-border/30"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 + i * 0.05 }}
            style={{
              height: 1,
              width: maxRadius,
              left: centerX,
              top: centerY,
              transformOrigin: "left center",
              transform: `rotate(${angle}rad)`,
            }}
          />
        )
      })}

      {/* Category labels */}
      {categories.map((category, i) => {
        const angle = (i * 2 * Math.PI) / categories.length
        const x = centerX + Math.cos(angle) * (maxRadius + 20)
        const y = centerY + Math.sin(angle) * (maxRadius + 20)

        return (
          <motion.div
            key={`label-${category}`}
            className="absolute text-xs font-medium bg-background/80 backdrop-blur-sm px-2 py-1 rounded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 + i * 0.05 }}
            style={{
              left: x - 50,
              top: y - 10,
              width: 100,
              textAlign: "center",
            }}
          >
            {category}
          </motion.div>
        )
      })}

      {/* Skills data points */}
      {categories.map((category, categoryIndex) => {
        const categorySkills = skillsByCategory[category]
        const angle = (categoryIndex * 2 * Math.PI) / categories.length

        return categorySkills.map((skill, skillIndex) => {
          const skillRatio = skill.level / 100
          const distance = maxRadius * skillRatio
          const spreadAngle = angle + (skillIndex - (categorySkills.length - 1) / 2) * 0.2
          const x = centerX + Math.cos(spreadAngle) * distance
          const y = centerY + Math.sin(spreadAngle) * distance

          return (
            <motion.div
              key={`skill-${skill.name}`}
              className="absolute rounded-full flex items-center justify-center cursor-pointer hover:scale-125 transition-transform"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1 + categoryIndex * 0.1 + skillIndex * 0.05 }}
              style={{
                width: 30,
                height: 30,
                left: x - 15,
                top: y - 15,
                backgroundColor: skill.color,
                boxShadow: `0 0 10px ${skill.color}80`,
                zIndex: 5,
              }}
              onMouseEnter={() => setHoveredSkill(skill.name)}
              onMouseLeave={() => setHoveredSkill(null)}
            >
              {hoveredSkill === skill.name && (
                <motion.div
                  className="absolute whitespace-nowrap text-xs font-medium bg-background/90 backdrop-blur-sm px-2 py-1 rounded pointer-events-none"
                  style={{
                    top: -30,
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {skill.name} - {skill.level}%
                </motion.div>
              )}
            </motion.div>
          )
        })
      })}

      {/* Radar polygon */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        {categories.map((category) => {
          const categorySkills = skillsByCategory[category]
          if (!categorySkills || categorySkills.length === 0) return null

          // Find the highest level skill in this category
          const highestSkill = categorySkills.reduce((prev, current) => (prev.level > current.level ? prev : current))

          const points = categories
            .map((cat, i) => {
              const catSkills = skillsByCategory[cat]
              if (!catSkills || catSkills.length === 0) return ""

              const highestCatSkill = catSkills.reduce((prev, current) => (prev.level > current.level ? prev : current))

              const angle = (i * 2 * Math.PI) / categories.length
              const distance = maxRadius * (highestCatSkill.level / 100)
              const x = centerX + Math.cos(angle) * distance
              const y = centerY + Math.sin(angle) * distance

              return `${x},${y}`
            })
            .join(" ")

          return (
            <motion.polygon
              key={`polygon-${category}`}
              points={points}
              fill={`${highestSkill.color}20`}
              stroke={highestSkill.color}
              strokeWidth="2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
            />
          )
        })}
      </svg>
    </div>
  )
}
