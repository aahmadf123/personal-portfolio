/**
 * Utility to check for required environment variables
 */

export function checkRequiredEnvVars() {
  const requiredVars = [
    { name: "NEXT_PUBLIC_SUPABASE_URL", description: "Supabase project URL" },
    {
      name: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      description: "Supabase anonymous key for client-side access",
    },
    {
      name: "SUPABASE_SERVICE_ROLE_KEY",
      description: "Supabase service role key for admin operations",
    },
  ];

  const optionalVars = [
    {
      name: "NEXT_PUBLIC_SUPABASE_BUCKET",
      description: 'Storage bucket name (defaults to "portfolio-bucket")',
    },
    {
      name: "DATABASE_URL",
      description:
        "Direct database connection string (optional for admin tools)",
    },
  ];

  const missing: string[] = [];

  // Check required variables
  requiredVars.forEach((envVar) => {
    if (!process.env[envVar.name]) {
      missing.push(`${envVar.name} (${envVar.description})`);
    }
  });

  // Report any missing variables
  if (missing.length > 0) {
    console.error("\n❌ Missing required environment variables:");
    missing.forEach((missingVar) => {
      console.error(`  - ${missingVar}`);
    });
    console.error(
      "\nMake sure these are defined in your .env file or environment."
    );

    if (process.env.NODE_ENV === "production") {
      throw new Error(
        `Missing required environment variables: ${missing.join(", ")}`
      );
    }
  }

  // Check optional variables
  const missingOptional: string[] = [];
  optionalVars.forEach((envVar) => {
    if (!process.env[envVar.name]) {
      missingOptional.push(`${envVar.name} (${envVar.description})`);
    }
  });

  if (missingOptional.length > 0 && process.env.NODE_ENV !== "production") {
    console.warn("\n⚠️ Missing optional environment variables:");
    missingOptional.forEach((missingVar) => {
      console.warn(`  - ${missingVar}`);
    });
    console.warn(
      "\nThese are not required but may be needed for some features."
    );
  }

  return { success: missing.length === 0, missing, missingOptional };
}

// Export the default bucket name
export const DEFAULT_BUCKET_NAME =
  process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "profolio-bucket";
