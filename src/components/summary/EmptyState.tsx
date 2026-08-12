import { ClipboardPaste } from "lucide-react"
import { useI18n } from "@/i18n/I18nProvider"

interface EmptyStateProps {
  isToday: boolean
}

export function EmptyState({ isToday }: EmptyStateProps) {
  const { t } = useI18n()
  return (
    <div className="card-surface rounded-xl px-6 py-7 text-center">
      <div className="flex flex-col items-center justify-center">
        <ClipboardPaste className="mb-3 h-8 w-8 text-muted-foreground/40" />
        <p className="text-sm font-bold text-muted-foreground">
          {isToday ? t.results.emptyToday : t.results.emptyDay}
        </p>
        <p className="mt-1 text-xs text-muted-foreground/60">{t.results.emptyHint}</p>
        <button
          type="button"
          onClick={() => document.getElementById("game-results-input")?.focus()}
          className="mt-3 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-primary-foreground"
        >
          {t.results.paste}
        </button>
      </div>
    </div>
  )
}
