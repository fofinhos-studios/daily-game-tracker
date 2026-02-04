import { ClipboardPaste } from "lucide-react"

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/50 bg-card/30 px-6 py-12 text-center">
      <ClipboardPaste className="mb-3 h-8 w-8 text-muted-foreground/40" />
      <p className="text-sm font-bold text-muted-foreground/60">No games yet today</p>
      <p className="mt-1 text-xs font-light text-muted-foreground/40">
        Paste your game results above to get started
      </p>
    </div>
  )
}
