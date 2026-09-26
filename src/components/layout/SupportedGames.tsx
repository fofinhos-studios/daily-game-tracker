import { ArrowUpRightIcon } from "@phosphor-icons/react"
import { GameIcon } from "@/components/input/GameIcon"
import { GAME_VISUALS, gameStyle } from "@/design-system/games"
import { useI18n } from "@/i18n/I18nProvider"
import { GAME_INFO, GAME_ORDER } from "@/types/games"

export function SupportedGames() {
  const { t } = useI18n()
  return (
    <div className="grid gap-3">
      {GAME_ORDER.map((game) => (
        <a
          key={game}
          href={GAME_INFO[game].url}
          target="_blank"
          rel="noopener noreferrer"
          style={gameStyle(game)}
          className="game-link"
        >
          <GameIcon gameType={game} className="h-8 w-8 text-[var(--game-ink)]" />
          <div className="min-w-0 flex-1">
            <span className="game-name">{GAME_INFO[game].label}</span>
            <p className="mt-1 text-xs text-muted-foreground">{t.gameDescriptions[game]}</p>
          </div>
          <span className="hidden font-mono text-xs text-muted-foreground sm:block">
            {GAME_VISUALS[game].code}
          </span>
          <ArrowUpRightIcon size={20} aria-hidden="true" />
        </a>
      ))}
    </div>
  )
}
