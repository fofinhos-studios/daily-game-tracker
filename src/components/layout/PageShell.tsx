import type { ReactNode } from "react"

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen paper-grain">
      <div className="relative">{children}</div>
    </div>
  )
}
