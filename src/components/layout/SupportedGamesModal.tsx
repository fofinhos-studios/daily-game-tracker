import { ExternalLink, Gamepad2, X } from "lucide-react"
import { useRef } from "react"
import { GameIcon } from "@/components/input/GameIcon"
import { useDialogFocus } from "@/hooks/useDialogFocus"
import { useI18n } from "@/i18n/I18nProvider"
import type { GameType } from "@/types/games"
import { GAME_INFO, GAME_ORDER } from "@/types/games"

const GAME_NAME_COLORS: Record<GameType, string> = {
  conexo: "text-blue-600",
  expresso: "text-cyan-600",
  framed: "text-red-600",
  gamedle: "text-purple-600",
  guessthegame: "text-emerald-600",
  letroso: "text-yellow-600",
  termo: "text-orange-600",
}

const GAME_BORDER_COLORS: Record<GameType, string> = {
  conexo: "border-l-blue-500",
  expresso: "border-l-cyan-500",
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
  const { t } = useI18n()
  const overlayRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  useDialogFocus(dialogRef, onClose)

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={t.app.supportedGamesTitle}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 px-2 pt-2 sm:items-center sm:p-4 motion-safe:animate-fade-in-fast"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose()
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") onClose()
      }}
    >
      <div
        ref={dialogRef}
        className="card-surface flex max-h-[calc(100dvh-1rem)] w-full max-w-lg flex-col rounded-t-2xl p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-xl sm:rounded-2xl sm:p-6 motion-safe:animate-dialog-in"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="inline-flex items-center gap-2 text-sm font-bold text-foreground">
            <Gamepad2 aria-hidden="true" className="h-4 w-4" />
            {t.app.supportedGamesTitle}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.app.viewSupportedGames}
            className="touch-manipulation rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 space-y-2 overflow-y-auto overscroll-contain pr-1">
          {GAME_ORDER.map((game) => {
            const info = GAME_INFO[game]
            return (
              <a
                key={game}
                href={info.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex touch-manipulation items-center gap-3 rounded-lg border-l-[3px] bg-muted/30 px-3 py-2.5 transition-colors hover:bg-muted/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${GAME_BORDER_COLORS[game]}`}
              >
                <GameIcon gameType={game} className="h-6 w-6" />
                <div className="min-w-0 flex-1">
                  <span className={`text-sm font-bold ${GAME_NAME_COLORS[game]}`}>
                    {info.label}
                  </span>
                  <p className="text-xs text-muted-foreground">{t.gameDescriptions[game]}</p>
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
