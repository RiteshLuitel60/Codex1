# World Leaders Atlas

Premium full-stack intelligence platform for transparent national leadership data.

## Stack
- Next.js + TypeScript + Tailwind + Framer Motion
- PostgreSQL + Prisma
- Redis + BullMQ
- Playwright + Cheerio

## Local setup
1. `npm install`
2. (Optional for full mode) create `.env` with `DATABASE_URL` and Redis variables.
3. `npx prisma generate`
4. (Optional for full mode) `npx prisma migrate dev --name init`
5. (Optional for full mode) `npm run prisma:seed`
6. `npm run dev`

## Modes
- **Demo mode (default if no `DATABASE_URL`)**: fully functional UI/API using bundled trusted sample records.
- **Full mode**: uses PostgreSQL + Redis for persistent snapshots and ingestion queues.

## Features
- Searchable country directory
- Interactive world map
- Country detail pages with citations + verification timestamps
- Historical leadership timeline
- Source ranking and conflict detection APIs
- Admin conflict resolution dashboard
- Export endpoint (`/api/export?format=csv`)
- Dark/light mode and multilingual-ready dictionary scaffolding

## Deploy v1 (free-tier path)
Follow `docs/deployment-v1.md` for Vercel + Neon + Upstash deployment.

See `docs/product-blueprint.md` for architecture, roadmap, and production plan.
