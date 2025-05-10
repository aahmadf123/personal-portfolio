"use client"

import React, { useState } from "react"
import { cn } from "@/lib/utils"
import styles from "@/styles/design-system/tabs.module.css"

export interface TabProps {
  /**
   * The label of the tab
   */
  label: React.ReactNode
  /**
   * The content of the tab
   */
  children: React.ReactNode
  /**
   * Whether the tab is disabled
   */
  disabled?: boolean
}

export const Tab: React.FC<TabProps> = ({ children }) => {
  return <>{children}</>
}

export interface TabsProps {
  /**
   * The variant of the tabs
   */
  variant?: "default" | "boxed" | "pills"
  /**
   * The size of the tabs
   */
  size?: "sm" | "md" | "lg"
  /**
   * The alignment of the tabs
   */
  align?: "start" | "center" | "end" | "stretch"
  /**
   * The default active tab index
   */
  defaultTab?: number
  /**
   * The active tab index (controlled)
   */
  activeTab?: number
  /**
   * Callback when a tab is selected
   */
  onTabChange?: (index: number) => void
  /**
   * The tabs
   */
  children: React.ReactNode
  /**
   * Additional CSS class names
   */
  className?: string
}

export const Tabs: React.FC<TabsProps> = ({
  variant = "default",
  size = "md",
  align = "start",
  defaultTab = 0,
  activeTab: controlledActiveTab,
  onTabChange,
  children,
  className,
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState(defaultTab)

  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab

  const handleTabClick = (index: number) => {
    if (controlledActiveTab === undefined) {
      setInternalActiveTab(index)
    }
    if (onTabChange) {
      onTabChange(index)
    }
  }

  // Filter out non-Tab children
  const tabChildren = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type === Tab,
  ) as React.ReactElement<TabProps>[]

  return (
    <div className={cn(styles.tabs, styles[variant], styles[size], styles[align], className)}>
      <div className={styles.tabList} role="tablist">
        {tabChildren.map((child, index) => (
          <button
            key={index}
            role="tab"
            className={cn(styles.tab, activeTab === index && styles.tabActive)}
            aria-selected={activeTab === index}
            aria-controls={`tab-panel-${index}`}
            id={`tab-${index}`}
            disabled={child.props.disabled}
            onClick={() => handleTabClick(index)}
          >
            {child.props.label}
          </button>
        ))}
      </div>
      {tabChildren.map((child, index) => (
        <div
          key={index}
          role="tabpanel"
          id={`tab-panel-${index}`}
          aria-labelledby={`tab-${index}`}
          className={cn(styles.tabPanel, activeTab === index && styles.tabPanelActive)}
        >
          {child.props.children}
        </div>
      ))}
    </div>
  )
}
