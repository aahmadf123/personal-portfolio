# Personal Portfolio

A modern portfolio website built with Next.js, featuring project showcases, blog posts, and skill demonstrations. The site was originally hosted on Vercel and has been migrated to Netlify with Supabase for database and storage.

## Technologies

- **Frontend**: Next.js 14, Tailwind CSS, React
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase Storage
- **Hosting**: Netlify

## Sections

- Projects showcase
- Blog with articles
- Skills showcase
- Timeline of experience and education
- Contact form
- Admin dashboard for content management

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- pnpm
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your Supabase credentials.

### Development

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Supabase Migration

This project has been migrated from Vercel to use Supabase for both database and storage. To set up the Supabase infrastructure, follow the instructions in [docs/supabase-setup.md](docs/supabase-setup.md).

### Key Migration Steps

1. Set up Supabase database schema
2. Migrate existing data to Supabase
3. Replace Vercel Blob with Supabase Storage
4. Update API routes to use Supabase clients

## Deployment

### Netlify Deployment

Deploy to Netlify by connecting your repository. The `netlify.toml` file contains the necessary configuration.

```bash
# Build command
pnpm build

# Publish directory
.next
```

## License

[MIT](LICENSE)

## Contact

Feel free to reach out if you have any questions or suggestions!

## GitHub Integration

This project includes integration with GitHub repositories to automatically update research projects based on GitHub activity:

1. **Automatic Updates**: When commits, issues, or pull requests are created or closed in a linked GitHub repository, the corresponding research project in the portfolio is automatically updated.

2. **Setup Instructions**:

   - Add the GitHub repository URL as a resource to your research project
   - In your GitHub repository, add the following secrets:
     - `WEBHOOK_URL`: Your portfolio webhook URL (e.g., `https://yourportfolio.com/api/github/webhook`)
     - `WEBHOOK_SECRET`: A random secret string you generate to verify webhooks
     - `API_TOKEN`: Your Supabase service role key

3. **Features**:

   - Commits are added as project updates
   - Issues labeled as challenges are added to the project challenges
   - Completed milestones update the project completion percentage
   - Merged PRs increase project completion

4. **Manual Sync**: Visit `/api/github/sync-projects` to manually trigger a sync of all research projects with their GitHub repositories.
