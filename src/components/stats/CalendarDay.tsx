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
  "bg-orange-100", // 1 game
  "bg-orange-200", // 2 games
  "bg-red-300", // 3 games
  "bg-red-400", // 4 games
  "bg-red-500", // 5 games
  "bg-red-700", // 6+ games
]

export function CalendarDay({ date, count, isToday, onClick }: CalendarDayProps) {
  const intensity = Math.min(count, INTENSITY_CLASSES.length - 1)

  return (
    <button
      type="button"
      onClick={() => onClick?.(date)}
      className={cn(
        "h-3 w-3 rounded-sm transition-all hover:scale-150 hover:ring-1 hover:ring-foreground/20",
        INTENSITY_CLASSES[intensity],
        isToday && "ring-1 ring-primary/50",
      )}
      title={`${date}: ${count} game${count !== 1 ? "s" : ""}`}
      aria-label={`${date}: ${count} game${count !== 1 ? "s" : ""}`}
    />
  )
}
