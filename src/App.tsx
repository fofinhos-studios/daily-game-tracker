import {
  ArrowUpRightIcon,
  ChartBarIcon as BarChart3,
  CalendarDotsIcon as CalendarDays,
  CheckCircleIcon as CheckCircle2,
  ClipboardTextIcon as ClipboardPaste,
  GameControllerIcon as Gamepad2,
  HardDrivesIcon,
  ArrowCounterClockwiseIcon as RotateCcw,
  TargetIcon as Target,
} from "@phosphor-icons/react"
import { useCallback, useMemo, useState } from "react"
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
import { industrialCopy } from "@/design-system/copy"
import { Button, Label, Panel, Tabs } from "@/design-system/primitives"
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

  const closeSupportedGames = useCallback(() => setShowSupportedGames(false), [])

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

  const copy = industrialCopy[locale]
  return (
    <PageShell>
      <Header today={today} onOpenBackup={() => setShowBackup(true)} />
      <main className="workspace">
        <div className="workspace-tools">
          {availableGames.length > 0 && (
            <div className="w-52 max-w-full">
              <GameFilter
                availableGames={availableGames}
                selected={gameFilter}
                onChange={setGameFilter}
              />
            </div>
          )}
          <Button
            onClick={() => setShowSupportedGames(true)}
            title={t.app.supportedGamesDescription}
          >
            <Gamepad2 size={18} aria-hidden="true" />
            {t.app.supportedGames}
            <ArrowUpRightIcon size={16} aria-hidden="true" />
          </Button>
        </div>
        <div className="workspace-grid">
          <Panel className="workspace-input paste-panel space-y-4">
            <SectionHeading help={t.help.pasteResults} icon={ClipboardPaste}>
              {t.app.pasteResults}
            </SectionHeading>
            <PasteInput onResults={store.addResults} onDatesAffected={handleDatesAffected} />
          </Panel>
          <section className="workspace-results space-y-5" aria-label={t.app.reviewResults}>
            <Tabs
              id="overview"
              label={t.app.reviewResults}
              items={tabs}
              value={activeTab}
              onChange={setActiveTab}
            />
            <div id="overview-panel" role="tabpanel" aria-labelledby={`overview-${activeTab}`}>
              {activeTab === "results" && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Label>{formatDateDisplay(viewDate, locale)}</Label>
                    {!isToday && (
                      <Button variant="ghost" onClick={() => setSelectedDate(null)}>
                        <RotateCcw size={16} aria-hidden="true" />
                        {t.app.backToToday}
                      </Button>
                    )}
                  </div>
                  <DailySummary
                    entry={entry}
                    onRemove={store.removeResult}
                    date={viewDate}
                    gameFilter={gameFilter}
                    onMarkLoss={(gameType) =>
                      store.addResults([createManualLoss(gameType, viewDate)])
                    }
                  />
                  <Panel>
                    <SectionHeading className="mb-4" help={t.help.winRates} icon={BarChart3}>
                      {t.app.winRates}
                    </SectionHeading>
                    <SuccessRateList data={store.data} gameFilter={gameFilter} />
                  </Panel>
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
          </section>
          <div className="workspace-share">
            <SharePreview entry={todayEntry} />
          </div>
        </div>
      </main>
      <footer className="app-footer">
        <span className="inline-flex items-center gap-2">
          <HardDrivesIcon size={16} aria-hidden="true" />
          {copy.local}
        </span>
      </footer>
      {showSupportedGames && <SupportedGamesModal onClose={closeSupportedGames} />}
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
