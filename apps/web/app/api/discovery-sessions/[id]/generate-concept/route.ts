import { getStore, resolveOrganizationId } from "@/lib/server/store"
import { generateConceptSectionsWithOptionalOpenAI } from "@/lib/server/ai-concept"
import { jsonError, jsonOk } from "@/lib/server/api-helpers"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function POST(request: Request, { params }: RouteParams) {
  const { id } = await params
  const orgId = resolveOrganizationId(request)
  const store = getStore()
  const session = store.getDiscoverySession(id)
  if (!session || session.organizationId !== orgId) {
    return jsonError("DISCOVERY_NOT_FOUND", 404)
  }

  const sections = await generateConceptSectionsWithOptionalOpenAI(session)
  const concept = store.createSolutionConceptFromDiscovery(id, sections)
  return jsonOk({ concept }, 201)
}
