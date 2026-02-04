import { Gamepad2 } from "lucide-react"
import { formatDateDisplay } from "@/lib/dates"

interface HeaderProps {
  today: string
}

export function Header({ today }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 glass-strong">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Left: Logo + title */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Gamepad2 className="h-4 w-4" />
          </div>
          <h1 className="text-sm font-extrabold tracking-tight sm:text-base">
            <span className="text-primary">Daily</span>
            <span className="hidden sm:inline"> Game Tracker</span>
            <span className="sm:hidden"> GT</span>
          </h1>
        </div>

        {/* Right: Date pill */}
        <div className="glass rounded-full px-3 py-1">
          <span className="text-xs font-bold text-muted-foreground">
            {formatDateDisplay(today)}
          </span>
        </div>
      </div>
    </header>
  )
}
