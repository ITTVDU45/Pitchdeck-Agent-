"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import type { Slide } from "@pitchdeck/core"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { updateSlide } from "./actions"
import { SlidePreview } from "@/components/slide-preview"

interface SlideEditorProps {
  slide: Slide
}

export function SlideEditor({ slide }: SlideEditorProps) {
  const router = useRouter()
  const [title, setTitle] = useState(slide.title)
  const [notes, setNotes] = useState(slide.notes)
  const [pending, start] = useTransition()

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <Card title="Struktur & Metadaten">
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              start(async () => {
                await updateSlide(slide.id, { title, notes })
                router.refresh()
              })
            }}
          >
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="title">
                Folientitel
              </label>
              <input
                id="title"
                className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="notes">
                Speaker Notes
              </label>
              <textarea
                id="notes"
                rows={4}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={pending}>
              {pending ? "Speichern…" : "Speichern"}
            </Button>
          </form>
        </Card>

        <Card title="Strukturierter Payload (read-only)">
          <pre className="max-h-[320px] overflow-auto rounded-xl bg-black/40 p-3 text-xs text-foreground/80">
            {JSON.stringify(slide.payload, null, 2)}
          </pre>
          <p className="mt-2 text-xs text-foreground/50">
            Payload-Editing über UI-Formulare pro Slide-Typ folgt in einer
            späteren Iteration; Schema und Typen sind bereits definiert.
          </p>
        </Card>
      </div>

      <div>
        <Card title="Live-Vorschau">
          <SlidePreview slide={slide} />
        </Card>
      </div>
    </div>
  )
}
