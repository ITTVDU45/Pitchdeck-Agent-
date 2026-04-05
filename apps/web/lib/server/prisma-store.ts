import { randomUUID } from "node:crypto"
import type { Prisma } from "@prisma/client"
import type {
  Client,
  DiscoverySession,
  PitchDeck,
  ShareLink,
  Slide,
  SlideScript,
  SolutionConcept,
  TagItem,
} from "@pitchdeck/core"
import {
  slidePayloadSchema,
  type CreateClientBody,
  type DiscoverySessionPatch,
  type SolutionConceptPatch,
  type SlidePatch,
  type SlideScriptPatch,
} from "@pitchdeck/core"
import { buildPitchDeckFromConcept } from "@pitchdeck/core"
import { buildScriptForSlide } from "@pitchdeck/core"
import { getPrisma } from "./prisma"
import type { AppDataStore } from "./store-types"

function iso(d: Date): string {
  return d.toISOString()
}

function parseTags(json: string): TagItem[] {
  try {
    const v = JSON.parse(json) as unknown
    if (!Array.isArray(v)) return []
    return v as TagItem[]
  } catch {
    return []
  }
}

function stringifyTags(items: TagItem[]): string {
  return JSON.stringify(items)
}

let defaultOrgIdPromise: Promise<string> | null = null

async function ensureDefaultOrganizationId(): Promise<string> {
  if (defaultOrgIdPromise) return defaultOrgIdPromise
  defaultOrgIdPromise = (async () => {
    const prisma = getPrisma()
    const existing = await prisma.organization.findFirst()
    if (existing) return existing.id
    const created = await prisma.organization.create({
      data: {
        id: randomUUID(),
        name: "Default Organization",
        slug: `default-${randomUUID().slice(0, 8)}`,
      },
    })
    return created.id
  })()
  return defaultOrgIdPromise
}

function toClient(row: {
  id: string
  organizationId: string
  companyName: string
  industry: string
  contactName: string
  contactRole: string | null
  website: string | null
  notes: string | null
  createdAt: Date
  updatedAt: Date
}): Client {
  return {
    id: row.id,
    organizationId: row.organizationId,
    companyName: row.companyName,
    industry: row.industry,
    contactName: row.contactName,
    contactRole: row.contactRole ?? undefined,
    website: row.website ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: iso(row.createdAt),
    updatedAt: iso(row.updatedAt),
  }
}

function toDiscovery(row: {
  id: string
  organizationId: string
  clientId: string
  title: string
  rawNotes: string
  painPointsJson: string
  needsJson: string
  goalsJson: string
  processesJson: string
  techStackJson: string
  status: string
  createdAt: Date
  updatedAt: Date
}): DiscoverySession {
  return {
    id: row.id,
    organizationId: row.organizationId,
    clientId: row.clientId,
    title: row.title,
    rawNotes: row.rawNotes,
    painPoints: parseTags(row.painPointsJson),
    needs: parseTags(row.needsJson),
    goals: parseTags(row.goalsJson),
    processes: parseTags(row.processesJson),
    techStack: parseTags(row.techStackJson),
    status: row.status as DiscoverySession["status"],
    createdAt: iso(row.createdAt),
    updatedAt: iso(row.updatedAt),
  }
}

function toConcept(row: {
  id: string
  organizationId: string
  discoverySessionId: string
  version: number
  status: string
  sectionsJson: string
  createdAt: Date
  updatedAt: Date
}): SolutionConcept {
  const sections = JSON.parse(row.sectionsJson) as SolutionConcept["sections"]
  return {
    id: row.id,
    organizationId: row.organizationId,
    discoverySessionId: row.discoverySessionId,
    version: row.version,
    status: row.status as SolutionConcept["status"],
    sections,
    createdAt: iso(row.createdAt),
    updatedAt: iso(row.updatedAt),
  }
}

function toDeck(row: {
  id: string
  organizationId: string
  solutionConceptId: string
  version: number
  title: string
  audience: string
  theme: string
  status: string
  createdAt: Date
  updatedAt: Date
}): PitchDeck {
  return {
    id: row.id,
    organizationId: row.organizationId,
    solutionConceptId: row.solutionConceptId,
    version: row.version,
    title: row.title,
    audience: row.audience,
    theme: row.theme,
    status: row.status as PitchDeck["status"],
    createdAt: iso(row.createdAt),
    updatedAt: iso(row.updatedAt),
  }
}

function toSlide(row: {
  id: string
  organizationId: string
  pitchDeckId: string
  orderIndex: number
  type: string
  title: string
  payloadJson: string
  notes: string
  createdAt: Date
  updatedAt: Date
}): Slide {
  const payload = slidePayloadSchema.parse(JSON.parse(row.payloadJson))
  return {
    id: row.id,
    organizationId: row.organizationId,
    pitchDeckId: row.pitchDeckId,
    orderIndex: row.orderIndex,
    type: payload.type,
    title: row.title,
    payload,
    notes: row.notes,
    createdAt: iso(row.createdAt),
    updatedAt: iso(row.updatedAt),
  }
}

function toScript(row: {
  id: string
  organizationId: string
  slideId: string
  version: number
  speakingMode: string
  text: string
  durationEstimateSeconds: number
  createdAt: Date
  updatedAt: Date
}): SlideScript {
  return {
    id: row.id,
    organizationId: row.organizationId,
    slideId: row.slideId,
    version: row.version,
    speakingMode: row.speakingMode as SlideScript["speakingMode"],
    text: row.text,
    durationEstimateSeconds: row.durationEstimateSeconds,
    createdAt: iso(row.createdAt),
    updatedAt: iso(row.updatedAt),
  }
}

function payloadTitle(payload: Slide["payload"]): string {
  switch (payload.type) {
    case "title":
      return payload.data.headline
    case "executive_summary":
      return payload.data.headline
    case "problem_cluster":
      return payload.data.headline
    case "solution_overview":
      return payload.data.headline
    case "roadmap":
      return payload.data.headline
    case "next_steps":
      return payload.data.headline
    default:
      return "Folie"
  }
}

export class PrismaAppStore implements AppDataStore {
  get defaultOrganizationId(): string {
    throw new Error(
      "Use await store.defaultOrganizationIdAsync() — Prisma store is async",
    )
  }

  async defaultOrganizationIdAsync(): Promise<string> {
    return ensureDefaultOrganizationId()
  }

  async listClients(organizationId: string): Promise<Client[]> {
    const prisma = getPrisma()
    const rows = await prisma.client.findMany({
      where: { organizationId },
      orderBy: { updatedAt: "desc" },
    })
    return rows.map(toClient)
  }

  async getClient(id: string): Promise<Client | undefined> {
    const prisma = getPrisma()
    const row = await prisma.client.findUnique({ where: { id } })
    return row ? toClient(row) : undefined
  }

  async createClient(
    organizationId: string,
    body: CreateClientBody,
  ): Promise<Client> {
    const prisma = getPrisma()
    const row = await prisma.client.create({
      data: {
        organizationId,
        companyName: body.companyName,
        industry: body.industry,
        contactName: body.contactName,
        contactRole: body.contactRole,
        website: body.website,
        notes: body.notes,
      },
    })
    return toClient(row)
  }

  async listDiscoveryForClient(clientId: string): Promise<DiscoverySession[]> {
    const prisma = getPrisma()
    const rows = await prisma.discoverySession.findMany({
      where: { clientId },
      orderBy: { updatedAt: "desc" },
    })
    return rows.map(toDiscovery)
  }

  async createDiscoverySession(
    organizationId: string,
    clientId: string,
    title?: string,
  ): Promise<DiscoverySession> {
    const prisma = getPrisma()
    const client = await prisma.client.findUnique({ where: { id: clientId } })
    if (!client || client.organizationId !== organizationId) {
      throw new Error("CLIENT_NOT_FOUND")
    }
    const row = await prisma.discoverySession.create({
      data: {
        organizationId,
        clientId,
        title: title?.trim() || "Neue Discovery",
        status: "draft",
      },
    })
    return toDiscovery(row)
  }

  async getDiscoverySession(id: string): Promise<DiscoverySession | undefined> {
    const prisma = getPrisma()
    const row = await prisma.discoverySession.findUnique({ where: { id } })
    return row ? toDiscovery(row) : undefined
  }

  async patchDiscoverySession(
    id: string,
    patch: DiscoverySessionPatch,
  ): Promise<DiscoverySession> {
    const prisma = getPrisma()
    const existing = await prisma.discoverySession.findUnique({ where: { id } })
    if (!existing) throw new Error("DISCOVERY_NOT_FOUND")

    const data: Prisma.DiscoverySessionUpdateInput = {}
    if (patch.title !== undefined) data.title = patch.title
    if (patch.rawNotes !== undefined) data.rawNotes = patch.rawNotes
    if (patch.painPoints !== undefined) {
      data.painPointsJson = stringifyTags(patch.painPoints)
    }
    if (patch.needs !== undefined) data.needsJson = stringifyTags(patch.needs)
    if (patch.goals !== undefined) data.goalsJson = stringifyTags(patch.goals)
    if (patch.processes !== undefined) {
      data.processesJson = stringifyTags(patch.processes)
    }
    if (patch.techStack !== undefined) {
      data.techStackJson = stringifyTags(patch.techStack)
    }
    if (patch.status !== undefined) data.status = patch.status

    const row = await prisma.discoverySession.update({
      where: { id },
      data,
    })
    return toDiscovery(row)
  }

  async getLatestConceptForSession(
    discoverySessionId: string,
  ): Promise<SolutionConcept | undefined> {
    const prisma = getPrisma()
    const row = await prisma.solutionConcept.findFirst({
      where: { discoverySessionId },
      orderBy: { version: "desc" },
    })
    return row ? toConcept(row) : undefined
  }

  async getSolutionConcept(id: string): Promise<SolutionConcept | undefined> {
    const prisma = getPrisma()
    const row = await prisma.solutionConcept.findUnique({ where: { id } })
    return row ? toConcept(row) : undefined
  }

  async createSolutionConceptFromDiscovery(
    discoverySessionId: string,
    sections: SolutionConcept["sections"],
  ): Promise<SolutionConcept> {
    const prisma = getPrisma()
    const session = await prisma.discoverySession.findUnique({
      where: { id: discoverySessionId },
    })
    if (!session) throw new Error("DISCOVERY_NOT_FOUND")

    const agg = await prisma.solutionConcept.aggregate({
      where: { discoverySessionId },
      _max: { version: true },
    })
    const version = (agg._max.version ?? 0) + 1

    const row = await prisma.solutionConcept.create({
      data: {
        organizationId: session.organizationId,
        discoverySessionId,
        version,
        status: "draft",
        sectionsJson: JSON.stringify(sections),
      },
    })
    return toConcept(row)
  }

  async patchSolutionConcept(
    id: string,
    patch: SolutionConceptPatch,
  ): Promise<SolutionConcept> {
    const prisma = getPrisma()
    const existing = await prisma.solutionConcept.findUnique({ where: { id } })
    if (!existing) throw new Error("CONCEPT_NOT_FOUND")

    const data: Prisma.SolutionConceptUpdateInput = {}
    if (patch.sections !== undefined) {
      data.sectionsJson = JSON.stringify(patch.sections)
    }
    if (patch.status !== undefined) data.status = patch.status

    const row = await prisma.solutionConcept.update({ where: { id }, data })
    return toConcept(row)
  }

  async approveSolutionConcept(id: string): Promise<SolutionConcept> {
    return this.patchSolutionConcept(id, { status: "approved" })
  }

  async getPitchDeck(id: string): Promise<PitchDeck | undefined> {
    const prisma = getPrisma()
    const row = await prisma.pitchDeck.findUnique({ where: { id } })
    return row ? toDeck(row) : undefined
  }

  async listSlidesForDeck(pitchDeckId: string): Promise<Slide[]> {
    const prisma = getPrisma()
    const rows = await prisma.slide.findMany({
      where: { pitchDeckId },
      orderBy: { orderIndex: "asc" },
    })
    return rows.map(toSlide)
  }

  async createPitchDeckFromConcept(solutionConceptId: string): Promise<{
    deck: PitchDeck
    slides: Slide[]
  }> {
    const prisma = getPrisma()
    const conceptRow = await prisma.solutionConcept.findUnique({
      where: { id: solutionConceptId },
    })
    if (!conceptRow) throw new Error("CONCEPT_NOT_FOUND")
    if (conceptRow.status !== "approved") {
      throw new Error("CONCEPT_NOT_APPROVED")
    }

    const concept = toConcept(conceptRow)
    const session = await prisma.discoverySession.findUnique({
      where: { id: concept.discoverySessionId },
    })
    if (!session) throw new Error("DISCOVERY_NOT_FOUND")

    const clientRow = await prisma.client.findUnique({
      where: { id: session.clientId },
    })
    const companyName = clientRow?.companyName ?? "Kunde"

    const agg = await prisma.pitchDeck.aggregate({
      where: { solutionConceptId },
      _max: { version: true },
    })
    const version = (agg._max.version ?? 0) + 1

    const slidePayloads = buildPitchDeckFromConcept({
      concept,
      clientName: companyName,
    })

    const deck = await prisma.pitchDeck.create({
      data: {
        organizationId: concept.organizationId,
        solutionConceptId,
        version,
        title: `Pitch – ${companyName}`,
        audience: "Entscheidungsträger",
        theme: "clean",
        status: "draft",
        slides: {
          create: slidePayloads.map((payload, index) => ({
            organizationId: concept.organizationId,
            orderIndex: index,
            type: payload.type,
            title: payloadTitle(payload as Slide["payload"]),
            payloadJson: JSON.stringify(payload),
          })),
        },
      },
      include: { slides: { orderBy: { orderIndex: "asc" } } },
    })

    const slides = deck.slides.map(toSlide)
    return { deck: toDeck(deck), slides }
  }

  async getSlide(id: string): Promise<Slide | undefined> {
    const prisma = getPrisma()
    const row = await prisma.slide.findUnique({ where: { id } })
    return row ? toSlide(row) : undefined
  }

  async patchSlide(id: string, patch: SlidePatch): Promise<Slide> {
    const prisma = getPrisma()
    const existing = await prisma.slide.findUnique({ where: { id } })
    if (!existing) throw new Error("SLIDE_NOT_FOUND")

    const current = toSlide(existing)
    const nextPayload = patch.payload ?? current.payload
    const row = await prisma.slide.update({
      where: { id },
      data: {
        title: patch.title ?? existing.title,
        notes: patch.notes ?? existing.notes,
        type: nextPayload.type,
        payloadJson: JSON.stringify(nextPayload),
      },
    })
    return toSlide(row)
  }

  async getLatestScriptForSlide(
    slideId: string,
  ): Promise<SlideScript | undefined> {
    const prisma = getPrisma()
    const row = await prisma.slideScript.findFirst({
      where: { slideId },
      orderBy: { version: "desc" },
    })
    return row ? toScript(row) : undefined
  }

  async getSlideScriptById(id: string): Promise<SlideScript | undefined> {
    const prisma = getPrisma()
    const row = await prisma.slideScript.findUnique({ where: { id } })
    return row ? toScript(row) : undefined
  }

  async generateScriptsForPitchDeck(
    pitchDeckId: string,
  ): Promise<SlideScript[]> {
    const prisma = getPrisma()
    const deck = await prisma.pitchDeck.findUnique({ where: { id: pitchDeckId } })
    if (!deck) throw new Error("DECK_NOT_FOUND")

    const slides = await this.listSlidesForDeck(pitchDeckId)
    const created: SlideScript[] = []

    for (const slide of slides) {
      const agg = await prisma.slideScript.aggregate({
        where: { slideId: slide.id },
        _max: { version: true },
      })
      const version = (agg._max.version ?? 0) + 1
      const text = buildScriptForSlide(slide)
      const row = await prisma.slideScript.create({
        data: {
          organizationId: deck.organizationId,
          slideId: slide.id,
          version,
          speakingMode: "consultant",
          text,
          durationEstimateSeconds: Math.min(
            240,
            Math.max(30, Math.floor(text.length / 12)),
          ),
        },
      })
      created.push(toScript(row))
    }
    return created
  }

  async patchSlideScript(
    id: string,
    patch: SlideScriptPatch,
  ): Promise<SlideScript> {
    const prisma = getPrisma()
    const existing = await prisma.slideScript.findUnique({ where: { id } })
    if (!existing) throw new Error("SCRIPT_NOT_FOUND")

    const slide = await prisma.slide.findUnique({ where: { id: existing.slideId } })
    if (!slide) throw new Error("SLIDE_NOT_FOUND")

    const agg = await prisma.slideScript.aggregate({
      where: { slideId: existing.slideId },
      _max: { version: true },
    })
    const version = (agg._max.version ?? 0) + 1

    const row = await prisma.slideScript.create({
      data: {
        organizationId: existing.organizationId,
        slideId: existing.slideId,
        version,
        speakingMode: patch.speakingMode ?? existing.speakingMode,
        text: patch.text ?? existing.text,
        durationEstimateSeconds: existing.durationEstimateSeconds,
      },
    })
    return toScript(row)
  }

  async publishPitchDeck(pitchDeckId: string): Promise<ShareLink> {
    const prisma = getPrisma()
    const deck = await prisma.pitchDeck.findUnique({ where: { id: pitchDeckId } })
    if (!deck) throw new Error("DECK_NOT_FOUND")

    const token = randomUUID().replace(/-/g, "")
    await prisma.$transaction([
      prisma.shareLink.create({
        data: {
          token,
          organizationId: deck.organizationId,
          pitchDeckId,
        },
      }),
      prisma.pitchDeck.update({
        where: { id: pitchDeckId },
        data: { status: "published" },
      }),
    ])

    const linkRow = await prisma.shareLink.findUnique({ where: { token } })
    if (!linkRow) throw new Error("SHARE_CREATE_FAILED")
    return {
      token: linkRow.token,
      organizationId: linkRow.organizationId,
      pitchDeckId: linkRow.pitchDeckId,
      createdAt: iso(linkRow.createdAt),
    }
  }

  async getShareLink(token: string): Promise<ShareLink | undefined> {
    const prisma = getPrisma()
    const row = await prisma.shareLink.findUnique({ where: { token } })
    if (!row) return undefined
    return {
      token: row.token,
      organizationId: row.organizationId,
      pitchDeckId: row.pitchDeckId,
      createdAt: iso(row.createdAt),
    }
  }

  async getShareLinkForPitchDeck(
    pitchDeckId: string,
  ): Promise<ShareLink | undefined> {
    const prisma = getPrisma()
    const row = await prisma.shareLink.findFirst({
      where: { pitchDeckId },
      orderBy: { createdAt: "desc" },
    })
    if (!row) return undefined
    return {
      token: row.token,
      organizationId: row.organizationId,
      pitchDeckId: row.pitchDeckId,
      createdAt: iso(row.createdAt),
    }
  }
}

const prismaStoreSingleton = new PrismaAppStore()

export function getPrismaStore(): PrismaAppStore {
  return prismaStoreSingleton
}
