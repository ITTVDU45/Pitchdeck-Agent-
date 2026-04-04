import { createDiscoverySessionBodySchema } from "@pitchdeck/core"
import { getStore, resolveOrganizationId } from "@/lib/server/store"
import { handleZodError, jsonError, jsonOk, mapStoreError } from "@/lib/server/api-helpers"

export async function POST(request: Request) {
  try {
    const orgId = resolveOrganizationId(request)
    const body = createDiscoverySessionBodySchema.parse(await request.json())
    const session = getStore().createDiscoverySession(
      orgId,
      body.clientId,
      body.title,
    )
    return jsonOk({ session }, 201)
  } catch (error) {
    const z = handleZodError(error)
    if (z) return z
    const m = mapStoreError(error)
    if (m) return m
    return jsonError("INVALID_REQUEST", 400)
  }
}
