import { cn } from "@/lib/utils"
import type { GameType } from "@/types/games"
import { GAME_LABELS } from "@/types/games"

const GAME_COLORS: Record<GameType, string> = {
  conexo: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  framed: "bg-red-500/20 text-red-300 border-red-500/30",
  gamedle: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  guessthegame: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  letroso: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  termo: "bg-orange-500/20 text-orange-300 border-orange-500/30",
}

interface GameBadgeProps {
  gameType: GameType
  className?: string
}

export function GameBadge({ gameType, className }: GameBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold transition-all",
        GAME_COLORS[gameType],
        className,
      )}
    >
      {GAME_LABELS[gameType]}
    </span>
  )
}
