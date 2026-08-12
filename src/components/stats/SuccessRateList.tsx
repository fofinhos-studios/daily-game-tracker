import { useI18n } from "@/i18n/I18nProvider"
import { calculateSubGameStats, getAllSubGameKeys } from "@/lib/stats"
import type { AppData, GameType } from "@/types/games"
import { getSubGameLabel, parseSubGameKey } from "@/types/games"
import { SuccessRateBar } from "./SuccessRateBar"

interface SuccessRateListProps {
  data: AppData
  gameFilter?: Set<GameType>
}

export function SuccessRateList({ data, gameFilter }: SuccessRateListProps) {
  const { t } = useI18n()
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
      <p className="text-center text-xs font-light text-muted-foreground/60 py-2">
        {t.stats.empty}
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {allStats.map((stats) => {
        const key = stats.subGameKey || stats.gameType
        const { mode } = parseSubGameKey(key)
        return (
          <SuccessRateBar key={key} stats={stats} label={mode ? getSubGameLabel(key) : undefined} />
        )
      })}
    </div>
  )
}
