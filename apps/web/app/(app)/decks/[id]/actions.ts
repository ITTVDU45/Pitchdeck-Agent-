"use server"

import { revalidatePath } from "next/cache"
import { getStore } from "@/lib/server/store"

export async function generateScriptsForDeck(deckId: string) {
  const store = getStore()
  store.generateScriptsForPitchDeck(deckId)
  revalidatePath(`/decks/${deckId}`)
}

export async function publishDeck(deckId: string) {
  const store = getStore()
  const link = store.publishPitchDeck(deckId)
  revalidatePath(`/decks/${deckId}`)
  return link
}
