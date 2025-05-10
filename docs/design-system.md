# Design System Documentation

This document provides an overview of the design system implemented in the portfolio project using CSS Modules.

## Table of Contents

1. [Introduction](#introduction)
2. [Design Tokens](#design-tokens)
3. [Components](#components)
4. [Usage Guidelines](#usage-guidelines)
5. [Best Practices](#best-practices)

## Introduction

The design system is a collection of reusable components, guided by clear standards, that can be assembled to build any number of applications. It uses CSS Modules for component-scoped styling, ensuring that styles are isolated and maintainable.

## Design Tokens

Design tokens are the visual design atoms of the design system — specifically, they are named entities that store visual design attributes. We use them in place of hardcoded values to ensure flexibility and consistency across our application.

### Colors

The color system is based on a set of base colors with various shades:

- **Primary**: Blue-based colors for primary actions and emphasis
- **Secondary**: Purple-based colors for secondary actions and elements
- **Tertiary**: Green-based colors for success states and tertiary elements
- **Accent**: Orange-based colors for highlighting and accent elements
- **Neutral**: Gray-based colors for text, backgrounds, and borders

Each color has a range of shades from 50 (lightest) to 950 (darkest).

### Typography

The typography system includes:

- **Font Families**: Sans-serif, serif, and monospace options
- **Font Sizes**: From xs (0.75rem) to 9xl (8rem)
- **Font Weights**: From thin (100) to black (900)
- **Line Heights**: From none (1) to loose (2)
- **Letter Spacing**: From tighter (-0.05em) to widest (0.1em)

### Spacing

The spacing system uses a consistent scale:

- **Base Unit**: 0.25rem (4px)
- **Scale**: 0, 0.25rem, 0.5rem, 0.75rem, 1rem, 1.25rem, 1.5rem, etc.

### Borders

Border properties include:

- **Border Radius**: From none (0) to full (9999px)
- **Border Width**: From 0 to 8px

### Shadows

Shadow values for different elevation levels:

- **Shadow SM**: Subtle shadow for low elevation
- **Shadow MD**: Medium shadow for medium elevation
- **Shadow LG**: Larger shadow for high elevation
- **Shadow XL**: Extra large shadow for very high elevation
- **Shadow 2XL**: Double extra large shadow for maximum elevation

## Components

The design system includes the following components:

### Typography Components

- **Heading**: For headings (h1-h6)
- **Text**: For paragraphs and general text
- **Label**: For form labels
- **Caption**: For small, supplementary text

### Layout Components

- **Container**: For containing content within a max-width
- **Section**: For page sections with consistent spacing
- **Grid**: For grid layouts
- **Flex**: For flexbox layouts
- **Spacer**: For adding space between elements

### Button Component

A versatile button component with various:
- Variants (primary, secondary, tertiary, etc.)
- Sizes (sm, md, lg)
- States (default, hover, focus, disabled, loading)
- Options (with icon, icon position, full width, ripple effect)

### Card Component

A flexible card component with:
- Variants (primary, secondary, tertiary, accent, default)
- Parts (header, body, footer, image)
- Options (shadow, hover, interactive, horizontal)

### Form Components

A comprehensive set of form components:
- FormGroup: For grouping form elements
- FormLabel: For form labels
- FormInput: For text inputs
- FormTextarea: For multiline text inputs
- FormSelect: For dropdown selects
- FormCheckbox: For checkboxes
- FormRadio: For radio buttons
- FormSwitch: For toggle switches
- FormRow/FormCol: For form layouts

### Badge Component

A badge component for displaying short status information:
- Variants (primary, secondary, tertiary, etc.)
- Sizes (sm, md, lg)
- Options (outline, with icon)

## Usage Guidelines

### Component Import

Import components from the design system:

\`\`\`tsx
import { Button, Card, Heading } from '@/components/design-system';
\`\`\`

### Basic Usage

Use components with their props:

\`\`\`tsx
<Heading level={2}>Section Title</Heading>
<Text size="lg">This is a paragraph of text.</Text>
<Button variant="primary" size="md">Click Me</Button>
\`\`\`

### Combining with Tailwind

You can combine design system components with Tailwind classes:

\`\`\`tsx
<Card className="mt-4 shadow-lg">
  <CardBody className="p-6">
    <Heading level={3} className="mb-4">Card Title</Heading>
    <Text>Card content goes here.</Text>
  </CardBody>
</Card>
\`\`\`

## Best Practices

1. **Consistency**: Use design system components consistently throughout the application.
2. **Composition**: Compose complex UI by combining simple components.
3. **Customization**: Use the className prop to customize components when needed.
4. **Accessibility**: Ensure all components are accessible by providing proper ARIA attributes.
5. **Responsive Design**: Use responsive props and media queries for different screen sizes.
6. **Performance**: Keep component re-renders to a minimum by using memoization when appropriate.
7. **Documentation**: Document custom components and their usage.
