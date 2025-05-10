import type React from "react"
import { cssm } from "@/lib/css-module-utils"
import styles from "@/styles/design-system/layout.module.css"

type GridColumns = 1 | 2 | 3 | 4 | 5 | 6 | 12
type Gap = 0 | 1 | 2 | 4 | 6 | 8 | 12 | 16
type Spacing = 0 | 1 | 2 | 4 | 8

interface ContainerProps {
  children: React.ReactNode
  className?: string
}

interface SectionProps {
  children: React.ReactNode
  className?: string
  id?: string
}

interface GridProps {
  children: React.ReactNode
  cols?: GridColumns
  smCols?: GridColumns
  mdCols?: GridColumns
  lgCols?: GridColumns
  gap?: Gap
  className?: string
}

interface FlexProps {
  children: React.ReactNode
  direction?: "row" | "col"
  wrap?: "wrap" | "nowrap"
  items?: "start" | "center" | "end" | "stretch"
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly"
  gap?: Gap
  className?: string
}

interface SpacerProps {
  size?: Spacing
  axis?: "horizontal" | "vertical"
  className?: string
}

export const Container: React.FC<ContainerProps> = ({ children, className, ...props }) => {
  return (
    <div className={cssm(styles.container, className)} {...props}>
      {children}
    </div>
  )
}

export const Section: React.FC<SectionProps> = ({ children, className, ...props }) => {
  return (
    <section className={cssm(styles.section, className)} {...props}>
      {children}
    </section>
  )
}

export const Grid: React.FC<GridProps> = ({
  children,
  cols = 1,
  smCols,
  mdCols,
  lgCols,
  gap = 4,
  className,
  ...props
}) => {
  const gridClasses = cssm(
    styles.grid,
    styles[`grid-cols-${cols}`],
    smCols && styles[`sm\\:grid-cols-${smCols}`],
    mdCols && styles[`md\\:grid-cols-${mdCols}`],
    lgCols && styles[`lg\\:grid-cols-${lgCols}`],
    styles[`gap-${gap}`],
    className,
  )

  return (
    <div className={gridClasses} {...props}>
      {children}
    </div>
  )
}

export const Flex: React.FC<FlexProps> = ({
  children,
  direction = "row",
  wrap = "nowrap",
  items,
  justify,
  gap,
  className,
  ...props
}) => {
  const flexClasses = cssm(
    styles.flex,
    styles[`flex-${direction}`],
    styles[`flex-${wrap}`],
    items && styles[`items-${items}`],
    justify && styles[`justify-${justify}`],
    gap !== undefined && styles[`gap-${gap}`],
    className,
  )

  return (
    <div className={flexClasses} {...props}>
      {children}
    </div>
  )
}

export const Spacer: React.FC<SpacerProps> = ({ size = 4, axis = "vertical", className }) => {
  const spacerClasses = cssm(axis === "horizontal" ? styles[`mx-${size}`] : styles[`my-${size}`], className)

  return <div className={spacerClasses} />
}
