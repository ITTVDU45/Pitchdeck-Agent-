import { getStore } from "@/lib/server/store"
import { jsonError, jsonOk } from "@/lib/server/api-helpers"

interface RouteParams {
  params: Promise<{ token: string }>
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { token } = await params
  const store = getStore()
  const link = store.getShareLink(token)
  if (!link) return jsonError("SHARE_NOT_FOUND", 404)
  const deck = store.getPitchDeck(link.pitchDeckId)
  if (!deck) return jsonError("DECK_NOT_FOUND", 404)
  const slides = store.listSlidesForDeck(link.pitchDeckId)
  const scripts = slides.map((s) => ({
    slideId: s.id,
    latest: store.getLatestScriptForSlide(s.id) ?? null,
  }))
  return jsonOk({ deck, slides, scripts })
}
