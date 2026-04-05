import { slideScriptPatchSchema } from "@pitchdeck/core"
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
  const script = await store.getSlideScriptById(id)
  if (!script || script.organizationId !== orgId) {
    return jsonError("SCRIPT_NOT_FOUND", 404)
  }
  return jsonOk({ script })
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const orgId = await resolveOrganizationId(request)
    const store = await getStore()
    const existing = await store.getSlideScriptById(id)
    if (!existing || existing.organizationId !== orgId) {
      return jsonError("SCRIPT_NOT_FOUND", 404)
    }
    const patch = slideScriptPatchSchema.parse(await request.json())
    const script = await store.patchSlideScript(id, patch)
    return jsonOk({ script })
  } catch (error) {
    const z = handleZodError(error)
    if (z) return z
    const m = mapStoreError(error)
    if (m) return m
    return jsonError("INVALID_REQUEST", 400)
  }
}
