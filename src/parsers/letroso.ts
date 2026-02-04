import { parseBrazilianDate } from "@/lib/dates"
import type { LetrosoResult } from "@/types/games"
import type { GameParser, ParseResult } from "./types"
import { collectEmojiLines } from "./utils"

const HEADER_RE =
  /^Joguei letroso\.com\s+(\d{1,2}\/\d{1,2}\/\d{4})\s+e consegui em\s+(\d+)\s+tentativas?/i

export const letrosoParser: GameParser = {
  gameType: "letroso",

  detect(lines: string[]): boolean {
    return lines.length > 0 && HEADER_RE.test(lines[0]!.trim())
  },

  parse(lines: string[], fallbackDate: string): ParseResult | null {
    const headerLine = lines[0]?.trim() ?? ""
    const match = HEADER_RE.exec(headerLine)
    if (!match) return null

    const date = match[1] ? parseBrazilianDate(match[1]) : fallbackDate
    const attempts = parseInt(match[2]!, 10)

    // Skip blank lines to grid
    let gridStart = 1
    while (gridStart < lines.length && lines[gridStart]!.trim() === "") {
      gridStart++
    }

    const { grid, count } = collectEmojiLines(lines, gridStart)
    const consumedLines = gridStart + count

    const rawText = lines.slice(0, consumedLines).join("\n").trim()
    // Won if grid ends with ✅
    const won = grid.length > 0 && grid[grid.length - 1] === "✅"

    const result: LetrosoResult = {
      gameType: "letroso",
      date,
      won,
      grid,
      rawText,
      attempts,
    }

    return { result, consumedLines }
  },
}
