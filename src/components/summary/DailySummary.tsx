import { useCallback, useEffect, useRef, useState } from "react"
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
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null)
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null)
  const dragCounter = useRef(0)

  useEffect(() => {
    saveOrder(customOrder)
  }, [customOrder])

  const handleDragStart = useCallback((idx: number) => {
    setDraggedIdx(idx)
  }, [])

  const handleDragEnd = useCallback(() => {
    setDraggedIdx(null)
    setDragOverIdx(null)
    dragCounter.current = 0
  }, [])

  let filtered = entry?.results ?? []
  if (gameFilter && gameFilter.size > 0) {
    filtered = filtered.filter((r) => gameFilter.has(r.gameType))
  }

  const sorted = sortByOrder(filtered, customOrder)
  const existingGames = new Set(entry?.results.map((result) => result.gameType) ?? [])

  const handleDrop = (targetIdx: number) => {
    if (draggedIdx === null || draggedIdx === targetIdx) return
    const draggedGame = sorted[draggedIdx]!.gameType
    const targetGame = sorted[targetIdx]!.gameType

    const newOrder = [...customOrder]
    const fromPos = newOrder.indexOf(draggedGame)
    const toPos = newOrder.indexOf(targetGame)

    if (fromPos !== -1 && toPos !== -1) {
      newOrder.splice(fromPos, 1)
      newOrder.splice(toPos, 0, draggedGame)
      setCustomOrder(newOrder)
    }

    setDraggedIdx(null)
    setDragOverIdx(null)
  }

  return (
    <div className="space-y-2">
      {sorted.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="space-y-2">
          {sorted.map((result, i) => (
            <li
              key={result.gameType}
              className={`animate-fade-in-up ${draggedIdx === i ? "opacity-50" : ""} ${dragOverIdx === i ? "ring-2 ring-primary/30 rounded-xl" : ""}`}
              style={{ animationDelay: `${i * 0.05}s` }}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOverIdx(i)
              }}
              onDragLeave={() => {
                setDragOverIdx(null)
              }}
              onDrop={(e) => {
                e.preventDefault()
                handleDrop(i)
              }}
            >
              <GameResultCard
                result={result}
                onRemove={(gameType) => onRemove(date, gameType)}
                draggable
              />
            </li>
          ))}
        </ul>
      )}
      <MarkLoss existingGames={existingGames} onMarkLoss={onMarkLoss} />
    </div>
  )
}
