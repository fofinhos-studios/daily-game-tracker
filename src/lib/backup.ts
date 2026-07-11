import type { AppData, DayEntry, GameResult, GameType } from "@/types/games"
import { GAME_ORDER } from "@/types/games"

const BACKUP_PREFIX = "daily-game-tracker:"
const SUPPORTED_VERSION = 1

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isGameResult(value: unknown): value is GameResult {
  if (!isRecord(value)) return false
  const validBase =
    GAME_ORDER.includes(value.gameType as GameType) &&
    typeof value.date === "string" &&
    typeof value.won === "boolean" &&
    Array.isArray(value.grid) &&
    value.grid.every((row) => typeof row === "string") &&
    typeof value.rawText === "string"
  if (!validBase) return false

  switch (value.gameType) {
    case "conexo":
      return typeof value.attempts === "number" && typeof value.hints === "number"
    case "expresso":
    case "letroso":
      return typeof value.attempts === "number"
    case "framed":
    case "guessthegame":
      return typeof value.gameNumber === "number"
    case "gamedle":
      return (
        Array.isArray(value.modes) &&
        value.modes.every(
          (mode) =>
            isRecord(mode) &&
            typeof mode.mode === "string" &&
            typeof mode.emoji === "string" &&
            typeof mode.gameNumber === "number" &&
            typeof mode.grid === "string" &&
            typeof mode.won === "boolean",
        )
      )
    case "termo":
      return (
        Array.isArray(value.modes) &&
        value.modes.every(
          (mode) =>
            isRecord(mode) &&
            typeof mode.mode === "string" &&
            typeof mode.gameNumber === "number" &&
            typeof mode.streak === "number" &&
            Array.isArray(mode.grid) &&
            mode.grid.every((row) => typeof row === "string") &&
            typeof mode.attempts === "string",
        )
      )
    default:
      return false
  }
}

function isDayEntry(value: unknown, date: string): value is DayEntry {
  if (!isRecord(value)) return false
  return (
    value.date === date &&
    Array.isArray(value.results) &&
    value.results.every((result) => isGameResult(result))
  )
}

function validateAppData(value: unknown): AppData {
  if (!isRecord(value) || typeof value.version !== "number" || !isRecord(value.entries)) {
    throw new Error("Invalid backup")
  }
  if (value.version !== SUPPORTED_VERSION) throw new Error("Unsupported backup version")

  for (const [date, entry] of Object.entries(value.entries)) {
    if (!isDayEntry(entry, date)) throw new Error("Invalid backup")
  }

  return value as unknown as AppData
}

export function exportBackup(data: AppData): string {
  return `${BACKUP_PREFIX}${JSON.stringify(data)}`
}

export function importBackup(backup: string): AppData {
  const trimmed = backup.trim()
  const json = trimmed.startsWith(BACKUP_PREFIX) ? trimmed.slice(BACKUP_PREFIX.length) : trimmed

  try {
    return validateAppData(JSON.parse(json) as unknown)
  } catch (error) {
    if (error instanceof Error && error.message === "Unsupported backup version") throw error
    throw new Error("Invalid backup")
  }
}

export function mergeAppData(current: AppData, imported: AppData): AppData {
  const entries = { ...current.entries }

  for (const [date, importedEntry] of Object.entries(imported.entries)) {
    const currentEntry = entries[date]
    if (!currentEntry) {
      entries[date] = importedEntry
      continue
    }

    const results = [...currentEntry.results]
    for (const importedResult of importedEntry.results) {
      const index = results.findIndex((result) => result.gameType === importedResult.gameType)
      if (index >= 0) results[index] = importedResult
      else results.push(importedResult)
    }
    entries[date] = { date, results }
  }

  return { version: SUPPORTED_VERSION, entries }
}
