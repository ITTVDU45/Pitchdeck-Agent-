import Link from "next/link"
import { redirect } from "next/navigation"
import { getStore } from "@/lib/server/store"
import { DiscoveryEditor } from "./discovery-editor"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function DiscoveryPage({ params }: PageProps) {
  const { id } = await params
  const store = getStore()
  const session = store.getDiscoverySession(id)
  if (!session) redirect("/clients")

  const client = store.getClient(session.clientId)

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-foreground/60">
          {client ? (
            <>
              <Link href={`/clients/${client.id}`} className="hover:underline">
                {client.companyName}
              </Link>{" "}
              / Discovery
            </>
          ) : (
            "Discovery"
          )}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Discovery erfassen
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-foreground/65">
          Strukturierte Eingaben fließen in das Lösungskonzept. Mit OpenAI-Key
          (`OPENAI_API_KEY`) wird JSON validiert erzeugt, sonst ein
          deterministischer Entwurf.
        </p>
      </div>

      <DiscoveryEditor session={session} />
    </div>
  )
}
