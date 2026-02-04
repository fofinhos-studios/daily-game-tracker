import { Calendar, Gamepad2, Share2, X } from "lucide-react"
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
  const [gamesOpen, setGamesOpen] = useState(false)
  const [statsOpen, setStatsOpen] = useState(false)

  const viewDate = selectedDate || today
  const entry = store.getEntry(viewDate)
  const isToday = viewDate === today

  const handleSelectDate = (date: string) => {
    setSelectedDate(date === today ? null : date)
    setActiveTab("summary")
  }

  const handleDatesAffected = (dates: string[]) => {
    // If all results landed on today, stay on today.
    // Otherwise navigate to the first affected date so the user sees them.
    if (dates.length === 1 && dates[0] === today) return
    if (dates.length > 0) {
      const target = dates.includes(today) ? today : dates[0]!
      setSelectedDate(target === today ? null : target)
      setActiveTab("summary")
    }
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "summary", label: "Today", icon: <Gamepad2 className="h-3.5 w-3.5" /> },
    { id: "share", label: "Share", icon: <Share2 className="h-3.5 w-3.5" /> },
  ]

  return (
    <PageShell>
      <Header
        today={today}
        onToggleGames={() => setGamesOpen((v) => !v)}
        onToggleStats={() => setStatsOpen((v) => !v)}
        gamesOpen={gamesOpen}
        statsOpen={statsOpen}
      />

      {/* Main content — single column */}
      <main className="mx-auto max-w-2xl space-y-6 px-4 py-8 sm:px-6">
        {/* Paste input — hero */}
        <section className="animate-fade-in-up delay-0">
          <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Paste Results
          </h2>
          <PasteInput onResults={store.addResults} onDatesAffected={handleDatesAffected} />
        </section>

        {/* Tabs */}
        <div className="animate-fade-in-up delay-1 space-y-4">
          <div className="flex gap-1 glass rounded-xl p-1">
            {tabs.map((tab) => (
              <button
                type="button"
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? "bg-foreground/10 text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground/70"
                }`}
              >
                {tab.icon}
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

        {/* Calendar heatmap */}
        <section className="animate-fade-in-up delay-2">
          <div className="mb-3 flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Activity
            </h2>
          </div>
          <CalendarHeatmap data={store.data} today={today} onSelectDate={handleSelectDate} />
        </section>
      </main>

      {/* Supported games popover */}
      <SupportedGames open={gamesOpen} onClose={() => setGamesOpen(false)} />

      {/* Stats drawer */}
      {statsOpen && (
        <div className="fixed inset-y-0 right-0 z-[55] flex">
          {/* Backdrop */}
          <button
            type="button"
            tabIndex={-1}
            className="fixed inset-0 bg-background/40 animate-fade-in cursor-default"
            onClick={() => setStatsOpen(false)}
            aria-label="Close stats"
          />
          {/* Drawer panel */}
          <div className="relative ml-auto h-full w-80 glass-strong animate-slide-in-right overflow-y-auto">
            <div className="p-5">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  Win Rates
                </h2>
                <button
                  type="button"
                  onClick={() => setStatsOpen(false)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close stats"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <SuccessRateList data={store.data} />
            </div>
          </div>
        </div>
      )}
    </PageShell>
  )
}
