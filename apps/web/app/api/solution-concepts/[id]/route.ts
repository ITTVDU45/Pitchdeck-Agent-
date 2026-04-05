import { solutionConceptPatchSchema } from "@pitchdeck/core"
import { getStore, resolveOrganizationId } from "@/lib/server/store"
import {
  handleZodError,
  jsonError,
  jsonOk,
  mapStoreError,
} from "@/lib/server/api-helpers"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params
  const orgId = await resolveOrganizationId(request)
  const store = await getStore()
  const concept = await store.getSolutionConcept(id)
  if (!concept || concept.organizationId !== orgId) {
    return jsonError("CONCEPT_NOT_FOUND", 404)
  }
  return jsonOk({ concept })
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const orgId = await resolveOrganizationId(request)
    const store = await getStore()
    const existing = await store.getSolutionConcept(id)
    if (!existing || existing.organizationId !== orgId) {
      return jsonError("CONCEPT_NOT_FOUND", 404)
    }
    const patch = solutionConceptPatchSchema.parse(await request.json())
    const concept = await store.patchSolutionConcept(id, patch)
    return jsonOk({ concept })
  } catch (error) {
    const z = handleZodError(error)
    if (z) return z
    const m = mapStoreError(error)
    if (m) return m
    return jsonError("INVALID_REQUEST", 400)
  }
}
