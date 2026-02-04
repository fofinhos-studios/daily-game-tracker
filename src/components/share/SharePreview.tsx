import { generateShareMessage } from "@/lib/message"
import type { DayEntry } from "@/types/games"
import { CopyButton } from "./CopyButton"

interface SharePreviewProps {
  entry: DayEntry | undefined
}

export function SharePreview({ entry }: SharePreviewProps) {
  if (!entry || entry.results.length === 0) {
    return (
      <div className="glass rounded-2xl px-6 py-8 text-center">
        <p className="text-xs font-light text-muted-foreground/60">
          Your shareable message will appear here
        </p>
      </div>
    )
  }

  const message = generateShareMessage(entry)

  return (
    <div className="space-y-3">
      <div className="relative glass rounded-2xl noise overflow-hidden p-4">
        <pre className="relative z-10 whitespace-pre-wrap font-mono text-xs leading-relaxed text-foreground/80">
          {message}
        </pre>
      </div>
      <CopyButton text={message} />
    </div>
  )
}
