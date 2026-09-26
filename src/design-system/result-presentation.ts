import { GAME_LABELS, type GameResult } from "@/types/games"

export type GridToken = {
  text: string
  color?: string
  shape?: "square" | "circle"
  symbol?: "check" | "cross" | "hint" | "camera" | "game" | "joystick"
}
const cells: Record<string, Pick<GridToken, "color" | "shape" | "symbol">> = {
  "🟩": { color: "green" },
  "🟨": { color: "yellow" },
  "🟥": { color: "red" },
  "🟦": { color: "blue" },
  "🟪": { color: "purple" },
  "🟧": { color: "orange" },
  "⬛": { color: "black" },
  "⬜": { color: "white" },
  "🟢": { color: "green", shape: "circle" },
  "🟡": { color: "yellow", shape: "circle" },
  "🔴": { color: "red", shape: "circle" },
  "🔵": { color: "blue", shape: "circle" },
  "✅": { color: "green", symbol: "check" },
  "❌": { color: "red", symbol: "cross" },
  "🎥": { color: "white", symbol: "camera" },
  "🎬": { color: "white", symbol: "camera" },
  "🎮": { color: "white", symbol: "game" },
  "🕹": { color: "white", symbol: "joystick" },
  "💡": { color: "yellow", symbol: "hint" },
}
const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" })

export function tokenizeGrid(row: string): GridToken[] {
  const tokens: GridToken[] = []
  for (const { segment } of segmenter.segment(row)) {
    const cell = cells[segment.replace(/\uFE0F/g, "")]
    const previous = tokens.at(-1)
    if (!cell && previous && !previous.color) previous.text += segment
    else tokens.push({ text: segment, ...cell })
  }
  return tokens
}
export function isManualLoss(result: GameResult): boolean {
  return !result.won && result.rawText === `${GAME_LABELS[result.gameType]} ❌`
}
// Metadata is a view of stored results. Never infer wins or invent missing numbers.
export function resultMetric(result: GameResult): {
  value: number | string
  label: "attempts" | "edition" | "points" | "modes" | "manual" | "result"
} {
  if (isManualLoss(result)) return { value: "—", label: "manual" }
  switch (result.gameType) {
    case "conexo":
    case "expresso":
    case "letroso":
      return result.attempts > 0
        ? { value: result.attempts, label: "attempts" }
        : { value: "—", label: "result" }
    case "framed":
    case "guessthegame":
      return result.gameNumber > 0
        ? { value: `#${result.gameNumber}`, label: "edition" }
        : { value: "—", label: "result" }
    case "krillion":
      return { value: result.score, label: "points" }
    case "sizeitup":
      return { value: result.overallScore, label: "points" }
    case "gamedle":
    case "termo":
      return { value: result.modes.length, label: "modes" }
  }
}
