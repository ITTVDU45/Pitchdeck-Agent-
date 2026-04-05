import Link from "next/link"
import { unstable_noStore as noStore } from "next/cache"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getStore } from "@/lib/server/store"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  noStore()
  const store = await getStore()
  const orgId = await store.defaultOrganizationIdAsync()
  const clients = await store.listClients(orgId)

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm text-foreground/65">
            MVP-Grundgerüst: Kunden anlegen, Discovery erfassen, Konzept und
            Deck generieren, Share-Link erzeugen. Datenhaltung aktuell
            In-Memory (pro Server-Prozess).
          </p>
        </div>
        <Link href="/clients/new">
          <Button>Neuer Kunde</Button>
        </Link>
      </div>

      <Card title="Kunden" description="Schnellzugriff auf bestehende Mandanten">
        {clients.length === 0 ? (
          <p className="text-sm text-foreground/60">
            Noch keine Kunden. Lege den ersten Datensatz an.
          </p>
        ) : (
          <ul className="divide-y divide-white/10">
            {clients.map((c) => (
              <li
                key={c.id}
                className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">{c.companyName}</p>
                  <p className="text-sm text-foreground/60">
                    {c.industry} · {c.contactName}
                  </p>
                </div>
                <Link href={`/clients/${c.id}`}>
                  <Button variant="secondary">Öffnen</Button>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card title="Nächste Schritte">
        <ol className="list-decimal space-y-2 pl-5 text-sm text-foreground/80">
          <li>Kunde anlegen und Discovery-Session starten</li>
          <li>Pain Points, Needs, Ziele, Prozesse, Tech-Stack pflegen</li>
          <li>Konzept generieren, reviewen und freigeben</li>
          <li>Pitchdeck erzeugen, Slides bearbeiten, Sprechertexte generieren</li>
          <li>Share-Link veröffentlichen und scrollbare Präsentation testen</li>
        </ol>
      </Card>
    </div>
  )
}
