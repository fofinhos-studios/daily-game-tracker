import { cn } from "@/lib/utils"
import type { GameType } from "@/types/games"
import { GAME_LABELS } from "@/types/games"
import { GameIcon } from "./GameIcon"

const GAME_COLORS: Record<GameType, string> = {
  conexo: "bg-blue-50 text-blue-700 border-blue-200",
  expresso: "bg-cyan-50 text-cyan-700 border-cyan-200",
  framed: "bg-red-50 text-red-700 border-red-200",
  gamedle: "bg-purple-50 text-purple-700 border-purple-200",
  guessthegame: "bg-emerald-50 text-emerald-700 border-emerald-200",
  letroso: "bg-yellow-50 text-yellow-700 border-yellow-200",
  termo: "bg-orange-50 text-orange-700 border-orange-200",
}

interface GameBadgeProps {
  gameType: GameType
  label?: string
  className?: string
}

export function GameBadge({ gameType, label, className }: GameBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold",
        GAME_COLORS[gameType],
        className,
      )}
    >
      <GameIcon gameType={gameType} className="mr-1.5 h-3.5 w-3.5" />
      {label || GAME_LABELS[gameType]}
    </span>
  )
}
