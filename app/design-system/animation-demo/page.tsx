"use client"

import { FadeIn, SlideIn, Scale, StaggeredList } from "@/components/ui/animations"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heading, Text } from "@/components/design-system"

export default function AnimationDemo() {
  return (
    <div className="container mx-auto py-24 px-4">
      <Heading level={1} align="center">
        Animation Demo
      </Heading>
      <Text align="center" size="lg" className="mt-4 mb-12">
        Demonstrating the reusable animation components
      </Text>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent>
            <Heading level={3} className="mb-4">
              Fade In
            </Heading>
            <FadeIn>
              <Text>This content fades in on scroll.</Text>
            </FadeIn>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Heading level={3} className="mb-4">
              Slide In
            </Heading>
            <SlideIn direction="left">
              <Text>This content slides in from the left.</Text>
            </SlideIn>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Heading level={3} className="mb-4">
              Scale on Hover
            </Heading>
            <Scale>
              <Button>Scale on Hover</Button>
            </Scale>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Heading level={3} className="mb-4">
              Staggered List
            </Heading>
            <StaggeredList>
              <div>Item 1</div>
              <div>Item 2</div>
              <div>Item 3</div>
            </StaggeredList>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
