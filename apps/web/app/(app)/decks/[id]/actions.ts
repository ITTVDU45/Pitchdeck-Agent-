"use server"

import { getStore } from "@/lib/server/store"

export async function generateScriptsForDeck(deckId: string) {
  const store = getStore()
  store.generateScriptsForPitchDeck(deckId)
}

export async function publishDeck(deckId: string) {
  const store = getStore()
  return store.publishPitchDeck(deckId)
}
