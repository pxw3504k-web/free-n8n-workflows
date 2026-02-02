# Free n8n Workflows Collection

<div align="center">

[English](./README.md) | [简体中文](./README_zh.md) | [日本語](./README_ja.md) | [Español](./README_es.md)

</div>

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fpwj19960112%2Ffree-n8n-workflows)
[![GitHub stars](https://img.shields.io/github/stars/pwj19960112/free-n8n-workflows?style=social)](https://github.com/pwj19960112/free-n8n-workflows)

🚀 **1000+ Verified n8n Automation Workflows** - Open Source & Free to Download.

Stop building from scratch. Discover, search, and deploy production-ready n8n workflows for marketing, sales, operations, and AI automation.

## 📱 Mobile Apps

**Unlock more possibilities with our productivity tools:**

### [App Name 1] - [One Line Value Prop]

Scan code or click to download:

![App 1 QR Code](https://placehold.co/200x200?text=App+1+QR)

[Download on App Store / Google Play](#)

### [App Name 2] - [One Line Value Prop]

Scan code or click to download:

![App 2 QR Code](https://placehold.co/200x200?text=App+2+QR)

[Download on App Store / Google Play](#)

---

## Features

- 🔍 **Search & Filter**: Browse workflows by category, integration, or keyword.
- 📦 **One-Click Download**: Get verified JSON templates instantly.
- 🌐 **Multilingual Support**: English and Chinese localization.
- ⚡ **High Performance**: Built with Next.js 14 and Supabase for speed.
- 🎨 **Modern UI**: Clean, responsive interface with dark mode support.

## Data & Backup

The complete database of workflows is included in this repository to ensure it remains available even if the original site goes down.

- **JSON Format**: [`data/workflows.json`](./data/workflows.json) - Full export of all workflows.
- **SQL Schema**: [`data/schema.sql`](./data/schema.sql) - Database structure for self-hosting.

## How to Self-Host

You can deploy this project yourself using Vercel or Docker.

### Option 1: Vercel (Recommended) & Supabase

1. **Fork this repository**.
2. **Create a Supabase project**:
   - Go to [Supabase](https://supabase.com) and create a new project.
   - Run the SQL from [`data/schema.sql`](./data/schema.sql) in the Supabase SQL Editor.
   - Import the data from [`data/workflows.json`](./data/workflows.json) (you may need a simple script to insert this JSON into the `workflows` table).
3. **Deploy to Vercel**:
   - Click the "Deploy with Vercel" button above or import your forked repo in Vercel.
   - Set the environment variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your-project-url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
     NEXT_PUBLIC_SITE_URL=https://your-domain.com
     ```

### Option 2: Docker (Local / VPS)

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/free-n8n-workflows.git
   cd free-n8n-workflows
   ```

2. **Setup Environment**:

   ```bash
   cp env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

3. **Run with Docker**:

   ```bash
   docker build -t n8n-workflows .
   docker run -p 3000:3000 n8n-workflows
   ```

4. **Database Setup**:
   You will need a Postgres database (or local Supabase instance).
   - Initialize the database using `data/schema.sql`.
   - Load data from `data/workflows.json`.

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## License

MIT License. Feel free to use and modify for your own needs.
