import {
  AsteriskSimpleIcon,
  CalendarDotsIcon,
  CheckCircleIcon,
  TargetIcon,
} from "@phosphor-icons/react"
import { useCallback, useEffect, useState } from "react"
import { BackupModal } from "@/components/backup/BackupModal"
import { GameFilter } from "@/components/filters/GameFilter"
import { GameBadge } from "@/components/input/GameBadge"
import { PasteInput } from "@/components/input/PasteInput"
import { SupportedGamesModal } from "@/components/layout/SupportedGamesModal"
import { CopyButton } from "@/components/share/CopyButton"
import { AccuracyHeatmap } from "@/components/stats/AccuracyHeatmap"
import { CalendarHeatmap } from "@/components/stats/CalendarHeatmap"
import { EmptyState } from "@/components/summary/EmptyState"
import { GameResultCard } from "@/components/summary/GameResultCard"
import { ScrollRegion } from "@/design-system/primitives"
import { useI18n } from "@/i18n/I18nProvider"
import { generateShareMessage } from "@/lib/message"
import {
  type AppData,
  createManualLoss,
  GAME_ORDER,
  type GameResult,
  type GameType,
} from "@/types/games"
import { industrialCopy } from "./copy"
import { DEMO_DATE, demoResults } from "./demo"
import { Button, Label, Message, Panel, Tabs, TextArea } from "./primitives"

export default function Catalog() {
  const { t, locale, setLocale } = useI18n()
  const copy = industrialCopy[locale]
  const [theme, setTheme] = useState("light")
  const [results, setResults] = useState(demoResults)
  const [filter, setFilter] = useState<Set<GameType>>(new Set())
  const [dialog, setDialog] = useState<"games" | "backup" | null>(null)
  const [tab, setTab] = useState("results")
  const close = useCallback(() => setDialog(null), [])
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])
  const entry = { date: DEMO_DATE, results }
  const data: AppData = { version: 1, entries: { [DEMO_DATE]: entry } }
  const addResults = (incoming: GameResult[]) => {
    const replaced = incoming.filter((item) =>
      results.some((existing) => existing.gameType === item.gameType),
    ).length
    setResults((current) => [
      ...current.filter((item) => !incoming.some((newItem) => newItem.gameType === item.gameType)),
      ...incoming,
    ])
    return { added: incoming.length - replaced, replaced }
  }
  return (
    <main className="workspace catalog">
      <header className="workspace-heading">
        <div>
          <Label>MINIGĒMU / DESIGN SYSTEM</Label>
          <h1 className="ds-display mt-2 text-4xl">Industrial.</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {locale === "en"
              ? "Interactive samples. Changes stay in this page."
              : "Amostras interativas. Alterações ficam nesta página."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
            {theme === "light" ? "Dark" : "Light"}
          </Button>
          <Button onClick={() => setLocale(locale === "en" ? "pt-BR" : "en")}>
            {locale === "en" ? "PT" : "EN"}
          </Button>
          <Button onClick={() => setResults(demoResults)}>
            {locale === "en" ? "Reset samples" : "Restaurar amostras"}
          </Button>
        </div>
      </header>
      <section className="catalog-section">
        <h2 className="ds-label">
          {locale === "en" ? "Type & identity" : "Tipografia e identidade"}
        </h2>
        <Panel>
          <div className="flex flex-wrap items-center gap-6">
            <AsteriskSimpleIcon size={56} aria-hidden="true" />
            <span className="font-japanese text-3xl">ミニゲーム</span>
            <span className="ds-display text-4xl">0123456789</span>
            <span className="font-mono">Aa / Çãé / #2026</span>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {GAME_ORDER.map((game) => (
              <GameBadge key={game} gameType={game} />
            ))}
          </div>
        </Panel>
      </section>
      <section className="catalog-section">
        <h2 className="ds-label">
          {locale === "en" ? "Controls & states" : "Controles e estados"}
        </h2>
        <Panel className="space-y-5">
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" onClick={() => setDialog("games")}>
              {t.app.supportedGames}
            </Button>
            <Button onClick={() => setDialog("backup")}>{t.backup.open}</Button>
            <Button
              variant="danger"
              onClick={() => addResults([createManualLoss("framed", DEMO_DATE)])}
            >
              {copy.manual}
            </Button>
            <Button disabled>{locale === "en" ? "Disabled" : "Desativado"}</Button>
          </div>
          <Message>{t.backup.copiedMessage}</Message>
          <Message tone="error">{t.paste.noGamesDetected}</Message>
          <TextArea disabled aria-label="Disabled field" value="MINIGĒMU / 2026" />
        </Panel>
      </section>
      <section className="catalog-section">
        <h2 className="ds-label">{t.app.pasteResults}</h2>
        <Panel>
          <PasteInput onResults={addResults} />
        </Panel>
      </section>
      <div className="max-w-sm">
        <GameFilter availableGames={GAME_ORDER} selected={filter} onChange={setFilter} />
      </div>
      <Tabs
        id="catalog"
        label={t.app.results}
        items={[
          { id: "results", label: t.app.results, icon: CheckCircleIcon },
          { id: "activity", label: t.app.activity, icon: CalendarDotsIcon },
          { id: "accuracy", label: t.app.accuracy, icon: TargetIcon },
        ]}
        value={tab}
        onChange={setTab}
      />
      <div id="catalog-panel" role="tabpanel" aria-labelledby={`catalog-${tab}`}>
        {tab === "results" && (
          <div className="catalog-tickets">
            {results
              .filter((result) => !filter.size || filter.has(result.gameType))
              .map((result) => {
                const index = results.indexOf(result)
                return (
                  <GameResultCard
                    key={result.gameType}
                    result={result}
                    onRemove={(game) =>
                      setResults((current) => current.filter((item) => item.gameType !== game))
                    }
                    canMoveUp={index > 0}
                    canMoveDown={index < results.length - 1}
                    onMoveUp={() =>
                      setResults((current) => {
                        const next = [...current]
                        ;[next[index - 1], next[index]] = [next[index]!, next[index - 1]!]
                        return next
                      })
                    }
                    onMoveDown={() =>
                      setResults((current) => {
                        const next = [...current]
                        ;[next[index], next[index + 1]] = [next[index + 1]!, next[index]!]
                        return next
                      })
                    }
                  />
                )
              })}
          </div>
        )}
        {tab === "activity" && (
          <CalendarHeatmap data={data} today={DEMO_DATE} gameFilter={filter} />
        )}
        {tab === "accuracy" && (
          <AccuracyHeatmap data={data} today={DEMO_DATE} gameFilter={filter} />
        )}
      </div>
      <section className="catalog-section">
        <h2 className="ds-label">{t.share.title}</h2>
        <Panel>
          <ScrollRegion
            label={t.share.title}
            className="share-text whitespace-pre-wrap font-mono text-xs"
          >
            {generateShareMessage(entry)}
          </ScrollRegion>
          <div className="mt-4">
            <CopyButton text={generateShareMessage(entry)} />
          </div>
        </Panel>
        <EmptyState isToday />
      </section>
      {dialog === "games" && <SupportedGamesModal onClose={close} />}
      {dialog === "backup" && (
        <BackupModal
          data={data}
          onClose={close}
          onMerge={(incoming) =>
            addResults(Object.values(incoming.entries).flatMap((day) => day.results))
          }
          onReplace={(incoming) =>
            setResults(Object.values(incoming.entries).flatMap((day) => day.results))
          }
        />
      )}
    </main>
  )
}
