"use server"

import { revalidatePath } from "next/cache"
import { slidePatchSchema } from "@pitchdeck/core"
import { getStore } from "@/lib/server/store"

export async function updateSlide(
  slideId: string,
  input: { title: string; notes: string },
) {
  const patch = slidePatchSchema.parse({
    title: input.title,
    notes: input.notes,
  })
  const store = getStore()
  store.patchSlide(slideId, patch)
  const slide = store.getSlide(slideId)
  if (slide) revalidatePath(`/decks/${slide.pitchDeckId}`)
  revalidatePath(`/slides/${slideId}`)
}
