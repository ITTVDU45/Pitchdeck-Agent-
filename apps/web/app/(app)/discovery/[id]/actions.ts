"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { discoverySessionPatchSchema } from "@pitchdeck/core"
import { getStore } from "@/lib/server/store"
import { generateConceptSectionsWithOptionalOpenAI } from "@/lib/server/ai-concept"

export async function saveDiscoverySession(
  discoveryId: string,
  formData: FormData,
) {
  const store = await getStore()
  const existing = await store.getDiscoverySession(discoveryId)
  if (!existing) throw new Error("DISCOVERY_NOT_FOUND")

  const parseTags = (prefix: string) => {
    const raw = String(formData.get(prefix) ?? "[]")
    try {
      const parsed = JSON.parse(raw) as { label: string; detail?: string }[]
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  const statusRaw = String(formData.get("status") ?? "").trim()
  const patch = discoverySessionPatchSchema.parse({
    title: String(formData.get("title") ?? "").trim() || undefined,
    rawNotes: String(formData.get("rawNotes") ?? ""),
    painPoints: parseTags("painPoints"),
    needs: parseTags("needs"),
    goals: parseTags("goals"),
    processes: parseTags("processes"),
    techStack: parseTags("techStack"),
    status:
      statusRaw === "draft" ||
      statusRaw === "ready_for_concept" ||
      statusRaw === "archived"
        ? statusRaw
        : undefined,
  })

  await store.patchDiscoverySession(discoveryId, patch)
  const updated = await store.getDiscoverySession(discoveryId)
  if (updated) {
    revalidatePath(`/discovery/${discoveryId}`)
    revalidatePath(`/clients/${updated.clientId}`)
  }
}

export async function generateConceptAction(discoveryId: string) {
  const store = await getStore()
  const session = await store.getDiscoverySession(discoveryId)
  if (!session) throw new Error("DISCOVERY_NOT_FOUND")

  const sections = await generateConceptSectionsWithOptionalOpenAI(session)
  const concept = await store.createSolutionConceptFromDiscovery(
    discoveryId,
    sections,
  )
  revalidatePath(`/discovery/${discoveryId}`)
  revalidatePath(`/clients/${session.clientId}`)
  redirect(`/concepts/${concept.id}`)
}
