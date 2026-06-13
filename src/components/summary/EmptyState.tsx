import { ClipboardPaste } from "lucide-react"

export function EmptyState() {
  return (
    <div className="card-surface rounded-xl px-6 py-12 text-center">
      <div className="flex flex-col items-center justify-center">
        <ClipboardPaste className="mb-3 h-8 w-8 text-muted-foreground/40" />
        <p className="text-sm font-bold text-muted-foreground">No games yet today</p>
        <p className="mt-1 text-xs text-muted-foreground/60">
          Paste a result or mark a loss to get started
        </p>
      </div>
    </div>
  )
}
