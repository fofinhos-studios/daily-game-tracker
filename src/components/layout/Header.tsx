import { BarChart3, Gamepad2, Info, X } from "lucide-react"
import { formatDateDisplay } from "@/lib/dates"

interface HeaderProps {
  today: string
  onToggleGames: () => void
  onToggleStats: () => void
  gamesOpen: boolean
  statsOpen: boolean
}

export function Header({ today, onToggleGames, onToggleStats, gamesOpen, statsOpen }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 glass-strong">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
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

        {/* Center: Date pill */}
        <div className="glass rounded-full px-3 py-1">
          <span className="text-xs font-bold text-muted-foreground">
            {formatDateDisplay(today)}
          </span>
        </div>

        {/* Right: Action buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onToggleGames}
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:glow-primary ${
              gamesOpen
                ? "bg-primary/20 text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-label="Supported games"
          >
            <Info className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onToggleStats}
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:glow-accent ${
              statsOpen ? "bg-accent/20 text-accent" : "text-muted-foreground hover:text-foreground"
            }`}
            aria-label="Stats"
          >
            {statsOpen ? <X className="h-4 w-4" /> : <BarChart3 className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  )
}
