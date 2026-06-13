import { formatDateBR } from "@/lib/dates"
import type { DayEntry } from "@/types/games"
import { GAME_LABELS, GAME_ORDER } from "@/types/games"

interface ShareMessageOptions {
  gameNamesOnly?: boolean
}

export function generateShareMessage(entry: DayEntry, options: ShareMessageOptions = {}): string {
  const dateLine = `ミニゲーム (Minigēmu) - ${formatDateBR(entry.date)}`

  // Sort results by canonical game order
  const sorted = [...entry.results].sort((a, b) => {
    return GAME_ORDER.indexOf(a.gameType) - GAME_ORDER.indexOf(b.gameType)
  })

  const blocks = sorted.map((r) => {
    if (options.gameNamesOnly) {
      if (!r.won && r.rawText === `${GAME_LABELS[r.gameType]} ❌`) return r.rawText
      return [GAME_LABELS[r.gameType], ...r.grid].join("\n")
    }

    return r.rawText
      .replace(/\s*>\s*https?:\/\/\S+/g, "")
      .replace(/https?:\/\/\S+/g, "")
      .replace(/[ \t]+$/gm, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  })
  return [dateLine, "", ...blocks.join("\n\n").split("\n")].join("\n")
}
