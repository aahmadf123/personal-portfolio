import { NextResponse } from "next/server";
import {
  fetchDatabaseSchema,
  getAllTables,
  getTableInfo,
  refreshSchemaCache,
} from "@/lib/schema-detection";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const table = url.searchParams.get("table");
    const refresh = url.searchParams.get("refresh") === "true";

    if (refresh) {
      await refreshSchemaCache();
    }

    if (table) {
      // Get info for a specific table
      const tableInfo = await getTableInfo(table);
      if (!tableInfo) {
        return NextResponse.json(
          { error: `Table '${table}' not found` },
          { status: 404 }
        );
      }
      return NextResponse.json(tableInfo);
    } else {
      // Get all tables or full schema
      const fullSchema = url.searchParams.get("full") === "true";
      if (fullSchema) {
        const schema = await fetchDatabaseSchema();
        return NextResponse.json(schema);
      } else {
        const tables = await getAllTables();
        return NextResponse.json({ tables });
      }
    }
  } catch (error) {
    console.error("Error in database schema API:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
