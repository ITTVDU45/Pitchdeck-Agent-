import {
  createClientBodySchema,
} from "@pitchdeck/core"
import { resolveOrganizationId, getStore } from "@/lib/server/store"
import { handleZodError, jsonError, jsonOk } from "@/lib/server/api-helpers"

export async function GET(request: Request) {
  const orgId = resolveOrganizationId(request)
  const clients = getStore().listClients(orgId)
  return jsonOk({ clients })
}

export async function POST(request: Request) {
  try {
    const orgId = resolveOrganizationId(request)
    const body = createClientBodySchema.parse(await request.json())
    const client = getStore().createClient(orgId, body)
    return jsonOk({ client }, 201)
  } catch (error) {
    const z = handleZodError(error)
    if (z) return z
    return jsonError("INVALID_REQUEST", 400)
  }
}
