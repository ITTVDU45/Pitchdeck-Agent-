import type { AppDataStore } from "./store-types"
import { memoryStoreAdapter } from "./memory-store-adapter"
import { getPrismaStore } from "./prisma-store"

const ORG_HEADER = "x-organization-id"

/**
 * Prisma nur, wenn DATABASE_URL gesetzt ist und auf Vercel kein SQLite-Dateipfad
 * (file:… → Memory-Fallback). Produktion: PostgreSQL-URL (Neon, Supabase, …).
 */
function shouldUsePrisma(): boolean {
  const url = process.env.DATABASE_URL?.trim() ?? ""
  if (!url) return false
  const onVercel = process.env.VERCEL === "1"
  if (onVercel && url.startsWith("file:")) return false
  return true
}

export async function getStore(): Promise<AppDataStore> {
  if (!shouldUsePrisma()) return memoryStoreAdapter
  return getPrismaStore()
}

export async function getDefaultOrganizationId(): Promise<string> {
  const store = await getStore()
  return store.defaultOrganizationIdAsync()
}

export async function resolveOrganizationId(
  request: Request,
): Promise<string> {
  const fromHeader = request.headers.get(ORG_HEADER)?.trim()
  if (fromHeader) return fromHeader
  return getDefaultOrganizationId()
}

export function isUsingMemoryStoreFallback(): boolean {
  return !shouldUsePrisma()
}
