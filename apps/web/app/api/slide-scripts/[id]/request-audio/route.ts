import { jsonOk } from "@/lib/server/api-helpers"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function POST(_request: Request, { params }: RouteParams) {
  await params
  return jsonOk(
    {
      status: "not_implemented",
      message:
        "Audio wird vorbereitet: ElevenLabs-Integration und Worker-Queue folgen. Nutze vorerst nur Sprechertexte.",
    },
    501,
  )
}
