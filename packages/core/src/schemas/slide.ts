import { z } from "zod"

export const slideTypeSchema = z.enum([
  "title",
  "executive_summary",
  "problem_cluster",
  "solution_overview",
  "roadmap",
  "next_steps",
])

export type SlideType = z.infer<typeof slideTypeSchema>

const titlePayloadSchema = z.object({
  headline: z.string().min(1).max(200),
  subline: z.string().max(500).optional(),
  clientName: z.string().min(1).max(200),
})

const executiveSummaryPayloadSchema = z.object({
  headline: z.string().min(1).max(200),
  bullets: z.array(z.string().min(1).max(400)).min(1).max(12),
})

const problemClusterPayloadSchema = z.object({
  headline: z.string().min(1).max(200),
  intro: z.string().max(2000).optional(),
  clusters: z
    .array(
      z.object({
        title: z.string().min(1).max(120),
        pain: z.string().min(1).max(800),
        impact: z.string().min(1).max(800),
      }),
    )
    .min(1)
    .max(8),
})

const solutionOverviewPayloadSchema = z.object({
  headline: z.string().min(1).max(200),
  pillars: z
    .array(
      z.object({
        title: z.string().min(1).max(120),
        description: z.string().min(1).max(1200),
      }),
    )
    .min(1)
    .max(8),
})

const roadmapPayloadSchema = z.object({
  headline: z.string().min(1).max(200),
  phases: z
    .array(
      z.object({
        name: z.string().min(1).max(120),
        milestones: z.array(z.string().min(1).max(400)).min(1).max(10),
      }),
    )
    .min(1)
    .max(10),
})

const nextStepsPayloadSchema = z.object({
  headline: z.string().min(1).max(200),
  steps: z.array(z.string().min(1).max(400)).min(1).max(12),
  cta: z.string().max(400).optional(),
})

export const slidePayloadSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("title"), data: titlePayloadSchema }),
  z.object({
    type: z.literal("executive_summary"),
    data: executiveSummaryPayloadSchema,
  }),
  z.object({
    type: z.literal("problem_cluster"),
    data: problemClusterPayloadSchema,
  }),
  z.object({
    type: z.literal("solution_overview"),
    data: solutionOverviewPayloadSchema,
  }),
  z.object({ type: z.literal("roadmap"), data: roadmapPayloadSchema }),
  z.object({ type: z.literal("next_steps"), data: nextStepsPayloadSchema }),
])

export type SlidePayload = z.infer<typeof slidePayloadSchema>

export const slidePatchSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  notes: z.string().max(5000).optional(),
  payload: slidePayloadSchema.optional(),
})

export type SlidePatch = z.infer<typeof slidePatchSchema>
