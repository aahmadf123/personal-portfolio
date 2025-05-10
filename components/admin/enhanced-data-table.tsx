"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type Column<T> = {
  id: string
  header: string
  cell: (item: T) => React.ReactNode
  sortable?: boolean
  searchable?: boolean
}

type SortDirection = "asc" | "desc" | null

interface EnhancedDataTableProps<T> {
  data: T[] | undefined
  columns: Column<T>[]
  isLoading?: boolean
  createHref?: string
  createLabel?: string
  onDelete?: (id: string | number) => Promise<void>
  onEdit?: (id: string | number) => void
  getItemId: (item: T) => string | number
  searchPlaceholder?: string
  emptyMessage?: string
  pageSize?: number
}

export function EnhancedDataTable<T>({
  data,
  columns,
  isLoading = false,
  createHref,
  createLabel = "Create New",
  onDelete,
  onEdit,
  getItemId,
  searchPlaceholder = "Search...",
  emptyMessage = "No items found",
  pageSize = 10,
}: EnhancedDataTableProps<T>) {
  const [filteredData, setFilteredData] = useState<T[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set(columns.map((col) => col.id)))

  // Calculate pagination
  const totalPages = Math.ceil((filteredData?.length || 0) / pageSize)
  const paginatedData = filteredData?.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // Filter, sort, and paginate data
  useEffect(() => {
    if (!data) {
      setFilteredData([])
      return
    }

    let result = [...data]

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      result = result.filter((item) => {
        return columns.some((column) => {
          if (!column.searchable) return false
          const cellContent = column.cell(item)
          if (typeof cellContent === "string") {
            return cellContent.toLowerCase().includes(searchLower)
          } else if (typeof cellContent === "number" || typeof cellContent === "boolean") {
            return String(cellContent).toLowerCase().includes(searchLower)
          }
          return false
        })
      })
    }

    // Apply sorting
    if (sortColumn && sortDirection) {
      const column = columns.find((col) => col.id === sortColumn)
      if (column && column.sortable) {
        result.sort((a, b) => {
          const aValue = column.cell(a)
          const bValue = column.cell(b)

          if (typeof aValue === "string" && typeof bValue === "string") {
            return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
          } else if (typeof aValue === "number" && typeof bValue === "number") {
            return sortDirection === "asc" ? aValue - bValue : bValue - aValue
          }
          return 0
        })
      }
    }

    setFilteredData(result)
    setCurrentPage(1) // Reset to first page when filtering changes
  }, [data, searchTerm, sortColumn, sortDirection, columns])

  const handleSort = (columnId: string) => {
    const column = columns.find((col) => col.id === columnId)
    if (!column?.sortable) return

    if (sortColumn === columnId) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === "asc") {
        setSortDirection("desc")
      } else if (sortDirection === "desc") {
        setSortDirection(null)
        setSortColumn(null)
      } else {
        setSortDirection("asc")
      }
    } else {
      setSortColumn(columnId)
      setSortDirection("asc")
    }
  }

  const toggleColumnVisibility = (columnId: string) => {
    const newVisibleColumns = new Set(visibleColumns)
    if (newVisibleColumns.has(columnId)) {
      newVisibleColumns.delete(columnId)
    } else {
      newVisibleColumns.add(columnId)
    }
    setVisibleColumns(newVisibleColumns)
  }

  const visibleColumnsList = columns.filter((col) => visibleColumns.has(col.id))

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {columns.map((column) => (
                <DropdownMenuItem key={column.id} onClick={() => toggleColumnVisibility(column.id)}>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={visibleColumns.has(column.id)}
                      onChange={() => {}}
                      className="mr-2"
                    />
                    {column.header}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {createHref && (
            <Button asChild>
              <Link href={createHref}>
                <Plus className="h-4 w-4 mr-2" />
                {createLabel}
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumnsList.map((column) => (
                <TableHead
                  key={column.id}
                  className={cn(column.sortable && "cursor-pointer")}
                  onClick={() => column.sortable && handleSort(column.id)}
                >
                  <div className="flex items-center">
                    {column.header}
                    {column.sortable && sortColumn === column.id && (
                      <Badge variant="outline" className="ml-2 px-1 py-0 h-5">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </Badge>
                    )}
                  </div>
                </TableHead>
              ))}
              {(onEdit || onDelete) && <TableHead className="w-[100px]">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading state
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`loading-${index}`}>
                  {visibleColumnsList.map((column) => (
                    <TableCell key={`loading-${index}-${column.id}`}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  ))}
                  {(onEdit || onDelete) && (
                    <TableCell>
                      <Skeleton className="h-6 w-20" />
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : paginatedData?.length === 0 ? (
              // Empty state
              <TableRow>
                <TableCell
                  colSpan={visibleColumnsList.length + (onEdit || onDelete ? 1 : 0)}
                  className="h-24 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              // Data rows
              paginatedData?.map((item) => (
                <TableRow key={getItemId(item)}>
                  {visibleColumnsList.map((column) => (
                    <TableCell key={`${getItemId(item)}-${column.id}`}>{column.cell(item)}</TableCell>
                  ))}
                  {(onEdit || onDelete) && (
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          {onEdit && <DropdownMenuItem onClick={() => onEdit(getItemId(item))}>Edit</DropdownMenuItem>}
                          {onDelete && (
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => {
                                if (
                                  window.confirm(
                                    "Are you sure you want to delete this item? This action cannot be undone.",
                                  )
                                ) {
                                  onDelete(getItemId(item))
                                }
                              }}
                            >
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredData.length)} of{" "}
            {filteredData.length} entries
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
