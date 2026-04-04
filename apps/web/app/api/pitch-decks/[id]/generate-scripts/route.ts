import { getStore, resolveOrganizationId } from "@/lib/server/store"
import { jsonError, jsonOk, mapStoreError } from "@/lib/server/api-helpers"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const orgId = resolveOrganizationId(request)
    const store = getStore()
    const deck = store.getPitchDeck(id)
    if (!deck || deck.organizationId !== orgId) {
      return jsonError("DECK_NOT_FOUND", 404)
    }
    const scripts = store.generateScriptsForPitchDeck(id)
    return jsonOk({ scripts })
  } catch (error) {
    const m = mapStoreError(error)
    if (m) return m
    return jsonError("INVALID_REQUEST", 400)
  }
}
