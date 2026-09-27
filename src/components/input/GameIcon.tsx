import { GAME_VISUALS } from "@/design-system/games"
import { cn } from "@/lib/utils"
import type { GameType } from "@/types/games"

export function GameIcon({ gameType, className }: { gameType: GameType; className?: string }) {
  return (
    <img
      src={GAME_VISUALS[gameType].favicon}
      alt=""
      draggable={false}
      aria-hidden="true"
      className={cn("game-mark h-5 w-5", className)}
    />
  )
}
