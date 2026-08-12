import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ClipboardPaste,
  Gamepad2,
  RotateCcw,
  Target,
} from "lucide-react"
import { useMemo, useState } from "react"
import { BackupModal } from "@/components/backup/BackupModal"
import { GameFilter } from "@/components/filters/GameFilter"
import { SectionHeading } from "@/components/help/SectionHeading"
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
import { useI18n } from "@/i18n/I18nProvider"
import { formatDateDisplay } from "@/lib/dates"
import { createManualLoss, type GameType } from "@/types/games"

type Tab = "results" | "activity" | "accuracy"

export default function App() {
  const today = useToday()
  const { locale, t } = useI18n()
  const store = useGameStore()
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>("results")
  const [gameFilter, setGameFilter] = useState<Set<GameType>>(new Set())
  const [showSupportedGames, setShowSupportedGames] = useState(false)
  const [showBackup, setShowBackup] = useState(false)

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

  const tabs = [
    {
      id: "results" as const,
      label: isToday ? t.app.todayResults : t.app.results,
      icon: CheckCircle2,
    },
    { id: "activity" as const, label: t.app.activity, icon: CalendarDays },
    { id: "accuracy" as const, label: t.app.accuracy, icon: Target },
  ]

  return (
    <PageShell>
      <Header today={today} onOpenBackup={() => setShowBackup(true)} />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between animate-fade-in-up delay-1">
          <SectionHeading help={t.help.pasteResults} icon={ClipboardPaste}>
            {t.app.pasteResults}
          </SectionHeading>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
            {availableGames.length > 0 && (
              <div className="w-full sm:w-64">
                <GameFilter
                  availableGames={availableGames}
                  selected={gameFilter}
                  onChange={setGameFilter}
                />
              </div>
            )}
            <button
              type="button"
              onClick={() => setShowSupportedGames(true)}
              title={t.app.supportedGamesDescription}
              className="inline-flex min-h-10 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
            >
              <Gamepad2 aria-hidden="true" className="h-3.5 w-3.5" />
              {t.app.supportedGames}
            </button>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left column: Paste + Share preview */}
          <div className="space-y-6 animate-fade-in-up delay-1">
            <PasteInput onResults={store.addResults} onDatesAffected={handleDatesAffected} />

            <SharePreview entry={todayEntry} />
          </div>

          {/* Right column: Results overview with tabs */}
          <div className="space-y-4 animate-fade-in-up delay-2">
            {/* Tabs */}
            <div className="flex gap-1 rounded-lg border border-border bg-muted p-1">
              {tabs.map((tab) => (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  title={
                    tab.id === "results"
                      ? t.app.reviewResults
                      : tab.id === "activity"
                        ? t.help.activity
                        : t.help.accuracy
                  }
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
                    activeTab === tab.id
                      ? "bg-card text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <tab.icon aria-hidden="true" className="h-3.5 w-3.5" />
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
                      <p className="text-xs text-muted-foreground">
                        {formatDateDisplay(viewDate, locale)}
                      </p>
                      <button
                        type="button"
                        onClick={() => setSelectedDate(null)}
                        className="text-xs text-primary hover:text-primary/80 font-bold"
                      >
                        <RotateCcw aria-hidden="true" className="mr-1 inline h-3.5 w-3.5" />
                        {t.app.backToToday}
                      </button>
                    </div>
                  )}
                  <DailySummary
                    entry={entry}
                    onRemove={store.removeResult}
                    date={viewDate}
                    gameFilter={gameFilter}
                    onMarkLoss={(gameType) =>
                      store.addResults([createManualLoss(gameType, viewDate)])
                    }
                  />
                  <div className="card-surface rounded-xl p-4">
                    <SectionHeading className="mb-3" help={t.help.winRates} icon={BarChart3}>
                      {t.app.winRates}
                    </SectionHeading>
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

      {showSupportedGames && <SupportedGamesModal onClose={() => setShowSupportedGames(false)} />}
      {showBackup && (
        <BackupModal
          data={store.data}
          onClose={() => setShowBackup(false)}
          onMerge={store.mergeData}
          onReplace={store.replaceData}
        />
      )}
    </PageShell>
  )
}
