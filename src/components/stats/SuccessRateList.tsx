import { useI18n } from "@/i18n/I18nProvider"
import { calculateGameStats, calculateSubGameStats, getAllSubGameKeys } from "@/lib/stats"
import type { AppData, GameType } from "@/types/games"
import { GAME_LABELS, getSubGameLabel, parseSubGameKey } from "@/types/games"
import { SuccessRateBar } from "./SuccessRateBar"

interface SuccessRateListProps {
  data: AppData
  gameFilter?: Set<GameType>
}

export function SuccessRateList({ data, gameFilter }: SuccessRateListProps) {
  const { t, locale } = useI18n()
  const subGameKeys = getAllSubGameKeys(data)
  const allStats = subGameKeys
    .map((key) => calculateSubGameStats(data, key))
    .filter((s) => s.totalPlayed > 0)
    .filter((s) => !gameFilter || gameFilter.size === 0 || gameFilter.has(s.gameType))
    .sort((a, b) => {
      const labelA = getSubGameLabel(a.subGameKey || a.gameType)
      const labelB = getSubGameLabel(b.subGameKey || b.gameType)
      return labelA.localeCompare(labelB)
    })

  if (allStats.length === 0) {
    return (
      <p className="text-center text-xs font-light text-muted-foreground py-2">{t.stats.empty}</p>
    )
  }

  const games = [...new Set(allStats.map((stats) => stats.gameType))].sort((a, b) =>
    GAME_LABELS[a].localeCompare(GAME_LABELS[b], locale),
  )

  return (
    <ul className="rate-games">
      {games.map((gameType) => {
        const modes = allStats.filter(
          (stats) =>
            stats.gameType === gameType && parseSubGameKey(stats.subGameKey || gameType).mode,
        )
        return (
          <li key={gameType}>
            <SuccessRateBar stats={calculateGameStats(data, gameType)} />
            {modes.length > 0 && (
              <ul className="rate-subgames" aria-label={GAME_LABELS[gameType]}>
                {modes.map((stats) => {
                  const mode = parseSubGameKey(stats.subGameKey!).mode!
                  return (
                    <li key={stats.subGameKey}>
                      <SuccessRateBar
                        stats={stats}
                        label={mode.charAt(0).toUpperCase() + mode.slice(1)}
                        nested
                      />
                    </li>
                  )
                })}
              </ul>
            )}
          </li>
        )
      })}
    </ul>
  )
}
