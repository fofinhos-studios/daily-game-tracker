import type { GameResult } from "@/types/games"
import type { GameParser } from "./types"
import { todayKey } from "@/lib/dates"
import { conexoParser } from "./conexo"
import { framedParser } from "./framed"
import { gamedleParser } from "./gamedle"
import { guessTheGameParser } from "./guessthegame"
import { letrosoParser } from "./letroso"
import { termoParser } from "./termo"

const parsers: GameParser[] = [
  conexoParser,
  framedParser,
  gamedleParser,
  guessTheGameParser,
  letrosoParser,
  termoParser,
]

export function parseInput(text: string): GameResult[] {
  const lines = text.split("\n")
  const results: GameResult[] = []
  const fallbackDate = todayKey()

  let i = 0
  while (i < lines.length) {
    const line = lines[i]!.trim()

    // Skip blank lines
    if (line === "") {
      i++
      continue
    }

    // Try each parser against the remaining lines
    const remaining = lines.slice(i)
    let matched = false

    for (const parser of parsers) {
      if (parser.detect(remaining)) {
        const result = parser.parse(remaining, fallbackDate)
        if (result) {
          results.push(result.result)
          i += result.consumedLines
          matched = true
          break
        }
      }
    }

    // If no parser matched, skip this line
    if (!matched) {
      i++
    }
  }

  return results
}

export { parsers }
