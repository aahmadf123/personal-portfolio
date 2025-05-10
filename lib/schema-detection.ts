import { createServerSupabaseClient } from "./supabase"

// Types for schema information
export interface TableSchema {
  name: string
  columns: ColumnSchema[]
  primaryKey?: string
  foreignKeys: ForeignKeySchema[]
}

export interface ColumnSchema {
  name: string
  dataType: string
  isNullable: boolean
  defaultValue?: string
}

export interface ForeignKeySchema {
  columnName: string
  referencedTable: string
  referencedColumn: string
}

export interface DatabaseSchema {
  tables: Record<string, TableSchema>
  lastUpdated: Date
}

// Cache the schema to avoid repeated queries
let schemaCache: DatabaseSchema | null = null
const CACHE_DURATION = 1000 * 60 * 60 // 1 hour

/**
 * Fetches the database schema from Supabase
 */
export async function fetchDatabaseSchema(forceRefresh = false): Promise<DatabaseSchema> {
  // Return cached schema if available and not expired
  if (schemaCache && !forceRefresh && new Date().getTime() - schemaCache.lastUpdated.getTime() < CACHE_DURATION) {
    console.log("Using cached database schema")
    return schemaCache
  }

  try {
    console.log("Fetching database schema...")
    const supabase = createServerSupabaseClient()

    // Get all tables in the public schema
    const { data: tablesData, error: tablesError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .not("table_name", "like", "pg_%")
      .not("table_name", "like", "auth_%")

    if (tablesError) {
      console.error("Error fetching tables:", tablesError)
      throw new Error(`Failed to fetch tables: ${tablesError.message}`)
    }

    const tables: Record<string, TableSchema> = {}

    // For each table, get its columns
    for (const table of tablesData || []) {
      const tableName = table.table_name

      // Get columns for this table
      const { data: columnsData, error: columnsError } = await supabase
        .from("information_schema.columns")
        .select("column_name, data_type, is_nullable, column_default")
        .eq("table_schema", "public")
        .eq("table_name", tableName)

      if (columnsError) {
        console.error(`Error fetching columns for table ${tableName}:`, columnsError)
        continue
      }

      // Get primary key for this table
      const { data: pkData, error: pkError } = await supabase
        .from("information_schema.table_constraints")
        .select(`
          constraint_name,
          information_schema.key_column_usage!inner(column_name)
        `)
        .eq("table_schema", "public")
        .eq("table_name", tableName)
        .eq("constraint_type", "PRIMARY KEY")

      if (pkError) {
        console.error(`Error fetching primary key for table ${tableName}:`, pkError)
      }

      // Get foreign keys for this table
      const { data: fkData, error: fkError } = await supabase
        .from("information_schema.table_constraints")
        .select(`
          constraint_name,
          information_schema.key_column_usage!inner(column_name),
          information_schema.constraint_column_usage!inner(table_name, column_name)
        `)
        .eq("table_schema", "public")
        .eq("table_name", tableName)
        .eq("constraint_type", "FOREIGN KEY")

      if (fkError) {
        console.error(`Error fetching foreign keys for table ${tableName}:`, fkError)
      }

      // Process columns
      const columns: ColumnSchema[] = (columnsData || []).map((col) => ({
        name: col.column_name,
        dataType: col.data_type,
        isNullable: col.is_nullable === "YES",
        defaultValue: col.column_default || undefined,
      }))

      // Process primary key
      let primaryKey: string | undefined
      if (pkData && pkData.length > 0 && pkData[0].information_schema) {
        primaryKey = pkData[0].information_schema.key_column_usage[0]?.column_name
      }

      // Process foreign keys
      const foreignKeys: ForeignKeySchema[] = []
      if (fkData) {
        for (const fk of fkData) {
          if (
            fk.information_schema &&
            fk.information_schema.key_column_usage &&
            fk.information_schema.constraint_column_usage
          ) {
            const columnName = fk.information_schema.key_column_usage[0]?.column_name
            const referencedTable = fk.information_schema.constraint_column_usage[0]?.table_name
            const referencedColumn = fk.information_schema.constraint_column_usage[0]?.column_name

            if (columnName && referencedTable && referencedColumn) {
              foreignKeys.push({
                columnName,
                referencedTable,
                referencedColumn,
              })
            }
          }
        }
      }

      // Add table to schema
      tables[tableName] = {
        name: tableName,
        columns,
        primaryKey,
        foreignKeys,
      }
    }

    // Update cache
    schemaCache = {
      tables,
      lastUpdated: new Date(),
    }

    console.log(`Schema detection complete. Found ${Object.keys(tables).length} tables.`)
    return schemaCache
  } catch (error) {
    console.error("Error detecting database schema:", error)
    throw new Error(`Failed to detect database schema: ${error instanceof Error ? error.message : String(error)}`)
  }
}

/**
 * Checks if a table exists in the database
 */
export async function tableExists(tableName: string): Promise<boolean> {
  const schema = await fetchDatabaseSchema()
  return !!schema.tables[tableName]
}

/**
 * Checks if a column exists in a table
 */
export async function columnExists(tableName: string, columnName: string): Promise<boolean> {
  const schema = await fetchDatabaseSchema()
  const table = schema.tables[tableName]
  if (!table) return false

  return table.columns.some((col) => col.name === columnName)
}

/**
 * Gets all column names for a table
 */
export async function getTableColumns(tableName: string): Promise<string[]> {
  const schema = await fetchDatabaseSchema()
  const table = schema.tables[tableName]
  if (!table) return []

  return table.columns.map((col) => col.name)
}

/**
 * Validates a query against the actual schema
 * @param query The query object with tables and columns to validate
 * @returns An object with validation results
 */
export async function validateQuery(query: {
  tables: string[]
  columns: Record<string, string[]>
}): Promise<{
  valid: boolean
  missingTables: string[]
  missingColumns: Record<string, string[]>
}> {
  const schema = await fetchDatabaseSchema()
  const missingTables: string[] = []
  const missingColumns: Record<string, string[]> = {}

  // Check tables
  for (const tableName of query.tables) {
    if (!schema.tables[tableName]) {
      missingTables.push(tableName)
    }
  }

  // Check columns
  for (const [tableName, columnNames] of Object.entries(query.columns)) {
    const table = schema.tables[tableName]
    if (!table) continue // Table already reported as missing

    const tableColumns = table.columns.map((col) => col.name)
    const missing = columnNames.filter((col) => !tableColumns.includes(col))

    if (missing.length > 0) {
      missingColumns[tableName] = missing
    }
  }

  return {
    valid: missingTables.length === 0 && Object.keys(missingColumns).length === 0,
    missingTables,
    missingColumns,
  }
}

/**
 * Gets a safe column list for a table, only including columns that actually exist
 */
export async function getSafeColumnList(tableName: string, desiredColumns: string[]): Promise<string[]> {
  const existingColumns = await getTableColumns(tableName)
  return desiredColumns.filter((col) => existingColumns.includes(col))
}

/**
 * Builds a safe SELECT query string based on the actual schema
 */
export async function buildSafeSelectQuery(tableName: string, desiredColumns: string[] = ["*"]): Promise<string> {
  if (!(await tableExists(tableName))) {
    throw new Error(`Table '${tableName}' does not exist in the database`)
  }

  if (desiredColumns.includes("*")) {
    return "*"
  }

  const safeColumns = await getSafeColumnList(tableName, desiredColumns)
  if (safeColumns.length === 0) {
    return "*" // Fallback to all columns if none of the desired columns exist
  }

  return safeColumns.join(", ")
}

/**
 * Gets detailed information about a table
 */
export async function getTableInfo(tableName: string): Promise<TableSchema | null> {
  const schema = await fetchDatabaseSchema()
  return schema.tables[tableName] || null
}

/**
 * Gets a list of all tables in the database
 */
export async function getAllTables(): Promise<string[]> {
  const schema = await fetchDatabaseSchema()
  return Object.keys(schema.tables)
}

/**
 * Refreshes the schema cache
 */
export async function refreshSchemaCache(): Promise<void> {
  await fetchDatabaseSchema(true)
}
