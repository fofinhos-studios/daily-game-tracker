import { GameBadge } from "@/components/input/GameBadge"
import { useI18n } from "@/i18n/I18nProvider"
import type { GameStats } from "@/lib/stats"
import type { GameType } from "@/types/games"
import { GAME_LABELS } from "@/types/games"

const GAME_BAR_COLORS: Record<GameType, string> = {
  conexo: "bg-blue-500",
  expresso: "bg-cyan-500",
  framed: "bg-red-500",
  gamedle: "bg-purple-500",
  guessthegame: "bg-emerald-500",
  letroso: "bg-yellow-500",
  termo: "bg-orange-500",
}

interface SuccessRateBarProps {
  stats: GameStats
  label?: string
}

export function SuccessRateBar({ stats, label }: SuccessRateBarProps) {
  const { t } = useI18n()
  const displayLabel = label || GAME_LABELS[stats.gameType]

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <GameBadge gameType={stats.gameType} label={label} />
        <div className="flex items-center gap-3 text-xs">
          <span className="text-muted-foreground">
            {stats.winRate}% ({stats.totalWon}/{stats.totalPlayed})
          </span>
          {stats.currentStreak > 0 && (
            <span className="text-primary font-bold" title={t.stats.best(stats.bestStreak)}>
              {t.stats.streak(stats.currentStreak)}
            </span>
          )}
        </div>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all duration-500 ${GAME_BAR_COLORS[stats.gameType]}`}
          style={{ width: `${stats.winRate}%` }}
          role="progressbar"
          aria-valuenow={stats.winRate}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={t.stats.winRate(displayLabel, stats.winRate)}
        />
      </div>
    </div>
  )
}
