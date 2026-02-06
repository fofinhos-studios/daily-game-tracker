import { useState } from "react"
import { PasteInput } from "@/components/input/PasteInput"
import { Header } from "@/components/layout/Header"
import { PageShell } from "@/components/layout/PageShell"
import { SupportedGames } from "@/components/layout/SupportedGames"
import { SharePreview } from "@/components/share/SharePreview"
import { CalendarHeatmap } from "@/components/stats/CalendarHeatmap"
import { SuccessRateList } from "@/components/stats/SuccessRateList"
import { DailySummary } from "@/components/summary/DailySummary"
import { useGameStore } from "@/hooks/useGameStore"
import { useToday } from "@/hooks/useToday"
import { formatDateDisplay } from "@/lib/dates"

type Tab = "summary" | "share"

export default function App() {
  const today = useToday()
  const store = useGameStore()
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>("summary")

  const viewDate = selectedDate || today
  const entry = store.getEntry(viewDate)
  const isToday = viewDate === today

  const handleSelectDate = (date: string) => {
    setSelectedDate(date === today ? null : date)
    setActiveTab("summary")
  }

  const handleDatesAffected = (dates: string[]) => {
    if (dates.length === 1 && dates[0] === today) return
    if (dates.length > 0) {
      const target = dates.includes(today) ? today : dates[0]!
      setSelectedDate(target === today ? null : target)
      setActiveTab("summary")
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "summary", label: "Today" },
    { id: "share", label: "Share" },
  ]

  return (
    <PageShell>
      <Header today={today} />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <SupportedGames />

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left column */}
          <div className="space-y-6 animate-fade-in-up delay-1">
            <section>
              <h2 className="section-heading mb-3">Paste Results</h2>
              <PasteInput onResults={store.addResults} onDatesAffected={handleDatesAffected} />
            </section>

            <section>
              <h2 className="section-heading mb-3">Win Rates</h2>
              <div className="card-surface rounded-xl p-4">
                <SuccessRateList data={store.data} />
              </div>
            </section>
          </div>

          {/* Right column */}
          <div className="space-y-4 animate-fade-in-up delay-2">
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
              {activeTab === "summary" && (
                <div className="space-y-3">
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
                  <DailySummary entry={entry} onRemove={store.removeResult} date={viewDate} />
                </div>
              )}

              {activeTab === "share" && <SharePreview entry={entry} />}
            </div>
          </div>
        </div>

        {/* Activity heatmap — full width below grid */}
        <section className="mt-6 animate-fade-in-up delay-3">
          <h2 className="section-heading mb-3">Activity</h2>
          <CalendarHeatmap data={store.data} today={today} onSelectDate={handleSelectDate} />
        </section>
      </main>
    </PageShell>
  )
}
