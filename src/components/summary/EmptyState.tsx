import { ClipboardPaste } from "lucide-react"

export function EmptyState() {
  return (
    <div className="relative glass rounded-2xl noise overflow-hidden px-6 py-12 text-center">
      <div className="relative z-10 flex flex-col items-center justify-center">
        <ClipboardPaste className="mb-3 h-8 w-8 text-muted-foreground/60" />
        <p className="text-sm font-bold text-muted-foreground">No games yet today</p>
        <p className="mt-1 text-xs font-light text-muted-foreground/60">
          Paste your game results above to get started
        </p>
      </div>
    </div>
  )
}
