import { GameBadge } from "@/components/input/GameBadge"
import { gameStyle } from "@/design-system/games"
import { useI18n } from "@/i18n/I18nProvider"
import type { GameStats } from "@/lib/stats"
import { GAME_LABELS } from "@/types/games"

interface SuccessRateBarProps {
  stats: GameStats
  label?: string
  nested?: boolean
}

export function SuccessRateBar({ stats, label, nested = false }: SuccessRateBarProps) {
  const { t } = useI18n()
  const displayLabel = label
    ? `${GAME_LABELS[stats.gameType]} — ${label}`
    : GAME_LABELS[stats.gameType]

  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {nested ? (
          <span className="font-mono text-xs font-medium">{label}</span>
        ) : (
          <GameBadge gameType={stats.gameType} label={label} />
        )}
        <div className="flex flex-wrap items-center gap-3 text-xs">
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
      <div className="h-1.5 w-full overflow-hidden rounded-none bg-muted">
        <div
          className={`h-full rounded-none transition-all duration-500 bg-[var(--game-color)]`}
          style={{ ...gameStyle(stats.gameType), width: `${stats.winRate}%` }}
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
