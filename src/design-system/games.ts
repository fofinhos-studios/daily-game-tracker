import type { CSSProperties } from "react"
import type { GameType } from "@/types/games"

export interface GameVisual {
  code: string
  path: string
  color: `var(--game-${GameType})`
  ink: `var(--game-${GameType}-ink)`
}

// All marks share a 32-unit grid, 2-unit outline, square line caps and no fill.
const identity = (game: GameType, code: string, path: string): GameVisual => ({
  code,
  path,
  color: `var(--game-${game})`,
  ink: `var(--game-${game}-ink)`,
})
export const GAME_VISUALS: Record<GameType, GameVisual> = {
  conexo: identity("conexo", "CNX", "M4 4h24v4H4z M4 11h24v4H4z M4 18h24v4H4z M4 25h24v3H4z"),
  expresso: identity(
    "expresso",
    "EXP",
    "M3 3h7v7H3z M13 3h7v7h-7z M23 3h6v7h-6z M8 13h7v7H8z M18 13h7v7h-7z M3 23h7v6H3z M13 23h7v6h-7z M23 23h6v6h-6z",
  ),
  framed: identity("framed", "FRM", "M3 7h18v18H3z M21 13l8-5v16l-8-5 M7 11h5"),
  gamedle: identity(
    "gamedle",
    "GMD",
    "M5 22l5-5h12l5 5v6H5z M16 17V9 M12 5l4-3 4 3v4l-4 3-4-3z M8 23h16 M22 17v-3",
  ),
  guessthegame: identity(
    "guessthegame",
    "GTG",
    "M16 9V3h5 M8 10h16l5 14-3 4-7-6h-6l-7 6-3-4z M10 13v8 M6 17h8 M22 14v3 M25 18v3",
  ),
  krillion: identity(
    "krillion",
    "KRL",
    "M19 9C14 1 6 4 5 10 M20 10C18 4 11 1 8 2 M7 13l7-4 10 3 5 7-2 7-8 3-8-4 8 1 5-5-2-5-8-1z M17 10l-2 5 M23 12l-3 5 M27 17l-4 3 M13 13h1 M7 13l-4 5 8-2",
  ),
  letroso: identity(
    "letroso",
    "LTR",
    "M3 4h7v7H3z M14 4h7v7h-7z M25 4h4v7h-4z M3 15h7v5H3z M14 15h15v5H14z M3 24h26v5H3z",
  ),
  sizeitup: identity("sizeitup", "SIZ", "M3 26l9-9 6 5L29 8 M20 8h9v9 M3 4v25h26"),
  termo: identity("termo", "TRM", "M3 3h26v26H3z M9 10h14 M16 10v14"),
}

export function gameStyle(game: GameType): CSSProperties {
  const visual = GAME_VISUALS[game]
  return { "--game-color": visual.color, "--game-ink": visual.ink } as CSSProperties
}
