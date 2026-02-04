import { GameBadge } from "@/components/input/GameBadge"
import type { GameStats } from "@/lib/stats"
import { GAME_LABELS } from "@/types/games"

interface SuccessRateBarProps {
  stats: GameStats
}

export function SuccessRateBar({ stats }: SuccessRateBarProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <GameBadge gameType={stats.gameType} />
        <div className="flex items-center gap-3 text-xs">
          <span className="text-muted-foreground">
            {stats.winRate}% ({stats.totalWon}/{stats.totalPlayed})
          </span>
          {stats.currentStreak > 0 && (
            <span className="text-accent font-bold" title={`Best: ${stats.bestStreak}`}>
              🔥 {stats.currentStreak}
            </span>
          )}
        </div>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-accent transition-all duration-500"
          style={{ width: `${stats.winRate}%` }}
          role="progressbar"
          aria-valuenow={stats.winRate}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${GAME_LABELS[stats.gameType]} win rate: ${stats.winRate}%`}
        />
      </div>
    </div>
  )
}
