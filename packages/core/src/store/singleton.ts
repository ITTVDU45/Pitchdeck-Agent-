import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname } from "node:path"
import { MemoryStore, type SerializedStore } from "./memory-store"

const globalKey = "__pitchdeck_memory_store__" as const

type GlobalStore = typeof globalThis & {
  [globalKey]?: MemoryStore
}

function resolveStoreFilePath(): string | undefined {
  const raw = process.env.PITCHDECK_STORE_PATH?.trim()
  if (!raw) return undefined
  return raw
}

function loadSnapshotFromFile(path: string): SerializedStore | undefined {
  if (!existsSync(path)) return undefined
  try {
    const raw = readFileSync(path, "utf8")
    return JSON.parse(raw) as SerializedStore
  } catch {
    return undefined
  }
}

function persistSnapshotToFile(path: string, store: MemoryStore): void {
  try {
    const dir = dirname(path)
    if (dir && dir !== ".") mkdirSync(dir, { recursive: true })
    writeFileSync(path, JSON.stringify(store.toSnapshot()), "utf8")
  } catch {
    // z. B. read-only FS auf Serverless ohne beschreibbares Volume
  }
}

export function getMemoryStore(): MemoryStore {
  const g = globalThis as GlobalStore
  if (g[globalKey]) return g[globalKey]

  const filePath = resolveStoreFilePath()
  const snapshot = filePath ? loadSnapshotFromFile(filePath) : undefined
  const store = new MemoryStore(snapshot)

  if (filePath) {
    store.setPersistHandler(() => persistSnapshotToFile(filePath, store))
  }

  g[globalKey] = store
  return store
}
