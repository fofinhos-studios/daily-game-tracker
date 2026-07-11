import { useEffect, useState } from "react"
import type { DayEntry, GameResult, GameType } from "@/types/games"
import { GAME_ORDER } from "@/types/games"
import { EmptyState } from "./EmptyState"
import { GameResultCard } from "./GameResultCard"
import { MarkLoss } from "./MarkLoss"

const STORAGE_KEY = "game-order"

function loadOrder(): GameType[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const order = JSON.parse(stored) as GameType[]
      return [...order, ...GAME_ORDER.filter((game) => !order.includes(game))]
    }
  } catch {
    // ignore
  }
  return [...GAME_ORDER]
}

function saveOrder(order: GameType[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(order))
}

function sortByOrder(results: GameResult[], order: GameType[]): GameResult[] {
  return [...results].sort((a, b) => {
    const ai = order.indexOf(a.gameType)
    const bi = order.indexOf(b.gameType)
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi)
  })
}

interface DailySummaryProps {
  entry: DayEntry | undefined
  onRemove: (date: string, gameType: GameType) => void
  date: string
  gameFilter?: Set<GameType>
  onMarkLoss: (gameType: GameType) => void
}

export function DailySummary({ entry, onRemove, date, gameFilter, onMarkLoss }: DailySummaryProps) {
  const [customOrder, setCustomOrder] = useState(loadOrder)

  useEffect(() => {
    saveOrder(customOrder)
  }, [customOrder])

  let filtered = entry?.results ?? []
  if (gameFilter && gameFilter.size > 0) {
    filtered = filtered.filter((r) => gameFilter.has(r.gameType))
  }

  const sorted = sortByOrder(filtered, customOrder)
  const existingGames = new Set(entry?.results.map((result) => result.gameType) ?? [])

  const moveResult = (fromIndex: number, offset: -1 | 1) => {
    const targetIdx = fromIndex + offset
    if (targetIdx < 0 || targetIdx >= sorted.length) return
    const draggedGame = sorted[fromIndex]!.gameType
    const targetGame = sorted[targetIdx]!.gameType

    const newOrder = [...customOrder]
    const fromPos = newOrder.indexOf(draggedGame)
    const toPos = newOrder.indexOf(targetGame)

    if (fromPos !== -1 && toPos !== -1) {
      newOrder.splice(fromPos, 1)
      newOrder.splice(toPos, 0, draggedGame)
      setCustomOrder(newOrder)
    }
  }

  return (
    <div className="space-y-2">
      {sorted.length === 0 ? (
        <EmptyState isToday={date === new Date().toLocaleDateString("en-CA")} />
      ) : (
        <ul className="space-y-2">
          {sorted.map((result, i) => (
            <li
              key={result.gameType}
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <GameResultCard
                result={result}
                onRemove={(gameType) => {
                  if (window.confirm("Remove this result?")) onRemove(date, gameType)
                }}
                canMoveUp={i > 0}
                canMoveDown={i < sorted.length - 1}
                onMoveUp={() => moveResult(i, -1)}
                onMoveDown={() => moveResult(i, 1)}
              />
            </li>
          ))}
        </ul>
      )}
      <MarkLoss existingGames={existingGames} onMarkLoss={onMarkLoss} />
    </div>
  )
}
