import { useCallback } from "react"
import type { AppData, DayEntry, GameResult, GameType } from "@/types/games"
import { createEmptyAppData } from "@/types/games"
import { useLocalStorage } from "./useLocalStorage"

const STORAGE_KEY = "daily-game-tracker"

interface GameStore {
  data: AppData
  addResults: (results: GameResult[]) => { added: number; replaced: number }
  removeResult: (date: string, gameType: GameType) => void
  getEntry: (date: string) => DayEntry | undefined
  getAllDates: () => string[]
  clearDay: (date: string) => void
}

export function useGameStore(): GameStore {
  const [data, setData] = useLocalStorage<AppData>(STORAGE_KEY, createEmptyAppData())

  const addResults = useCallback(
    (results: GameResult[]): { added: number; replaced: number } => {
      let added = 0
      let replaced = 0

      setData((prev) => {
        const next = { ...prev, entries: { ...prev.entries } }

        for (const result of results) {
          const dateKey = result.date
          const existing = next.entries[dateKey]

          if (existing) {
            const entry = { ...existing, results: [...existing.results] }
            const idx = entry.results.findIndex((r) => r.gameType === result.gameType)
            if (idx >= 0) {
              entry.results[idx] = result
              replaced++
            } else {
              entry.results.push(result)
              added++
            }
            next.entries[dateKey] = entry
          } else {
            next.entries[dateKey] = {
              date: dateKey,
              results: [result],
            }
            added++
          }
        }

        return next
      })

      return { added, replaced }
    },
    [setData],
  )

  const removeResult = useCallback(
    (date: string, gameType: GameType) => {
      setData((prev) => {
        const entry = prev.entries[date]
        if (!entry) return prev

        const next = { ...prev, entries: { ...prev.entries } }
        const filtered = entry.results.filter((r) => r.gameType !== gameType)

        if (filtered.length === 0) {
          delete next.entries[date]
        } else {
          next.entries[date] = { ...entry, results: filtered }
        }

        return next
      })
    },
    [setData],
  )

  const getEntry = useCallback(
    (date: string): DayEntry | undefined => {
      return data.entries[date]
    },
    [data],
  )

  const getAllDates = useCallback((): string[] => {
    return Object.keys(data.entries).sort()
  }, [data])

  const clearDay = useCallback(
    (date: string) => {
      setData((prev) => {
        const next = { ...prev, entries: { ...prev.entries } }
        delete next.entries[date]
        return next
      })
    },
    [setData],
  )

  return { data, addResults, removeResult, getEntry, getAllDates, clearDay }
}
