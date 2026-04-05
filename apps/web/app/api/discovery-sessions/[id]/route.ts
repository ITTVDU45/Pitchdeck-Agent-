import { discoverySessionPatchSchema } from "@pitchdeck/core"
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
  const session = await store.getDiscoverySession(id)
  if (!session || session.organizationId !== orgId) {
    return jsonError("DISCOVERY_NOT_FOUND", 404)
  }
  const latestConcept = await store.getLatestConceptForSession(id)
  return jsonOk({ session, latestConcept })
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const orgId = await resolveOrganizationId(request)
    const store = await getStore()
    const existing = await store.getDiscoverySession(id)
    if (!existing || existing.organizationId !== orgId) {
      return jsonError("DISCOVERY_NOT_FOUND", 404)
    }
    const patch = discoverySessionPatchSchema.parse(await request.json())
    const session = await store.patchDiscoverySession(id, patch)
    return jsonOk({ session })
  } catch (error) {
    const z = handleZodError(error)
    if (z) return z
    const m = mapStoreError(error)
    if (m) return m
    return jsonError("INVALID_REQUEST", 400)
  }
}
