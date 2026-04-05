import { getMemoryStore } from "@pitchdeck/core"
import type { AppDataStore } from "./store-types"

function mem() {
  return getMemoryStore()
}

/** Wrappt den synchronen MemoryStore als Promise-API (Vercel-Fallback ohne DB). */
export const memoryStoreAdapter: AppDataStore = {
  defaultOrganizationIdAsync() {
    return Promise.resolve(mem().defaultOrganizationId)
  },
  listClients(organizationId) {
    return Promise.resolve(mem().listClients(organizationId))
  },
  getClient(id) {
    return Promise.resolve(mem().getClient(id))
  },
  createClient(organizationId, body) {
    return Promise.resolve(mem().createClient(organizationId, body))
  },
  listDiscoveryForClient(clientId) {
    return Promise.resolve(mem().listDiscoveryForClient(clientId))
  },
  createDiscoverySession(organizationId, clientId, title) {
    return Promise.resolve(
      mem().createDiscoverySession(organizationId, clientId, title),
    )
  },
  getDiscoverySession(id) {
    return Promise.resolve(mem().getDiscoverySession(id))
  },
  patchDiscoverySession(id, patch) {
    return Promise.resolve(mem().patchDiscoverySession(id, patch))
  },
  getLatestConceptForSession(discoverySessionId) {
    return Promise.resolve(mem().getLatestConceptForSession(discoverySessionId))
  },
  getSolutionConcept(id) {
    return Promise.resolve(mem().getSolutionConcept(id))
  },
  createSolutionConceptFromDiscovery(discoverySessionId, sections) {
    return Promise.resolve(
      mem().createSolutionConceptFromDiscovery(discoverySessionId, sections),
    )
  },
  patchSolutionConcept(id, patch) {
    return Promise.resolve(mem().patchSolutionConcept(id, patch))
  },
  approveSolutionConcept(id) {
    return Promise.resolve(mem().approveSolutionConcept(id))
  },
  getPitchDeck(id) {
    return Promise.resolve(mem().getPitchDeck(id))
  },
  listSlidesForDeck(pitchDeckId) {
    return Promise.resolve(mem().listSlidesForDeck(pitchDeckId))
  },
  createPitchDeckFromConcept(solutionConceptId) {
    return Promise.resolve(mem().createPitchDeckFromConcept(solutionConceptId))
  },
  getSlide(id) {
    return Promise.resolve(mem().getSlide(id))
  },
  patchSlide(id, patch) {
    return Promise.resolve(mem().patchSlide(id, patch))
  },
  getLatestScriptForSlide(slideId) {
    return Promise.resolve(mem().getLatestScriptForSlide(slideId))
  },
  getSlideScriptById(id) {
    return Promise.resolve(mem().getSlideScriptById(id))
  },
  generateScriptsForPitchDeck(pitchDeckId) {
    return Promise.resolve(mem().generateScriptsForPitchDeck(pitchDeckId))
  },
  patchSlideScript(id, patch) {
    return Promise.resolve(mem().patchSlideScript(id, patch))
  },
  publishPitchDeck(pitchDeckId) {
    return Promise.resolve(mem().publishPitchDeck(pitchDeckId))
  },
  getShareLink(token) {
    return Promise.resolve(mem().getShareLink(token))
  },
  getShareLinkForPitchDeck(pitchDeckId) {
    return Promise.resolve(mem().getShareLinkForPitchDeck(pitchDeckId))
  },
}
