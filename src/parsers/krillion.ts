import {
  formatKrillionGrid,
  type KrillionTier,
  krillionDate,
  krillionScore,
  krillionTierFromEmoji,
} from "@/lib/krillion"
import type { KrillionResult } from "@/types/games"
import type { GameParser, ParseResult } from "./types"

const HEADER_RE = /^Krillion(?:\s+⟲)?\s+#([1-9]\d*)\s+🦐$/i
const SCORE_RE = /^(0|[1-9]\d*)$/

export const krillionParser: GameParser = {
  gameType: "krillion",

  detect(lines: string[]): boolean {
    return HEADER_RE.test(lines[0]?.trim() ?? "")
  },

  parse(lines: string[], _fallbackDate: string): ParseResult | null {
    const header = lines[0]?.trim() ?? ""
    const match = HEADER_RE.exec(header)
    if (!match) return null

    const gameNumber = Number(match[1])
    const date = krillionDate(gameNumber)
    if (!date) return null

    let consumed = 1
    while (lines[consumed]?.trim() === "") consumed++
    const scoreText = lines[consumed]?.trim() ?? ""
    if (!SCORE_RE.test(scoreText)) return null
    const score = Number(scoreText)
    if (!Number.isSafeInteger(score) || score > 700) return null
    consumed++

    while (lines[consumed]?.trim() === "") consumed++
    const emojiLine = lines[consumed]?.trim() ?? ""
    const emojis = Array.from(emojiLine)
    if (emojis.length !== 7) return null
    const tiers = emojis.map(krillionTierFromEmoji)
    if (tiers.some((tier) => tier === undefined)) return null
    const knownTiers = tiers as KrillionTier[]
    if (krillionScore(knownTiers) !== score) return null
    consumed++

    // The game's optional share link belongs to this result, not the next game.
    const afterGrid = consumed
    while (lines[consumed]?.trim() === "") consumed++
    if (/^https:\/\/krillion\.io(?:\/|$)/i.test(lines[consumed]?.trim() ?? "")) {
      consumed++
    } else {
      consumed = afterGrid
    }

    const result: KrillionResult = {
      gameType: "krillion",
      date,
      won: true,
      gameNumber,
      score,
      tiers: knownTiers,
      grid: formatKrillionGrid(knownTiers),
      rawText: lines.slice(0, consumed).join("\n").trim(),
    }
    return { result, consumedLines: consumed }
  },
}
