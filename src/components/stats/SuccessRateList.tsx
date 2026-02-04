import { calculateGameStats } from "@/lib/stats"
import type { AppData } from "@/types/games"
import { GAME_ORDER } from "@/types/games"
import { SuccessRateBar } from "./SuccessRateBar"

interface SuccessRateListProps {
  data: AppData
}

export function SuccessRateList({ data }: SuccessRateListProps) {
  const allStats = GAME_ORDER.map((gameType) => calculateGameStats(data, gameType)).filter(
    (s) => s.totalPlayed > 0,
  )

  if (allStats.length === 0) {
    return (
      <p className="text-center text-xs font-light text-muted-foreground/60 py-2">
        Stats will appear after you add some games
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {allStats.map((stats) => (
        <SuccessRateBar key={stats.gameType} stats={stats} />
      ))}
    </div>
  )
}
