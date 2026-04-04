# Agent-Regeln (Codex / Cursor) – Pitchdeck-Tool

## Allgemein

- Zuerst bestehende Typen in `@pitchdeck/core` und UI-Komponenten prüfen, bevor du Duplikate einführst.
- AI-Outputs **nur** als validiertes JSON persistieren (Zod-Schemas in `packages/core/src/schemas`).
- Keine unstrukturierten Freitext-Responses in Speicherpfade schreiben.
- Externe APIs (OpenAI, ElevenLabs, Storage) in dedizierte Module kapseln; keine Keys im Client.
- Jobs und Nebenwirkungen möglichst **idempotent** modellieren (gleiche Anfrage → stabiler Zustand).
- Neue fachliche Logik mit Tests oder dokumentierten Smoke-Pfaden absichern.
- UI von Orchestrierung trennen: Server Actions / API für Daten, Komponenten für Darstellung.

## MVP-Hinweis

Aktuell: In-Memory-Store pro Serverprozess. Produktionspfad: Postgres + Queue gemäß `docs/technische-codex-roadmap.md`.
