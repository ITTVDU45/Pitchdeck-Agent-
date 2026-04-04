import { getStore, resolveOrganizationId } from "@/lib/server/store"
import { jsonError, jsonOk } from "@/lib/server/api-helpers"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params
  const orgId = resolveOrganizationId(request)
  const store = getStore()
  const client = store.getClient(id)
  if (!client || client.organizationId !== orgId) {
    return jsonError("CLIENT_NOT_FOUND", 404)
  }
  const discoverySessions = store.listDiscoveryForClient(id)
  return jsonOk({ client, discoverySessions })
}
