import { z } from "zod"

const tagItemSchema = z.object({
  label: z.string().min(1).max(200),
  detail: z.string().max(2000).optional(),
})

export const discoverySessionPatchSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  rawNotes: z.string().max(20000).optional(),
  painPoints: z.array(tagItemSchema).max(50).optional(),
  needs: z.array(tagItemSchema).max(50).optional(),
  goals: z.array(tagItemSchema).max(50).optional(),
  processes: z.array(tagItemSchema).max(50).optional(),
  techStack: z.array(tagItemSchema).max(50).optional(),
  status: z.enum(["draft", "ready_for_concept", "archived"]).optional(),
})

export type DiscoverySessionPatch = z.infer<typeof discoverySessionPatchSchema>

export const createDiscoverySessionBodySchema = z.object({
  clientId: z.string().uuid(),
  title: z.string().min(1).max(200).optional(),
})

export type CreateDiscoverySessionBody = z.infer<
  typeof createDiscoverySessionBodySchema
>
