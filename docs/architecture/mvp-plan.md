# MVP-Plan – Pitchdeck-Tool (Next.js SaaS-Grundlage)

Dieses Dokument leitet aus `docs/pitchdeck-prozess-und-ui-spezifikation.md` und `docs/technische-codex-roadmap.md` die konkrete MVP-Ausarbeitung ab: Projektstruktur, Datenmodell, API, UI-Sitemap und Umsetzungsschritte.

---

## 1. Projektstruktur (MVP)

Monorepo mit klarer Trennung von **Domäne** (wiederverwendbar, testbar) und **App** (Next.js, UI, Route Handlers).

```text
/
  package.json                 # npm workspaces
  apps/
    web/                       # Next.js 15 App Router
      app/                     # Routen, layouts, API
      components/              # UI-Komponenten
      lib/                     # App-spezifische Helfer (fetch, formatting)
  packages/
    core/                      # Domäne: Typen, Zod, Store, Use-Cases
      src/
        domain/                # Entitäten & Status-Enums
        schemas/               # Zod (API + AI-Output)
        store/                 # In-Memory-Persistenz (MVP)
        services/              # Konzept-, Deck-, Script-Generierung
  docs/
    architecture/
      mvp-plan.md              # (dieses Dokument)
  AGENTS.md
  .env.example
```

**Später (Roadmap):** `apps/worker`, `packages/integrations`, Postgres-Migrationen, Job-Queue – ohne das MVP zu blockieren.

---

## 2. Datenmodell (versionierbar, mandantenfähig vorbereitet)

### 2.1 Mandanten-Vorbereitung

- **`Organization`**: `id`, `name`, `slug`. MVP: eine feste Default-Organisation im Store, alle Entitäten tragen `organizationId`.

### 2.2 Kernentitäten

| Entität | Zweck | Versionierung |
|--------|--------|----------------|
| **Client** | Kunde | `updatedAt` |
| **DiscoverySession** | Erfassung Gespräch | `version`, Status |
| **SolutionConcept** | KI-/Review-Konzept | `version`, `status` (draft \| approved) |
| **PitchDeck** | Folien-Container | `version`, `status` |
| **Slide** | Einzelfolie mit `type` + `payloadJson` (strukturiert) | über Deck-Version |
| **SlideScript** | Sprechertext pro Slide | `version` |
| **ShareLink** | Öffentliche Präsentation | `token`, `pitchDeckId`, optional `passwordHash` (später) |

### 2.3 DiscoverySession (MVP-Felder)

Strukturiert im Dokument (kein separates Kind-ORM im MVP-Speicher):

- `painPoints[]`, `needs[]`, `goals[]`, `processes[]`, `techStack[]`
- Freitext: `rawNotes`
- `status`: `draft` \| `ready_for_concept` \| `archived`

### 2.4 Slide-Typen (MVP, ≥5)

`title`, `executive_summary`, `problem_cluster`, `solution_overview`, `roadmap`, `next_steps` (erweiterbar).

### 2.5 Regeln

- Kein Rohtext aus dem Modell in Slides ohne Schema; `payloadJson` ist **validiertes** JSON pro `type`.
- Konzept/Deck/Script: neue Version bei regenerieren; letzte Version ist „aktuell“ für die UI (vereinfachtes MVP).

---

## 3. API-Architektur (Route Handlers)

Präfix `/api`, JSON, konsistente Fehlerform `{ error: string }`.

### Clients & Discovery

- `POST /api/clients` – anlegen  
- `GET /api/clients` – Liste (gefiltert nach `organizationId`)  
- `GET /api/clients/[id]`  
- `POST /api/discovery-sessions` – `{ clientId, title? }`  
- `GET /api/discovery-sessions/[id]`  
- `PATCH /api/discovery-sessions/[id]` – Discovery-Felder aktualisieren  

### Konzept (KI)

- `POST /api/discovery-sessions/[id]/generate-concept` – asynchrone Simulation: Job startet, Status `processing` → `completed` mit validiertem JSON  
- `GET /api/solution-concepts/[id]`  
- `PATCH /api/solution-concepts/[id]` – Inhalt bearbeiten  
- `POST /api/solution-concepts/[id]/approve`  

### Deck & Slides

- `POST /api/solution-concepts/[id]/generate-deck`  
- `GET /api/pitch-decks/[id]`  
- `PATCH /api/slides/[id]` – Titel/Payload/Notes  

### Scripts

- `POST /api/pitch-decks/[id]/generate-scripts`  
- `GET /api/slide-scripts/[id]`  

### Share

- `POST /api/pitch-decks/[id]/publish` – erzeugt Token  
- `GET /api/share/[token]` – öffentliche Payload für Web-Präsentation  

### Audio (vorbereitet)

- `POST /api/slide-scripts/[id]/request-audio` – liefert `501` + Hinweis ElevenLabs/Worker (Schnittstelle stub)

**Stand jetzt:** Persistenz über **Prisma + PostgreSQL** (`apps/web/prisma`). Lokal z. B. Docker (`docker-compose.yml`) oder gehostete URL. Vercel: `DATABASE_URL` mit Postgres (Neon, Supabase, …) – siehe `ENV-VORLAGE.md`.

---

## 4. UI-Sitemap

| Route | Zweck |
|-------|--------|
| `/` | Dashboard: Schnellzugriff, Listen-Links |
| `/clients` | Kundenliste + „Neu“ |
| `/clients/new` | Formular Neukunde |
| `/clients/[id]` | Kunde + zugehörige Discovery-Sessions |
| `/discovery/[id]` | Discovery-Formular, Buttons: Konzept generieren |
| `/concepts/[id]` | Konzept lesen/bearbeiten, freigeben, Deck erzeugen |
| `/decks/[id]` | Slide-Liste, Editor, Scripts generieren, Share publizieren |
| `/share/[token]` | Scrollbare Web-Präsentation (öffentlich) |

Globales **App-Shell**-Layout: Navigation, Titel, Mobile-first.

---

## 5. MVP-Umsetzungsplan (Phasen)

### Phase 0 – Erledigt im Repo-Grundgerüst

1. Workspaces + `apps/web` + `packages/core`  
2. Zod-Schemas für Discovery, Concept, Slide-Payloads, Scripts  
3. In-Memory-Store + Default-Organisation  
4. API wie oben (Mock-/OpenAI-Pfad für Konzept)  
5. UI-Sitemap mit Server Components wo möglich  
6. `AGENTS.md`, `.env.example`  

### Phase 1 – Vertiefung

- Echte DB (Prisma + Postgres), Migrationen unter `infra/migrations` oder `prisma/migrations`  
- Auth (z. B. NextAuth + Org-Membership)  
- Datei-Uploads → Object Storage  

### Phase 2 – KI & Jobs

- Vercel AI SDK / OpenAI streaming optional  
- Worker-App + Queue für lange Jobs  
- Prompt-Versionierung in `packages/prompts`  

### Phase 3 – Audio & Export

- ElevenLabs-Integration, Audio-Assets  
- PDF-Export-Pipeline  

---

## 6. Offene Punkte (bewusst MVP)

- Kein Multi-User-Login im ersten Schritt; `organizationId` ist vorbereitet.  
- Kein PDF im MVP-Codepfad.  
- Audio: nur API-Stub und UI-Hook.  
- Konzept-Generierung: ohne `OPENAI_API_KEY` deterministisches Template, mit Key optional OpenAI-JSON-Modus.  

---

## 7. Tracking der Umsetzung

Die technische Checkliste wird parallel in der Codebasis abgebildet: Store-Methoden, Routen und Seiten entsprechen den Abschnitten 2–4 dieses Dokuments.
