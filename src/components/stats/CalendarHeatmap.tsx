import { addDays, format, startOfWeek, subDays } from "date-fns"
import { useMemo } from "react"
import { getGamesPlayedOnDate } from "@/lib/stats"
import type { AppData } from "@/types/games"
import { CalendarDay } from "./CalendarDay"

interface CalendarHeatmapProps {
  data: AppData
  today: string
  onSelectDate?: (date: string) => void
}

export function CalendarHeatmap({ data, today, onSelectDate }: CalendarHeatmapProps) {
  const calendar = useMemo(() => {
    const todayDate = new Date(`${today}T12:00:00`)
    const weeks = 20 // ~5 months
    const totalDays = weeks * 7

    // Find the start: go back totalDays from today, then align to start of week (Sunday)
    const rawStart = subDays(todayDate, totalDays)
    const start = startOfWeek(rawStart, { weekStartsOn: 0 })

    const days: { date: string; count: number; dayOfWeek: number; week: number }[] = []
    let currentDate = start

    for (let w = 0; w <= weeks; w++) {
      for (let d = 0; d < 7; d++) {
        const dateKey = format(currentDate, "yyyy-MM-dd")
        if (dateKey <= today) {
          days.push({
            date: dateKey,
            count: getGamesPlayedOnDate(data, dateKey),
            dayOfWeek: d,
            week: w,
          })
        }
        currentDate = addDays(currentDate, 1)
      }
    }

    const maxCount = Math.max(1, ...days.map((d) => d.count))
    return { days, maxCount, weeks }
  }, [data, today])

  // Group by week
  const weeks = new Map<number, typeof calendar.days>()
  for (const day of calendar.days) {
    const arr = weeks.get(day.week) || []
    arr.push(day)
    weeks.set(day.week, arr)
  }

  return (
    <div className="overflow-x-auto">
      <div className="inline-flex gap-[3px]">
        {Array.from(weeks.entries())
          .sort(([a], [b]) => a - b)
          .map(([weekNum, days]) => (
            <div key={weekNum} className="flex flex-col gap-[3px]">
              {Array.from({ length: 7 }).map((_, dow) => {
                const day = days.find((d) => d.dayOfWeek === dow)
                if (!day) {
                  return <div key={dow} className="h-3 w-3" />
                }
                return (
                  <CalendarDay
                    key={day.date}
                    date={day.date}
                    count={day.count}
                    maxCount={calendar.maxCount}
                    isToday={day.date === today}
                    onClick={onSelectDate}
                  />
                )
              })}
            </div>
          ))}
      </div>
      <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground/50">
        <span>Less</span>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-2.5 w-2.5 rounded-sm ${
              [
                "bg-muted/30",
                "bg-accent/20",
                "bg-accent/40",
                "bg-accent/60",
                "bg-accent/80",
                "bg-accent",
              ][i]
            }`}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  )
}
