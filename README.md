<<<<<<< HEAD
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
=======
# Personal Website
>>>>>>> fd62990f10ba9702a95356dc947b9cd36b1f39cd
