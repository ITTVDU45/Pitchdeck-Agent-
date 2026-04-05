import { getStore } from "@/lib/server/store"
import { jsonError, jsonOk } from "@/lib/server/api-helpers"

interface RouteParams {
  params: Promise<{ token: string }>
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { token } = await params
  const store = await getStore()
  const link = await store.getShareLink(token)
  if (!link) return jsonError("SHARE_NOT_FOUND", 404)
  const deck = await store.getPitchDeck(link.pitchDeckId)
  if (!deck) return jsonError("DECK_NOT_FOUND", 404)
  const slides = await store.listSlidesForDeck(link.pitchDeckId)
  const scripts = await Promise.all(
    slides.map(async (s) => ({
      slideId: s.id,
      latest: (await store.getLatestScriptForSlide(s.id)) ?? null,
    })),
  )
  return jsonOk({ deck, slides, scripts })
}
