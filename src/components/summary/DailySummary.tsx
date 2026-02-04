import type { DayEntry, GameType } from "@/types/games"
import { GAME_ORDER } from "@/types/games"
import { EmptyState } from "./EmptyState"
import { GameResultCard } from "./GameResultCard"

interface DailySummaryProps {
  entry: DayEntry | undefined
  onRemove: (date: string, gameType: GameType) => void
  date: string
}

export function DailySummary({ entry, onRemove, date }: DailySummaryProps) {
  if (!entry || entry.results.length === 0) {
    return <EmptyState />
  }

  const sorted = [...entry.results].sort(
    (a, b) => GAME_ORDER.indexOf(a.gameType) - GAME_ORDER.indexOf(b.gameType),
  )

  return (
    <div className="space-y-2">
      {sorted.map((result, i) => (
        <div
          key={result.gameType}
          className="animate-fade-in-up"
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          <GameResultCard result={result} onRemove={(gameType) => onRemove(date, gameType)} />
        </div>
      ))}
    </div>
  )
}
