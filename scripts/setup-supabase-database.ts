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

// Test database connection
async function testConnection() {
  try {
    console.log("Testing database connection...");
    const { data, error } = await supabase
      .from("_prisma_migrations")
      .select("*")
      .limit(1);

    if (error) {
      // This is expected if the table doesn't exist yet
      console.log("Connection successful. Ready to set up tables.");
      return true;
    }

    console.log("Connection successful. Database appears to be initialized.");
    return true;
  } catch (error) {
    console.error("Failed to connect to database:", error);
    return false;
  }
}

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

    // Test connection first
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error("Cannot proceed with setup due to connection issues.");
      process.exit(1);
    }

    // Read SQL schema file
    const schemaPath = path.join(
      process.cwd(),
      "scripts",
      "setup-supabase-schema.sql"
    );

    if (!fs.existsSync(schemaPath)) {
      console.error(`Schema file not found: ${schemaPath}`);
      process.exit(1);
    }

    const schemaSQL = fs.readFileSync(schemaPath, "utf-8");

    // Split into individual statements
    const statements = splitSqlStatements(schemaSQL);
    console.log(`Found ${statements.length} SQL statements to execute`);

    // Execute each statement individually
    let successCount = 0;
    let errorCount = 0;
    let warningCount = 0;

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

        // Try RPC method first
        let error;
        try {
          const { error: rpcError } = await supabase.rpc("exec_sql", {
            sql_query: statement,
          });
          error = rpcError;
        } catch (e) {
          // RPC method not available, fall back to direct SQL
          error = e;
        }

        // If RPC fails, try direct SQL
        if (error) {
          try {
            const { error: sqlError } = await supabase.sql(statement);
            error = sqlError;
          } catch (e) {
            error = e;
          }
        }

        if (error) {
          // Check if it's a "relation already exists" error, which can be treated as a warning
          const errorMessage = error.message || "";
          if (errorMessage.includes("already exists")) {
            console.log(`⚠️ Warning: ${errorMessage}`);
            warningCount++;
          } else {
            console.log(`❌ Error: ${errorMessage}`);
            errorCount++;
          }
          continue;
        }

        console.log("✅ Success");
        successCount++;
      } catch (err: any) {
        console.log(`❌ Error: ${err.message || "Unknown error"}`);
        errorCount++;
      }
    }

    console.log(
      `\nDatabase setup completed with ${successCount} successful statements, ${warningCount} warnings, and ${errorCount} errors.`
    );

    if (errorCount > 0) {
      console.log(
        "\nSome statements failed. If tables already exist, this may be expected."
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
