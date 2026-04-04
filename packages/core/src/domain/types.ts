import type { SolutionConceptSections } from "../schemas/concept"
import type { SlidePayload } from "../schemas/slide"

export type DiscoveryStatus = "draft" | "ready_for_concept" | "archived"

export interface TagItem {
  label: string
  detail?: string
}

export interface Organization {
  id: string
  name: string
  slug: string
  createdAt: string
}

export interface Client {
  id: string
  organizationId: string
  companyName: string
  industry: string
  contactName: string
  contactRole?: string
  website?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface DiscoverySession {
  id: string
  organizationId: string
  clientId: string
  title: string
  rawNotes: string
  painPoints: TagItem[]
  needs: TagItem[]
  goals: TagItem[]
  processes: TagItem[]
  techStack: TagItem[]
  status: DiscoveryStatus
  createdAt: string
  updatedAt: string
}

export type SolutionConceptStatus = "draft" | "approved"

export interface SolutionConcept {
  id: string
  organizationId: string
  discoverySessionId: string
  version: number
  status: SolutionConceptStatus
  sections: SolutionConceptSections
  createdAt: string
  updatedAt: string
}

export type PitchDeckStatus = "draft" | "published"

export interface PitchDeck {
  id: string
  organizationId: string
  solutionConceptId: string
  version: number
  title: string
  audience: string
  theme: string
  status: PitchDeckStatus
  createdAt: string
  updatedAt: string
}

export interface Slide {
  id: string
  organizationId: string
  pitchDeckId: string
  orderIndex: number
  type: SlidePayload["type"]
  title: string
  payload: SlidePayload
  notes: string
  createdAt: string
  updatedAt: string
}

export interface SlideScript {
  id: string
  organizationId: string
  slideId: string
  version: number
  speakingMode: "consultant" | "sales" | "technical"
  text: string
  durationEstimateSeconds: number
  createdAt: string
  updatedAt: string
}

export interface ShareLink {
  token: string
  organizationId: string
  pitchDeckId: string
  createdAt: string
}
