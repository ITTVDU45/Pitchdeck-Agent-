import { getStore, resolveOrganizationId } from "@/lib/server/store"
import { jsonError, jsonOk } from "@/lib/server/api-helpers"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params
  const orgId = resolveOrganizationId(request)
  const store = getStore()
  const deck = store.getPitchDeck(id)
  if (!deck || deck.organizationId !== orgId) {
    return jsonError("DECK_NOT_FOUND", 404)
  }
  const slides = store.listSlidesForDeck(id)
  const scripts = slides.map((s) => ({
    slideId: s.id,
    latest: store.getLatestScriptForSlide(s.id) ?? null,
  }))
  return jsonOk({ deck, slides, scripts })
}
