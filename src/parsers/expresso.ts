import { parseBrazilianDate } from "@/lib/dates"
import type { ExpressoResult } from "@/types/games"
import type { GameParser, ParseResult } from "./types"
import { collectEmojiLines } from "./utils"

const HEADER_RE =
  /^Joguei expresso\.ac\s+(\d{1,2}\/\d{1,2}\/\d{4})\s+e consegui em\s+(\d+)\s+tentativas?/i

export const expressoParser: GameParser = {
  gameType: "expresso",

  detect(lines: string[]): boolean {
    return lines.length > 0 && HEADER_RE.test(lines[0]!.trim())
  },

  parse(lines: string[], fallbackDate: string): ParseResult | null {
    const match = HEADER_RE.exec(lines[0]?.trim() ?? "")
    if (!match) return null

    let gridStart = 1
    while (gridStart < lines.length && lines[gridStart]!.trim() === "") gridStart++

    const { grid, count } = collectEmojiLines(lines, gridStart)
    const consumedLines = gridStart + count
    const result: ExpressoResult = {
      gameType: "expresso",
      date: match[1] ? parseBrazilianDate(match[1]) : fallbackDate,
      won: true,
      grid,
      rawText: lines.slice(0, consumedLines).join("\n").trim(),
      attempts: parseInt(match[2]!, 10),
    }

    return { result, consumedLines }
  },
}
