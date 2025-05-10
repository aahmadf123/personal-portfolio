"use client"

import React, { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import styles from "@/styles/design-system/accordion.module.css"

export interface AccordionItemProps {
  /**
   * The title of the accordion item
   */
  title: React.ReactNode
  /**
   * The content of the accordion item
   */
  children: React.ReactNode
  /**
   * Whether the accordion item is open
   */
  isOpen?: boolean
  /**
   * Callback when the accordion item is toggled
   */
  onToggle?: () => void
}

export const AccordionItem: React.FC<AccordionItemProps> = ({ title, children, isOpen = false, onToggle }) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number | undefined>(isOpen ? undefined : 0)

  useEffect(() => {
    if (!contentRef.current) return

    if (isOpen) {
      const contentHeight = contentRef.current.scrollHeight
      setHeight(contentHeight)
    } else {
      setHeight(0)
    }
  }, [isOpen])

  return (
    <div className={styles.item}>
      <button className={styles.header} onClick={onToggle} aria-expanded={isOpen}>
        <span>{title}</span>
        <span className={cn(styles.icon, isOpen && styles.iconOpen)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      <div
        ref={contentRef}
        className={cn(styles.content, isOpen && styles.contentOpen)}
        style={{ maxHeight: height }}
        aria-hidden={!isOpen}
      >
        <div className={styles.contentInner}>{children}</div>
      </div>
    </div>
  )
}

export interface AccordionProps {
  /**
   * The variant of the accordion
   */
  variant?: "default" | "bordered" | "filled"
  /**
   * The color scheme of the accordion
   */
  color?: "default" | "primary"
  /**
   * Whether multiple items can be open at once
   */
  allowMultiple?: boolean
  /**
   * The accordion items
   */
  children: React.ReactNode
  /**
   * Additional CSS class names
   */
  className?: string
}

export const Accordion: React.FC<AccordionProps> = ({
  variant = "default",
  color = "default",
  allowMultiple = false,
  children,
  className,
}) => {
  const [openItems, setOpenItems] = useState<number[]>([])

  const handleToggle = (index: number) => {
    if (allowMultiple) {
      setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
    } else {
      setOpenItems((prev) => (prev.includes(index) ? [] : [index]))
    }
  }

  const variantClass = variant === "default" ? "" : styles[variant]
  const colorClass = color === "default" ? "" : styles[color]

  return (
    <div className={cn(styles.accordion, variantClass, colorClass, className)}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement<AccordionItemProps>(child)) {
          return child
        }

        return React.cloneElement(child, {
          isOpen: openItems.includes(index),
          onToggle: () => handleToggle(index),
        })
      })}
    </div>
  )
}
