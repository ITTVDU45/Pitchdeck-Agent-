# Pitchdeck Tool (MVP)

Monorepo mit `apps/web` (Next.js 15) und `packages/core` (Domäne, Zod, In-Memory-Store).

```bash
npm install
cp .env.example apps/web/.env   # DATABASE_URL (SQLite) – siehe .env.example
cd apps/web && npx prisma db push && npm run db:seed && cd ../..
npm run dev
```

Optionaler **Testkunde** (IBS / Sicherheitstechnik / David Viu / ibs.de): wird mit `npm run db:seed` aus `apps/web/prisma/seed.ts` angelegt (idempotent).

Datenbank: **Prisma + SQLite** (`apps/web/prisma/schema.prisma`). `DATABASE_URL` z. B. `file:./dev.db` (relativ zum `prisma/`-Ordner, siehe `.env.example`).

Siehe `docs/architecture/mvp-plan.md` und `docs/technische-codex-roadmap.md`.

**Vercel:** Schritt-für-Schritt unter [`docs/deployment-vercel.md`](docs/deployment-vercel.md).
