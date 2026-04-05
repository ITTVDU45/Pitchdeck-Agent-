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
6. **Build Command:** `npm run build` (Standard).
7. **Install Command:** `npm install` (Standard, läuft im Root `apps/web` – der lokale Pfad `file:../../packages/core` funktioniert so).
8. **Output:** bleibt leer (Next.js verwaltet das).
9. **Deploy** klicken.

## Umgebungsvariablen

Unter **Settings → Environment Variables** (mindestens für *Production*):

| Name | Hinweis |
|------|--------|
| `OPENAI_API_KEY` | Optional – ohne Key nutzt die App den deterministischen Konzept-Fallback. |
| `OPENAI_MODEL` | Optional, z. B. `gpt-4o-mini`. |
| `PITCHDECK_STORE_PATH` | Optional, z. B. `/tmp/pitchdeck-store.json` – schreibt den MVP-Datenstand in eine Datei, damit **alle** Serverless-Instanzen dieselben Kunden sehen (Demo only; `/tmp` ist nicht dauerhaft). Für echte Nutzung: Datenbank. |

## Nach dem Deploy

- Jeder Push auf den konfigurierten Produktions-Branch (meist `main`) löst ein neues Deployment aus.
- **Hinweis MVP:** Ohne Datenbank und ohne `PITCHDECK_STORE_PATH` hat **jede** Serverless-Instanz eigenen Speicher – neu angelegte Kunden erscheinen in der Liste ggf. nicht. Setze `PITCHDECK_STORE_PATH=/tmp/pitchdeck-store.json` für eine einfache Demo, oder entwickle/teste lokal mit `npm run dev`.

## CLI (optional)

```bash
npm i -g vercel
cd apps/web
vercel login
vercel link   # neues Projekt wählen oder anlegen
vercel --prod
```
