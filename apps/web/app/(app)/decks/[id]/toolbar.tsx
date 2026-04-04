"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { generateScriptsForDeck, publishDeck } from "./actions"

interface DeckToolbarProps {
  deckId: string
  shareToken: string | null
}

export function DeckToolbar({ deckId, shareToken }: DeckToolbarProps) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [token, setToken] = useState(shareToken)

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
      <Button
        type="button"
        variant="secondary"
        disabled={pending}
        onClick={() =>
          start(async () => {
            await generateScriptsForDeck(deckId)
            router.refresh()
          })
        }
      >
        Sprechertexte generieren
      </Button>
      <Button
        type="button"
        disabled={pending}
        onClick={() =>
          start(async () => {
            const link = await publishDeck(deckId)
            setToken(link.token)
            router.refresh()
          })
        }
      >
        Share-Link erzeugen
      </Button>
      {token ? (
        <a href={`/share/${token}`} target="_blank" rel="noreferrer">
          <Button type="button" variant="ghost">
            Präsentation öffnen
          </Button>
        </a>
      ) : null}
    </div>
  )
}
