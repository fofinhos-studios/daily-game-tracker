import { addDays, format, startOfWeek, subDays } from "date-fns"
import { Target } from "lucide-react"
import { useMemo } from "react"
import { HELP_TEXT } from "@/components/help/helpContent"
import { SectionHeading } from "@/components/help/SectionHeading"
import { getWinRateForDate } from "@/lib/stats"
import type { AppData, GameType } from "@/types/games"

interface AccuracyHeatmapProps {
  data: AppData
  today: string
  gameFilter?: Set<GameType>
  onSelectDate?: (date: string) => void
}

const ACCURACY_CLASSES = [
  "bg-muted",
  "bg-red-400",
  "bg-orange-400",
  "bg-yellow-400",
  "bg-lime-400",
  "bg-emerald-400",
  "bg-green-500",
]

function getAccuracyIntensity(rate: number | null): number {
  if (rate === null) return 0
  if (rate === 0) return 1
  if (rate <= 25) return 2
  if (rate <= 50) return 3
  if (rate <= 75) return 4
  if (rate < 100) return 5
  return 6
}

export function AccuracyHeatmap({ data, today, gameFilter, onSelectDate }: AccuracyHeatmapProps) {
  const calendar = useMemo(() => {
    const todayDate = new Date(`${today}T12:00:00`)
    const weeks = 20
    const totalDays = weeks * 7

    const rawStart = subDays(todayDate, totalDays)
    const start = startOfWeek(rawStart, { weekStartsOn: 0 })

    const days: {
      date: string
      rate: number | null
      intensity: number
      dayOfWeek: number
      week: number
    }[] = []
    let currentDate = start

    for (let w = 0; w <= weeks; w++) {
      for (let d = 0; d < 7; d++) {
        const dateKey = format(currentDate, "yyyy-MM-dd")
        if (dateKey <= today) {
          const rate = getWinRateForDate(data, dateKey, gameFilter)
          days.push({
            date: dateKey,
            rate,
            intensity: getAccuracyIntensity(rate),
            dayOfWeek: d,
            week: w,
          })
        }
        currentDate = addDays(currentDate, 1)
      }
    }

    return { days, weeks }
  }, [data, today, gameFilter])

  const weeks = new Map<number, typeof calendar.days>()
  for (const day of calendar.days) {
    const arr = weeks.get(day.week) || []
    arr.push(day)
    weeks.set(day.week, arr)
  }

  return (
    <div className="card-surface rounded-xl p-4">
      <SectionHeading className="mb-3" help={HELP_TEXT.accuracy} icon={Target}>
        Accuracy
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
                    return <div key={dow} className="h-5 w-5" />
                  }
                  const tooltip =
                    day.rate !== null
                      ? `${day.date}: ${day.rate}% accuracy`
                      : `${day.date}: no games`
                  return (
                    <button
                      type="button"
                      key={day.date}
                      onClick={() => onSelectDate?.(day.date)}
                      className="flex h-5 w-5 items-center justify-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      title={tooltip}
                      aria-label={tooltip}
                    >
                      <span
                        className={`h-3 w-3 rounded-sm ${ACCURACY_CLASSES[day.intensity]} ${day.date === today ? "ring-1 ring-foreground/50" : ""}`}
                      />
                    </button>
                  )
                })}
              </div>
            ))}
        </div>
        <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground/70">
          <span>0%</span>
          {ACCURACY_CLASSES.slice(1).map((cls, i) => (
            <div key={i} className={`h-2.5 w-2.5 rounded-sm ${cls}`} />
          ))}
          <span>100%</span>
        </div>
      </div>
    </div>
  )
}
