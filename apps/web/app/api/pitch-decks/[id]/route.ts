import { getStore, resolveOrganizationId } from "@/lib/server/store"
import { jsonError, jsonOk } from "@/lib/server/api-helpers"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params
  const orgId = await resolveOrganizationId(request)
  const store = await getStore()
  const deck = await store.getPitchDeck(id)
  if (!deck || deck.organizationId !== orgId) {
    return jsonError("DECK_NOT_FOUND", 404)
  }
  const slides = await store.listSlidesForDeck(id)
  const scripts = await Promise.all(
    slides.map(async (s) => ({
      slideId: s.id,
      latest: (await store.getLatestScriptForSlide(s.id)) ?? null,
    })),
  )
  return jsonOk({ deck, slides, scripts })
}
