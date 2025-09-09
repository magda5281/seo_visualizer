# SEO Tag Visualizer

Live demo: 
🔗 **<a href="https://seo-tag-wizzard.replit.app" target="_blank">Live
Demo</a>**

SEO Tag Visualizer fetches a web page and visualises key on-page SEO signals (title, meta description, Open Graph, Twitter cards, canonical, viewport, etc.). It computes a simple score and suggests quick wins.

Originally scaffolded and deployed with **Replit AI Agent**; runs locally with **Node 20** and **PostgreSQL (Neon or local)**.

---

## ✨ Features

- Paste a URL → get a structured SEO analysis
- Extracts `title`, meta tags, Open Graph, Twitter Card tags, canonical, viewport, charset and more
- Computes a score with pass/warning/fail checks and actionable recommendations
- Saves history of analyses to Postgres
- Clean UI (React + Vite + Tailwind + Radix)
- Type-safe validation with Zod

---

## 🧱 Tech Stack

- **Frontend:** React 18, Vite, Radix UI, Tailwind, TanStack Query, Recharts
- **Backend:** Node 20, Express, `ws` (WebSocket), `express-session`
- **DB/ORM:** PostgreSQL (Neon or local), Drizzle ORM (`drizzle-kit`)
- **Parsing:** Cheerio, Axios
- **Validation:** Zod + React Hook Form
- **Build/Tooling:** TypeScript, esbuild, tsx

---

## ✅ Requirements

- Node.js **v20** or newer
- A PostgreSQL connection string  
  - Neon recommended (remember `?sslmode=require`)  
  - or local Postgres via Docker

---

## 🚀 Quick Start (Local)

```bash
# 1) Install dependencies
npm install

# 2) Create env file and fill values
cp .env.example .env
DATABASE_URL=
SESSION_SECRET=
HOST=127.0.0.1
PORT=3000
NODE_ENV=development

# --- Database ---
# Neon example (keep sslmode=require):
# DATABASE_URL=postgresql://USER:PASSWORD@YOUR-HOST.neon.tech/neondb?sslmode=require
# Local Postgres example:
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/seoviz

# --- Session ---
SESSION_SECRET=change_me_to_a_long_random_string
# simply generate in terminal with openssl rand -base64 48

# --- Server ---
HOST=127.0.0.1
PORT=3000
NODE_ENV=development

# 3) Create/Update tables in the DB
npm run db:push

# 4) Start dev server
npm run dev
