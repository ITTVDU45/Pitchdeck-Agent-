import { getMemoryStore } from "@pitchdeck/core"

const ORG_HEADER = "x-organization-id"

export function getStore() {
  return getMemoryStore()
}

export function resolveOrganizationId(request: Request): string {
  const fromHeader = request.headers.get(ORG_HEADER)?.trim()
  if (fromHeader) return fromHeader
  return getStore().defaultOrganizationId
}
