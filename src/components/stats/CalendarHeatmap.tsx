import { CalendarDotsIcon as CalendarDays } from "@phosphor-icons/react"
import { addDays, format, startOfWeek, subDays } from "date-fns"
import { useMemo } from "react"
import { SectionHeading } from "@/components/help/SectionHeading"
import { useI18n } from "@/i18n/I18nProvider"
import { getGamesPlayedOnDate } from "@/lib/stats"
import type { AppData, GameType } from "@/types/games"
import { CalendarDay } from "./CalendarDay"

interface CalendarHeatmapProps {
  data: AppData
  today: string
  gameFilter?: Set<GameType>
  onSelectDate?: (date: string) => void
}

export function CalendarHeatmap({ data, today, gameFilter, onSelectDate }: CalendarHeatmapProps) {
  const { t } = useI18n()
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
            count: getGamesPlayedOnDate(data, dateKey, gameFilter),
            dayOfWeek: d,
            week: w,
          })
        }
        currentDate = addDays(currentDate, 1)
      }
    }

    const maxCount = Math.max(1, ...days.map((d) => d.count))
    return { days, maxCount, weeks }
  }, [data, today, gameFilter])

  // Group by week
  const weeks = new Map<number, typeof calendar.days>()
  for (const day of calendar.days) {
    const arr = weeks.get(day.week) || []
    arr.push(day)
    weeks.set(day.week, arr)
  }

  return (
    <div className="card-surface rounded-xl p-4">
      <SectionHeading className="mb-3" help={t.help.activity} icon={CalendarDays}>
        {t.app.activity}
      </SectionHeading>
      <div className="overflow-x-auto">
        <div className="inline-flex gap-px">
          {Array.from(weeks.entries())
            .sort(([a], [b]) => a - b)
            .map(([weekNum, days]) => (
              <div key={weekNum} className="flex flex-col gap-px">
                {Array.from({ length: 7 }).map((_, dow) => {
                  const day = days.find((d) => d.dayOfWeek === dow)
                  if (!day) {
                    return <div key={dow} className="h-6 w-6" />
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
        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <span>{t.stats.less}</span>
          {Array.from({ length: 7 }, (_, i) => (
            <div
              key={i}
              className="h-3 w-3 border border-border"
              style={{ background: `var(--activity-${i})` }}
            />
          ))}
          <span>{t.stats.more}</span>
        </div>
      </div>
    </div>
  )
}
