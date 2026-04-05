# Pitchdeck Tool (MVP)

Monorepo mit `apps/web` (Next.js 15) und `packages/core` (Domäne, Zod, In-Memory-Store).

```bash
npm install
cp .env.example apps/web/.env   # DATABASE_URL (SQLite) – siehe .env.example
cd apps/web && npx prisma db push && cd ../..
npm run dev
```

Datenbank: **Prisma + SQLite** (`apps/web/prisma/schema.prisma`). `DATABASE_URL` z. B. `file:./dev.db` (relativ zum `prisma/`-Ordner, siehe `.env.example`).

Siehe `docs/architecture/mvp-plan.md` und `docs/technische-codex-roadmap.md`.

**Vercel:** Schritt-für-Schritt unter [`docs/deployment-vercel.md`](docs/deployment-vercel.md).
