import { useState } from "react"
import { useGameStore } from "@/hooks/useGameStore"
import { useToday } from "@/hooks/useToday"
import { PageShell } from "@/components/layout/PageShell"
import { Header } from "@/components/layout/Header"
import { PasteInput } from "@/components/input/PasteInput"
import { DailySummary } from "@/components/summary/DailySummary"
import { SharePreview } from "@/components/share/SharePreview"
import { CalendarHeatmap } from "@/components/stats/CalendarHeatmap"
import { SuccessRateList } from "@/components/stats/SuccessRateList"
import { formatDateDisplay } from "@/lib/dates"
import { Calendar, BarChart3, Share2, Gamepad2 } from "lucide-react"

type Tab = "summary" | "share" | "stats"

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
    { id: "stats", label: "Stats", icon: <BarChart3 className="h-3.5 w-3.5" /> },
  ]

  return (
    <PageShell>
      <Header today={today} />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left column */}
        <div className="space-y-6 animate-fade-in-up delay-1">
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Paste Results
            </h2>
            <PasteInput onResults={store.addResults} onDatesAffected={handleDatesAffected} />
          </section>

          <section>
            <div className="mb-3 flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Activity
              </h2>
            </div>
            <CalendarHeatmap
              data={store.data}
              today={today}
              onSelectDate={handleSelectDate}
            />
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-4 animate-fade-in-up delay-2">
          {/* Tabs */}
          <div className="flex gap-1 rounded-lg bg-muted/30 p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? "bg-card text-foreground shadow-sm"
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
                    <p className="text-xs text-muted-foreground">
                      {formatDateDisplay(viewDate)}
                    </p>
                    <button
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
                />
              </div>
            )}

            {activeTab === "share" && (
              <SharePreview entry={entry} />
            )}

            {activeTab === "stats" && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Win Rates
                </h3>
                <SuccessRateList data={store.data} />
              </div>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  )
}
