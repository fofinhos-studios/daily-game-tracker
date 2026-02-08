import { generateShareMessage } from "@/lib/message"
import type { DayEntry } from "@/types/games"
import { CopyButton } from "./CopyButton"

interface SharePreviewProps {
  entry: DayEntry | undefined
}

export function SharePreview({ entry }: SharePreviewProps) {
  if (!entry || entry.results.length === 0) {
    return null
  }

  const message = generateShareMessage(entry)

  return (
    <div className="card-surface rounded-xl p-4 space-y-3">
      <h3 className="section-heading">Share</h3>
      <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-foreground/80">
        {message}
      </pre>
      <CopyButton text={message} />
    </div>
  )
}
