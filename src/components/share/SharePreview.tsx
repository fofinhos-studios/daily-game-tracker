import { ListRestart, Share2 } from "lucide-react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { useI18n } from "@/i18n/I18nProvider"
import { generateShareMessage } from "@/lib/message"
import type { DayEntry } from "@/types/games"
import { SectionHeading } from "../help/SectionHeading"
import { CopyButton } from "./CopyButton"

const STORAGE_KEY = "share-game-names-only"

interface SharePreviewProps {
  entry: DayEntry | undefined
}

export function SharePreview({ entry }: SharePreviewProps) {
  const { t } = useI18n()
  const [gameNamesOnly, setGameNamesOnly] = useLocalStorage(STORAGE_KEY, false)

  if (!entry || entry.results.length === 0) {
    return null
  }

  const message = generateShareMessage(entry, { gameNamesOnly })

  return (
    <div className="card-surface rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <SectionHeading help={t.help.share} icon={Share2}>
          {t.share.title}
        </SectionHeading>
        <label
          className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground"
          title={t.share.gameNamesOnlyHint}
        >
          <input
            type="checkbox"
            checked={gameNamesOnly}
            onChange={(event) => setGameNamesOnly(event.target.checked)}
            className="accent-primary"
          />
          <ListRestart aria-hidden="true" className="h-3.5 w-3.5" />
          {t.share.gameNamesOnly}
        </label>
      </div>
      <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-foreground/80">
        {message}
      </pre>
      <CopyButton text={message} />
    </div>
  )
}
