"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import type { SolutionConcept, SolutionConceptSections } from "@pitchdeck/core"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { approveConcept, generateDeckAction, updateConceptSections } from "./actions"

interface ConceptReviewProps {
  concept: SolutionConcept
}

function emptySection(): SolutionConceptSections["problems"][0] {
  return { title: "", detail: "" }
}

function emptyRoadmap(): SolutionConceptSections["roadmap"][0] {
  return { phase: "", items: [""] }
}

function sanitizeSections(
  s: SolutionConceptSections,
): SolutionConceptSections {
  const problems = s.problems
    .filter((p) => p.title.trim() && p.detail.trim())
    .map((p) => ({ title: p.title.trim(), detail: p.detail.trim() }))
  const solutions = s.solutions
    .filter((p) => p.title.trim() && p.detail.trim())
    .map((p) => ({ title: p.title.trim(), detail: p.detail.trim() }))
  const strategy = s.strategy
    .filter((p) => p.title.trim() && p.detail.trim())
    .map((p) => ({ title: p.title.trim(), detail: p.detail.trim() }))
  const roadmap = s.roadmap
    .map((r) => ({
      phase: r.phase.trim(),
      items: r.items.map((i) => i.trim()).filter(Boolean),
    }))
    .filter((r) => r.phase && r.items.length > 0)

  const executiveSummary = s.executiveSummary.trim() || "—"

  return {
    executiveSummary,
    problems:
      problems.length > 0
        ? problems
        : [
            {
              title: "Bitte ausfüllen",
              detail: "Mindestens ein Problem mit Titel und Beschreibung ist erforderlich.",
            },
          ],
    solutions:
      solutions.length > 0
        ? solutions
        : [
            {
              title: "Bitte ausfüllen",
              detail: "Mindestens eine Lösung mit Titel und Beschreibung ist erforderlich.",
            },
          ],
    strategy:
      strategy.length > 0
        ? strategy
        : [
            {
              title: "Strategie",
              detail: "Bitte strategische Punkte ergänzen.",
            },
          ],
    roadmap:
      roadmap.length > 0
        ? roadmap
        : [
            {
              phase: "Phase 1",
              items: ["Meilenstein definieren"],
            },
          ],
  }
}

export function ConceptReview({ concept }: ConceptReviewProps) {
  const router = useRouter()
  const [sections, setSections] = useState<SolutionConceptSections>(concept.sections)
  const [savePending, startSave] = useTransition()
  const [deckPending, startDeck] = useTransition()

  async function persist() {
    startSave(async () => {
      const next = sanitizeSections(sections)
      setSections(next)
      await updateConceptSections(concept.id, JSON.stringify(next))
      router.refresh()
    })
  }

  async function approveAndMaybeDeck() {
    startSave(async () => {
      const next = sanitizeSections(sections)
      setSections(next)
      await updateConceptSections(concept.id, JSON.stringify(next))
      await approveConcept(concept.id)
      router.refresh()
    })
  }

  return (
    <div className="space-y-6">
      <Card title="Executive Summary">
        <textarea
          className="min-h-[140px] w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm"
          value={sections.executiveSummary}
          onChange={(e) =>
            setSections((s) => ({ ...s, executiveSummary: e.target.value }))
          }
        />
      </Card>

      <Card title="Probleme">
        <div className="space-y-4">
          {sections.problems.map((p, i) => (
            <div key={i} className="space-y-2 rounded-xl border border-white/5 p-3">
              <input
                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm"
                value={p.title}
                onChange={(e) => {
                  const next = [...sections.problems]
                  next[i] = { ...next[i], title: e.target.value }
                  setSections((s) => ({ ...s, problems: next }))
                }}
                placeholder="Titel"
              />
              <textarea
                className="min-h-[80px] w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm"
                value={p.detail}
                onChange={(e) => {
                  const next = [...sections.problems]
                  next[i] = { ...next[i], detail: e.target.value }
                  setSections((s) => ({ ...s, problems: next }))
                }}
                placeholder="Beschreibung"
              />
            </div>
          ))}
          <Button
            type="button"
            variant="ghost"
            onClick={() =>
              setSections((s) => ({
                ...s,
                problems: [...s.problems, emptySection()],
              }))
            }
          >
            Problem hinzufügen
          </Button>
        </div>
      </Card>

      <Card title="Lösungen">
        <div className="space-y-4">
          {sections.solutions.map((p, i) => (
            <div key={i} className="space-y-2 rounded-xl border border-white/5 p-3">
              <input
                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm"
                value={p.title}
                onChange={(e) => {
                  const next = [...sections.solutions]
                  next[i] = { ...next[i], title: e.target.value }
                  setSections((s) => ({ ...s, solutions: next }))
                }}
              />
              <textarea
                className="min-h-[80px] w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm"
                value={p.detail}
                onChange={(e) => {
                  const next = [...sections.solutions]
                  next[i] = { ...next[i], detail: e.target.value }
                  setSections((s) => ({ ...s, solutions: next }))
                }}
              />
            </div>
          ))}
          <Button
            type="button"
            variant="ghost"
            onClick={() =>
              setSections((s) => ({
                ...s,
                solutions: [...s.solutions, emptySection()],
              }))
            }
          >
            Lösung hinzufügen
          </Button>
        </div>
      </Card>

      <Card title="Strategie">
        <div className="space-y-4">
          {sections.strategy.map((p, i) => (
            <div key={i} className="space-y-2 rounded-xl border border-white/5 p-3">
              <input
                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm"
                value={p.title}
                onChange={(e) => {
                  const next = [...sections.strategy]
                  next[i] = { ...next[i], title: e.target.value }
                  setSections((s) => ({ ...s, strategy: next }))
                }}
              />
              <textarea
                className="min-h-[80px] w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm"
                value={p.detail}
                onChange={(e) => {
                  const next = [...sections.strategy]
                  next[i] = { ...next[i], detail: e.target.value }
                  setSections((s) => ({ ...s, strategy: next }))
                }}
              />
            </div>
          ))}
          <Button
            type="button"
            variant="ghost"
            onClick={() =>
              setSections((s) => ({
                ...s,
                strategy: [...s.strategy, emptySection()],
              }))
            }
          >
            Strategiepunkt hinzufügen
          </Button>
        </div>
      </Card>

      <Card title="Roadmap">
        <div className="space-y-4">
          {sections.roadmap.map((r, ri) => (
            <div key={ri} className="space-y-2 rounded-xl border border-white/5 p-3">
              <input
                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm"
                value={r.phase}
                onChange={(e) => {
                  const next = [...sections.roadmap]
                  next[ri] = { ...next[ri], phase: e.target.value }
                  setSections((s) => ({ ...s, roadmap: next }))
                }}
                placeholder="Phase"
              />
              {r.items.map((item, ii) => (
                <input
                  key={ii}
                  className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm"
                  value={item}
                  onChange={(e) => {
                    const next = [...sections.roadmap]
                    const items = [...next[ri].items]
                    items[ii] = e.target.value
                    next[ri] = { ...next[ri], items }
                    setSections((s) => ({ ...s, roadmap: next }))
                  }}
                  placeholder={`Meilenstein ${ii + 1}`}
                />
              ))}
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  const next = [...sections.roadmap]
                  next[ri] = { ...next[ri], items: [...next[ri].items, ""] }
                  setSections((s) => ({ ...s, roadmap: next }))
                }}
              >
                Meilenstein hinzufügen
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="ghost"
            onClick={() =>
              setSections((s) => ({
                ...s,
                roadmap: [...s.roadmap, emptyRoadmap()],
              }))
            }
          >
            Phase hinzufügen
          </Button>
        </div>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button type="button" disabled={savePending} onClick={() => void persist()}>
          {savePending ? "Speichern…" : "Änderungen speichern"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={savePending}
          onClick={() => void approveAndMaybeDeck()}
        >
          Konzept freigeben
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={deckPending || concept.status !== "approved"}
          onClick={() =>
            startDeck(async () => {
              await generateDeckAction(concept.id)
            })
          }
        >
          {deckPending ? "Deck wird erstellt…" : "Pitchdeck generieren"}
        </Button>
      </div>

      {concept.status !== "approved" ? (
        <p className="text-sm text-amber-200/90">
          Pitchdeck-Generierung ist gesperrt, bis das Konzept freigegeben ist.
        </p>
      ) : null}
    </div>
  )
}
