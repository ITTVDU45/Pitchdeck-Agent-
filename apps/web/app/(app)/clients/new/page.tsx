import Link from "next/link"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClientBodySchema } from "@pitchdeck/core"
import { getDefaultOrganizationId, getStore } from "@/lib/server/store"

export default function NewClientPage() {
  async function createClient(formData: FormData) {
    "use server"
    const raw = {
      companyName: String(formData.get("companyName") ?? "").trim(),
      industry: String(formData.get("industry") ?? "").trim(),
      contactName: String(formData.get("contactName") ?? "").trim(),
      contactRole: String(formData.get("contactRole") ?? "").trim() || undefined,
      website: String(formData.get("website") ?? "").trim() || undefined,
      notes: String(formData.get("notes") ?? "").trim() || undefined,
    }
    const body = createClientBodySchema.parse(raw)
    const store = await getStore()
    const orgId = await getDefaultOrganizationId()
    const client = await store.createClient(orgId, body)
    revalidatePath("/")
    revalidatePath("/clients")
    redirect(`/clients/${client.id}`)
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Neuer Kunde</h1>
        <p className="mt-1 text-sm text-foreground/65">
          Pflichtfelder: Firma, Branche, Ansprechpartner.
        </p>
      </div>

      <Card title="Stammdaten">
        <form action={createClient} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="companyName">
              Firmenname
            </label>
            <input
              id="companyName"
              name="companyName"
              required
              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="industry">
              Branche
            </label>
            <input
              id="industry"
              name="industry"
              required
              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="contactName">
              Ansprechpartner
            </label>
            <input
              id="contactName"
              name="contactName"
              required
              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="contactRole">
              Rolle (optional)
            </label>
            <input
              id="contactRole"
              name="contactRole"
              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="website">
              Website (optional)
            </label>
            <input
              id="website"
              name="website"
              type="url"
              placeholder="https://"
              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="notes">
              Notizen (optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button type="submit">Speichern</Button>
            <Link href="/clients">
              <Button variant="ghost" type="button">
                Abbrechen
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  )
}
