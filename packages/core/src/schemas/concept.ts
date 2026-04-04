import { z } from "zod"

export const solutionConceptSectionsSchema = z.object({
  executiveSummary: z.string().min(1).max(8000),
  problems: z
    .array(
      z.object({
        title: z.string().min(1).max(200),
        detail: z.string().min(1).max(4000),
      }),
    )
    .min(1)
    .max(20),
  solutions: z
    .array(
      z.object({
        title: z.string().min(1).max(200),
        detail: z.string().min(1).max(4000),
      }),
    )
    .min(1)
    .max(20),
  strategy: z
    .array(
      z.object({
        title: z.string().min(1).max(200),
        detail: z.string().min(1).max(4000),
      }),
    )
    .min(1)
    .max(20),
  roadmap: z
    .array(
      z.object({
        phase: z.string().min(1).max(120),
        items: z.array(z.string().min(1).max(500)).min(1).max(20),
      }),
    )
    .min(1)
    .max(15),
})

export type SolutionConceptSections = z.infer<
  typeof solutionConceptSectionsSchema
>

export const solutionConceptPatchSchema = z.object({
  sections: solutionConceptSectionsSchema.optional(),
  status: z.enum(["draft", "approved"]).optional(),
})

export type SolutionConceptPatch = z.infer<typeof solutionConceptPatchSchema>
