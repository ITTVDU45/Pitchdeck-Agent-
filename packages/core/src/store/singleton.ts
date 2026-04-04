import { MemoryStore } from "./memory-store"

const globalKey = "__pitchdeck_memory_store__" as const

type GlobalStore = typeof globalThis & {
  [globalKey]?: MemoryStore
}

export function getMemoryStore(): MemoryStore {
  const g = globalThis as GlobalStore
  if (!g[globalKey]) g[globalKey] = new MemoryStore()
  return g[globalKey]
}
