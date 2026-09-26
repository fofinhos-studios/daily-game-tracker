import { ClipboardTextIcon as ClipboardPaste } from "@phosphor-icons/react"
import { Button } from "@/design-system/primitives"
import { useI18n } from "@/i18n/I18nProvider"

interface EmptyStateProps {
  isToday: boolean
}

export function EmptyState({ isToday }: EmptyStateProps) {
  const { t } = useI18n()
  return (
    <div className="empty-ticket">
      <div className="flex flex-col items-start gap-2">
        <ClipboardPaste className="mb-3 h-12 w-12 text-foreground" />
        <p className="ds-display text-2xl text-foreground">
          {isToday ? t.results.emptyToday : t.results.emptyDay}
        </p>
        <Button
          variant="primary"
          type="button"
          onClick={() => document.getElementById("game-results-input")?.focus()}
          className="mt-3 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-primary-foreground"
        >
          {t.results.paste}
        </Button>
      </div>
    </div>
  )
}
