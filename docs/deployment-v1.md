# World Leaders Atlas — Deployment v1 (Free Tier)

## Free resources used
- **Frontend/API hosting:** Vercel Hobby (free)
- **PostgreSQL:** Neon free tier
- **Redis:** Upstash free tier

## Required environment variables
- `DATABASE_URL` (Neon connection string)
- `REDIS_HOST` and `REDIS_PORT` **or** `REDIS_URL`

## Pre-deploy checklist
1. `npm ci`
2. `npm run typecheck`
3. `npm run lint`
4. `npm run build`
5. `npx prisma generate`
6. `npx prisma migrate deploy`

## Publish v1 steps
1. Push this repository to GitHub.
2. Create Neon + Upstash projects (both have no-cost tiers).
3. Import repo into Vercel and set env vars.
4. Deploy from `main` branch.
5. Configure a cron job for `POST /api/refresh` every 12h in Vercel cron.

## Runtime behavior
- With DB/Redis configured: full pipeline mode (persistent storage + queued refresh).
- Without DB/Redis: demo mode using built-in seed-like mock records (frontend remains functional).
