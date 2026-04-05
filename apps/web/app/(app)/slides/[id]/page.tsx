import Link from "next/link"
import { redirect } from "next/navigation"
import { getStore } from "@/lib/server/store"
import { SlideEditor } from "./slide-editor"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function SlidePage({ params }: PageProps) {
  const { id } = await params
  const store = await getStore()
  const slide = await store.getSlide(id)
  if (!slide) redirect("/clients")

  const deck = await store.getPitchDeck(slide.pitchDeckId)

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-foreground/60">
          {deck ? (
            <Link href={`/decks/${deck.id}`} className="hover:underline">
              ← {deck.title}
            </Link>
          ) : (
            "Slide"
          )}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Slide-Editor
        </h1>
        <p className="mt-2 text-sm text-foreground/65">
          Typ: <span className="text-foreground/90">{slide.type}</span>
        </p>
      </div>

      <SlideEditor slide={slide} />
    </div>
  )
}
