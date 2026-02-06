import { ExternalLink } from "lucide-react"
import type { GameType } from "@/types/games"
import { GAME_INFO, GAME_ORDER } from "@/types/games"

const GAME_BORDER_COLORS: Record<GameType, string> = {
  conexo: "border-l-blue-500",
  framed: "border-l-red-500",
  gamedle: "border-l-purple-500",
  guessthegame: "border-l-emerald-500",
  letroso: "border-l-yellow-500",
  termo: "border-l-orange-500",
}

const GAME_NAME_COLORS: Record<GameType, string> = {
  conexo: "text-blue-700",
  framed: "text-red-700",
  gamedle: "text-purple-700",
  guessthegame: "text-emerald-700",
  letroso: "text-yellow-700",
  termo: "text-orange-700",
}

export function SupportedGames() {
  return (
    <section className="mb-6 animate-fade-in-up delay-0">
      <h2 className="section-heading mb-3">Supported Games</h2>
      <div className="flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-x-visible sm:pb-0">
        {GAME_ORDER.map((game, i) => {
          const info = GAME_INFO[game]
          return (
            <a
              key={game}
              href={info.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex shrink-0 items-center gap-2 card-surface rounded-lg border-l-[3px] px-3 py-2 transition-all hover:-translate-y-0.5 hover:shadow-md animate-fade-in-up ${GAME_BORDER_COLORS[game]}`}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="min-w-0">
                <span className={`text-sm font-bold ${GAME_NAME_COLORS[game]}`}>{info.label}</span>
                <p className="text-[11px] text-muted-foreground whitespace-nowrap">
                  {info.description}
                </p>
              </div>
              <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground/40 group-hover:text-muted-foreground" />
            </a>
          )
        })}
      </div>
    </section>
  )
}
