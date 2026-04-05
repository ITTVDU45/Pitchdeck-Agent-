# Pitchdeck Tool (MVP)

Monorepo mit `apps/web` (Next.js 15) und `packages/core` (Domäne, Zod, In-Memory-Store).

```bash
npm install
docker compose up -d
cp apps/web/.env.example apps/web/.env
cd apps/web && npx prisma db push && npm run db:seed && cd ../..
npm run dev
```

Optionaler **Testkunde** (IBS): `npm run db:seed` (idempotent).

Datenbank: **Prisma + PostgreSQL**. Zeilen zum Kopieren: **`ENV-VORLAGE.md`** und `apps/web/.env.example`.

Siehe `docs/architecture/mvp-plan.md` und `docs/technische-codex-roadmap.md`.

**Vercel:** Schritt-für-Schritt unter [`docs/deployment-vercel.md`](docs/deployment-vercel.md).
