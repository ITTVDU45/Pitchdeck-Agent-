import type {
  Client,
  DiscoverySession,
  PitchDeck,
  ShareLink,
  Slide,
  SlideScript,
  SolutionConcept,
} from "@pitchdeck/core"
import type {
  CreateClientBody,
  DiscoverySessionPatch,
  SolutionConceptPatch,
  SlidePatch,
  SlideScriptPatch,
} from "@pitchdeck/core"

/** Gemeinsame async-API für Prisma- und Memory-Backend */
export interface AppDataStore {
  defaultOrganizationIdAsync(): Promise<string>
  listClients(organizationId: string): Promise<Client[]>
  getClient(id: string): Promise<Client | undefined>
  createClient(organizationId: string, body: CreateClientBody): Promise<Client>
  listDiscoveryForClient(clientId: string): Promise<DiscoverySession[]>
  createDiscoverySession(
    organizationId: string,
    clientId: string,
    title?: string,
  ): Promise<DiscoverySession>
  getDiscoverySession(id: string): Promise<DiscoverySession | undefined>
  patchDiscoverySession(
    id: string,
    patch: DiscoverySessionPatch,
  ): Promise<DiscoverySession>
  getLatestConceptForSession(
    discoverySessionId: string,
  ): Promise<SolutionConcept | undefined>
  getSolutionConcept(id: string): Promise<SolutionConcept | undefined>
  createSolutionConceptFromDiscovery(
    discoverySessionId: string,
    sections: SolutionConcept["sections"],
  ): Promise<SolutionConcept>
  patchSolutionConcept(
    id: string,
    patch: SolutionConceptPatch,
  ): Promise<SolutionConcept>
  approveSolutionConcept(id: string): Promise<SolutionConcept>
  getPitchDeck(id: string): Promise<PitchDeck | undefined>
  listSlidesForDeck(pitchDeckId: string): Promise<Slide[]>
  createPitchDeckFromConcept(solutionConceptId: string): Promise<{
    deck: PitchDeck
    slides: Slide[]
  }>
  getSlide(id: string): Promise<Slide | undefined>
  patchSlide(id: string, patch: SlidePatch): Promise<Slide>
  getLatestScriptForSlide(slideId: string): Promise<SlideScript | undefined>
  getSlideScriptById(id: string): Promise<SlideScript | undefined>
  generateScriptsForPitchDeck(pitchDeckId: string): Promise<SlideScript[]>
  patchSlideScript(id: string, patch: SlideScriptPatch): Promise<SlideScript>
  publishPitchDeck(pitchDeckId: string): Promise<ShareLink>
  getShareLink(token: string): Promise<ShareLink | undefined>
  getShareLinkForPitchDeck(
    pitchDeckId: string,
  ): Promise<ShareLink | undefined>
}
