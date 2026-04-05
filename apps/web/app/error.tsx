"use client"

import { useEffect } from "react"

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-950 px-6 text-center text-zinc-100">
      <div className="max-w-md space-y-3">
        <h1 className="text-xl font-semibold">Etwas ist schiefgelaufen</h1>
        <p className="text-sm text-zinc-400">
          Auf Vercel braucht die App eine gültige{" "}
          <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-200">
            DATABASE_URL
          </code>{" "}
          (kein lokales{" "}
          <code className="rounded bg-zinc-800 px-1.5 py-0.5">file:…</code>
          -SQLite). Ohne URL nutzt das Deployment einen Memory-Fallback – dann
          sollte die Seite trotzdem laden.
        </p>
        {error.digest ? (
          <p className="font-mono text-xs text-zinc-500">Digest: {error.digest}</p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-sky-500"
      >
        Erneut versuchen
      </button>
    </div>
  )
}
