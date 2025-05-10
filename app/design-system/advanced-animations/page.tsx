"use client";
import {
  Parallax,
  TextReveal,
  ScrollReveal,
  PathAnimation,
  HoverCard,
  Counter,
  AnimatedGradient,
  TypingAnimation,
} from "@/components/design-system";
import { Card, CardContent } from "@/components/ui/card";
import { Heading, Text } from "@/components/design-system";
import { Suspense } from "react";

function AdvancedAnimationsDemoContent() {
  // SVG path for demo
  const svgPath = "M10,90 Q50,10 90,90";

  return (
    <div className="container mx-auto py-24 px-4 space-y-32">
      <div className="text-center mb-16">
        <Heading level={1}>Advanced Animations</Heading>
        <Text size="lg" className="mt-4">
          Showcase of advanced animation components for the design system
        </Text>
      </div>

      {/* Text Reveal Section */}
      <section className="text-center">
        <Heading level={2} className="mb-8">
          Text Reveal Animation
        </Heading>
        <div className="max-w-3xl mx-auto">
          <TextReveal
            text="This text animates word by word as it enters the viewport, creating an engaging reading experience."
            className="text-2xl font-medium"
          />
        </div>
      </section>

      {/* Scroll Reveal Section */}
      <section>
        <Heading level={2} className="mb-8 text-center">
          Scroll Reveal Animations
        </Heading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ScrollReveal animation="fadeIn">
            <Card>
              <CardContent className="p-6">
                <Heading level={3} className="mb-2">
                  Fade In
                </Heading>
                <Text>This card fades in as you scroll down the page.</Text>
              </CardContent>
            </Card>
          </ScrollReveal>

          <ScrollReveal animation="slideUp" delay={0.2}>
            <Card>
              <CardContent className="p-6">
                <Heading level={3} className="mb-2">
                  Slide Up
                </Heading>
                <Text>This card slides up as you scroll down the page.</Text>
              </CardContent>
            </Card>
          </ScrollReveal>

          <ScrollReveal animation="scale" delay={0.4}>
            <Card>
              <CardContent className="p-6">
                <Heading level={3} className="mb-2">
                  Scale
                </Heading>
                <Text>This card scales in as you scroll down the page.</Text>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </section>

      {/* Parallax Section */}
      <section className="relative h-[50vh] overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-xl">
        <div className="absolute inset-0 flex items-center justify-center">
          <Heading level={2}>Parallax Background</Heading>
        </div>
        <Parallax speed={-0.2} className="absolute inset-0">
          <div className="absolute inset-0 grid grid-cols-4 gap-4 p-8 opacity-10">
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-primary rounded-full"
              ></div>
            ))}
          </div>
        </Parallax>
      </section>

      {/* Path Animation Section */}
      <section className="text-center">
        <Heading level={2} className="mb-8">
          SVG Path Animation
        </Heading>
        <div className="flex justify-center">
          <PathAnimation
            pathData={svgPath}
            width={200}
            height={100}
            pathColor="currentColor"
            pathWidth={4}
            duration={3}
          />
        </div>
      </section>

      {/* Hover Card Section */}
      <section>
        <Heading level={2} className="mb-8 text-center">
          Hover Card Effect
        </Heading>
        <div className="max-w-md mx-auto">
          <HoverCard>
            <Card className="w-full">
              <CardContent className="p-6">
                <Heading level={3} className="mb-2">
                  Interactive Card
                </Heading>
                <Text>
                  Hover over this card to see a 3D effect. The card will tilt
                  based on your cursor position.
                </Text>
              </CardContent>
            </Card>
          </HoverCard>
        </div>
      </section>

      {/* Counter Section */}
      <section className="text-center">
        <Heading level={2} className="mb-12">
          Animated Counters
        </Heading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Counter
              end={95}
              suffix="%"
              className="text-5xl font-bold text-primary"
            />
            <Text className="mt-2">Client Satisfaction</Text>
          </div>
          <div>
            <Counter
              end={120}
              prefix="+"
              className="text-5xl font-bold text-primary"
            />
            <Text className="mt-2">Projects Completed</Text>
          </div>
          <div>
            <Counter
              end={4.9}
              decimals={1}
              className="text-5xl font-bold text-primary"
            />
            <Text className="mt-2">Average Rating</Text>
          </div>
        </div>
      </section>

      {/* Animated Gradient Section */}
      <section>
        <Heading level={2} className="mb-8 text-center">
          Animated Gradient
        </Heading>
        <AnimatedGradient
          colors={["#4f46e5", "#8b5cf6", "#ec4899", "#f43f5e"]}
          className="p-12 rounded-xl text-white text-center"
        >
          <Heading level={3} className="mb-4">
            Dynamic Background
          </Heading>
          <Text>
            This section features an animated gradient background that smoothly
            transitions between colors.
          </Text>
        </AnimatedGradient>
      </section>

      {/* Typing Animation Section */}
      <section className="text-center">
        <Heading level={2} className="mb-8">
          Typing Animation
        </Heading>
        <div className="max-w-2xl mx-auto bg-gray-100 dark:bg-gray-800 p-8 rounded-xl">
          <div className="text-2xl font-mono">
            <TypingAnimation text="Hello, I'm a typing animation component that simulates typing text character by character." />
          </div>
        </div>
      </section>
    </div>
  );
}

export default function AdvancedAnimationsDemo() {
  return (
    <Suspense fallback={<div>Loading animations...</div>}>
      <AdvancedAnimationsDemoContent />
    </Suspense>
  );
}
