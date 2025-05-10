"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import styles from "@/styles/design-system/pagination.module.css"

export interface PaginationProps {
  /**
   * The total number of pages
   */
  totalPages: number
  /**
   * The current page
   */
  currentPage: number
  /**
   * Callback when a page is selected
   */
  onPageChange: (page: number) => void
  /**
   * The number of pages to show on each side of the current page
   */
  siblingCount?: number
  /**
   * Whether to show the previous and next buttons
   */
  showControls?: boolean
  /**
   * The size of the pagination
   */
  size?: "sm" | "md" | "lg"
  /**
   * The variant of the pagination
   */
  variant?: "default" | "rounded" | "outline"
  /**
   * Additional CSS class names
   */
  className?: string
}

export const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
  siblingCount = 1,
  showControls = true,
  size = "md",
  variant = "default",
  className,
}) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const totalNumbers = siblingCount * 2 + 3 // siblings + current + first + last
    const totalBlocks = totalNumbers + 2 // +2 for the ellipses

    if (totalPages <= totalBlocks) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)

    const shouldShowLeftDots = leftSiblingIndex > 2
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 1 + 2 * siblingCount
      return [...Array.from({ length: leftItemCount }, (_, i) => i + 1), "ellipsis", totalPages]
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 1 + 2 * siblingCount
      return [1, "ellipsis", ...Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + i + 1)]
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      return [
        1,
        "ellipsis",
        ...Array.from({ length: rightSiblingIndex - leftSiblingIndex + 1 }, (_, i) => leftSiblingIndex + i),
        "ellipsis",
        totalPages,
      ]
    }

    return []
  }

  const pageNumbers = getPageNumbers()

  return (
    <nav className={cn(styles.pagination, styles[size], styles[variant], className)} aria-label="Pagination">
      {showControls && (
        <div
          className={cn(styles.pageItem, currentPage === 1 && styles.disabled)}
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        >
          <span className={styles.pageLink} aria-label="Previous page">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      )}

      {pageNumbers.map((pageNumber, index) => {
        if (pageNumber === "ellipsis") {
          return (
            <div key={`ellipsis-${index}`} className={styles.ellipsis}>
              &hellip;
            </div>
          )
        }

        return (
          <div
            key={pageNumber}
            className={cn(styles.pageItem, pageNumber === currentPage && styles.active)}
            onClick={() => onPageChange(pageNumber as number)}
          >
            <span className={styles.pageLink}>{pageNumber}</span>
          </div>
        )
      })}

      {showControls && (
        <div
          className={cn(styles.pageItem, currentPage === totalPages && styles.disabled)}
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        >
          <span className={styles.pageLink} aria-label="Next page">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9 18l6-6-6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      )}
    </nav>
  )
}
