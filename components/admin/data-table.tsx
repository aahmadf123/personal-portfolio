"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, Plus } from "lucide-react"
import Link from "next/link"
import type { ActionResponse } from "@/lib/server-action-utils"
import { ActionResponseHandler } from "@/components/ui/action-response-handler"

interface Column {
  key: string
  header: string
  cell: (item: any) => React.ReactNode
}

interface DataTableProps {
  data: any[]
  columns: Column[]
  createHref?: string
  onDelete?: (id: number) => Promise<ActionResponse>
  onEdit?: (id: number) => void
}

export function DataTable({ data, columns, createHref, onDelete, onEdit }: DataTableProps) {
  const [actionResponse, setActionResponse] = useState<ActionResponse | null>(null)
  const [isPending, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = async (id: number) => {
    if (!onDelete) return

    if (!confirm("Are you sure you want to delete this item? This action cannot be undone.")) {
      return
    }

    setDeletingId(id)
    startTransition(async () => {
      const response = await onDelete(id)
      setActionResponse(response)
      setDeletingId(null)
    })
  }

  return (
    <div>
      <ActionResponseHandler response={actionResponse} onSuccess={() => setActionResponse(null)} />

      <div className="flex justify-between items-center mb-4">
        <div></div>
        {createHref && (
          <Button asChild>
            <Link href={createHref}>
              <Plus className="mr-2 h-4 w-4" />
              Create New
            </Link>
          </Button>
        )}
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>{column.header}</TableHead>
              ))}
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center py-8 text-muted-foreground">
                  No items found
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id}>
                  {columns.map((column) => (
                    <TableCell key={`${item.id}-${column.key}`}>{column.cell(item)}</TableCell>
                  ))}
                  <TableCell>
                    <div className="flex space-x-2">
                      {onEdit && (
                        <Button variant="ghost" size="sm" onClick={() => onEdit(item.id)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          disabled={isPending && deletingId === item.id}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
