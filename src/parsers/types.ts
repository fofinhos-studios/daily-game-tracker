import type { GameResult, GameType } from "@/types/games"

export interface ParseResult {
  result: GameResult
  consumedLines: number
}

export interface GameParser {
  gameType: GameType
  detect(lines: string[]): boolean
  parse(lines: string[], fallbackDate: string): ParseResult | null
}
