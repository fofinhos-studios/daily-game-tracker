import { GAME_VISUALS } from "@/design-system/games"
import { cn } from "@/lib/utils"
import type { GameType } from "@/types/games"

export function GameIcon({ gameType, className }: { gameType: GameType; className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      className={cn("game-mark h-5 w-5", className)}
    >
      <path d={GAME_VISUALS[gameType].path} />
    </svg>
  )
}
