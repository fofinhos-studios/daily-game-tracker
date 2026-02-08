import { ExternalLink, X } from "lucide-react"
import { useEffect, useRef } from "react"
import type { GameType } from "@/types/games"
import { GAME_INFO, GAME_ORDER } from "@/types/games"

const GAME_NAME_COLORS: Record<GameType, string> = {
  conexo: "text-blue-600",
  framed: "text-red-600",
  gamedle: "text-purple-600",
  guessthegame: "text-emerald-600",
  letroso: "text-yellow-600",
  termo: "text-orange-600",
}

const GAME_BORDER_COLORS: Record<GameType, string> = {
  conexo: "border-l-blue-500",
  framed: "border-l-red-500",
  gamedle: "border-l-purple-500",
  guessthegame: "border-l-emerald-500",
  letroso: "border-l-yellow-500",
  termo: "border-l-orange-500",
}

interface SupportedGamesModalProps {
  onClose: () => void
}

export function SupportedGamesModal({ onClose }: SupportedGamesModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Supported Games"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose()
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose()
      }}
    >
      <div className="card-surface mx-4 w-full max-w-lg rounded-2xl p-6 shadow-xl animate-fade-in-up">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold text-foreground">Supported Games</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-2">
          {GAME_ORDER.map((game) => {
            const info = GAME_INFO[game]
            return (
              <a
                key={game}
                href={info.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center gap-3 rounded-lg border-l-[3px] bg-muted/30 px-3 py-2.5 transition-all hover:bg-muted/60 ${GAME_BORDER_COLORS[game]}`}
              >
                <span className="text-lg">{info.emoji}</span>
                <div className="min-w-0 flex-1">
                  <span className={`text-sm font-bold ${GAME_NAME_COLORS[game]}`}>
                    {info.label}
                  </span>
                  <p className="text-xs text-muted-foreground">{info.description}</p>
                </div>
                <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40 group-hover:text-muted-foreground" />
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}
