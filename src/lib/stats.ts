import type { AppData, GameType, SubGameKey } from "@/types/games"
import { getSubGameEntries, parseSubGameKey } from "@/types/games"

export interface GameStats {
  gameType: GameType
  subGameKey?: SubGameKey
  totalPlayed: number
  totalWon: number
  winRate: number
  currentStreak: number
  bestStreak: number
}

export function calculateGameStats(data: AppData, gameType: GameType): GameStats {
  const results: { date: string; won: boolean }[] = []

  for (const entry of Object.values(data.entries)) {
    const gameResult = entry.results.find((r) => r.gameType === gameType)
    if (gameResult) {
      results.push({ date: entry.date, won: gameResult.won })
    }
  }

  // Sort by date descending for streak calculation
  results.sort((a, b) => b.date.localeCompare(a.date))

  const totalPlayed = results.length
  const totalWon = results.filter((r) => r.won).length
  const winRate = totalPlayed > 0 ? Math.round((totalWon / totalPlayed) * 100) : 0

  // Current streak (consecutive wins from most recent)
  let currentStreak = 0
  for (const r of results) {
    if (r.won) {
      currentStreak++
    } else {
      break
    }
  }

  // Best streak
  let bestStreak = 0
  let streak = 0
  // Sort ascending for best streak calculation
  const ascending = [...results].reverse()
  for (const r of ascending) {
    if (r.won) {
      streak++
      bestStreak = Math.max(bestStreak, streak)
    } else {
      streak = 0
    }
  }

  return { gameType, totalPlayed, totalWon, winRate, currentStreak, bestStreak }
}

export function calculateSubGameStats(data: AppData, subGameKey: SubGameKey): GameStats {
  const { gameType, mode } = parseSubGameKey(subGameKey)
  const results: { date: string; won: boolean }[] = []

  for (const entry of Object.values(data.entries)) {
    const gameResult = entry.results.find((r) => r.gameType === gameType)
    if (!gameResult) continue

    if (mode) {
      const entries = getSubGameEntries(gameResult)
      const match = entries.find((e) => e.key === subGameKey)
      if (match) {
        results.push({ date: entry.date, won: match.won })
      }
    } else {
      results.push({ date: entry.date, won: gameResult.won })
    }
  }

  results.sort((a, b) => b.date.localeCompare(a.date))

  const totalPlayed = results.length
  const totalWon = results.filter((r) => r.won).length
  const winRate = totalPlayed > 0 ? Math.round((totalWon / totalPlayed) * 100) : 0

  let currentStreak = 0
  for (const r of results) {
    if (r.won) currentStreak++
    else break
  }

  let bestStreak = 0
  let streak = 0
  const ascending = [...results].reverse()
  for (const r of ascending) {
    if (r.won) {
      streak++
      bestStreak = Math.max(bestStreak, streak)
    } else {
      streak = 0
    }
  }

  return { gameType, subGameKey, totalPlayed, totalWon, winRate, currentStreak, bestStreak }
}

export function getAllSubGameKeys(data: AppData): SubGameKey[] {
  const keys = new Set<SubGameKey>()
  for (const entry of Object.values(data.entries)) {
    for (const result of entry.results) {
      for (const { key } of getSubGameEntries(result)) {
        keys.add(key)
      }
    }
  }
  return Array.from(keys)
}

export function getGamesPlayedOnDate(
  data: AppData,
  dateKey: string,
  filter?: Set<GameType>,
): number {
  const entry = data.entries[dateKey]
  if (!entry) return 0
  if (!filter || filter.size === 0) return entry.results.length
  return entry.results.filter((r) => filter.has(r.gameType)).length
}

export function getWinRateForDate(
  data: AppData,
  dateKey: string,
  filter?: Set<GameType>,
): number | null {
  const entry = data.entries[dateKey]
  if (!entry) return null
  let results = entry.results
  if (filter && filter.size > 0) {
    results = results.filter((r) => filter.has(r.gameType))
  }
  if (results.length === 0) return null
  const won = results.filter((r) => r.won).length
  return Math.round((won / results.length) * 100)
}
