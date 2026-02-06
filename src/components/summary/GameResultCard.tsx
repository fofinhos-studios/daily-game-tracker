import { Trophy, X, XCircle } from "lucide-react"
import { GameBadge } from "@/components/input/GameBadge"
import type { GameResult, GameType } from "@/types/games"
import { GAME_LABELS } from "@/types/games"

const GAME_BORDER_COLORS: Record<GameType, string> = {
  conexo: "border-l-blue-500",
  framed: "border-l-red-500",
  gamedle: "border-l-purple-500",
  guessthegame: "border-l-emerald-500",
  letroso: "border-l-yellow-500",
  termo: "border-l-orange-500",
}

interface GameResultCardProps {
  result: GameResult
  onRemove: (gameType: GameType) => void
}

export function GameResultCard({ result, onRemove }: GameResultCardProps) {
  return (
    <div
      className={`group card-surface rounded-xl border-l-[3px] p-3 transition-all hover:-translate-y-0.5 hover:shadow-md ${GAME_BORDER_COLORS[result.gameType]}`}
    >
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
  )
}
