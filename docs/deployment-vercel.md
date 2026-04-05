# Deployment auf Vercel – „Pitchdeck Tool“

Ein Klick-Deployment aus dieser Umgebung ist nicht möglich (Vercel-Zugang liegt bei dir). So richtest du ein **neues Projekt** ein.

## Voraussetzungen

- GitHub-Repo ist mit `main` verbunden (Stand mit `apps/web` + `packages/core`).
- Vercel-Account und Zugriff auf dasselbe GitHub-Org/User-Repo.

## Neues Projekt anlegen

1. [Vercel Dashboard](https://vercel.com/dashboard) → **Add New…** → **Project**.
2. **Import** deines Repositories `Pitchdeck-Agent-` (oder wie es bei dir heißt).
3. **Project Name:** z. B. `pitchdeck-tool` (Vercel erlaubt keine Leerzeichen; „Pitchdeck Tool“ nur als Anzeigename unter *Settings → General*).
4. **Root Directory:** `apps/web` → *Edit* → Ordner `apps/web` wählen und bestätigen.  
   Wichtig: Ohne diesen Schritt findet Vercel die Next.js-App nicht.
5. **Framework Preset:** Next.js (wird erkannt).
6. **Build Command:** `npm run build` (führt `prisma generate` aus).
7. **Install Command:** `npm install` (Standard, Workspace installiert `@pitchdeck/core` über `file:../../packages/core`).
8. **Output:** bleibt leer (Next.js verwaltet das).
9. **Deploy** klicken.

## Umgebungsvariablen

Unter **Settings → Environment Variables** (mindestens für *Production*):

| Name | Hinweis |
|------|--------|
| `OPENAI_API_KEY` | Optional – ohne Key nutzt die App den deterministischen Konzept-Fallback. |
| `OPENAI_MODEL` | Optional, z. B. `gpt-4o-mini`. |
| `DATABASE_URL` | **Für dauerhafte Daten (Vercel):** PostgreSQL-URL, z. B. [Neon](https://neon.tech/) oder Supabase (`postgresql://…?sslmode=require`). **Optional:** Wenn leer oder `file:…` auf Vercel → **Memory-Fallback** (Demo-Banner). Lokal: siehe `ENV-VORLAGE.md` und `docker-compose.yml`. |

## Nach dem Deploy

- Jeder Push auf den konfigurierten Produktions-Branch (meist `main`) löst ein neues Deployment aus.
- **Schema anwenden:** Bei verwalteter DB einmalig Migrationen/`db push` ausführen (je nach Hosting). Lokal: `cd apps/web && npx prisma db push`.
- **Hinweis:** Die App speichert alle MVP-Daten in **Prisma** – nicht mehr im In-Memory-Store.

## CLI (optional)

```bash
npm i -g vercel
cd apps/web
vercel login
vercel link   # neues Projekt wählen oder anlegen
vercel --prod
```
