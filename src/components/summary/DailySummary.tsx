import { useCallback, useEffect, useRef, useState } from "react"
import type { DayEntry, GameResult, GameType } from "@/types/games"
import { GAME_ORDER } from "@/types/games"
import { EmptyState } from "./EmptyState"
import { GameResultCard } from "./GameResultCard"

const STORAGE_KEY = "game-order"

function loadOrder(): GameType[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored) as GameType[]
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
}

export function DailySummary({ entry, onRemove, date, gameFilter }: DailySummaryProps) {
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

  if (!entry || entry.results.length === 0) {
    return <EmptyState />
  }

  let filtered = entry.results
  if (gameFilter && gameFilter.size > 0) {
    filtered = filtered.filter((r) => gameFilter.has(r.gameType))
  }

  if (filtered.length === 0) {
    return <EmptyState />
  }

  const sorted = sortByOrder(filtered, customOrder)

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
  )
}
