import { createServerSupabaseClient } from "./supabase"

/**
 * A utility for building safe database queries that adapt to the actual schema
 */
export class SafeQueryBuilder {
  private supabase = createServerSupabaseClient()
  private tableName: string
  private selectedColumns: string[] = ["*"]
  private whereConditions: Array<{ column: string; value: any }> = []
  private orderByColumn?: string
  private orderDirection: "asc" | "desc" = "asc"
  private limitValue?: number
  private offsetValue?: number

  constructor(tableName: string) {
    this.tableName = tableName
  }

  /**
   * Selects columns for the query
   */
  select(columns: string[] | string): SafeQueryBuilder {
    if (typeof columns === "string") {
      this.selectedColumns = [columns]
    } else {
      this.selectedColumns = columns
    }
    return this
  }

  /**
   * Adds a where clause to the query
   */
  where(column: string, value: any): SafeQueryBuilder {
    this.whereConditions.push({ column, value })
    return this
  }

  /**
   * Adds an order by clause to the query
   */
  orderBy(column: string, direction: "asc" | "desc" = "asc"): SafeQueryBuilder {
    this.orderByColumn = column
    this.orderDirection = direction
    return this
  }

  /**
   * Sets a limit on the query
   */
  limit(value: number): SafeQueryBuilder {
    this.limitValue = value
    return this
  }

  /**
   * Sets an offset on the query
   */
  offset(value: number): SafeQueryBuilder {
    this.offsetValue = value
    return this
  }

  /**
   * Executes the query with error handling for missing columns
   */
  async execute() {
    try {
      // Start building the query
      let query = this.supabase.from(this.tableName).select(this.selectedColumns.join(","))

      // Add where clauses
      for (const condition of this.whereConditions) {
        query = query.eq(condition.column, condition.value)
      }

      // Add order by
      if (this.orderByColumn) {
        query = query.order(this.orderByColumn, { ascending: this.orderDirection === "asc" })
      }

      // Add limit and offset
      if (this.limitValue !== undefined) {
        query = query.limit(this.limitValue)
      }

      if (this.offsetValue !== undefined) {
        query = query.range(this.offsetValue, this.offsetValue + (this.limitValue || 10) - 1)
      }

      // Execute the query
      const { data, error } = await query

      // If there's an error, check if it's related to missing columns
      if (
        error &&
        error.message &&
        (error.message.includes("column") ||
          error.message.includes("does not exist") ||
          error.message.includes("undefined"))
      ) {
        console.warn(`Schema mismatch in query for ${this.tableName}:`, error.message)

        // Try again with just the id column as a fallback
        const fallbackQuery = this.supabase.from(this.tableName).select("id")
        return await fallbackQuery
      }

      return { data, error }
    } catch (error) {
      console.error(`Error executing query for ${this.tableName}:`, error)
      return { data: null, error }
    }
  }
}

/**
 * Creates a new safe query builder for a table
 */
export function createSafeQuery(tableName: string): SafeQueryBuilder {
  return new SafeQueryBuilder(tableName)
}
