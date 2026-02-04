import type { GamedleMode, GamedleResult } from "@/types/games"
import type { GameParser, ParseResult } from "./types"
import { parseBrazilianDate } from "@/lib/dates"
import { isEmojiLine } from "./utils"

// Format 1: Multi-line block starting with "Gamedle" header
const BLOCK_HEADER_RE = /^Gamedle$/i
// Category headers like "🕹️ (Capa) #1377:" or "🎨 (Artwork) #1136:"
const CATEGORY_RE = /^(.+?)\s*\(([^)]+)\)\s*#(\d+):\s*$/
// Category with inline grid: "🕹️ (Capa) #1377:" followed by grid on same line - not seen, but handle anyway

// Format 2: Single-line per mode
// "🕹️ Gamedle: 06/06/2024 🟥🟥🟩⬜⬜⬜ > https://gamedle.wtf/classic"
// "🕹️🎨 Gamedle (Artwork mode): 06/06/2024 🟥🟥🟥🟥🟩⬜ > https://gamedle.wtf/artwork"
const SINGLE_LINE_RE = /^(.+?)\s*Gamedle(?:\s*\(([^)]+)\))?\s*:\s*(\d{1,2}\/\d{1,2}\/\d{4})\s+(.+?)(?:\s*>\s*https?:\/\/\S+)?$/

export const gamedleParser: GameParser = {
  gameType: "gamedle",

  detect(lines: string[]): boolean {
    if (lines.length === 0) return false
    const first = lines[0]!.trim()
    // Block format: starts with "Gamedle"
    if (BLOCK_HEADER_RE.test(first)) return true
    // Single-line format: contains "Gamedle" with emoji prefix
    if (SINGLE_LINE_RE.test(first)) return true
    return false
  },

  parse(lines: string[], fallbackDate: string): ParseResult | null {
    const first = lines[0]!.trim()

    // Try single-line format first
    if (SINGLE_LINE_RE.test(first)) {
      return parseSingleLineFormat(lines, fallbackDate)
    }

    // Block format
    if (BLOCK_HEADER_RE.test(first)) {
      return parseBlockFormat(lines, fallbackDate)
    }

    return null
  },
}

function parseSingleLineFormat(lines: string[], fallbackDate: string): ParseResult | null {
  const modes: GamedleMode[] = []
  let consumed = 0
  let date = fallbackDate

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!.trim()
    if (line === "") {
      consumed = i + 1
      continue
    }

    const match = SINGLE_LINE_RE.exec(line)
    if (match) {
      const emoji = match[1]!.trim()
      const modeName = match[2] || "Classic"
      if (match[3]) {
        date = parseBrazilianDate(match[3])
      }
      const gridStr = match[4]!.trim()

      modes.push({
        mode: modeName,
        emoji,
        gameNumber: 0,
        grid: gridStr,
        won: gridStr.includes("🟩"),
      })
      consumed = i + 1
    } else {
      // Not a gamedle line — stop
      break
    }
  }

  if (modes.length === 0) return null

  const rawText = lines.slice(0, consumed).join("\n").trim()
  const grid = modes.map((m) => `${m.emoji} ${m.mode}: ${m.grid}`)
  const won = modes.some((m) => m.won)

  const result: GamedleResult = {
    gameType: "gamedle",
    date,
    won,
    grid,
    rawText,
    modes,
  }

  return { result, consumedLines: consumed }
}

function parseBlockFormat(lines: string[], fallbackDate: string): ParseResult | null {
  const modes: GamedleMode[] = []
  let consumed = 1 // skip "Gamedle" header

  while (consumed < lines.length) {
    const line = lines[consumed]!.trim()

    // Skip blank lines
    if (line === "") {
      consumed++
      continue
    }

    // Try category header
    const catMatch = CATEGORY_RE.exec(line)
    if (catMatch) {
      const emoji = catMatch[1]!.trim()
      const modeName = catMatch[2]!
      const gameNumber = parseInt(catMatch[3]!, 10)

      // Next non-blank line should be the grid
      consumed++
      while (consumed < lines.length && lines[consumed]!.trim() === "") {
        consumed++
      }

      let gridStr = ""
      if (consumed < lines.length && isEmojiLine(lines[consumed]!.trim())) {
        gridStr = lines[consumed]!.trim()
        consumed++
      }

      modes.push({
        mode: modeName,
        emoji,
        gameNumber,
        grid: gridStr,
        won: gridStr.includes("🟩"),
      })
      continue
    }

    // If we hit a non-category, non-blank line that isn't emoji, stop
    if (!isEmojiLine(line)) {
      break
    }

    consumed++
  }

  if (modes.length === 0) return null

  const rawText = lines.slice(0, consumed).join("\n").trim()
  const grid = modes.map((m) => `${m.emoji} (${m.mode}) #${m.gameNumber}: ${m.grid}`)
  const won = modes.some((m) => m.won)

  const result: GamedleResult = {
    gameType: "gamedle",
    date: fallbackDate,
    won,
    grid,
    rawText,
    modes,
  }

  return { result, consumedLines: consumed }
}
