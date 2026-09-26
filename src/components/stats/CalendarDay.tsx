import { useI18n } from "@/i18n/I18nProvider"
import { cn } from "@/lib/utils"

interface CalendarDayProps {
  date: string
  count: number
  maxCount: number
  isToday: boolean
  onClick?: (date: string) => void
}

export function CalendarDay({ date, count, isToday, onClick }: CalendarDayProps) {
  const { t } = useI18n()
  const intensity = Math.min(count, 6)

  return (
    <button
      type="button"
      onClick={() => onClick?.(date)}
      className={cn(
        "heat-cell flex h-6 w-6 items-center justify-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
      title={t.stats.gamesOnDate(date, count)}
      aria-label={t.stats.gamesOnDate(date, count)}
    >
      <span
        style={{ background: `var(--activity-${intensity})` }}
        className={cn(
          "h-3 w-3 rounded-sm",

          isToday && "ring-1 ring-foreground/50",
        )}
      />
    </button>
  )
}
