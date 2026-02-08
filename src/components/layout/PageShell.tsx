import type { ReactNode } from "react"

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden paper-grain dark-orbs">
      <div className="orb-primary" />
      <div className="orb-accent" />
      <div className="relative">{children}</div>
    </div>
  )
}
