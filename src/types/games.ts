export type GameType =
  | "conexo"
  | "expresso"
  | "framed"
  | "gamedle"
  | "guessthegame"
  | "letroso"
  | "termo"

export const GAME_LABELS: Record<GameType, string> = {
  conexo: "Conexo",
  expresso: "Expresso",
  framed: "Framed",
  gamedle: "Gamedle",
  guessthegame: "GuessTheGame",
  letroso: "Letroso",
  termo: "Termo",
}

export const GAME_INFO: Record<
  GameType,
  { label: string; url: string; favicon: string; emoji: string; description: string }
> = {
  conexo: {
    label: "Conexo",
    url: "https://conexo.ws",
    favicon: "/favicons/conexo.ico",
    emoji: "🔗",
    description: "Group words by connection",
  },
  expresso: {
    label: "Expresso",
    url: "https://expresso.ac",
    favicon: "/favicons/expresso.ico",
    emoji: "💬",
    description: "Find the popular expression",
  },
  framed: {
    label: "Framed",
    url: "https://framed.wtf",
    favicon: "/favicons/framed.ico",
    emoji: "🎬",
    description: "Guess the movie from frames",
  },
  gamedle: {
    label: "Gamedle",
    url: "https://gamedle.wtf",
    favicon: "/favicons/gamedle.ico",
    emoji: "🕹️",
    description: "Guess the game from clues",
  },
  guessthegame: {
    label: "GuessTheGame",
    url: "https://guessthe.game",
    favicon: "/favicons/guessthegame.ico",
    emoji: "🎮",
    description: "Guess the game from screenshots",
  },
  letroso: {
    label: "Letroso",
    url: "https://letroso.com",
    favicon: "/favicons/letroso.ico",
    emoji: "🔤",
    description: "Brazilian word puzzle",
  },
  termo: {
    label: "Termo",
    url: "https://term.ooo",
    favicon: "/favicons/termo.ico",
    emoji: "🟩",
    description: "Portuguese Wordle",
  },
}

export const GAME_ORDER: GameType[] = [
  "conexo",
  "expresso",
  "framed",
  "gamedle",
  "guessthegame",
  "letroso",
  "termo",
]

export interface BaseResult {
  gameType: GameType
  date: string
  won: boolean
  grid: string[]
  rawText: string
}

export interface ConexoResult extends BaseResult {
  gameType: "conexo"
  attempts: number
  hints: number
}

export interface FramedResult extends BaseResult {
  gameType: "framed"
  gameNumber: number
}

export interface ExpressoResult extends BaseResult {
  gameType: "expresso"
  attempts: number
}

export interface GamedleMode {
  mode: string
  emoji: string
  gameNumber: number
  grid: string
  won: boolean
}

export interface GamedleResult extends BaseResult {
  gameType: "gamedle"
  modes: GamedleMode[]
}

export interface GuessTheGameResult extends BaseResult {
  gameType: "guessthegame"
  gameNumber: number
}

export interface LetrosoResult extends BaseResult {
  gameType: "letroso"
  attempts: number
}

export interface TermoMode {
  mode: string
  gameNumber: number
  streak: number
  grid: string[]
  attempts: string
}

export interface TermoResult extends BaseResult {
  gameType: "termo"
  modes: TermoMode[]
}

export type GameResult =
  | ConexoResult
  | ExpressoResult
  | FramedResult
  | GamedleResult
  | GuessTheGameResult
  | LetrosoResult
  | TermoResult

export interface DayEntry {
  date: string
  results: GameResult[]
}

export interface AppData {
  version: number
  entries: Record<string, DayEntry>
}

export function createEmptyAppData(): AppData {
  return { version: 1, entries: {} }
}

export function createManualLoss(gameType: GameType, date: string): GameResult {
  const base = {
    gameType,
    date,
    won: false,
    grid: ["❌"],
    rawText: `${GAME_LABELS[gameType]} ❌`,
  }

  switch (gameType) {
    case "conexo":
      return { ...base, gameType, attempts: 0, hints: 0 }
    case "expresso":
    case "letroso":
      return { ...base, gameType, attempts: 0 }
    case "framed":
    case "guessthegame":
      return { ...base, gameType, gameNumber: 0 }
    case "gamedle":
    case "termo":
      return { ...base, gameType, modes: [] }
  }
}

// Sub-game support: "gameType" or "gameType:mode"
export type SubGameKey = string

export function getSubGameEntries(result: GameResult): { key: SubGameKey; won: boolean }[] {
  if (result.gameType === "gamedle") {
    if (result.modes.length === 0) return [{ key: result.gameType, won: result.won }]
    return result.modes.map((m) => ({
      key: `gamedle:${m.mode}`,
      won: m.won,
    }))
  }
  if (result.gameType === "termo") {
    if (result.modes.length === 0) return [{ key: result.gameType, won: result.won }]
    return result.modes.map((m) => {
      const won = m.grid.some((row) => {
        const greens = Array.from(row).filter((c) => c === "🟩").length
        return greens >= 5
      })
      return { key: `termo:${m.mode}`, won }
    })
  }
  return [{ key: result.gameType, won: result.won }]
}

export function parseSubGameKey(key: SubGameKey): { gameType: GameType; mode?: string } {
  const idx = key.indexOf(":")
  if (idx === -1) return { gameType: key as GameType }
  return { gameType: key.slice(0, idx) as GameType, mode: key.slice(idx + 1) }
}

export function getSubGameLabel(key: SubGameKey): string {
  const { gameType, mode } = parseSubGameKey(key)
  const base = GAME_LABELS[gameType]
  return mode ? `${base} - ${mode.charAt(0).toUpperCase() + mode.slice(1)}` : base
}
