# World Leaders Atlas - Product Blueprint

## 1) Product architecture
- **Presentation:** Next.js App Router + TypeScript + Tailwind + Framer Motion.
- **Application APIs:** Route handlers under `src/app/api/*` for countries, sources, conflicts, refresh, and export.
- **Data layer:** Prisma ORM over PostgreSQL for canonical entities and snapshots.
- **Ingestion layer:** BullMQ queue + worker for scheduled refresh jobs.
- **Collection adapters:** Playwright for dynamic/JS-driven pages, Cheerio for extraction logic.
- **Cache layer:** Redis for queue transport, dedupe keys, and near-real-time read caching.

### High-level flow
1. Scheduler triggers `/api/refresh`.
2. Queue enqueues one job per country.
3. Worker fetches source records, computes trust/confidence, detects conflicts, writes snapshots.
4. Frontend surfaces current leaders, citations, confidence, and historical timelines.
5. Admin dashboard resolves conflicts and records audit notes.

## 2) Database schema overview
Core Prisma models:
- `Country`: identity + region + government metadata.
- `Leader`: normalized leader profile.
- `LeaderAssignment`: role-specific term records (current + historical).
- `Source`: source registry with weighted credibility signals.
- `Citation`: role-level evidence with trust score and retrieval timestamp.
- `VerificationSnapshot`: immutable verification snapshots for history and observability.
- `Conflict`: disagreement cases routed to admin workflow.

## 3) Page designs
- `/`: cinematic hero, feature pillars, interactive world map, premium CTA.
- `/countries`: searchable directory + confidence-forward cards.
- `/countries/[slug]`: editorial dossier with current roles, confidence, citations, timeline.
- `/tracker`: snapshot-driven leadership change feed.
- `/methodology`: transparent scoring/verification methodology.
- `/admin/conflicts`: conflict queue for manual adjudication.

## 4) Reusable component system
- `NavShell`: minimal navigation + theme toggle.
- `Hero`: motion-powered statement section.
- `WorldMap`: interactive region jump map.
- `CountryCard`: reusable preview cards.
- `SourcePanel`: citation and verification transparency.
- `Timeline`: historical leadership chronology.

## 5) Ingestion logic
- `collector.ts`:
  - launches Playwright in headless mode,
  - loads source page,
  - parses semantic data hooks using Cheerio.
- `queue.ts`:
  - creates BullMQ queue,
  - schedules per-country refresh jobs.
- `worker.ts`:
  - resolves source inputs,
  - applies conflict + confidence algorithms,
  - writes snapshots,
  - opens conflict records when disagreement exceeds threshold.

## 6) Source ranking logic
Weighted score:
- Base credibility: 40%
- Recency weight: 10%
- Official authority signal: 20%
- Independent corroboration signal: 15%
- Transparency signal: 15%

Output:
- Tier A (`>=0.90`), B (`>=0.80`), C (`>=0.65`), D (`<0.65`).
- Final leader confidence = mean source score - conflict penalty.

## 7) Admin dashboard plan
- Conflict inbox sorted by risk and confidence delta.
- Side-by-side evidence pane (official vs corroborating sources).
- Resolution actions: `Accept Source A`, `Accept Source B`, `Request Manual Review`, `Mark Inconclusive`.
- Audit trail: reviewer, timestamp, rationale.
- Recompute confidence and create new snapshot post-resolution.

## 8) Folder structure
```txt
src/
  app/
    api/
      countries/
      conflicts/
      export/
      refresh/
      sources/
    admin/conflicts/
    countries/[slug]/
    methodology/
    tracker/
    layout.tsx
    page.tsx
  components/
  ingestion/
  lib/
prisma/
docs/
```

## 9) MVP roadmap
1. **Phase 1 - Foundation (Week 1):** schema, seed data, API routes, core pages.
2. **Phase 2 - Ingestion (Week 2):** collectors for 10 pilot countries, queue + worker, confidence scoring.
3. **Phase 3 - Transparency (Week 3):** citation surfaces, timeline snapshots, methodology hardening.
4. **Phase 4 - Operations (Week 4):** admin conflict workflow, scheduler, export, SEO polish.
5. **Phase 5 - Expansion (Week 5+):** coverage scaling, multilingual content packs, advanced analytics.

## 10) Production deployment plan
- **Frontend/API:** Deploy Next.js on Vercel or containerized on Fly/Render.
- **Database:** Managed PostgreSQL (Neon, Supabase, RDS).
- **Redis/Queue:** Upstash Redis or self-managed Redis with TLS.
- **Workers:** Dedicated worker process (`npm run queue:worker`) with autoscaling.
- **Scheduling:** Cron calling `/api/refresh` every 6-12 hours.
- **Monitoring:** OpenTelemetry traces, job success SLAs, conflict volume alerts.
- **Security:** Secret rotation, admin RBAC, signed export URLs.
- **Data governance:** snapshot retention policy + source attribution guarantees.
