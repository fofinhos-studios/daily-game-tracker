import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckCircleIcon,
  TrashIcon,
  XCircleIcon,
} from "@phosphor-icons/react"
import { GameIcon } from "@/components/input/GameIcon"
import { industrialCopy } from "@/design-system/copy"
import { GAME_VISUALS, gameStyle } from "@/design-system/games"
import { Button, Label } from "@/design-system/primitives"
import { resultEditions, resultMetrics } from "@/design-system/result-presentation"
import { useI18n } from "@/i18n/I18nProvider"
import { GAME_LABELS, type GameResult, type GameType } from "@/types/games"
import { ResultGrid } from "./ResultGrid"

interface GameResultCardProps {
  result: GameResult
  onRemove: (gameType: GameType) => void
  canMoveUp?: boolean
  canMoveDown?: boolean
  onMoveUp?: () => void
  onMoveDown?: () => void
}
export function GameResultCard({
  result,
  onRemove,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
}: GameResultCardProps) {
  const { t, locale } = useI18n()
  const copy = industrialCopy[locale]
  const metrics = resultMetrics(result)
  const editions = resultEditions(result)
  const Status = result.won ? CheckCircleIcon : XCircleIcon
  const name = GAME_LABELS[result.gameType]
  return (
    <article className="ticket" style={gameStyle(result.gameType)} aria-label={name}>
      <div className="ticket-stub">
        <GameIcon gameType={result.gameType} />
        <span className="ticket-code" aria-hidden="true">
          {GAME_VISUALS[result.gameType].code}
        </span>
        {editions.length > 0 && (
          <div className="ticket-editions" data-multiple={editions.length > 1}>
            <Label>{copy.edition}</Label>
            <ul className="ticket-edition-list">
              {editions.map((edition, index) => (
                <li key={`${edition.mode ?? "edition"}-${index}`}>
                  {edition.mode && <span className="block">{edition.mode}</span>}
                  <strong>{edition.value}</strong>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="ticket-body">
        <div className="ticket-top">
          <h3 className="ticket-title">{name}</h3>
          <div className="ticket-toolbar">
            <fieldset className="ticket-actions">
              <legend className="sr-only">{t.results.reorder}</legend>
              <Button
                variant="ghost"
                className="ds-icon-button"
                disabled={!canMoveUp}
                onClick={onMoveUp}
                aria-label={t.results.moveUp(name)}
              >
                <ArrowUpIcon size={18} />
              </Button>
              <Button
                variant="ghost"
                className="ds-icon-button"
                disabled={!canMoveDown}
                onClick={onMoveDown}
                aria-label={t.results.moveDown(name)}
              >
                <ArrowDownIcon size={18} />
              </Button>
            </fieldset>
            <Button
              variant="ghost"
              className="ds-icon-button"
              onClick={() => onRemove(result.gameType)}
              aria-label={t.results.remove(name)}
              title={t.results.removeHint(name)}
            >
              <TrashIcon size={18} />
            </Button>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
          <div className="ticket-performance">
            {metrics.map((metric, index) => (
              <div key={metric.mode ?? index}>
                {metric.mode && <p className="mb-1 font-mono text-xs">{metric.mode}</p>}
                <p className="ticket-metric">{metric.value}</p>
                <Label className="text-muted-foreground">{copy[metric.label]}</Label>
              </div>
            ))}
          </div>
          <span className={`ticket-status ${result.won ? "text-success" : "text-destructive"}`}>
            <Status size={18} aria-hidden="true" />
            {result.won ? copy.won : copy.lost}
          </span>
        </div>
        {result.gameType === "conexo" && result.hints > 0 && (
          <p className="mt-2 font-mono text-xs">
            {copy.hints}: {result.hints}
          </p>
        )}
        <ResultGrid result={result} />
      </div>
    </article>
  )
}
