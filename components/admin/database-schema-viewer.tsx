"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { AlertCircle, RefreshCw, Database, Table, Key, Link2 } from "lucide-react"
import type { TableSchema } from "@/lib/schema-detection"

export function DatabaseSchemaViewer() {
  const [tables, setTables] = useState<string[]>([])
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [tableInfo, setTableInfo] = useState<TableSchema | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Fetch tables on component mount
  useEffect(() => {
    fetchTables()
  }, [])

  // Fetch table info when a table is selected
  useEffect(() => {
    if (selectedTable) {
      fetchTableInfo(selectedTable)
    } else {
      setTableInfo(null)
    }
  }, [selectedTable])

  // Fetch all tables
  const fetchTables = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/admin/database-schema")
      if (!response.ok) {
        throw new Error(`Failed to fetch tables: ${response.statusText}`)
      }
      const data = await response.json()
      setTables(data.tables || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error fetching tables")
      console.error("Error fetching tables:", err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch info for a specific table
  const fetchTableInfo = async (tableName: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/admin/database-schema?table=${tableName}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch table info: ${response.statusText}`)
      }
      const data = await response.json()
      setTableInfo(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error fetching table info")
      console.error(`Error fetching info for table ${tableName}:`, err)
    } finally {
      setLoading(false)
    }
  }

  // Refresh the schema cache
  const refreshSchema = async () => {
    setRefreshing(true)
    try {
      const response = await fetch("/api/admin/database-schema?refresh=true")
      if (!response.ok) {
        throw new Error(`Failed to refresh schema: ${response.statusText}`)
      }
      await fetchTables()
      if (selectedTable) {
        await fetchTableInfo(selectedTable)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error refreshing schema")
      console.error("Error refreshing schema:", err)
    } finally {
      setRefreshing(false)
    }
  }

  // Filter tables based on search term
  const filteredTables = tables.filter((table) => table.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Database Schema Explorer
            </CardTitle>
            <CardDescription>View and explore your database schema</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={refreshSchema} disabled={refreshing}>
            {refreshing ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Schema
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="mb-4">
              <Label htmlFor="search-tables">Search Tables</Label>
              <Input
                id="search-tables"
                placeholder="Search tables..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="border rounded-md h-[500px] overflow-y-auto">
              {loading && !selectedTable ? (
                <div className="flex items-center justify-center h-full">
                  <Spinner className="h-8 w-8" />
                </div>
              ) : (
                <ul className="divide-y">
                  {filteredTables.map((table) => (
                    <li key={table}>
                      <button
                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center ${
                          selectedTable === table ? "bg-gray-100 font-medium" : ""
                        }`}
                        onClick={() => setSelectedTable(table)}
                      >
                        <Table className="h-4 w-4 mr-2" />
                        {table}
                      </button>
                    </li>
                  ))}
                  {filteredTables.length === 0 && (
                    <li className="px-4 py-2 text-gray-500 italic">
                      {searchTerm ? "No matching tables found" : "No tables found"}
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            {selectedTable ? (
              loading ? (
                <div className="flex items-center justify-center h-[500px]">
                  <Spinner className="h-8 w-8" />
                </div>
              ) : tableInfo ? (
                <Tabs defaultValue="columns">
                  <TabsList className="mb-4">
                    <TabsTrigger value="columns">Columns</TabsTrigger>
                    <TabsTrigger value="relationships">Relationships</TabsTrigger>
                    <TabsTrigger value="query">Query Helper</TabsTrigger>
                  </TabsList>

                  <TabsContent value="columns">
                    <h3 className="text-lg font-medium mb-2 flex items-center">
                      <Table className="h-5 w-5 mr-2" />
                      {tableInfo.name}
                    </h3>

                    <div className="border rounded-md overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Column Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Data Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Nullable
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Default
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Key
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {tableInfo.columns.map((column) => (
                            <tr key={column.name}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{column.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <Badge variant="outline">{column.dataType}</Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {column.isNullable ? "Yes" : "No"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {column.defaultValue || "-"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {tableInfo.primaryKey === column.name && (
                                  <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                                    <Key className="h-3 w-3 mr-1" />
                                    Primary
                                  </Badge>
                                )}
                                {tableInfo.foreignKeys.some((fk) => fk.columnName === column.name) && (
                                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                    <Link2 className="h-3 w-3 mr-1" />
                                    Foreign
                                  </Badge>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>

                  <TabsContent value="relationships">
                    <h3 className="text-lg font-medium mb-2">Relationships</h3>

                    {tableInfo.foreignKeys.length > 0 ? (
                      <Accordion type="single" collapsible className="w-full">
                        {tableInfo.foreignKeys.map((fk, index) => (
                          <AccordionItem key={index} value={`fk-${index}`}>
                            <AccordionTrigger className="hover:bg-gray-50 px-4">
                              <div className="flex items-center">
                                <Link2 className="h-4 w-4 mr-2" />
                                <span className="font-medium">{fk.columnName}</span>
                                <span className="mx-2 text-gray-400">→</span>
                                <span>
                                  {fk.referencedTable}.{fk.referencedColumn}
                                </span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-4">
                              <div className="bg-gray-50 p-3 rounded-md">
                                <p className="text-sm">
                                  <span className="font-medium">From:</span> {tableInfo.name}.{fk.columnName}
                                </p>
                                <p className="text-sm">
                                  <span className="font-medium">To:</span> {fk.referencedTable}.{fk.referencedColumn}
                                </p>
                                <div className="mt-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedTable(fk.referencedTable)}
                                  >
                                    View {fk.referencedTable} Table
                                  </Button>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    ) : (
                      <p className="text-gray-500 italic">No relationships found for this table.</p>
                    )}
                  </TabsContent>

                  <TabsContent value="query">
                    <h3 className="text-lg font-medium mb-2">Query Helper</h3>

                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="mb-2">
                        Use this template to safely query the <code>{tableInfo.name}</code> table:
                      </p>
                      <pre className="bg-gray-900 text-gray-100 p-3 rounded-md overflow-x-auto text-sm">
                        {`import { createSafeQuery } from '@/lib/safe-query-builder';

async function fetch${tableInfo.name.charAt(0).toUpperCase() + tableInfo.name.slice(1)}() {
  const query = await createSafeQuery('${tableInfo.name}')
    .select([
${tableInfo.columns.map((col) => `      '${col.name}',`).join("\n")}
    ])
    // Add conditions as needed
    // .where('column_name', 'value')
    // .orderBy('created_at', 'desc')
    .limit(10);
  
  const { data, error } = await query.execute();
  
  if (error) {
    console.error('Error fetching data:', error);
    return null;
  }
  
  return data;
}`}
                      </pre>
                      <p className="mt-2 text-sm text-gray-600">
                        This query will automatically adapt to schema changes and only select columns that exist.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="flex items-center justify-center h-[500px] text-gray-500">
                  No table information available
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center h-[500px] text-gray-500">
                <Database className="h-16 w-16 mb-4 text-gray-300" />
                <p>Select a table to view its schema</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
