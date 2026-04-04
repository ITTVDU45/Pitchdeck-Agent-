"use server"

import { redirect } from "next/navigation"
import { solutionConceptSectionsSchema } from "@pitchdeck/core"
import { getStore } from "@/lib/server/store"

export async function updateConceptSections(conceptId: string, sectionsJson: string) {
  const store = getStore()
  const existing = store.getSolutionConcept(conceptId)
  if (!existing) throw new Error("CONCEPT_NOT_FOUND")

  const parsed = JSON.parse(sectionsJson) as unknown
  const sections = solutionConceptSectionsSchema.parse(parsed)
  store.patchSolutionConcept(conceptId, { sections })
}

export async function approveConcept(conceptId: string) {
  const store = getStore()
  store.approveSolutionConcept(conceptId)
}

export async function generateDeckAction(conceptId: string) {
  const store = getStore()
  const { deck } = store.createPitchDeckFromConcept(conceptId)
  redirect(`/decks/${deck.id}`)
}
