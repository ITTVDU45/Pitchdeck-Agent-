"use server"

import { revalidatePath } from "next/cache"
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
  const c = store.getSolutionConcept(conceptId)
  if (c) {
    revalidatePath(`/concepts/${conceptId}`)
    const session = store.getDiscoverySession(c.discoverySessionId)
    if (session) revalidatePath(`/clients/${session.clientId}`)
  }
}

export async function approveConcept(conceptId: string) {
  const store = getStore()
  store.approveSolutionConcept(conceptId)
  const c = store.getSolutionConcept(conceptId)
  if (c) {
    revalidatePath(`/concepts/${conceptId}`)
    const session = store.getDiscoverySession(c.discoverySessionId)
    if (session) revalidatePath(`/clients/${session.clientId}`)
  }
}

export async function generateDeckAction(conceptId: string) {
  const store = getStore()
  const conceptBefore = store.getSolutionConcept(conceptId)
  const { deck } = store.createPitchDeckFromConcept(conceptId)
  revalidatePath(`/concepts/${conceptId}`)
  if (conceptBefore) {
    const session = store.getDiscoverySession(conceptBefore.discoverySessionId)
    if (session) revalidatePath(`/clients/${session.clientId}`)
  }
  redirect(`/decks/${deck.id}`)
}
