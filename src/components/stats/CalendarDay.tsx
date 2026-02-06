import { cn } from "@/lib/utils"

interface CalendarDayProps {
  date: string
  count: number
  maxCount: number
  isToday: boolean
  onClick?: (date: string) => void
}

const INTENSITY_CLASSES = [
  "bg-muted-foreground/15", // 0 games
  "bg-accent/20", // 1 game
  "bg-accent/40", // 2 games
  "bg-accent/60", // 3 games
  "bg-accent/80", // 4 games
  "bg-accent", // 5 games
  "bg-primary", // 6+ games
]

export function CalendarDay({ date, count, isToday, onClick }: CalendarDayProps) {
  const intensity = Math.min(count, INTENSITY_CLASSES.length - 1)

  return (
    <button
      type="button"
      onClick={() => onClick?.(date)}
      className={cn(
        "h-3 w-3 rounded-sm transition-all hover:scale-150 hover:ring-1 hover:ring-foreground/20 hover:shadow-[0_0_6px_oklch(0.6_0.15_165/0.3)]",
        INTENSITY_CLASSES[intensity],
        isToday && "ring-1 ring-primary/50",
      )}
      title={`${date}: ${count} game${count !== 1 ? "s" : ""}`}
      aria-label={`${date}: ${count} game${count !== 1 ? "s" : ""}`}
    />
  )
}
