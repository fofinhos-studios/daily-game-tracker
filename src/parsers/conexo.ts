import { parseBrazilianDate } from "@/lib/dates"
import type { ConexoResult } from "@/types/games"
import type { GameParser, ParseResult } from "./types"
import { collectEmojiLines } from "./utils"

const HEADER_RE =
  /^Joguei conexo\.ws\s+(\d{1,2}\/\d{1,2}\/\d{4})\s+e consegui em\s+(\d+)\s+tentativas?(?:\s+e\s+(\d+)\s+dicas?)?/i

export const conexoParser: GameParser = {
  gameType: "conexo",

  detect(lines: string[]): boolean {
    return lines.length > 0 && HEADER_RE.test(lines[0]!.trim())
  },

  parse(lines: string[], fallbackDate: string): ParseResult | null {
    const headerLine = lines[0]?.trim() ?? ""
    const match = HEADER_RE.exec(headerLine)
    if (!match) return null

    const date = match[1] ? parseBrazilianDate(match[1]) : fallbackDate
    const attempts = parseInt(match[2]!, 10)
    const hints = match[3] ? parseInt(match[3], 10) : 0

    // Collect emoji grid lines after header (skip blank lines between header and grid)
    let gridStart = 1
    while (gridStart < lines.length && lines[gridStart]!.trim() === "") {
      gridStart++
    }

    const { grid, count } = collectEmojiLines(lines, gridStart)
    const consumedLines = gridStart + count

    const rawLines = lines.slice(0, consumedLines)
    const rawText = rawLines.join("\n").trim()

    const result: ConexoResult = {
      gameType: "conexo",
      date,
      won: true, // "consegui" means they always won
      grid,
      rawText,
      attempts,
      hints,
    }

    return { result, consumedLines }
  },
}
