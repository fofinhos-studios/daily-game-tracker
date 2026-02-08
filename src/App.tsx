import { useMemo, useState } from "react"
import { GameFilter } from "@/components/filters/GameFilter"
import { PasteInput } from "@/components/input/PasteInput"
import { Header } from "@/components/layout/Header"
import { PageShell } from "@/components/layout/PageShell"
import { SupportedGamesModal } from "@/components/layout/SupportedGamesModal"
import { SharePreview } from "@/components/share/SharePreview"
import { AccuracyHeatmap } from "@/components/stats/AccuracyHeatmap"
import { CalendarHeatmap } from "@/components/stats/CalendarHeatmap"
import { SuccessRateList } from "@/components/stats/SuccessRateList"
import { DailySummary } from "@/components/summary/DailySummary"
import { useGameStore } from "@/hooks/useGameStore"
import { useToday } from "@/hooks/useToday"
import { formatDateDisplay } from "@/lib/dates"
import type { GameType } from "@/types/games"

type Tab = "results" | "activity" | "accuracy"

export default function App() {
  const today = useToday()
  const store = useGameStore()
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>("results")
  const [gameFilter, setGameFilter] = useState<Set<GameType>>(new Set())
  const [showSupportedGames, setShowSupportedGames] = useState(false)

  const viewDate = selectedDate || today
  const entry = store.getEntry(viewDate)
  const todayEntry = store.getEntry(today)
  const isToday = viewDate === today

  const availableGames = useMemo(() => {
    const games = new Set<GameType>()
    for (const e of Object.values(store.data.entries)) {
      for (const r of e.results) {
        games.add(r.gameType)
      }
    }
    return Array.from(games)
  }, [store.data])

  const handleSelectDate = (date: string) => {
    setSelectedDate(date === today ? null : date)
    setActiveTab("results")
  }

  const handleDatesAffected = (dates: string[]) => {
    if (dates.length === 1 && dates[0] === today) return
    if (dates.length > 0) {
      const target = dates.includes(today) ? today : dates[0]!
      setSelectedDate(target === today ? null : target)
      setActiveTab("results")
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "results", label: "Today's Results" },
    { id: "activity", label: "Activity" },
    { id: "accuracy", label: "Accuracy" },
  ]

  return (
    <PageShell>
      <Header today={today} />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left column: Paste + Share preview */}
          <div className="space-y-6 animate-fade-in-up delay-1">
            <section>
              <h2 className="section-heading mb-3">Paste Results</h2>
              <PasteInput onResults={store.addResults} onDatesAffected={handleDatesAffected} />
            </section>

            <SharePreview entry={todayEntry} />
          </div>

          {/* Right column: Results overview with tabs */}
          <div className="space-y-4 animate-fade-in-up delay-2">
            {/* Header row: filter + supported games button */}
            <div className="flex items-start gap-3">
              <div className="flex-1">
                {availableGames.length > 0 && (
                  <GameFilter
                    availableGames={availableGames}
                    selected={gameFilter}
                    onChange={setGameFilter}
                  />
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowSupportedGames(true)}
                className="shrink-0 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground hover:border-primary/30"
              >
                Supported Games
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 rounded-lg border border-border bg-muted p-1">
              {tabs.map((tab) => (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
                    activeTab === tab.id
                      ? "bg-card text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="animate-fade-in">
              {activeTab === "results" && (
                <div className="space-y-4">
                  {!isToday && (
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">{formatDateDisplay(viewDate)}</p>
                      <button
                        type="button"
                        onClick={() => setSelectedDate(null)}
                        className="text-xs text-primary hover:text-primary/80 font-bold"
                      >
                        Back to today
                      </button>
                    </div>
                  )}
                  <DailySummary
                    entry={entry}
                    onRemove={store.removeResult}
                    date={viewDate}
                    gameFilter={gameFilter}
                  />
                  <div className="card-surface rounded-xl p-4">
                    <h3 className="section-heading mb-3">Win Rates</h3>
                    <SuccessRateList data={store.data} gameFilter={gameFilter} />
                  </div>
                </div>
              )}

              {activeTab === "activity" && (
                <CalendarHeatmap
                  data={store.data}
                  today={today}
                  gameFilter={gameFilter}
                  onSelectDate={handleSelectDate}
                />
              )}

              {activeTab === "accuracy" && (
                <AccuracyHeatmap
                  data={store.data}
                  today={today}
                  gameFilter={gameFilter}
                  onSelectDate={handleSelectDate}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      {showSupportedGames && (
        <SupportedGamesModal onClose={() => setShowSupportedGames(false)} />
      )}
    </PageShell>
  )
}
