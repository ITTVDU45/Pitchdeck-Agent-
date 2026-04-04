import OpenAI from "openai"
import {
  buildSolutionConceptFromDiscovery,
  solutionConceptSectionsSchema,
  type DiscoverySession,
  type SolutionConceptSections,
} from "@pitchdeck/core"

export async function generateConceptSectionsWithOptionalOpenAI(
  session: DiscoverySession,
): Promise<SolutionConceptSections> {
  const apiKey = process.env.OPENAI_API_KEY?.trim()
  if (!apiKey) {
    return buildSolutionConceptFromDiscovery(session)
  }

  const client = new OpenAI({ apiKey })
  const system = `Du bist ein erfahrener B2B-Berater. Antworte ausschließlich mit gültigem JSON, das exakt diesem Schema entspricht (kein Markdown, keine Erklärungen):
{
  "executiveSummary": string,
  "problems": [{ "title": string, "detail": string }],
  "solutions": [{ "title": string, "detail": string }],
  "strategy": [{ "title": string, "detail": string }],
  "roadmap": [{ "phase": string, "items": string[] }]
}
Halte Texte prägnant, sachlich, auf Deutsch.`

  const userPayload = {
    sessionTitle: session.title,
    rawNotes: session.rawNotes,
    painPoints: session.painPoints,
    needs: session.needs,
    goals: session.goals,
    processes: session.processes,
    techStack: session.techStack,
  }

  try {
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini",
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        {
          role: "user",
          content: JSON.stringify(userPayload),
        },
      ],
    })
    const raw = completion.choices[0]?.message?.content
    if (!raw) return buildSolutionConceptFromDiscovery(session)
    const parsed = JSON.parse(raw) as unknown
    const validated = solutionConceptSectionsSchema.safeParse(parsed)
    if (!validated.success) return buildSolutionConceptFromDiscovery(session)
    return validated.data
  } catch {
    return buildSolutionConceptFromDiscovery(session)
  }
}
