import type { Slide } from "@pitchdeck/core"

interface SlidePreviewProps {
  slide: Slide
}

export function SlidePreview({ slide }: SlidePreviewProps) {
  const p = slide.payload
  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-6">
      {p.type === "title" ? (
        <>
          <p className="text-xs uppercase tracking-[0.2em] text-sky-300/90">
            {p.data.clientName}
          </p>
          <h2 className="text-2xl font-semibold">{p.data.headline}</h2>
          {p.data.subline ? (
            <p className="text-sm text-foreground/70">{p.data.subline}</p>
          ) : null}
        </>
      ) : null}

      {p.type === "executive_summary" ? (
        <>
          <h2 className="text-xl font-semibold">{p.data.headline}</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-foreground/80">
            {p.data.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </>
      ) : null}

      {p.type === "problem_cluster" ? (
        <>
          <h2 className="text-xl font-semibold">{p.data.headline}</h2>
          {p.data.intro ? (
            <p className="text-sm text-foreground/70">{p.data.intro}</p>
          ) : null}
          <div className="space-y-3">
            {p.data.clusters.map((c, i) => (
              <div key={i} className="rounded-xl border border-white/10 p-3">
                <p className="font-medium">{c.title}</p>
                <p className="mt-1 text-sm text-foreground/75">{c.pain}</p>
                <p className="mt-2 text-xs text-amber-200/80">
                  Impact: {c.impact}
                </p>
              </div>
            ))}
          </div>
        </>
      ) : null}

      {p.type === "solution_overview" ? (
        <>
          <h2 className="text-xl font-semibold">{p.data.headline}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {p.data.pillars.map((x, i) => (
              <div key={i} className="rounded-xl border border-white/10 p-3">
                <p className="font-medium">{x.title}</p>
                <p className="mt-2 text-sm text-foreground/75">
                  {x.description}
                </p>
              </div>
            ))}
          </div>
        </>
      ) : null}

      {p.type === "roadmap" ? (
        <>
          <h2 className="text-xl font-semibold">{p.data.headline}</h2>
          <ol className="space-y-4">
            {p.data.phases.map((ph, i) => (
              <li key={i}>
                <p className="font-medium">{ph.name}</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground/75">
                  {ph.milestones.map((m, j) => (
                    <li key={j}>{m}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </>
      ) : null}

      {p.type === "next_steps" ? (
        <>
          <h2 className="text-xl font-semibold">{p.data.headline}</h2>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-foreground/80">
            {p.data.steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
          {p.data.cta ? (
            <p className="mt-4 rounded-xl bg-sky-500/15 px-3 py-2 text-sm text-sky-100">
              {p.data.cta}
            </p>
          ) : null}
        </>
      ) : null}
    </div>
  )
}
