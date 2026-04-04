import Link from "next/link"
import { redirect } from "next/navigation"
import { getStore } from "@/lib/server/store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DeckToolbar } from "./toolbar"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function DeckPage({ params }: PageProps) {
  const { id } = await params
  const store = getStore()
  const deck = store.getPitchDeck(id)
  if (!deck) redirect("/clients")

  const slides = store.listSlidesForDeck(id)
  const share = store.getShareLinkForPitchDeck(id)
  const concept = store.getSolutionConcept(deck.solutionConceptId)
  const session = concept
    ? store.getDiscoverySession(concept.discoverySessionId)
    : undefined
  const client = session ? store.getClient(session.clientId) : undefined

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm text-foreground/60">
            {client ? (
              <Link href={`/clients/${client.id}`} className="hover:underline">
                {client.companyName}
              </Link>
            ) : (
              "Pitchdeck"
            )}{" "}
            · Version {deck.version} · {deck.status}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            {deck.title}
          </h1>
          <p className="mt-2 text-sm text-foreground/65">
            {deck.audience} · Theme: {deck.theme}
          </p>
        </div>
        <DeckToolbar deckId={id} shareToken={share?.token ?? null} />
      </div>

      <Card
        title="Slides"
        description="Sechs Folien-Typen im MVP. Bearbeite Inhalte und Sprechertexte je Folie."
      >
        <ul className="divide-y divide-white/10">
          {slides.map((s) => {
            const script = store.getLatestScriptForSlide(s.id)
            return (
              <li
                key={s.id}
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-xs uppercase tracking-wide text-foreground/45">
                    {s.type}
                  </p>
                  <p className="font-medium">{s.title}</p>
                  <p className="text-sm text-foreground/55">
                    Skript: {script ? `v${script.version}` : "—"}
                  </p>
                </div>
                <Link href={`/slides/${s.id}`}>
                  <Button variant="secondary">Editor</Button>
                </Link>
              </li>
            )
          })}
        </ul>
      </Card>
    </div>
  )
}
