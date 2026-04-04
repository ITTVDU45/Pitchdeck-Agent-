import type { ButtonHTMLAttributes } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost"
}

export function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50"
  const styles =
    variant === "primary"
      ? "bg-sky-600 text-white hover:bg-sky-500 focus-visible:outline-sky-500"
      : variant === "secondary"
        ? "border border-white/15 bg-white/5 hover:bg-white/10 text-foreground"
        : "text-foreground/80 hover:bg-white/5"
  return (
    <button type={type} className={`${base} ${styles} ${className}`} {...props} />
  )
}
