import type { ReactNode } from "react"

interface CardProps {
  title?: string
  description?: string
  children: ReactNode
  className?: string
}

export function Card({ title, description, children, className = "" }: CardProps) {
  return (
    <section
      className={`rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_8px_40px_rgba(0,0,0,0.25)] backdrop-blur-md ${className}`}
    >
      {title ? (
        <header className="mb-4">
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm text-foreground/65">{description}</p>
          ) : null}
        </header>
      ) : null}
      {children}
    </section>
  )
}
