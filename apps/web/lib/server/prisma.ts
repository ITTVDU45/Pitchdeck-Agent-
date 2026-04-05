import { PrismaClient } from "@prisma/client"

const globalKey = "__pitchdeck_prisma__" as const

type GlobalWithPrisma = typeof globalThis & {
  [globalKey]?: PrismaClient
}

export function getPrisma(): PrismaClient {
  const g = globalThis as GlobalWithPrisma
  if (!g[globalKey]) {
    g[globalKey] = new PrismaClient({ log: ["error"] })
  }
  return g[globalKey]
}
