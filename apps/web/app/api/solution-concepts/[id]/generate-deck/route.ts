import { getStore, resolveOrganizationId } from "@/lib/server/store"
import { jsonError, jsonOk, mapStoreError } from "@/lib/server/api-helpers"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function POST(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const orgId = await resolveOrganizationId(_request)
    const store = await getStore()
    const concept = await store.getSolutionConcept(id)
    if (!concept || concept.organizationId !== orgId) {
      return jsonError("CONCEPT_NOT_FOUND", 404)
    }
    const { deck, slides } = await store.createPitchDeckFromConcept(id)
    return jsonOk({ deck, slides }, 201)
  } catch (error) {
    const m = mapStoreError(error)
    if (m) return m
    return jsonError("INVALID_REQUEST", 400)
  }
}
