import { ExternalLink, X } from "lucide-react"
import { useCallback, useEffect } from "react"
import type { GameType } from "@/types/games"
import { GAME_INFO, GAME_ORDER } from "@/types/games"

const GAME_NAME_COLORS: Record<GameType, string> = {
  conexo: "text-blue-300",
  framed: "text-red-300",
  gamedle: "text-purple-300",
  guessthegame: "text-emerald-300",
  letroso: "text-yellow-300",
  termo: "text-orange-300",
}

interface SupportedGamesProps {
  open: boolean
  onClose: () => void
}

export function SupportedGames({ open, onClose }: SupportedGamesProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown)
      return () => document.removeEventListener("keydown", handleKeyDown)
    }
  }, [open, handleKeyDown])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <button
        type="button"
        tabIndex={-1}
        className="absolute inset-0 bg-background/60 backdrop-blur-sm animate-fade-in cursor-default"
        onClick={onClose}
        aria-label="Close supported games"
      />

      {/* Panel */}
      <div
        role="dialog"
        className="relative glass rounded-2xl p-6 max-w-lg w-full noise overflow-hidden animate-scale-in"
      >
        <div className="relative z-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Supported Games
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {GAME_ORDER.map((game, i) => {
              const info = GAME_INFO[game]
              return (
                <a
                  key={game}
                  href={info.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 rounded-xl glass px-3 py-2.5 transition-all hover:glow-primary animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <span className="text-base">{info.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <span className={`text-sm font-bold ${GAME_NAME_COLORS[game]}`}>
                      {info.label}
                    </span>
                    <p className="text-[10px] text-muted-foreground/70 whitespace-nowrap overflow-hidden text-ellipsis">
                      {info.description}
                    </p>
                  </div>
                  <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground/30 group-hover:text-primary/50" />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
