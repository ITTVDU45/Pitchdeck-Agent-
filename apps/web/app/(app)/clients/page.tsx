import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getStore } from "@/lib/server/store"

export const dynamic = "force-dynamic"

export default async function ClientsPage() {
  const store = getStore()
  const clients = store.listClients(store.defaultOrganizationId)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Kunden</h1>
          <p className="mt-1 text-sm text-foreground/65">
            Verwaltung der Zielkunden (mandantenfähig vorbereitet über{" "}
            <code className="rounded bg-white/10 px-1 py-0.5 text-xs">
              organizationId
            </code>
            ).
          </p>
        </div>
        <Link href="/clients/new">
          <Button>Neuer Kunde</Button>
        </Link>
      </div>

      <Card title="Alle Kunden">
        {clients.length === 0 ? (
          <p className="text-sm text-foreground/60">Keine Einträge.</p>
        ) : (
          <ul className="divide-y divide-white/10">
            {clients.map((c) => (
              <li
                key={c.id}
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">{c.companyName}</p>
                  <p className="text-sm text-foreground/60">
                    {c.contactName} · {c.industry}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href={`/clients/${c.id}`}>
                    <Button variant="secondary">Details</Button>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
