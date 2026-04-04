import type { Slide } from "../domain/types"

function asBullets(lines: string[]): string {
  return lines.map((l) => `• ${l}`).join("\n")
}

export function buildScriptForSlide(slide: Slide): string {
  const p = slide.payload
  switch (p.type) {
    case "title":
      return [
        `Willkommen zu unserem Vorschlag für ${p.data.clientName}.`,
        p.data.subline ? `Kurz zum Kontext: ${p.data.subline}` : "",
        `Auf dieser Folie: ${p.data.headline}.`,
      ]
        .filter(Boolean)
        .join("\n\n")
    case "executive_summary":
      return [
        `Wir fassen das Wesentliche zusammen: ${p.data.headline}.`,
        asBullets(p.data.bullets),
      ].join("\n\n")
    case "problem_cluster":
      return [
        p.data.intro ?? "",
        `Schwerpunkt: ${p.data.headline}.`,
        ...p.data.clusters.map(
          (c) =>
            `${c.title}: ${c.pain} Auswirkung: ${c.impact}`,
        ),
      ]
        .filter(Boolean)
        .join("\n\n")
    case "solution_overview":
      return [
        `Unser Lösungsangebot im Überblick: ${p.data.headline}.`,
        ...p.data.pillars.map(
          (x) => `${x.title}: ${x.description}`,
        ),
      ].join("\n\n")
    case "roadmap":
      return [
        `Die Roadmap zeigt, wie wir vorgehen: ${p.data.headline}.`,
        ...p.data.phases.map(
          (ph) =>
            `${ph.name}:\n${asBullets(ph.milestones)}`,
        ),
      ].join("\n\n")
    case "next_steps":
      return [
        `Zum Abschluss: ${p.data.headline}.`,
        asBullets(p.data.steps),
        p.data.cta ? `\nCall to Action: ${p.data.cta}` : "",
      ].join("\n\n")
    default:
      return slide.title
  }
}
