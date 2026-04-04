import type { ReactNode } from "react"

export default function ShareLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      {children}
    </div>
  )
}
