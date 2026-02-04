import type { AppData, GameType } from "@/types/games"

export interface GameStats {
  gameType: GameType
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

export function getGamesPlayedOnDate(data: AppData, dateKey: string): number {
  const entry = data.entries[dateKey]
  return entry ? entry.results.length : 0
}
