# Portfolio Project Setup Guide

This guide will help you set up the portfolio project after migrating from Vercel to Supabase.

## 1. Environment Setup

Create a `.env` file in the root directory with the following variables:

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Replace the placeholder values with your actual Supabase project information.

## 2. Database Setup

To set up the Supabase database tables, run:

```
npm run setup-db
```

This command will create all necessary tables in your Supabase project.

## 3. Image Migration

To migrate images from Vercel Blob to Supabase Storage:

1. Add URLs to the `vercel-image-urls.txt` file (there are some examples included)
2. Run the migration script:

```
npm run migrate-images
```

This will:

- Create a `portfolio-bucket` in your Supabase Storage if it doesn't exist
- Download each image from Vercel Blob
- Upload it to Supabase Storage
- Generate a mapping file so you can see which URLs have changed

## 4. Running the Project

To run the project locally:

```
npm run dev
```

## 5. Deployment to Netlify

This project is configured to deploy to Netlify using the following settings:

1. Build command: `next build`
2. Publish directory: `.next`
3. Environment variables: Make sure to add all the same environment variables from your `.env` file to Netlify's environment variables section.

---

## Troubleshooting

### Database Connection Issues

If you encounter database connection issues:

- Verify that your Supabase credentials are correct
- Check if your IP is allowed in Supabase's access control settings
- Ensure your database is active

### Image Migration Issues

If you have problems with the image migration:

- Check if the Supabase bucket was created correctly
- Verify your Supabase storage permissions
- Make sure the Vercel Blob URLs are accessible
