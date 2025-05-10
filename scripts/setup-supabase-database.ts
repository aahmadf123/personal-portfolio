/**
 * Script to set up Supabase database tables for the portfolio
 *
 * Usage:
 * 1. Make sure .env has NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
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
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing Supabase environment variables. Make sure .env is properly set up."
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

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

    // Execute the SQL
    const { error } = await supabase.rpc("pgtle_install_schema", {
      schema_sql: schemaSQL,
    });

    if (error) {
      // If RPC method fails, try direct SQL execution
      console.log("Falling back to direct SQL execution...");
      const { error: sqlError } = await supabase.sql(schemaSQL);

      if (sqlError) {
        console.error("Failed to set up database schema:", sqlError);
        process.exit(1);
      }
    }

    console.log("Database schema set up successfully!");
  } catch (error) {
    console.error("Error setting up database:", error);
    process.exit(1);
  }
}

setupDatabase();
