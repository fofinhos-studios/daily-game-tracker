import type { SizeItUpResult } from "@/types/games"
import type { GameParser, ParseResult } from "./types"

const HEADER_RE = /^Size It Up$/i
const SCORE_RE = /^Overall Score\s+(\d{1,3})$/i
const ROUND_RE = /^((?:🟥|⬜){5})\s+(\d{1,3})$/u
const LINK_RE =
  /^(?:https:\/\/magnitudle\.com\/size-it-up\/?|\[https:\/\/magnitudle\.com\/size-it-up\/?\]\(https:\/\/magnitudle\.com\/size-it-up\/?\))$/i

export const sizeItUpParser: GameParser = {
  gameType: "sizeitup",

  detect(lines: string[]): boolean {
    return HEADER_RE.test(lines[0]?.trim() ?? "")
  },

  parse(lines: string[], fallbackDate: string): ParseResult | null {
    if (!this.detect(lines)) return null

    let consumed = 1
    while (lines[consumed]?.trim() === "") consumed++
    const scoreMatch = SCORE_RE.exec(lines[consumed]?.trim() ?? "")
    if (!scoreMatch) return null

    const overallScore = Number(scoreMatch[1])
    if (overallScore > 500) return null
    consumed++

    const grid: string[] = []
    const roundScores: number[] = []
    for (let round = 0; round < 5; round++) {
      while (lines[consumed]?.trim() === "") consumed++
      const row = lines[consumed]?.trim() ?? ""
      const match = ROUND_RE.exec(row)
      if (!match) return null

      const points = Number(match[2])
      if (points > 100) return null
      grid.push(row)
      roundScores.push(points)
      consumed++
    }

    if (roundScores.reduce((sum, points) => sum + points, 0) !== overallScore) return null

    const afterGrid = consumed
    while (lines[consumed]?.trim() === "") consumed++
    const nextLine = lines[consumed]?.trim() ?? ""
    if (ROUND_RE.test(nextLine)) return null
    if (LINK_RE.test(nextLine)) consumed++
    else consumed = afterGrid

    const result: SizeItUpResult = {
      gameType: "sizeitup",
      date: fallbackDate,
      won: true,
      overallScore,
      roundScores,
      grid,
      rawText: lines.slice(0, consumed).join("\n").trim(),
    }
    return { result, consumedLines: consumed }
  },
}
