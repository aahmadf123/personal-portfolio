/**
 * Script to set up Supabase database tables for the portfolio
 *
 * Usage:
 * 1. Make sure .env has NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 * 2. Run: npm run setup-db
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing Supabase environment variables. Make sure .env is properly set up with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

// Split SQL into individual statements to handle them one by one
function splitSqlStatements(sql: string): string[] {
  // Basic SQL statement splitting - this handles most common cases
  // More complex scripts might need more sophisticated parsing
  return sql
    .split(";")
    .map((statement) => statement.trim())
    .filter((statement) => statement.length > 0)
    .map((statement) => statement + ";");
}

async function setupDatabase() {
  try {
    console.log("Setting up Supabase database...");

    // Read SQL schema file
    const schemaPath = path.join(
      process.cwd(),
      "scripts",
      "setup-supabase-schema.sql"
    );
    const schemaSQL = fs.readFileSync(schemaPath, "utf-8");

    // Split into individual statements
    const statements = splitSqlStatements(schemaSQL);
    console.log(`Found ${statements.length} SQL statements to execute`);

    // Execute each statement individually
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      try {
        // Skip empty statements
        if (!statement.trim()) continue;

        // Log first 50 chars of statement
        const previewText = statement.substring(0, 50).replace(/\s+/g, " ");
        process.stdout.write(
          `Executing statement ${i + 1}/${
            statements.length
          }: ${previewText}... `
        );

        const { error } = await supabase.rpc("exec_sql", {
          sql_query: statement,
        });

        if (error) {
          // Fallback to direct SQL if RPC not available
          const { error: sqlError } = await supabase.sql(statement);

          if (sqlError) {
            console.log(`❌ Error: ${sqlError.message}`);
            errorCount++;
            continue;
          }
        }

        console.log("✅ Success");
        successCount++;
      } catch (err: any) {
        console.log(`❌ Error: ${err.message || "Unknown error"}`);
        errorCount++;
      }
    }

    console.log(
      `\nDatabase setup completed with ${successCount} successful statements and ${errorCount} errors.`
    );

    if (errorCount > 0) {
      console.log(
        "\nSome statements failed. This might be expected if tables already exist."
      );
    } else {
      console.log("\nDatabase schema set up successfully!");
    }
  } catch (error: any) {
    console.error("Error setting up database:", error.message || error);
    process.exit(1);
  }
}

setupDatabase();
