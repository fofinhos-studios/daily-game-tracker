import { CircleHelp } from "lucide-react"
import { useCallback, useId, useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useI18n } from "@/i18n/I18nProvider"

interface InfoTipProps {
  label: string
  text: string
}

export function InfoTip({ label, text }: InfoTipProps) {
  const { t } = useI18n()
  const tooltipId = useId()
  const triggerRef = useRef<HTMLSpanElement>(null)
  const tooltipRef = useRef<HTMLSpanElement>(null)
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current
    const tooltip = tooltipRef.current
    if (!trigger || !tooltip) return

    const triggerRect = trigger.getBoundingClientRect()
    const tooltipRect = tooltip.getBoundingClientRect()
    const gap = 8
    const edge = 16

    let top = triggerRect.bottom + gap
    if (top + tooltipRect.height > window.innerHeight - edge) {
      top = triggerRect.top - tooltipRect.height - gap
    }

    const centeredLeft = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
    const left = Math.max(
      edge,
      Math.min(centeredLeft, window.innerWidth - tooltipRect.width - edge),
    )

    setPosition({ top: Math.max(edge, top), left })
  }, [])

  useLayoutEffect(() => {
    if (!open) return

    updatePosition()
    window.addEventListener("resize", updatePosition)
    window.addEventListener("scroll", updatePosition, true)

    return () => {
      window.removeEventListener("resize", updatePosition)
      window.removeEventListener("scroll", updatePosition, true)
    }
  }, [open, updatePosition])

  return (
    <span ref={triggerRef} className="inline-flex">
      <button
        type="button"
        aria-label={t.about(label)}
        aria-describedby={open ? tooltipId : undefined}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="rounded-full text-muted-foreground/60 transition-colors hover:text-primary focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <CircleHelp className="h-3.5 w-3.5" />
      </button>
      {open &&
        createPortal(
          <span
            ref={tooltipRef}
            id={tooltipId}
            role="tooltip"
            className="pointer-events-none fixed z-[100] w-64 max-w-[calc(100vw-2rem)] rounded-lg border border-border bg-card px-3 py-2 text-left text-xs font-normal normal-case tracking-normal text-card-foreground shadow-lg"
            style={{ top: position.top, left: position.left }}
          >
            {text}
          </span>,
          document.body,
        )}
    </span>
  )
}
