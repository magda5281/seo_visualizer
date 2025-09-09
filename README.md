# SEO Tag Visualizer

Live demo: https://seo-tag-wizzard.replit.app

SEO Tag Visualizer audits and visualises key HTML/SEO tags for a given URL.  
Built on **Express + Vite + React**, using **Postgres (Neon)** with **Drizzle ORM**. Originally scaffolded and deployed via **Replit AI Agent**.

## Tech stack
- **Frontend:** React 18, Vite, Radix UI, Tailwind, TanStack Query, Recharts
- **Backend:** Node/Express, ws (WebSocket), express-session
- **DB/ORM:** Postgres (Neon or local), Drizzle ORM
- **Validation:** Zod + @hookform/resolvers / react-hook-form
- **Build/Tooling:** TypeScript, esbuild, tsx

## Requirements
- Node.js 20+
- A Postgres connection string (Neon recommended)

## Quick start (local)
```bash
# 1) Install deps
npm install

# 2) Create env file
cp .env.example .env
# Edit .env and fill DATABASE_URL and SESSION_SECRET

# 3) Create tables in the DB
npm run db:push

# 4) Start dev server
npm run dev
