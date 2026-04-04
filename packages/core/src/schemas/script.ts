import { z } from "zod"

export const slideScriptPatchSchema = z.object({
  text: z.string().min(1).max(12000).optional(),
  speakingMode: z.enum(["consultant", "sales", "technical"]).optional(),
})

export type SlideScriptPatch = z.infer<typeof slideScriptPatchSchema>
