/**
 * CSS Utilities for dynamic styling
 */

type CSSProperties = Record<string, string | number>

/**
 * Convert a CSS object to a style string
 */
export function cssToString(css: CSSProperties): string {
  return Object.entries(css)
    .map(([key, value]) => {
      // Convert camelCase to kebab-case
      const property = key.replace(/([A-Z])/g, "-$1").toLowerCase()
      return `${property}: ${value};`
    })
    .join(" ")
}

/**
 * Create a CSS variable with fallback
 */
export function cssVar(name: string, fallback?: string): string {
  return fallback ? `var(${name}, ${fallback})` : `var(${name})`
}

/**
 * Combine class names conditionally
 */
export function cx(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ")
}

/**
 * Create a responsive style object
 */
export function responsive<T>(base: T, sm?: T, md?: T, lg?: T, xl?: T): Record<string, T> {
  const styles: Record<string, T> = { base }

  if (sm) styles.sm = sm
  if (md) styles.md = md
  if (lg) styles.lg = lg
  if (xl) styles.xl = xl

  return styles
}

/**
 * Create a theme-aware color value
 */
export function themeColor(colorVar: string, opacity = 1): string {
  return `rgba(var(${colorVar}), ${opacity})`
}
