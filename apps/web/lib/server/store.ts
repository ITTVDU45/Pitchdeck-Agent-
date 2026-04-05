import { getPrismaStore } from "./prisma-store"

const ORG_HEADER = "x-organization-id"

export async function getStore() {
  return getPrismaStore()
}

export async function getDefaultOrganizationId(): Promise<string> {
  return getPrismaStore().defaultOrganizationIdAsync()
}

export async function resolveOrganizationId(
  request: Request,
): Promise<string> {
  const fromHeader = request.headers.get(ORG_HEADER)?.trim()
  if (fromHeader) return fromHeader
  return getDefaultOrganizationId()
}
