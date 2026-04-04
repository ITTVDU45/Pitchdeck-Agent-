import { z } from "zod"

export const createClientBodySchema = z.object({
  companyName: z.string().min(1).max(200),
  industry: z.string().min(1).max(120),
  contactName: z.string().min(1).max(120),
  contactRole: z.string().max(120).optional(),
  website: z
    .union([z.string().url().max(500), z.literal("")])
    .optional(),
  notes: z.string().max(5000).optional(),
})

export type CreateClientBody = z.infer<typeof createClientBodySchema>
