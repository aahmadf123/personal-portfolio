# Admin Interface Documentation

The admin interface for your portfolio site allows you to manage all content directly through a web interface without needing to access the Supabase database directly. This document provides an overview of the admin functionality and how it interacts with the Supabase backend.

## Overview

The admin dashboard provides the following key features:

1. **Project Management**: Create, edit, and delete portfolio projects
2. **Blog Management**: Manage blog posts with rich content and tags
3. **Media Library**: Upload, browse, and manage images and files
4. **Skills Management**: Organize your professional skills by category
5. **Database Management**: Access to view and manage database schema

## Authentication

All admin routes and API endpoints are protected by authentication. The site uses Supabase Auth to handle user sessions.

## Project Management

Projects are stored in the `projects` table with related data in:

- `project_technologies`
- `project_tags`
- `project_challenges`
- `project_milestones`
- `project_images`

### API Endpoints

- `GET /api/admin/projects` - List all projects
- `POST /api/admin/projects` - Create a new project
- `GET /api/admin/projects/[id]` - Get a specific project
- `PUT /api/admin/projects/[id]` - Update a project
- `DELETE /api/admin/projects/[id]` - Delete a project

When you create or update a project through the admin interface, the application handles all the relationships automatically, including:

- Creating/updating the main project record
- Managing associated technologies
- Managing associated tags
- Managing project challenges
- Managing project milestones
- Managing project images

## Blog Management

Blog posts are stored in the `blog_posts` table with related data in:

- `blog_post_tags`
- `blog_tags`
- `categories`

### API Endpoints

- `GET /api/admin/blog-posts` - List all blog posts
- `POST /api/admin/blog-posts` - Create a new blog post
- `GET /api/admin/blog-posts/[id]` - Get a specific blog post
- `PUT /api/admin/blog-posts/[id]` - Update a blog post
- `DELETE /api/admin/blog-posts/[id]` - Delete a blog post

The blog editor supports markdown content and image embedding. When working with blog tags, the system automatically:

1. Checks if a tag exists
2. Creates the tag if it doesn't exist
3. Associates the tag with the blog post

## Media Management

Files are stored in Supabase Storage in the "media" bucket, with metadata stored in the `media_metadata` table.

### API Endpoints

- `POST /api/admin/media/upload` - Upload a new file
- `GET /api/admin/media/list` - List files (with optional folder parameter)
- `POST /api/admin/media/delete` - Delete a file

When you upload a file through the media library:

1. The file is uploaded to Supabase Storage
2. A metadata record is created in the `media_metadata` table
3. A public URL is generated and returned to the client

## Skills Management

Skills are stored in the `skills` table, organized by category.

## Data Validation

All admin API endpoints include validation to ensure:

1. Required fields are present
2. Slugs are unique
3. Data types are correct
4. Authentication is verified

## File Structure

The admin interface is built using:

1. Next.js App Router for page routing
2. React components for the UI
3. API routes for backend communication
4. Server actions for form submission
5. Supabase client for database and storage operations

## Creating Admin Users

To create an admin user:

1. Use the Supabase dashboard to add a user to the Authentication service
2. Set the user role to "admin" in the `users` table

## Error Handling

The admin interface includes comprehensive error handling:

1. API errors are logged to the console
2. User-friendly error messages are displayed in the UI
3. Validation errors are shown on forms
4. Authentication errors redirect to the login page

## Customization

You can extend the admin interface by:

1. Adding new sections to the dashboard
2. Creating new API endpoints for additional functionality
3. Extending the database schema with new tables
4. Adding new UI components for specialized editing tasks
