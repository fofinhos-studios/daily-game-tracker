import { Trophy, X, XCircle } from "lucide-react"
import { GameBadge } from "@/components/input/GameBadge"
import type { GameResult, GameType } from "@/types/games"
import { GAME_LABELS } from "@/types/games"

interface GameResultCardProps {
  result: GameResult
  onRemove: (gameType: GameType) => void
}

export function GameResultCard({ result, onRemove }: GameResultCardProps) {
  return (
    <div className="group relative glass rounded-xl noise overflow-hidden p-3 transition-all hover:glow-accent">
      <div className="relative z-10">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GameBadge gameType={result.gameType} />
            {result.won ? (
              <Trophy className="h-3.5 w-3.5 text-accent" />
            ) : (
              <XCircle className="h-3.5 w-3.5 text-destructive/70" />
            )}
          </div>
          <button
            type="button"
            onClick={() => onRemove(result.gameType)}
            className="rounded p-0.5 text-muted-foreground/30 opacity-0 transition-all hover:text-destructive group-hover:opacity-100"
            aria-label={`Remove ${GAME_LABELS[result.gameType]}`}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="space-y-0.5 font-mono text-sm leading-tight">
          {result.grid.map((row, i) => (
            <div key={i} className="whitespace-pre">
              {row}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
