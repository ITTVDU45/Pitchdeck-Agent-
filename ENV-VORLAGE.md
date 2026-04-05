# Umgebungsvariablen zum Kopieren

Lege die Datei **`apps/web/.env`** an (nicht committen).

## 1) Lokal mit Docker-PostgreSQL (empfohlen)

Im **Repo-Root**:

```bash
docker compose up -d
```

In **`apps/web/.env`**:

```env
DATABASE_URL="postgresql://pitchdeck:pitchdeck@localhost:5432/pitchdeck"
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
```

Dann:

```bash
cd apps/web
npx prisma db push
npm run db:seed
cd ../..
npm run dev
```

## 2) Vercel (dauerhafte Daten, kein Demo-Banner)

In **Vercel → Project → Settings → Environment Variables** dieselbe URL wie bei deinem gehosteten Postgres setzen, z. B. **Neon**:

```env
DATABASE_URL=postgresql://USER:PASSWORD@ep-xxxx.region.aws.neon.tech/neondb?sslmode=require
```

(Optional)

```env
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
```

Nach dem Speichern: **Redeploy**. Einmalig Schema anwenden (lokal gegen dieselbe URL oder Neon-SQL-Editor):

```bash
cd apps/web
DATABASE_URL="postgresql://…" npx prisma db push
DATABASE_URL="postgresql://…" npm run db:seed
```

## 3) Nur Demo ohne DB (Banner bleibt sichtbar)

`DATABASE_URL` weglassen oder auf Vercel `file:…` – dann **Memory-Fallback** (Daten flüchtig).
