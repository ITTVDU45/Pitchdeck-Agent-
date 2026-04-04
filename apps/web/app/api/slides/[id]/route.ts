import { slidePatchSchema } from "@pitchdeck/core"
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
  const orgId = resolveOrganizationId(request)
  const store = getStore()
  const slide = store.getSlide(id)
  if (!slide || slide.organizationId !== orgId) {
    return jsonError("SLIDE_NOT_FOUND", 404)
  }
  const latestScript = store.getLatestScriptForSlide(id)
  return jsonOk({ slide, latestScript })
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const orgId = resolveOrganizationId(request)
    const store = getStore()
    const existing = store.getSlide(id)
    if (!existing || existing.organizationId !== orgId) {
      return jsonError("SLIDE_NOT_FOUND", 404)
    }
    const patch = slidePatchSchema.parse(await request.json())
    const slide = store.patchSlide(id, patch)
    return jsonOk({ slide })
  } catch (error) {
    const z = handleZodError(error)
    if (z) return z
    const m = mapStoreError(error)
    if (m) return m
    return jsonError("INVALID_REQUEST", 400)
  }
}
