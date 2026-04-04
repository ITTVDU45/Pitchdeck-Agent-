import { NextResponse } from "next/server"
import { ZodError } from "zod"

export function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status })
}

export function handleZodError(error: unknown) {
  if (error instanceof ZodError) {
    const msg = error.errors.map((e) => e.message).join("; ")
    return jsonError(msg, 400)
  }
  return null
}

export function mapStoreError(error: unknown): NextResponse | null {
  if (!(error instanceof Error)) return null
  const code = error.message
  const map: Record<string, number> = {
    CLIENT_NOT_FOUND: 404,
    DISCOVERY_NOT_FOUND: 404,
    CONCEPT_NOT_FOUND: 404,
    CONCEPT_NOT_APPROVED: 409,
    DECK_NOT_FOUND: 404,
    SLIDE_NOT_FOUND: 404,
    SCRIPT_NOT_FOUND: 404,
  }
  const status = map[code]
  if (!status) return null
  return jsonError(code, status)
}
