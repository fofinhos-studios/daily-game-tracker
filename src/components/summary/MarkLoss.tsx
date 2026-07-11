import { ChevronDown, CircleX, Plus } from "lucide-react"
import { useId, useState } from "react"
import { GameIcon } from "@/components/input/GameIcon"
import { GAME_LABELS, GAME_ORDER, type GameType } from "@/types/games"

interface MarkLossProps {
  existingGames: Set<GameType>
  onMarkLoss: (gameType: GameType) => void
}

export function MarkLoss({ existingGames, onMarkLoss }: MarkLossProps) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const availableGames = GAME_ORDER.filter((game) => !existingGames.has(game))

  if (availableGames.length === 0) return null

  return (
    <div
      className={`card-surface overflow-hidden rounded-xl transition-colors ${open ? "border-destructive/25" : ""}`}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={panelId}
        title="Record a loss when a game has no shareable result"
        className={`flex min-h-12 w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/60 ${
          open ? "bg-muted/50 text-foreground" : "text-muted-foreground"
        }`}
      >
        <span className="flex min-w-0 items-center gap-2.5">
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors ${
              open ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"
            }`}
          >
            <Plus className={`h-4 w-4 transition-transform ${open ? "rotate-45" : ""}`} />
          </span>
          <span>
            <span className="block text-xs font-bold text-foreground">Mark a game as lost</span>
            <span className="mt-0.5 hidden text-[11px] font-normal text-muted-foreground sm:block">
              Use this when a game has no result to paste
            </span>
          </span>
        </span>
        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180 text-foreground" : ""}`}
        />
      </button>

      {open && (
        <div id={panelId} className="border-t border-border px-4 py-3 animate-fade-in">
          <p className="mb-2.5 text-[11px] font-medium text-muted-foreground">
            Select a game to record for this day as a loss.
          </p>
          <div className="flex flex-wrap gap-2">
            {availableGames.map((game) => (
              <button
                type="button"
                key={game}
                title={`Record ${GAME_LABELS[game]} as a loss`}
                onClick={() => {
                  onMarkLoss(game)
                  setOpen(false)
                }}
                className="group inline-flex min-h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground transition-colors hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <GameIcon gameType={game} className="h-3.5 w-3.5" />
                {GAME_LABELS[game]}
                <CircleX className="h-3.5 w-3.5 text-muted-foreground/50 transition-colors group-hover:text-destructive" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
