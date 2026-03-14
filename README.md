# World Leaders Atlas

World Leaders Atlas is a premium full-stack platform for tracking current national leadership across sovereign countries with transparent citations, trust scoring, conflict detection, and historical snapshots.

## Product Architecture

### Runtime layers
1. **Frontend (Next.js App Router + TypeScript + Tailwind + Framer Motion)**
   - Luxury editorial interface with responsive cards, cinematic hero, and glass surfaces.
   - Country directory, country detail pages, map panel, tracker, methodology, admin dashboard.
2. **API Layer (Next.js Route Handlers)**
   - Country list endpoint (`/api/countries`)
   - Country detail endpoint (`/api/countries/[code]`)
   - Export endpoint (`/api/export`)
3. **Data & Storage**
   - PostgreSQL + Prisma schema for countries, leaders, timelines, source records, conflicts, and snapshots.
   - Redis + BullMQ queue for scheduled ingest and asynchronous refresh jobs.
4. **Ingestion & Verification**
   - Playwright renders official pages.
   - Cheerio extracts structured hints.
   - Source ranker computes trust score and aggregate confidence.
   - Conflict detector flags disagreements by role/date/name for admin triage.

### Data flow
- Scheduler (cron or cloud scheduler) -> enqueue refresh job -> worker runs ingestion pipeline -> score sources -> detect conflicts -> write snapshots and source records -> publish API responses and frontend pages with timestamp and citation transparency.

## Database Schema
- Prisma schema is defined in `prisma/schema.prisma` and includes:
  - `Country`
  - `LeaderRole`
  - `TimelineEntry`
  - `SourceRecord`
  - `ConflictCase`
  - `Snapshot`

## Page Designs

### Core routes
- `/` Directory + hero + world map component.
- `/countries/[code]` Country profile page (all required fields plus citations and timeline).
- `/tracker` Leadership change tracker.
- `/methodology` Source methodology and verification principles.
- `/admin/conflicts` Conflict-resolution queue dashboard.

### UX style system
- Minimal top nav, wide margins, bold typography, soft gradients.
- Glass cards, subtle shadows, motion transitions via Framer Motion.
- Dark-first palette with `next-themes` support for dual theme extension.
- Built-in loading, error, and not-found states.

## Reusable Components
- `components/site-header.tsx`
- `components/hero.tsx`
- `components/country-card.tsx`
- `components/world-map.tsx`
- `components/source-panel.tsx`
- `components/timeline.tsx`
- `components/theme-provider.tsx`

## Ingestion Logic
- Source catalog in `lib/ingestion/sourceCatalog.ts`
- Scrapers in `lib/ingestion/scrapers.ts` (Playwright + Cheerio)
- End-to-end pipeline in `lib/ingestion/pipeline.ts`
- One-off ingest runner in `scripts/runIngestion.ts`

## Source-Ranking Logic
- `rankSourceTrust` weights:
  - publisher trust tier
  - historical accuracy
  - recency decay
- `aggregateConfidence` computes confidence from ranked source set.
- Conflict logic in `lib/scoring/conflictDetector.ts` groups candidate records per role and marks conflict when fields disagree.

## Admin Dashboard Plan
1. Open conflicts queue with confidence spread and evidence summary.
2. Side-by-side candidate comparison by source trust.
3. Decision actions: approve candidate, request manual review, hold publication.
4. Resolution audit log persisted in `ConflictCase`.

## Folder Structure

```text
app/
  api/
  admin/conflicts/
  countries/[code]/
  methodology/
  tracker/
components/
data/
lib/
  i18n/
  ingestion/
  queue/
  scoring/
prisma/
scripts/
```

## MVP Roadmap

### Phase 1 (Current scaffold)
- UI shell, route map, API route stubs, scoring/conflict modules, ingestion pipeline skeleton.

### Phase 2
- Populate all sovereign countries and region metadata.
- Build map polygons + hover interactions + geo filters.
- Persist ingestion output to PostgreSQL and snapshots.

### Phase 3
- Automate refresh schedules by region cadence.
- Add admin auth + full conflict review workflow.
- Add CSV/JSON export controls and signed snapshots.

### Phase 4
- Expand multilingual content dictionaries and locale routing.
- Introduce richer timeline visualizations and notification feeds.

## Production Deployment Plan

1. **Frontend/API hosting**: Deploy Next.js on Vercel or containerized platform.
2. **Database**: Managed PostgreSQL (Neon, RDS, Supabase, AlloyDB).
3. **Queue**: Managed Redis (Upstash/Elasticache).
4. **Workers**: Separate worker service for BullMQ jobs.
5. **Scheduling**: Cloud scheduler triggers enqueue endpoint.
6. **Observability**: OpenTelemetry logs for ingestion and conflict rates.
7. **Data governance**: Save immutable snapshots and verification metadata for auditability.
8. **SEO & internationalization**: metadata routes + locale strategy from `lib/i18n/config.ts`.

## Local development

```bash
npm install
npm run dev
```

Optional pipeline jobs:

```bash
npm run ingest:once
npm run worker
```
