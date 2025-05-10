"use client"

import { useRef, useState, useEffect, useMemo, Suspense } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text, Html } from "@react-three/drei"
import * as THREE from "three"
import { useInView } from "react-intersection-observer"
import { Button } from "@/components/ui/button"

interface Skill {
  name: string
  level: number
  category: string
  color: string
}

interface Skills3DVisualizationProps {
  skills: Skill[]
  title?: string
  subtitle?: string
}

export function Skills3DVisualization({
  skills,
  title = "Skills & Expertise in 3D",
  subtitle = "Explore my interdisciplinary expertise in this interactive 3D visualization.",
}: Skills3DVisualizationProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [visualizationType, setVisualizationType] = useState<"galaxy" | "network" | "orbital">("galaxy")
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  })
  const [isMounted, setIsMounted] = useState(false)

  // Get unique categories
  const categories = Array.from(new Set(skills.map((skill) => skill.category)))

  // Filter skills by active category
  const filteredSkills = activeCategory ? skills.filter((skill) => skill.category === activeCategory) : skills

  // Handle client-side rendering for Three.js
  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-background/80" id="skills-3d" ref={ref}>
      <div className="container px-4 md:px-6">
        <h2 className="section-title">{title}</h2>
        <p className="section-subtitle">{subtitle}</p>

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
              onClick={() => setVisualizationType("orbital")}
              className={`p-2 rounded-md text-sm transition-all ${
                visualizationType === "orbital" ? "bg-card" : "hover:bg-card/50"
              }`}
            >
              Orbital
            </button>
          </div>
        </div>

        <div className="relative h-[600px] border border-border rounded-lg bg-card/30 backdrop-blur-sm overflow-hidden">
          {isMounted && (
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
                {visualizationType === "network" && <NetworkVisualization skills={filteredSkills} inView={inView} />}
                {visualizationType === "orbital" && <OrbitalVisualization skills={filteredSkills} inView={inView} />}
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
            <p>Drag to rotate • Scroll to zoom • Double-click to reset view</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">
            This interactive 3D visualization represents my skills and their relationships. Each node's size corresponds
            to proficiency level.
          </p>
          <Button
            onClick={() => {
              setActiveCategory(null)
              setVisualizationType("galaxy")
            }}
            variant="outline"
          >
            Reset Visualization
          </Button>
        </div>
      </div>
    </section>
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
        const size = 0.1 + (skill.level / 100) * 0.3
        const isHovered = hoveredSkill === skill.name
        const isClicked = clickedSkill === skill.name

        return (
          <group key={skill.name} position={position}>
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
          <group key={skill.name} position={position}>
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

function OrbitalVisualization({ skills, inView }: { skills: Skill[]; inView: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)
  const [clickedSkill, setClickedSkill] = useState<string | null>(null)

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

  // Generate orbital paths and positions
  const orbitalData = useMemo(() => {
    const data: {
      category: string
      radius: number
      color: string
      skills: {
        name: string
        level: number
        color: string
        angle: number
        orbitSpeed: number
      }[]
    }[] = []

    const categories = Object.keys(skillsByCategory)
    categories.forEach((category, categoryIndex) => {
      const categorySkills = skillsByCategory[category]
      const radius = 3 + categoryIndex * 2 // Increasing radius for each category

      // Get a representative color for the category
      const categoryColor = categorySkills[0].color

      const skillsData = categorySkills.map((skill, skillIndex) => {
        // Distribute skills evenly around the orbit
        const angle = (skillIndex * Math.PI * 2) / categorySkills.length
        // Vary orbit speeds slightly
        const orbitSpeed = 0.1 + (Math.random() * 0.1 - 0.05)

        return {
          name: skill.name,
          level: skill.level,
          color: skill.color,
          angle,
          orbitSpeed,
        }
      })

      data.push({
        category,
        radius,
        color: categoryColor,
        skills: skillsData,
      })
    })

    return data
  }, [skillsByCategory])

  // Animate the orbital system
  useFrame((state, delta) => {
    if (groupRef.current && inView) {
      groupRef.current.rotation.y += 0.001

      // Update positions of skill spheres
      groupRef.current.traverse((child) => {
        if (child.userData && child.userData.isSkillSphere) {
          const { orbitRadius, orbitSpeed, initialAngle } = child.userData
          // Store the angle in userData instead of trying to modify position directly
          child.userData.angle = (child.userData.angle || initialAngle) + delta * orbitSpeed

          const angle = child.userData.angle
          // Use position.set instead of direct assignment
          if (child.position) {
            child.position.set(Math.cos(angle) * orbitRadius, child.position.y, Math.sin(angle) * orbitRadius)
          }
        }
      })
    }
  })

  return (
    <group ref={groupRef}>
      {/* Central sun */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={2} toneMapped={false} />
        <pointLight intensity={1} distance={20} color="#FFFFFF" />
      </mesh>

      {/* Orbital paths */}
      {orbitalData.map((orbit) => (
        <group key={`orbit-${orbit.category}`}>
          {/* Orbital ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[orbit.radius, 0.02, 16, 100]} />
            <meshStandardMaterial
              color={orbit.color}
              emissive={orbit.color}
              emissiveIntensity={0.5}
              transparent
              opacity={0.3}
            />
          </mesh>

          {/* Skills as planets */}
          {orbit.skills.map((skill) => {
            const angle = skill.angle
            const x = Math.cos(angle) * orbit.radius
            const z = Math.sin(angle) * orbit.radius
            const size = 0.1 + (skill.level / 100) * 0.4
            const isHovered = hoveredSkill === skill.name
            const isClicked = clickedSkill === skill.name

            return (
              <group key={`skill-${skill.name}`} position={[x, 0, z]}>
                <mesh
                  userData={{
                    isSkillSphere: true,
                    orbitRadius: orbit.radius,
                    orbitSpeed: skill.orbitSpeed,
                    initialAngle: angle,
                    angle: angle, // Initialize angle in userData
                  }}
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
      ))}
    </group>
  )
}
