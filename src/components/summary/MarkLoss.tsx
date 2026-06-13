import { Plus, X } from "lucide-react"
import { useState } from "react"
import { GameIcon } from "@/components/input/GameIcon"
import { GAME_LABELS, GAME_ORDER, type GameType } from "@/types/games"

interface MarkLossProps {
  existingGames: Set<GameType>
  onMarkLoss: (gameType: GameType) => void
}

export function MarkLoss({ existingGames, onMarkLoss }: MarkLossProps) {
  const [open, setOpen] = useState(false)
  const availableGames = GAME_ORDER.filter((game) => !existingGames.has(game))

  if (availableGames.length === 0) return null

  return (
    <div className="card-surface rounded-xl p-3">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        title="Record a loss when a game has no shareable result"
        className="flex w-full items-center justify-between text-xs font-bold text-muted-foreground transition-colors hover:text-foreground"
      >
        <span className="flex items-center gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          Mark loss
        </span>
        {open && <X className="h-3.5 w-3.5" />}
      </button>

      {open && (
        <div className="mt-3 flex flex-wrap gap-2">
          {availableGames.map((game) => (
            <button
              type="button"
              key={game}
              title={`Record ${GAME_LABELS[game]} as a loss`}
              onClick={() => {
                onMarkLoss(game)
                setOpen(false)
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
            >
              <GameIcon gameType={game} className="h-3.5 w-3.5" />
              {GAME_LABELS[game]} ❌
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
