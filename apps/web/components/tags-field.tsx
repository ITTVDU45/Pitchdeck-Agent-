"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export interface TagRow {
  label: string
  detail?: string
}

interface TagsFieldProps {
  label: string
  value: TagRow[]
  onChange: (next: TagRow[]) => void
}

export function TagsField({ label, value, onChange }: TagsFieldProps) {
  const [draftLabel, setDraftLabel] = useState("")
  const [draftDetail, setDraftDetail] = useState("")

  function addTag() {
    const labelTrim = draftLabel.trim()
    if (!labelTrim) return
    onChange([...value, { label: labelTrim, detail: draftDetail.trim() || undefined }])
    setDraftLabel("")
    setDraftDetail("")
  }

  function removeAt(index: number) {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-foreground/90">{label}</p>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-2">
          <input
            className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm"
            placeholder="Stichwort"
            value={draftLabel}
            onChange={(e) => setDraftLabel(e.target.value)}
          />
          <input
            className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm"
            placeholder="Optional: Details"
            value={draftDetail}
            onChange={(e) => setDraftDetail(e.target.value)}
          />
        </div>
        <Button type="button" variant="secondary" onClick={addTag}>
          Hinzufügen
        </Button>
      </div>
      <ul className="flex flex-wrap gap-2">
        {value.map((t, i) => (
          <li
            key={`${t.label}-${i}`}
            className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs"
          >
            <span className="font-medium">{t.label}</span>
            {t.detail ? (
              <span className="text-foreground/55">· {t.detail}</span>
            ) : null}
            <button
              type="button"
              className="ml-1 rounded-full px-1 text-foreground/40 hover:text-foreground"
              onClick={() => removeAt(i)}
              aria-label={`${t.label} entfernen`}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
