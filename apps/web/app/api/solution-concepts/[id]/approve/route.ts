import { getStore, resolveOrganizationId } from "@/lib/server/store"
import { jsonError, jsonOk, mapStoreError } from "@/lib/server/api-helpers"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const orgId = await resolveOrganizationId(request)
    const store = await getStore()
    const existing = await store.getSolutionConcept(id)
    if (!existing || existing.organizationId !== orgId) {
      return jsonError("CONCEPT_NOT_FOUND", 404)
    }
    const concept = await store.approveSolutionConcept(id)
    return jsonOk({ concept })
  } catch (error) {
    const m = mapStoreError(error)
    if (m) return m
    return jsonError("INVALID_REQUEST", 400)
  }
}
