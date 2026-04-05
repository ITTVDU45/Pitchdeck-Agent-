import Link from "next/link"
import { unstable_noStore as noStore } from "next/cache"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getStore } from "@/lib/server/store"

export const dynamic = "force-dynamic"

export default async function ClientsPage() {
  noStore()
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

      {process.env.VERCEL && !process.env.PITCHDECK_STORE_PATH ? (
        <p className="rounded-xl border border-amber-400/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-100/90">
          <strong className="font-medium">Vercel / Serverless:</strong> Ohne
          Datei-Persistenz (<code className="rounded bg-black/30 px-1">PITCHDECK_STORE_PATH</code>)
          oder Datenbank hat jede Server-Instanz eigenen Speicher – neu angelegte
          Kunden erscheinen in der Liste ggf. nicht. Für Demos lokal{" "}
          <code className="rounded bg-black/30 px-1">npm run dev</code> nutzen
          oder <code className="rounded bg-black/30 px-1">PITCHDECK_STORE_PATH</code>{" "}
          auf ein beschreibbares Volume setzen.
        </p>
      ) : null}

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
