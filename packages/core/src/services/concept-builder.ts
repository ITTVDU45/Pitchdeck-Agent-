import type { DiscoverySession } from "../domain/types"
import type { SolutionConceptSections } from "../schemas/concept"

function joinLabels(items: { label: string; detail?: string }[], max: number): string {
  const slice = items.slice(0, max)
  if (slice.length === 0) return ""
  return slice
    .map((i) => (i.detail ? `${i.label}: ${i.detail}` : i.label))
    .join("; ")
}

export function buildSolutionConceptFromDiscovery(
  session: DiscoverySession,
): SolutionConceptSections {
  const painSummary = joinLabels(session.painPoints, 6)
  const needsSummary = joinLabels(session.needs, 6)
  const goalsSummary = joinLabels(session.goals, 6)
  const processSummary = joinLabels(session.processes, 5)
  const techSummary = joinLabels(session.techStack, 8)

  const problems = [
    {
      title: "Operative Reibung & Engpässe",
      detail:
        painSummary ||
        "Aus der Discovery wurden noch keine Pain Points strukturiert erfasst. Bitte im Discovery-Formular ergänzen.",
    },
    {
      title: "Anforderungen & Erwartungen",
      detail:
        needsSummary ||
        "Needs und Erwartungen sollten präziser erfasst werden, um die Lösungslogik zu schärfen.",
    },
  ]

  const solutions = [
    {
      title: "Zielbild & Nutzen",
      detail:
        goalsSummary ||
        "Ziele wurden noch nicht klar dokumentiert; ein gemeinsames Zielbild ist die Basis für Roadmap und Pitch.",
    },
    {
      title: "Prozess- & Tech-Fit",
      detail: [processSummary, techSummary].filter(Boolean).join(" — ") ||
        "Prozesse und Tech-Stack sollten im nächsten Schritt konkretisiert werden.",
    },
  ]

  const strategy = [
    {
      title: "Vorgehen",
      detail:
        session.rawNotes.trim().slice(0, 3500) ||
        "Ergänze Freitext-Notizen in der Discovery, um Strategie und Kontext zu vertiefen.",
    },
    {
      title: "Priorisierung",
      detail:
        "Fokus auf schnelle Wins in den ersten 30–60 Tagen, parallel Architektur für Skalierung vorbereiten.",
    },
  ]

  const roadmap = [
    {
      phase: "Discovery & Alignment",
      items: [
        "Ziele und KPIs finalisieren",
        "Stakeholder-Map und Entscheidungswege klären",
      ],
    },
    {
      phase: "Pilot & Umsetzung",
      items: [
        "MVP-Scope und Erfolgskriterien definieren",
        "Umsetzung starten und wöchentlich synchronisieren",
      ],
    },
    {
      phase: "Skalierung",
      items: [
        "Rollout-Plan und Change-Management",
        "Monitoring, Qualitätssicherung, kontinuierliche Optimierung",
      ],
    },
  ]

  return {
    executiveSummary: [
      `Kontext: ${session.title}.`,
      painSummary ? `Zentrale Herausforderungen: ${painSummary}.` : "",
      goalsSummary ? `Strategische Ziele: ${goalsSummary}.` : "",
    ]
      .filter(Boolean)
      .join(" "),
    problems,
    solutions,
    strategy,
    roadmap,
  }
}
