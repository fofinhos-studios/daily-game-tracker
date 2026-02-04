import type { FramedResult } from "@/types/games"
import type { GameParser, ParseResult } from "./types"
import { hasGreenSquare } from "./utils"

const HEADER_RE = /^Framed\s+#(\d+)/i

export const framedParser: GameParser = {
  gameType: "framed",

  detect(lines: string[]): boolean {
    return lines.length > 0 && HEADER_RE.test(lines[0]!.trim())
  },

  parse(lines: string[], fallbackDate: string): ParseResult | null {
    const headerLine = lines[0]?.trim() ?? ""
    const match = HEADER_RE.exec(headerLine)
    if (!match) return null

    const gameNumber = parseInt(match[1]!, 10)

    // Collect: header + emoji line + optional blank + optional URL
    let consumed = 1
    const grid: string[] = []

    // Skip blank lines after header
    while (consumed < lines.length && lines[consumed]!.trim() === "") {
      consumed++
    }

    // Grid line (starts with 🎥)
    if (consumed < lines.length && lines[consumed]!.trim().startsWith("🎥")) {
      grid.push(lines[consumed]!.trim())
      consumed++
    }

    // Skip blank lines
    while (consumed < lines.length && lines[consumed]!.trim() === "") {
      consumed++
    }

    // Optional URL line
    if (consumed < lines.length && lines[consumed]!.trim().startsWith("http")) {
      consumed++
    }

    const rawText = lines.slice(0, consumed).join("\n").trim()
    const won = hasGreenSquare(grid)

    const result: FramedResult = {
      gameType: "framed",
      date: fallbackDate,
      won,
      grid,
      rawText,
      gameNumber,
    }

    return { result, consumedLines: consumed }
  },
}
