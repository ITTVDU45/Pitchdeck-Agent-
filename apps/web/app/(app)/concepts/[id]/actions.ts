"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { solutionConceptSectionsSchema } from "@pitchdeck/core"
import { getStore } from "@/lib/server/store"

export async function updateConceptSections(
  conceptId: string,
  sectionsJson: string,
) {
  const store = await getStore()
  const existing = await store.getSolutionConcept(conceptId)
  if (!existing) throw new Error("CONCEPT_NOT_FOUND")

  const parsed = JSON.parse(sectionsJson) as unknown
  const sections = solutionConceptSectionsSchema.parse(parsed)
  await store.patchSolutionConcept(conceptId, { sections })
  const c = await store.getSolutionConcept(conceptId)
  if (c) {
    revalidatePath(`/concepts/${conceptId}`)
    const session = await store.getDiscoverySession(c.discoverySessionId)
    if (session) revalidatePath(`/clients/${session.clientId}`)
  }
}

export async function approveConcept(conceptId: string) {
  const store = await getStore()
  await store.approveSolutionConcept(conceptId)
  const c = await store.getSolutionConcept(conceptId)
  if (c) {
    revalidatePath(`/concepts/${conceptId}`)
    const session = await store.getDiscoverySession(c.discoverySessionId)
    if (session) revalidatePath(`/clients/${session.clientId}`)
  }
}

export async function generateDeckAction(conceptId: string) {
  const store = await getStore()
  const conceptBefore = await store.getSolutionConcept(conceptId)
  const { deck } = await store.createPitchDeckFromConcept(conceptId)
  revalidatePath(`/concepts/${conceptId}`)
  if (conceptBefore) {
    const session = await store.getDiscoverySession(
      conceptBefore.discoverySessionId,
    )
    if (session) revalidatePath(`/clients/${session.clientId}`)
  }
  redirect(`/decks/${deck.id}`)
}
