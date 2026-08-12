import { ArrowDown, ArrowUp, ThumbsDown, Trash2, Trophy } from "lucide-react"
import { GameBadge } from "@/components/input/GameBadge"
import { useI18n } from "@/i18n/I18nProvider"
import type { GameResult, GameType } from "@/types/games"
import { GAME_LABELS } from "@/types/games"

const GAME_BORDER_COLORS: Record<GameType, string> = {
  conexo: "border-l-blue-500",
  expresso: "border-l-cyan-500",
  framed: "border-l-red-500",
  gamedle: "border-l-purple-500",
  guessthegame: "border-l-emerald-500",
  letroso: "border-l-yellow-500",
  termo: "border-l-orange-500",
}

interface GameResultCardProps {
  result: GameResult
  onRemove: (gameType: GameType) => void
  canMoveUp?: boolean
  canMoveDown?: boolean
  onMoveUp?: () => void
  onMoveDown?: () => void
}

export function GameResultCard({
  result,
  onRemove,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
}: GameResultCardProps) {
  const { t } = useI18n()
  return (
    <div
      className={`group card-surface rounded-xl border-l-[3px] p-3 transition-all hover:-translate-y-0.5 hover:shadow-md ${GAME_BORDER_COLORS[result.gameType]}`}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <fieldset className="flex border-0 p-0">
            <legend className="sr-only">{t.results.reorder}</legend>
            <button
              type="button"
              disabled={!canMoveUp}
              onClick={onMoveUp}
              aria-label={t.results.moveUp(GAME_LABELS[result.gameType])}
              className="rounded p-1 text-muted-foreground hover:text-primary disabled:opacity-25"
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              disabled={!canMoveDown}
              onClick={onMoveDown}
              aria-label={t.results.moveDown(GAME_LABELS[result.gameType])}
              className="rounded p-1 text-muted-foreground hover:text-primary disabled:opacity-25"
            >
              <ArrowDown className="h-3.5 w-3.5" />
            </button>
          </fieldset>
          <GameBadge gameType={result.gameType} />
          {result.won ? (
            <Trophy className="h-3.5 w-3.5 text-accent" />
          ) : (
            <ThumbsDown className="h-3.5 w-3.5 text-destructive/70" />
          )}
        </div>
        <button
          type="button"
          onClick={() => onRemove(result.gameType)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
          aria-label={t.results.remove(GAME_LABELS[result.gameType])}
          title={t.results.removeHint(GAME_LABELS[result.gameType])}
        >
          <Trash2 className="h-3.5 w-3.5" />
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
