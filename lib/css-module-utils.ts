/**
 * Utility functions for working with CSS Modules
 */

/**
 * Combines multiple CSS Module classnames
 * Similar to the cn utility but specifically for CSS Modules
 */
export function cssm(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ")
}

/**
 * Creates a responsive class name based on a breakpoint
 * @param baseClass The base class name
 * @param breakpoint The breakpoint (sm, md, lg, xl, 2xl)
 * @param styles The CSS Module styles object
 */
export function responsive(baseClass: string, breakpoint: string, styles: Record<string, string>): string {
  const breakpointClass = `${baseClass}-${breakpoint}`
  return styles[breakpointClass] || ""
}

/**
 * Creates a variant class name
 * @param baseClass The base class name
 * @param variant The variant name
 * @param styles The CSS Module styles object
 */
export function variant(baseClass: string, variantName: string, styles: Record<string, string>): string {
  const variantClass = `${baseClass}-${variantName}`
  return styles[variantClass] || ""
}

/**
 * Creates a state class name
 * @param baseClass The base class name
 * @param state The state name (hover, focus, active, disabled)
 * @param styles The CSS Module styles object
 */
export function state(baseClass: string, stateName: string, styles: Record<string, string>): string {
  const stateClass = `${baseClass}-${stateName}`
  return styles[stateClass] || ""
}
