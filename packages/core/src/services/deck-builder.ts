import type { SolutionConcept } from "../domain/types"
import type { SlidePayload } from "../schemas/slide"

interface BuildDeckInput {
  concept: SolutionConcept
  clientName: string
}

export function buildPitchDeckFromConcept(input: BuildDeckInput): SlidePayload[] {
  const { concept, clientName } = input
  const s = concept.sections

  const problemClusters = s.problems.slice(0, 4).map((p) => ({
    title: p.title,
    pain: p.detail.slice(0, 600),
    impact:
      "Risiko für Zeit, Budget und strategische Ziele; Handlungsbedarf zur Absicherung des Betriebs und Wachstums.",
  }))

  const pillars = s.solutions.slice(0, 4).map((sol) => ({
    title: sol.title,
    description: sol.detail.slice(0, 1000),
  }))

  const phases = s.roadmap.slice(0, 6).map((r) => ({
    name: r.phase,
    milestones: r.items.slice(0, 6),
  }))

  const nextSteps = [
    "Workshop zur Feinjustierung von Scope und KPIs",
    "Pilot starten und Erfolgskriterien messen",
    "Rollout- und Kommunikationsplan abstimmen",
  ]

  const payloads: SlidePayload[] = [
    {
      type: "title",
      data: {
        headline: "Strategisches Lösungskonzept",
        subline: s.executiveSummary.slice(0, 220),
        clientName,
      },
    },
    {
      type: "executive_summary",
      data: {
        headline: "Executive Summary",
        bullets: [
          s.executiveSummary.slice(0, 400),
          ...s.strategy.map((x) => `${x.title}: ${x.detail.slice(0, 200)}…`),
        ].slice(0, 6),
      },
    },
    {
      type: "problem_cluster",
      data: {
        headline: "Problem- & Chancenlandschaft",
        intro: "Aus Discovery abgeleitete Schwerpunkte.",
        clusters:
          problemClusters.length > 0
            ? problemClusters
            : [
                {
                  title: "Handlungsbedarf",
                  pain: "Bitte Pain Points in der Discovery pflegen.",
                  impact: "Ohne klare Pain Points ist der Business Case schwächer.",
                },
              ],
      },
    },
    {
      type: "solution_overview",
      data: {
        headline: "Lösungsarchitektur & Nutzen",
        pillars:
          pillars.length > 0
            ? pillars
            : [
                {
                  title: "Lösungsrahmen",
                  description:
                    "Nutzen Sie die Konzept-Sektionen, um Lösungsbausteine zu schärfen.",
                },
              ],
      },
    },
    {
      type: "roadmap",
      data: {
        headline: "Roadmap",
        phases:
          phases.length > 0
            ? phases
            : [
                {
                  name: "Phase 1",
                  milestones: ["Kickoff", "Ziele fixieren", "Pilot definieren"],
                },
              ],
      },
    },
    {
      type: "next_steps",
      data: {
        headline: "Nächste Schritte",
        steps: nextSteps,
        cta: "Gemeinsam den Pilot terminieren und Verantwortlichkeiten klären.",
      },
    },
  ]

  return payloads
}
