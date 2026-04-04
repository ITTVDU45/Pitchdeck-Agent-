"use client"

import { useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import type { DiscoverySession } from "@pitchdeck/core"
import { TagsField, type TagRow } from "@/components/tags-field"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { generateConceptAction, saveDiscoverySession } from "./actions"

interface DiscoveryEditorProps {
  session: DiscoverySession
}

export function DiscoveryEditor({ session }: DiscoveryEditorProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [genPending, startGen] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  const [painPoints, setPainPoints] = useState<TagRow[]>(session.painPoints)
  const [needs, setNeeds] = useState<TagRow[]>(session.needs)
  const [goals, setGoals] = useState<TagRow[]>(session.goals)
  const [processes, setProcesses] = useState<TagRow[]>(session.processes)
  const [techStack, setTechStack] = useState<TagRow[]>(session.techStack)

  function syncHiddenFields(form: HTMLFormElement) {
    const setJson = (name: string, value: TagRow[]) => {
      const input = form.elements.namedItem(name) as HTMLInputElement | null
      if (input) input.value = JSON.stringify(value)
    }
    setJson("painPoints", painPoints)
    setJson("needs", needs)
    setJson("goals", goals)
    setJson("processes", processes)
    setJson("techStack", techStack)
  }

  return (
    <form
      ref={formRef}
      action={(formData) => {
        const form = formRef.current
        if (form) syncHiddenFields(form)
        startTransition(async () => {
          await saveDiscoverySession(session.id, formData)
          router.refresh()
        })
      }}
      className="space-y-6"
    >
      <input type="hidden" name="painPoints" defaultValue="[]" />
      <input type="hidden" name="needs" defaultValue="[]" />
      <input type="hidden" name="goals" defaultValue="[]" />
      <input type="hidden" name="processes" defaultValue="[]" />
      <input type="hidden" name="techStack" defaultValue="[]" />

      <Card title="Session" description="Metadaten und Freitext">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="title">
              Titel
            </label>
            <input
              id="title"
              name="title"
              defaultValue={session.title}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={session.status}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm"
            >
              <option value="draft">Entwurf</option>
              <option value="ready_for_concept">Bereit für Konzept</option>
              <option value="archived">Archiviert</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="rawNotes">
              Gesprächsnotizen
            </label>
            <textarea
              id="rawNotes"
              name="rawNotes"
              rows={6}
              defaultValue={session.rawNotes}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm"
            />
          </div>
        </div>
      </Card>

      <Card title="Strukturierte Discovery">
        <div className="space-y-8">
          <TagsField label="Pain Points" value={painPoints} onChange={setPainPoints} />
          <TagsField label="Needs" value={needs} onChange={setNeeds} />
          <TagsField label="Ziele" value={goals} onChange={setGoals} />
          <TagsField label="Prozesse" value={processes} onChange={setProcesses} />
          <TagsField label="Tech-Stack" value={techStack} onChange={setTechStack} />
        </div>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Speichern…" : "Speichern"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={genPending}
          onClick={() => {
            const form = formRef.current
            if (!form) return
            syncHiddenFields(form)
            const fd = new FormData(form)
            startGen(async () => {
              await saveDiscoverySession(session.id, fd)
              await generateConceptAction(session.id)
            })
          }}
        >
          {genPending ? "Konzept wird erstellt…" : "Konzept generieren"}
        </Button>
      </div>
    </form>
  )
}
