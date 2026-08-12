import { useI18n } from "@/i18n/I18nProvider"
import { cn } from "@/lib/utils"

interface CalendarDayProps {
  date: string
  count: number
  maxCount: number
  isToday: boolean
  onClick?: (date: string) => void
}

const INTENSITY_CLASSES = [
  "bg-muted", // 0 games
  "bg-primary/20",
  "bg-primary/30",
  "bg-primary/45",
  "bg-primary/60",
  "bg-primary/75",
  "bg-primary",
]

export function CalendarDay({ date, count, isToday, onClick }: CalendarDayProps) {
  const { t } = useI18n()
  const intensity = Math.min(count, INTENSITY_CLASSES.length - 1)

  return (
    <button
      type="button"
      onClick={() => onClick?.(date)}
      className={cn(
        "flex h-5 w-5 items-center justify-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
      title={t.stats.gamesOnDate(date, count)}
      aria-label={t.stats.gamesOnDate(date, count)}
    >
      <span
        className={cn(
          "h-3 w-3 rounded-sm",
          INTENSITY_CLASSES[intensity],
          isToday && "ring-1 ring-foreground/50",
        )}
      />
    </button>
  )
}
