import { formatDateBR } from "@/lib/dates"
import type { DayEntry } from "@/types/games"
import { GAME_ORDER } from "@/types/games"

export function generateShareMessage(entry: DayEntry): string {
  const dateLine = `Daily Games - ${formatDateBR(entry.date)}`

  // Sort results by canonical game order
  const sorted = [...entry.results].sort((a, b) => {
    return GAME_ORDER.indexOf(a.gameType) - GAME_ORDER.indexOf(b.gameType)
  })

  const blocks = sorted.map((r) => {
    return r.rawText
      .replace(/\s*>\s*https?:\/\/\S+/g, "")
      .replace(/https?:\/\/\S+/g, "")
      .replace(/[ \t]+$/gm, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  })
  return [dateLine, "", ...blocks.join("\n\n").split("\n")].join("\n")
}
