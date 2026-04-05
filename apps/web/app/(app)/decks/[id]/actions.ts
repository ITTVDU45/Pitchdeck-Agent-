"use server"

import { revalidatePath } from "next/cache"
import { getStore } from "@/lib/server/store"

export async function generateScriptsForDeck(deckId: string) {
  const store = await getStore()
  await store.generateScriptsForPitchDeck(deckId)
  revalidatePath(`/decks/${deckId}`)
}

export async function publishDeck(deckId: string) {
  const store = await getStore()
  const link = await store.publishPitchDeck(deckId)
  revalidatePath(`/decks/${deckId}`)
  return link
}
