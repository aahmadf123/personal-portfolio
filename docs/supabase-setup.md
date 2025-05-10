# Supabase Database Setup

This document provides instructions for setting up the Supabase database for the portfolio site.

## Prerequisites

- Supabase account and project created
- Environment variables set in `.env` file

## Environment Variables

Make sure the following variables are set in your `.env` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Setup Steps

1. **Create the database schema**

   Run the following command to set up the database tables and schema:

   ```bash
   npm run setup-db
   ```

   This will execute the SQL in `scripts/setup-supabase-schema.sql` to create all required tables, indices, and functions.

2. **Migrate existing data**

   After the schema is set up, migrate your existing data from JSON/TS files to Supabase:

   ```bash
   npm run migrate-data
   ```

   This will:

   - Migrate projects and associated data (challenges, milestones, etc.)
   - Migrate organizations
   - Create sample skills data
   - Create sample blog posts and tags

3. **Migrate images from Vercel Blob to Supabase Storage**

   If you're migrating from Vercel Blob storage:

   ```bash
   npm run migrate-images
   ```

   This will transfer all your images from Vercel to Supabase Storage.

## Database Schema

The database includes the following main tables:

- `projects` - Portfolio projects
- `project_technologies` - Technologies used in projects
- `project_tags` - Tags for projects
- `project_challenges` - Challenges faced in projects
- `project_milestones` - Project milestones/timeline
- `project_images` - Images associated with projects
- `blog_posts` - Blog articles
- `blog_tags` - Tags for blog posts
- `blog_post_tags` - Mapping between posts and tags
- `skills` - Skills organized by categories
- `media_metadata` - Metadata for stored files

For the complete schema, see `scripts/setup-supabase-schema.sql`.

## Utility Files

- `lib/supabase-content.ts` - Functions for fetching content from Supabase
- `lib/storage-utils.ts` - Utilities for working with Supabase Storage
- `scripts/setup-supabase-database.ts` - Script for setting up the database
- `scripts/migrate-data-to-supabase.ts` - Script for migrating data
- `scripts/migrate-images.ts` - Script for migrating images

## Troubleshooting

1. **Database Connection Issues**

   If you encounter connection issues, check your environment variables and make sure your IP is allowed in Supabase.

2. **Schema Creation Errors**

   If you encounter errors during schema creation, try running each create table statement manually in the Supabase SQL editor.

3. **Data Migration Errors**

   If data migration fails, check the error messages and fix the source data if needed. You may need to run parts of the migration script manually.
