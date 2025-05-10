import { createServerSupabaseClient } from "./supabase"

export async function setupDatabase() {
  const supabase = createServerSupabaseClient()

  try {
    // Check if case_studies table exists
    const { error: checkError } = await supabase.from("case_studies").select("id").limit(1)

    // If table doesn't exist, create it
    if (checkError && checkError.code === "42P01") {
      console.log("Setting up database tables...")

      // Create case_studies table
      await supabase.rpc("create_case_studies_table")

      console.log("Database tables created successfully")
    }
  } catch (error) {
    console.error("Error setting up database:", error)
  }
}

// Function to create stored procedures for table creation
export async function setupStoredProcedures() {
  const supabase = createServerSupabaseClient()

  try {
    // Create stored procedure for case_studies table
    await supabase.rpc("create_stored_procedures")
    console.log("Stored procedures created successfully")
  } catch (error) {
    console.error("Error setting up stored procedures:", error)
  }
}
