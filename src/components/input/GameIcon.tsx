import { useState } from "react"
import { cn } from "@/lib/utils"
import type { GameType } from "@/types/games"
import { GAME_INFO } from "@/types/games"

interface GameIconProps {
  gameType: GameType
  className?: string
}

export function GameIcon({ gameType, className }: GameIconProps) {
  const [failed, setFailed] = useState(false)
  const info = GAME_INFO[gameType]

  if (failed) {
    return (
      <span className={cn("inline-flex shrink-0 items-center justify-center text-xs", className)}>
        {info.emoji}
      </span>
    )
  }

  return (
    <img
      src={info.favicon}
      alt=""
      aria-hidden="true"
      decoding="async"
      onError={() => setFailed(true)}
      className={cn("inline-block shrink-0 rounded-sm object-contain", className)}
    />
  )
}
