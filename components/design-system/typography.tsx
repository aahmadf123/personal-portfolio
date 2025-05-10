import type React from "react"
import { cssm } from "@/lib/css-module-utils"
import styles from "@/styles/design-system/typography.module.css"

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6
type TextSize = "xs" | "sm" | "base" | "lg" | "xl" | "2xl"
type FontWeight = "thin" | "extralight" | "light" | "normal" | "medium" | "semibold" | "bold" | "extrabold" | "black"
type TextAlign = "left" | "center" | "right" | "justify"
type TextTransform = "uppercase" | "lowercase" | "capitalize" | "normal-case"
type TextColor = "primary" | "secondary" | "tertiary" | "accent" | "muted"
type LetterSpacing = "tighter" | "tight" | "normal" | "wide" | "wider" | "widest"
type LineHeight = "none" | "tight" | "snug" | "normal" | "relaxed" | "loose"

interface TypographyProps {
  children: React.ReactNode
  className?: string
}

interface HeadingProps extends TypographyProps {
  level?: HeadingLevel
  weight?: FontWeight
  align?: TextAlign
  transform?: TextTransform
  color?: TextColor
  tracking?: LetterSpacing
  leading?: LineHeight
}

interface TextProps extends TypographyProps {
  size?: TextSize
  weight?: FontWeight
  align?: TextAlign
  transform?: TextTransform
  color?: TextColor
  tracking?: LetterSpacing
  leading?: LineHeight
  muted?: boolean
  underline?: boolean
  lineThrough?: boolean
}

export const Heading: React.FC<HeadingProps> = ({
  children,
  level = 2,
  weight,
  align,
  transform,
  color,
  tracking,
  leading,
  className,
  ...props
}) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements

  const headingClasses = cssm(
    styles.heading,
    styles[`heading-${level}`],
    weight && styles[`font-${weight}`],
    align && styles[`text-${align}`],
    transform && styles[transform],
    color && styles[`text-${color}`],
    tracking && styles[`tracking-${tracking}`],
    leading && styles[`leading-${leading}`],
    className,
  )

  return (
    <Tag className={headingClasses} {...props}>
      {children}
    </Tag>
  )
}

export const Text: React.FC<TextProps> = ({
  children,
  size = "base",
  weight = "normal",
  align,
  transform,
  color,
  tracking,
  leading = "normal",
  muted,
  underline,
  lineThrough,
  className,
  ...props
}) => {
  const textClasses = cssm(
    styles.text,
    styles[`text-${size}`],
    styles[`font-${weight}`],
    align && styles[`text-${align}`],
    transform && styles[transform],
    color && styles[`text-${color}`],
    muted && styles["text-muted"],
    tracking && styles[`tracking-${tracking}`],
    leading && styles[`leading-${leading}`],
    underline && styles.underline,
    lineThrough && styles["line-through"],
    className,
  )

  return (
    <p className={textClasses} {...props}>
      {children}
    </p>
  )
}

export const Label: React.FC<TextProps> = (props) => {
  return <Text as="label" size="sm" weight="medium" {...props} />
}

export const Caption: React.FC<TextProps> = (props) => {
  return <Text as="span" size="xs" color="muted" {...props} />
}
