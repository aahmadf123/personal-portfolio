# CSS Modules in the Portfolio Project

This document provides guidelines and best practices for using CSS Modules in the portfolio project.

## What are CSS Modules?

CSS Modules are a way to scope CSS to a specific component, preventing class name collisions and making styles more maintainable. Each CSS Module file generates unique class names that are scoped to the component that imports them.

## File Structure

- CSS Module files should be named with the `.module.css` extension
- Each component should have its own CSS Module file
- CSS Module files should be placed in the same directory as the component they style

Example:
\`\`\`
components/
  ├── hero/
  │   ├── hero.tsx
  │   └── hero.module.css
  ├── about/
  │   ├── about.tsx
  │   └── about.module.css
\`\`\`

## Naming Conventions

- Use kebab-case for class names
- Use descriptive names that reflect the purpose of the element
- Use BEM-like naming for nested elements and modifiers

Example:
\`\`\`css
.hero-section {
  /* styles for the hero section */
}

.hero-title {
  /* styles for the hero title */
}

.hero-button--primary {
  /* styles for the primary hero button */
}
\`\`\`

## Usage in Components

Import the CSS Module file and use the generated class names:

\`\`\`tsx
import styles from './hero.module.css';

export function Hero() {
  return (
    <section className={styles['hero-section']}>
      <h1 className={styles['hero-title']}>Welcome</h1>
      <button className={styles['hero-button--primary']}>Get Started</button>
    </section>
  );
}
\`\`\`

## Combining with Tailwind CSS

You can combine CSS Modules with Tailwind CSS for more flexibility:

1. Use CSS Modules for component-specific styles
2. Use Tailwind for utility classes and quick styling

Example:
\`\`\`tsx
import styles from './hero.module.css';

export function Hero() {
  return (
    <section className={`${styles['hero-section']} py-20 relative overflow-hidden`}>
      <h1 className={`${styles['hero-title']} text-4xl font-bold`}>Welcome</h1>
    </section>
  );
}
\`\`\`

## Utility Functions

Use the utility functions in `lib/css-module-utils.ts` to combine class names:

\`\`\`tsx
import { cssm } from '@/lib/css-module-utils';
import styles from './button.module.css';

export function Button({ variant = 'primary', size = 'md', className }) {
  return (
    <button 
      className={cssm(
        styles.button,
        styles[`button-${variant}`],
        styles[`button-${size}`],
        className
      )}
    >
      Click me
    </button>
  );
}
\`\`\`

## Best Practices

1. Keep CSS Module files small and focused on a single component
2. Use variables for colors, spacing, and other design tokens
3. Use media queries for responsive design
4. Use CSS custom properties for theming
5. Avoid using global styles in CSS Modules
6. Use the `composes` feature for style composition
7. Document complex styles with comments
