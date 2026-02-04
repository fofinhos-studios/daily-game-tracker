import { ExternalLink } from "lucide-react"
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

export function SupportedGames() {
  return (
    <section className="mb-6 animate-fade-in-up delay-0">
      <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
        Supported Games
      </h2>
      <div className="flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-x-visible sm:pb-0">
        {GAME_ORDER.map((game, i) => {
          const info = GAME_INFO[game]
          return (
            <a
              key={game}
              href={info.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex shrink-0 items-center gap-2 rounded-lg border border-border/50 bg-card/30 px-3 py-2 transition-all hover:border-primary/30 hover:bg-card/60 animate-fade-in-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <span className="text-sm">{info.emoji}</span>
              <div className="min-w-0">
                <span className={`text-sm font-bold ${GAME_NAME_COLORS[game]}`}>{info.label}</span>
                <p className="text-xs text-muted-foreground/70 whitespace-nowrap">
                  {info.description}
                </p>
              </div>
              <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground/50 group-hover:text-primary/50" />
            </a>
          )
        })}
      </div>
    </section>
  )
}
