import Link from "next/link"
import type { ReactNode } from "react"

const nav = [
  { href: "/", label: "Dashboard" },
  { href: "/clients", label: "Kunden" },
]

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_circle_at_20%_-10%,rgba(56,189,248,0.18),transparent),radial-gradient(900px_circle_at_100%_0%,rgba(99,102,241,0.12),transparent)]">
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/" className="text-lg font-semibold tracking-tight">
              Pitchdeck Tool
            </Link>
            <p className="text-sm text-foreground/60">
              Discovery → Konzept → Deck → Share
            </p>
          </div>
          <nav className="flex flex-wrap gap-2">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-white/5"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  )
}
