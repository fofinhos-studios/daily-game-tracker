import { CircleHelp } from "lucide-react"

interface InfoTipProps {
  label: string
  text: string
}

export function InfoTip({ label, text }: InfoTipProps) {
  return (
    <span className="group/info relative inline-flex">
      <button
        type="button"
        aria-label={`About ${label}`}
        className="rounded-full text-muted-foreground/60 transition-colors hover:text-primary focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <CircleHelp className="h-3.5 w-3.5" />
      </button>
      <span
        role="tooltip"
        className="pointer-events-none invisible absolute left-1/2 top-full z-40 mt-2 w-64 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-lg border border-border bg-card px-3 py-2 text-left text-xs font-normal normal-case tracking-normal text-card-foreground opacity-0 shadow-lg transition-all group-hover/info:visible group-hover/info:opacity-100 group-focus-within/info:visible group-focus-within/info:opacity-100"
      >
        {text}
      </span>
    </span>
  )
}
