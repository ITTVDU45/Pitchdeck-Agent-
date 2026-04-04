import { randomUUID } from "node:crypto"
import type {
  Client,
  DiscoverySession,
  Organization,
  PitchDeck,
  ShareLink,
  Slide,
  SlideScript,
  SolutionConcept,
} from "../domain/types"
import type { CreateClientBody } from "../schemas/client"
import type { DiscoverySessionPatch } from "../schemas/discovery"
import type { SolutionConceptPatch } from "../schemas/concept"
import type { SlidePatch } from "../schemas/slide"
import type { SlideScriptPatch } from "../schemas/script"
import { buildPitchDeckFromConcept } from "../services/deck-builder"
import { buildScriptForSlide } from "../services/script-builder"

function nowIso(): string {
  return new Date().toISOString()
}

export class MemoryStore {
  organizations = new Map<string, Organization>()
  clients = new Map<string, Client>()
  discoverySessions = new Map<string, DiscoverySession>()
  solutionConcepts = new Map<string, SolutionConcept>()
  pitchDecks = new Map<string, PitchDeck>()
  slidesByDeck = new Map<string, Slide[]>()
  scriptsBySlide = new Map<string, SlideScript[]>()
  shareByToken = new Map<string, ShareLink>()

  constructor() {
    const org: Organization = {
      id: randomUUID(),
      name: "Default Organization",
      slug: "default",
      createdAt: nowIso(),
    }
    this.organizations.set(org.id, org)
    this.defaultOrganizationId = org.id
  }

  readonly defaultOrganizationId: string

  listClients(organizationId: string): Client[] {
    return [...this.clients.values()].filter(
      (c) => c.organizationId === organizationId,
    )
  }

  getClient(id: string): Client | undefined {
    return this.clients.get(id)
  }

  createClient(organizationId: string, body: CreateClientBody): Client {
    const ts = nowIso()
    const client: Client = {
      id: randomUUID(),
      organizationId,
      companyName: body.companyName,
      industry: body.industry,
      contactName: body.contactName,
      contactRole: body.contactRole,
      website: body.website || undefined,
      notes: body.notes,
      createdAt: ts,
      updatedAt: ts,
    }
    this.clients.set(client.id, client)
    return client
  }

  listDiscoveryForClient(clientId: string): DiscoverySession[] {
    return [...this.discoverySessions.values()].filter(
      (d) => d.clientId === clientId,
    )
  }

  createDiscoverySession(
    organizationId: string,
    clientId: string,
    title?: string,
  ): DiscoverySession {
    const client = this.clients.get(clientId)
    if (!client || client.organizationId !== organizationId) {
      throw new Error("CLIENT_NOT_FOUND")
    }
    const ts = nowIso()
    const session: DiscoverySession = {
      id: randomUUID(),
      organizationId,
      clientId,
      title: title?.trim() || "Neue Discovery",
      rawNotes: "",
      painPoints: [],
      needs: [],
      goals: [],
      processes: [],
      techStack: [],
      status: "draft",
      createdAt: ts,
      updatedAt: ts,
    }
    this.discoverySessions.set(session.id, session)
    return session
  }

  getDiscoverySession(id: string): DiscoverySession | undefined {
    return this.discoverySessions.get(id)
  }

  patchDiscoverySession(
    id: string,
    patch: DiscoverySessionPatch,
  ): DiscoverySession {
    const existing = this.discoverySessions.get(id)
    if (!existing) throw new Error("DISCOVERY_NOT_FOUND")
    const updated: DiscoverySession = {
      ...existing,
      ...patch,
      title: patch.title ?? existing.title,
      rawNotes: patch.rawNotes ?? existing.rawNotes,
      painPoints: patch.painPoints ?? existing.painPoints,
      needs: patch.needs ?? existing.needs,
      goals: patch.goals ?? existing.goals,
      processes: patch.processes ?? existing.processes,
      techStack: patch.techStack ?? existing.techStack,
      status: patch.status ?? existing.status,
      updatedAt: nowIso(),
    }
    this.discoverySessions.set(id, updated)
    return updated
  }

  getLatestConceptForSession(
    discoverySessionId: string,
  ): SolutionConcept | undefined {
    const list = [...this.solutionConcepts.values()].filter(
      (c) => c.discoverySessionId === discoverySessionId,
    )
    if (list.length === 0) return undefined
    return list.sort((a, b) => b.version - a.version)[0]
  }

  getSolutionConcept(id: string): SolutionConcept | undefined {
    return this.solutionConcepts.get(id)
  }

  createSolutionConceptFromDiscovery(
    discoverySessionId: string,
    sections: SolutionConcept["sections"],
  ): SolutionConcept {
    const session = this.discoverySessions.get(discoverySessionId)
    if (!session) throw new Error("DISCOVERY_NOT_FOUND")
    const previous = this.getLatestConceptForSession(discoverySessionId)
    const version = (previous?.version ?? 0) + 1
    const ts = nowIso()
    const concept: SolutionConcept = {
      id: randomUUID(),
      organizationId: session.organizationId,
      discoverySessionId,
      version,
      status: "draft",
      sections,
      createdAt: ts,
      updatedAt: ts,
    }
    this.solutionConcepts.set(concept.id, concept)
    return concept
  }

  patchSolutionConcept(
    id: string,
    patch: SolutionConceptPatch,
  ): SolutionConcept {
    const existing = this.solutionConcepts.get(id)
    if (!existing) throw new Error("CONCEPT_NOT_FOUND")
    const updated: SolutionConcept = {
      ...existing,
      sections: patch.sections ?? existing.sections,
      status: patch.status ?? existing.status,
      updatedAt: nowIso(),
    }
    this.solutionConcepts.set(id, updated)
    return updated
  }

  approveSolutionConcept(id: string): SolutionConcept {
    return this.patchSolutionConcept(id, { status: "approved" })
  }

  getPitchDeck(id: string): PitchDeck | undefined {
    return this.pitchDecks.get(id)
  }

  listSlidesForDeck(pitchDeckId: string): Slide[] {
    return [...(this.slidesByDeck.get(pitchDeckId) ?? [])].sort(
      (a, b) => a.orderIndex - b.orderIndex,
    )
  }

  createPitchDeckFromConcept(solutionConceptId: string): {
    deck: PitchDeck
    slides: Slide[]
  } {
    const concept = this.solutionConcepts.get(solutionConceptId)
    if (!concept) throw new Error("CONCEPT_NOT_FOUND")
    if (concept.status !== "approved") {
      throw new Error("CONCEPT_NOT_APPROVED")
    }
    const session = this.discoverySessions.get(concept.discoverySessionId)
    if (!session) throw new Error("DISCOVERY_NOT_FOUND")
    const client = this.clients.get(session.clientId)
    const companyName = client?.companyName ?? "Kunde"

    const previousDecks = [...this.pitchDecks.values()].filter(
      (d) => d.solutionConceptId === solutionConceptId,
    )
    const version = (previousDecks.sort((a, b) => b.version - a.version)[0]
      ?.version ?? 0) + 1

    const ts = nowIso()
    const deck: PitchDeck = {
      id: randomUUID(),
      organizationId: concept.organizationId,
      solutionConceptId,
      version,
      title: `Pitch – ${companyName}`,
      audience: "Entscheidungsträger",
      theme: "clean",
      status: "draft",
      createdAt: ts,
      updatedAt: ts,
    }

    const slidePayloads = buildPitchDeckFromConcept({
      concept,
      clientName: companyName,
    })
    const slides: Slide[] = slidePayloads.map((payload, index) => ({
      id: randomUUID(),
      organizationId: concept.organizationId,
      pitchDeckId: deck.id,
      orderIndex: index,
      type: payload.type,
      title: payloadTitleFromPayload(payload),
      payload,
      notes: "",
      createdAt: ts,
      updatedAt: ts,
    }))

    this.pitchDecks.set(deck.id, deck)
    this.slidesByDeck.set(deck.id, slides)
    return { deck, slides }
  }

  getSlide(id: string): Slide | undefined {
    for (const slides of this.slidesByDeck.values()) {
      const found = slides.find((s) => s.id === id)
      if (found) return found
    }
    return undefined
  }

  patchSlide(id: string, patch: SlidePatch): Slide {
    const slide = this.getSlide(id)
    if (!slide) throw new Error("SLIDE_NOT_FOUND")
    const deckSlides = this.slidesByDeck.get(slide.pitchDeckId)
    if (!deckSlides) throw new Error("DECK_NOT_FOUND")

    const nextPayload = patch.payload ?? slide.payload
    const nextType = nextPayload.type
    const updated: Slide = {
      ...slide,
      title: patch.title ?? slide.title,
      notes: patch.notes ?? slide.notes,
      type: nextType,
      payload: nextPayload,
      updatedAt: nowIso(),
    }
    const nextList = deckSlides.map((s) => (s.id === id ? updated : s))
    this.slidesByDeck.set(slide.pitchDeckId, nextList)
    return updated
  }

  getLatestScriptForSlide(slideId: string): SlideScript | undefined {
    const list = this.scriptsBySlide.get(slideId) ?? []
    if (list.length === 0) return undefined
    return list.sort((a, b) => b.version - a.version)[0]
  }

  getSlideScriptById(id: string): SlideScript | undefined {
    for (const scripts of this.scriptsBySlide.values()) {
      const found = scripts.find((s) => s.id === id)
      if (found) return found
    }
    return undefined
  }

  generateScriptsForPitchDeck(pitchDeckId: string): SlideScript[] {
    const deck = this.pitchDecks.get(pitchDeckId)
    if (!deck) throw new Error("DECK_NOT_FOUND")
    const slides = this.listSlidesForDeck(pitchDeckId)
    const created: SlideScript[] = []
    const ts = nowIso()
    for (const slide of slides) {
      const previous = this.getLatestScriptForSlide(slide.id)
      const version = (previous?.version ?? 0) + 1
      const text = buildScriptForSlide(slide)
      const script: SlideScript = {
        id: randomUUID(),
        organizationId: deck.organizationId,
        slideId: slide.id,
        version,
        speakingMode: "consultant",
        text,
        durationEstimateSeconds: Math.min(240, Math.max(30, text.length / 12)),
        createdAt: ts,
        updatedAt: ts,
      }
      const existing = this.scriptsBySlide.get(slide.id) ?? []
      this.scriptsBySlide.set(slide.id, [...existing, script])
      created.push(script)
    }
    return created
  }

  patchSlideScript(id: string, patch: SlideScriptPatch): SlideScript {
    const existing = this.getSlideScriptById(id)
    if (!existing) throw new Error("SCRIPT_NOT_FOUND")
    const slide = this.getSlide(existing.slideId)
    if (!slide) throw new Error("SLIDE_NOT_FOUND")
    const list = this.scriptsBySlide.get(existing.slideId) ?? []
    const version = (this.getLatestScriptForSlide(existing.slideId)?.version ?? 0) + 1
    const ts = nowIso()
    const next: SlideScript = {
      ...existing,
      id: randomUUID(),
      version,
      text: patch.text ?? existing.text,
      speakingMode: patch.speakingMode ?? existing.speakingMode,
      updatedAt: ts,
      createdAt: ts,
    }
    this.scriptsBySlide.set(existing.slideId, [...list, next])
    return next
  }

  publishPitchDeck(pitchDeckId: string): ShareLink {
    const deck = this.pitchDecks.get(pitchDeckId)
    if (!deck) throw new Error("DECK_NOT_FOUND")
    const token = randomUUID().replace(/-/g, "")
    const link: ShareLink = {
      token,
      organizationId: deck.organizationId,
      pitchDeckId,
      createdAt: nowIso(),
    }
    this.shareByToken.set(token, link)
    deck.status = "published"
    deck.updatedAt = nowIso()
    this.pitchDecks.set(pitchDeckId, deck)
    return link
  }

  getShareLink(token: string): ShareLink | undefined {
    return this.shareByToken.get(token)
  }

  getShareLinkForPitchDeck(pitchDeckId: string): ShareLink | undefined {
    return [...this.shareByToken.values()].find(
      (l) => l.pitchDeckId === pitchDeckId,
    )
  }
}

function payloadTitleFromPayload(
  payload: import("../schemas/slide").SlidePayload,
): string {
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
