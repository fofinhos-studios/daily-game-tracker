import { gameStyle } from "@/design-system/games"
import { cn } from "@/lib/utils"
import { GAME_LABELS, type GameType } from "@/types/games"
import { GameIcon } from "./GameIcon"

interface GameBadgeProps {
  gameType: GameType
  label?: string
  className?: string
}
export function GameBadge({ gameType, label, className }: GameBadgeProps) {
  return (
    <span style={gameStyle(gameType)} className={cn("game-badge", className)}>
      <GameIcon gameType={gameType} className="h-4 w-4" />
      {label || GAME_LABELS[gameType]}
    </span>
  )
}
