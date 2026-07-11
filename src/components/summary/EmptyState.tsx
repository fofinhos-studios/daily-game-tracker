import { ClipboardPaste } from "lucide-react"

interface EmptyStateProps {
  isToday: boolean
}

export function EmptyState({ isToday }: EmptyStateProps) {
  return (
    <div className="card-surface rounded-xl px-6 py-7 text-center">
      <div className="flex flex-col items-center justify-center">
        <ClipboardPaste className="mb-3 h-8 w-8 text-muted-foreground/40" />
        <p className="text-sm font-bold text-muted-foreground">
          No games recorded {isToday ? "today" : "for this day"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground/60">
          Paste a result or mark a loss to get started
        </p>
        <button
          type="button"
          onClick={() => document.getElementById("game-results-input")?.focus()}
          className="mt-3 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-primary-foreground"
        >
          Paste a result
        </button>
      </div>
    </div>
  )
}
