"use client"
import {
  ScrollProgress,
  ScrollSequence,
  ParallaxScene,
  ParallaxLayer,
  ScrollTransform,
  StickySection,
  ScrollCanvas,
  HorizontalScroll,
  ScrollCounter,
  ScrollRevealGroup,
  ScrollAppear,
} from "@/components/design-system"
import { Card, CardContent } from "@/components/ui/card"
import { Heading, Text } from "@/components/design-system"

export default function ScrollAnimationsDemo() {
  // Canvas drawing function for ScrollCanvas
  const drawCircle = (ctx: CanvasRenderingContext2D, progress: number) => {
    const centerX = 150
    const centerY = 150
    const radius = 50 + progress * 50

    ctx.clearRect(0, 0, 300, 300)
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.fillStyle = `rgba(59, 130, 246, ${progress})`
    ctx.fill()
  }

  return (
    <>
      {/* Scroll Progress Indicator */}
      <ScrollProgress color="#3b82f6" height={4} position="top" />

      <div className="container mx-auto py-24 px-4 space-y-32">
        <div className="text-center mb-16">
          <Heading level={1}>Scroll Animation Components</Heading>
          <Text size="lg" className="mt-4">
            Showcase of scroll-triggered animation components for the design system
          </Text>
        </div>

        {/* Scroll Sequence Section */}
        <section>
          <Heading level={2} className="mb-8 text-center">
            Scroll Sequence
          </Heading>
          <ScrollSequence className="space-y-4 max-w-2xl mx-auto">
            {[1, 2, 3, 4, 5].map((num) => (
              <Card key={num}>
                <CardContent className="p-6">
                  <Heading level={3} className="mb-2">
                    Step {num}
                  </Heading>
                  <Text>
                    This card appears in sequence as you scroll down. Each item animates with a staggered delay.
                  </Text>
                </CardContent>
              </Card>
            ))}
          </ScrollSequence>
        </section>

        {/* Parallax Scene Section */}
        <section>
          <Heading level={2} className="mb-8 text-center">
            Parallax Scene
          </Heading>
          <ParallaxScene className="h-[50vh] bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
            <ParallaxLayer speed={-0.2} className="flex items-center justify-center">
              <div className="text-6xl font-bold opacity-10">Background Layer</div>
            </ParallaxLayer>
            <ParallaxLayer speed={0.2} className="flex items-center justify-center">
              <div className="text-4xl font-bold">Middle Layer</div>
            </ParallaxLayer>
            <ParallaxLayer speed={0.5} className="flex items-center justify-center">
              <div className="text-2xl font-bold bg-primary text-white px-4 py-2 rounded-md">Foreground Layer</div>
            </ParallaxLayer>
          </ParallaxScene>
        </section>

        {/* Scroll Transform Section */}
        <section>
          <Heading level={2} className="mb-8 text-center">
            Scroll Transform
          </Heading>
          <div className="h-[50vh] flex items-center justify-center">
            <ScrollTransform
              properties={{
                scale: [0.5, 1.5],
                rotate: [0, 180],
                opacity: [0.2, 1],
              }}
              className="bg-primary text-white p-8 rounded-xl"
            >
              <Heading level={3}>Transform on Scroll</Heading>
              <Text>This element transforms as you scroll through the page.</Text>
            </ScrollTransform>
          </div>
        </section>

        {/* Sticky Section */}
        <section>
          <Heading level={2} className="mb-8 text-center">
            Sticky Section
          </Heading>
          <StickySection
            height="200vh"
            stickyPosition="center"
            className="mb-32"
            contentClassName="flex items-center justify-center"
          >
            <Card className="max-w-lg w-full">
              <CardContent className="p-8">
                <Heading level={3} className="mb-4">
                  Sticky Content
                </Heading>
                <Text>
                  This card sticks to the center of the viewport as you scroll through this section. It creates a
                  focused reading experience and can be used for step-by-step explanations.
                </Text>
              </CardContent>
            </Card>
          </StickySection>
        </section>

        {/* Scroll Canvas Section */}
        <section>
          <Heading level={2} className="mb-8 text-center">
            Scroll Canvas Animation
          </Heading>
          <div className="flex justify-center">
            <ScrollCanvas
              draw={drawCircle}
              width={300}
              height={300}
              className="border border-gray-200 dark:border-gray-700 rounded-xl"
            />
          </div>
        </section>

        {/* Horizontal Scroll Section */}
        <section>
          <Heading level={2} className="mb-8 text-center">
            Horizontal Scroll
          </Heading>
          <HorizontalScroll height="50vh" contentWidth="300%" className="bg-gray-100 dark:bg-gray-800 rounded-xl mb-32">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex-1 flex items-center justify-center">
                <Card className="m-8 w-3/4">
                  <CardContent className="p-8">
                    <Heading level={3} className="mb-4">
                      Horizontal Panel {num}
                    </Heading>
                    <Text>
                      This panel is part of a horizontal scrolling section. As you scroll vertically, the content moves
                      horizontally.
                    </Text>
                  </CardContent>
                </Card>
              </div>
            ))}
          </HorizontalScroll>
        </section>

        {/* Scroll Counter Section */}
        <section>
          <Heading level={2} className="mb-12 text-center">
            Scroll Triggered Counters
          </Heading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <ScrollCounter end={95} suffix="%" className="text-5xl font-bold text-primary" />
              <Text className="mt-2">Client Satisfaction</Text>
            </div>
            <div>
              <ScrollCounter end={120} prefix="+" className="text-5xl font-bold text-primary" />
              <Text className="mt-2">Projects Completed</Text>
            </div>
            <div>
              <ScrollCounter end={4.9} decimals={1} className="text-5xl font-bold text-primary" />
              <Text className="mt-2">Average Rating</Text>
            </div>
          </div>
        </section>

        {/* Scroll Reveal Group Section */}
        <section>
          <Heading level={2} className="mb-8 text-center">
            Scroll Reveal Group
          </Heading>
          <ScrollRevealGroup direction="up" stagger={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <Card key={num}>
                <CardContent className="p-6">
                  <Heading level={3} className="mb-2">
                    Item {num}
                  </Heading>
                  <Text>This item is part of a reveal group that animates in sequence.</Text>
                </CardContent>
              </Card>
            ))}
          </ScrollRevealGroup>
        </section>

        {/* Scroll Appear Section */}
        <section>
          <Heading level={2} className="mb-8 text-center">
            Scroll Appear
          </Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ScrollAppear>
              <Card>
                <CardContent className="p-8">
                  <Heading level={3} className="mb-4">
                    First Appear
                  </Heading>
                  <Text>This card appears with a scale effect when it enters the viewport.</Text>
                </CardContent>
              </Card>
            </ScrollAppear>
            <ScrollAppear delay={0.2}>
              <Card>
                <CardContent className="p-8">
                  <Heading level={3} className="mb-4">
                    Delayed Appear
                  </Heading>
                  <Text>This card appears with a slight delay after the first one.</Text>
                </CardContent>
              </Card>
            </ScrollAppear>
          </div>
        </section>

        {/* Note about Scroll Snap */}
        <section className="text-center">
          <Heading level={2} className="mb-4">
            Scroll Snap Sections
          </Heading>
          <Text className="max-w-2xl mx-auto">
            The ScrollSnapContainer and ScrollSnapSection components create full-page sections that snap to the viewport
            during scrolling. They're ideal for creating presentation-style websites with discrete sections.
          </Text>
        </section>
      </div>
    </>
  )
}
