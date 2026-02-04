export type GameType =
  | "conexo"
  | "framed"
  | "gamedle"
  | "guessthegame"
  | "letroso"
  | "termo"

export const GAME_LABELS: Record<GameType, string> = {
  conexo: "Conexo",
  framed: "Framed",
  gamedle: "Gamedle",
  guessthegame: "GuessTheGame",
  letroso: "Letroso",
  termo: "Termo",
}

export const GAME_ORDER: GameType[] = [
  "conexo",
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
