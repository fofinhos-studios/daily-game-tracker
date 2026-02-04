import type { ReactNode } from "react"

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background gradients */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-1/3 -top-1/3 h-[800px] w-[800px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute -bottom-1/3 -right-1/3 h-[700px] w-[700px] rounded-full bg-accent/5 blur-[120px]" />
      </div>

      {/* Noise texture overlay */}
      <div className="pointer-events-none fixed inset-0 noise" />

      {/* Dot grid pattern */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Content */}
      <div className="relative">{children}</div>
    </div>
  )
}
