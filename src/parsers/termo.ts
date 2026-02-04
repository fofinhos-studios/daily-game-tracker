import { parseBrazilianDate } from "@/lib/dates"
import type { TermoMode, TermoResult } from "@/types/games"
import type { GameParser, ParseResult } from "./types"
import { isEmojiLine } from "./utils"

// "joguei term.ooo #1302 6/6 🔥 1" or "term.ooo/2 #1251 🔥 1"
const HEADER_RE =
  /^(?:joguei\s+)?term\.ooo(?:\/(\d+))?\s+#(\d+)\s+(?:(\d{1,2}\/\d{1,2}(?:\/\d{4})?)\s+)?(?:(\d+\/\d+)\s+)?🔥\s*(\d+)/i

export const termoParser: GameParser = {
  gameType: "termo",

  detect(lines: string[]): boolean {
    if (lines.length === 0) return false
    return HEADER_RE.test(lines[0]!.trim())
  },

  parse(lines: string[], fallbackDate: string): ParseResult | null {
    const modes: TermoMode[] = []
    let consumed = 0
    let date = fallbackDate

    while (consumed < lines.length) {
      const line = lines[consumed]!.trim()

      // Skip blank lines
      if (line === "") {
        consumed++
        continue
      }

      const match = HEADER_RE.exec(line)
      if (match) {
        const modeNum = match[1]
        const mode = modeNum === "2" ? "duet" : modeNum === "4" ? "quad" : "normal"
        const gameNumber = parseInt(match[2]!, 10)

        // Try to extract date from header (DD/MM or DD/MM/YYYY format)
        if (match[3]) {
          const dateStr = match[3]
          if (dateStr.split("/").length === 3) {
            date = parseBrazilianDate(dateStr)
          }
          // DD/MM without year — skip, use fallback
        }

        const attempts = match[4] || ""
        const streak = parseInt(match[5]!, 10)

        consumed++

        // Skip blank lines
        while (consumed < lines.length && lines[consumed]!.trim() === "") {
          consumed++
        }

        // Collect grid lines (emoji lines, may include side-by-side grids for duet/quad)
        const grid: string[] = []
        while (consumed < lines.length) {
          const gridLine = lines[consumed]!.trim()
          if (gridLine === "") break
          if (isEmojiLine(gridLine)) {
            grid.push(gridLine)
            consumed++
          } else {
            break
          }
        }

        modes.push({
          mode,
          gameNumber,
          streak,
          grid,
          attempts,
        })
        continue
      }

      // If not a header and not an emoji line, stop
      if (!isEmojiLine(line)) {
        break
      }
      consumed++
    }

    if (modes.length === 0) return null

    const rawText = lines.slice(0, consumed).join("\n").trim()
    const allGrids = modes.flatMap((m) => m.grid)
    const won = allGrids.some((row) => {
      // A "won" row in termo is all green: 🟩🟩🟩🟩🟩
      const chars = Array.from(row)
      const greens = chars.filter((c) => c === "🟩").length
      return greens >= 5
    })

    const result: TermoResult = {
      gameType: "termo",
      date,
      won,
      grid: allGrids,
      rawText,
      modes,
    }

    return { result, consumedLines: consumed }
  },
}
