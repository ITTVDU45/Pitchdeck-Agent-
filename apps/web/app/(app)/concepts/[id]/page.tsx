import Link from "next/link"
import { redirect } from "next/navigation"
import { getStore } from "@/lib/server/store"
import { ConceptReview } from "./concept-review"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ConceptPage({ params }: PageProps) {
  const { id } = await params
  const store = await getStore()
  const concept = await store.getSolutionConcept(id)
  if (!concept) redirect("/clients")

  const session = await store.getDiscoverySession(concept.discoverySessionId)
  const client = session ? await store.getClient(session.clientId) : undefined

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-foreground/60">
          {client ? (
            <Link href={`/clients/${client.id}`} className="hover:underline">
              {client.companyName}
            </Link>
          ) : (
            "Konzept"
          )}{" "}
          · Version {concept.version} ·{" "}
          <span className="text-foreground/80">{concept.status}</span>
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Konzept-Review
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-foreground/65">
          Strukturierte Sektionen entsprechen dem Zod-Schema. Nach Freigabe kann
          ein versioniertes Pitchdeck erzeugt werden.
        </p>
      </div>

      <ConceptReview concept={concept} />
    </div>
  )
}
