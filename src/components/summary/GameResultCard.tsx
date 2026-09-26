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
import { resultMetric } from "@/design-system/result-presentation"
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
  const metric = resultMetric(result)
  const Status = result.won ? CheckCircleIcon : XCircleIcon
  const name = GAME_LABELS[result.gameType]
  return (
    <article
      className="ticket"
      style={gameStyle(result.gameType)}
      aria-label={`${name} / ${result.date}`}
    >
      <div className="ticket-stub" aria-hidden="true">
        <GameIcon gameType={result.gameType} />
        <span className="ticket-code">{GAME_VISUALS[result.gameType].code}</span>
        <span className="ds-label ticket-stub-label">
          MINIGĒMU
          <br />
          {result.date.slice(0, 4)}
        </span>
      </div>
      <div className="ticket-body">
        <div className="ticket-top">
          <div>
            <Label className="text-muted-foreground">{copy.ticket}</Label>
            <h3 className="ticket-title mt-1">{name}</h3>
          </div>
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
        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="ticket-metric">{metric.value}</p>
            <Label className="text-muted-foreground">{copy[metric.label]}</Label>
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
        <div className="ticket-bottom">
          <time dateTime={result.date} className="font-mono text-xs">
            {result.date.split("-").reverse().join(".")}
          </time>
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
        </div>
      </div>
    </article>
  )
}
