# Example Environment Variables

Copy this content to a `.env` file in the root of your project and fill in your specific values.

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Analytics (optional)
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=

# OpenAI (optional, for AI features)
OPENAI_API_KEY=

# GitHub (optional, for GitHub stats)
GITHUB_ACCESS_TOKEN=

# Admin Authentication (for admin panel)
NEXTAUTH_SECRET=generate_a_random_secret
NEXTAUTH_URL=http://localhost:3000

# Database Connection (only needed if you're using direct Postgres connection)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

## Getting Supabase Credentials

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. After creating a project, go to Project Settings > API
3. Copy the URL and anon key to your `.env` file
4. Make sure to enable the necessary permissions in your Supabase project for storage and database access
