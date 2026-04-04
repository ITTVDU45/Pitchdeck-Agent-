import { notFound } from "next/navigation"
import { getStore } from "@/lib/server/store"
import { SlidePreview } from "@/components/slide-preview"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{ token: string }>
}

export default async function SharePresentationPage({ params }: PageProps) {
  const { token } = await params
  const store = getStore()
  const link = store.getShareLink(token)
  if (!link) notFound()

  const deck = store.getPitchDeck(link.pitchDeckId)
  if (!deck) notFound()

  const slides = store.listSlidesForDeck(link.pitchDeckId)

  return (
    <div>
      <header className="border-b border-white/10 bg-black/40 px-4 py-6 backdrop-blur-md">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs uppercase tracking-[0.25em] text-sky-300/90">
            Geteilte Präsentation
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            {deck.title}
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Scrollbare Web-Ansicht · Audio folgt (ElevenLabs-Anbindung)
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-16 px-4 py-12">
        {slides.map((slide, index) => {
          const script = store.getLatestScriptForSlide(slide.id)
          return (
            <section
              key={slide.id}
              id={`slide-${index + 1}`}
              className="scroll-mt-8 space-y-6"
            >
              <div className="flex items-baseline justify-between gap-4 text-xs text-zinc-500">
                <span>
                  Abschnitt {index + 1} / {slides.length}
                </span>
                <span>{slide.type}</span>
              </div>
              <SlidePreview slide={slide} />
              {script ? (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                    Sprechertext
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-200">
                    {script.text}
                  </p>
                </div>
              ) : null}
            </section>
          )
        })}
      </main>

      <footer className="border-t border-white/10 py-8 text-center text-xs text-zinc-500">
        Erstellt mit Pitchdeck Tool (MVP)
      </footer>
    </div>
  )
}
