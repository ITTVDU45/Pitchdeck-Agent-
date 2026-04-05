import Link from "next/link"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getStore } from "@/lib/server/store"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ClientDetailPage({ params }: PageProps) {
  const { id } = await params
  const store = getStore()
  const client = store.getClient(id)
  if (!client) redirect("/clients")

  const sessions = store.listDiscoveryForClient(id)

  async function startDiscovery() {
    "use server"
    const storeInner = getStore()
    const session = storeInner.createDiscoverySession(
      storeInner.defaultOrganizationId,
      id,
    )
    revalidatePath("/clients")
    revalidatePath(`/clients/${id}`)
    redirect(`/discovery/${session.id}`)
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-foreground/60">
          <Link href="/clients" className="hover:underline">
            Kunden
          </Link>{" "}
          / {client.companyName}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          {client.companyName}
        </h1>
        <p className="mt-2 text-sm text-foreground/65">
          {client.industry} · {client.contactName}
          {client.contactRole ? ` (${client.contactRole})` : ""}
        </p>
        {client.website ? (
          <a
            href={client.website}
            className="mt-2 inline-block text-sm text-sky-400 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            {client.website}
          </a>
        ) : null}
      </div>

      <Card
        title="Discovery-Sessions"
        description="Eine Session pro Gespräch oder Iteration."
      >
        <form action={startDiscovery} className="mb-6">
          <Button type="submit">Neue Discovery starten</Button>
        </form>
        {sessions.length === 0 ? (
          <p className="text-sm text-foreground/60">
            Noch keine Sessions. Starte die erste Erfassung.
          </p>
        ) : (
          <ul className="divide-y divide-white/10">
            {sessions.map((s) => (
              <li
                key={s.id}
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">{s.title}</p>
                  <p className="text-sm text-foreground/60">
                    Status: {s.status}
                  </p>
                </div>
                <Link href={`/discovery/${s.id}`}>
                  <Button variant="secondary">Bearbeiten</Button>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
