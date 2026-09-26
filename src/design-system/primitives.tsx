import { type Icon, XIcon } from "@phosphor-icons/react"
import {
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
  useId,
  useRef,
} from "react"
import { useDialogFocus } from "@/hooks/useDialogFocus"
import { cn } from "@/lib/utils"

export function Button({
  variant = "secondary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost"
}) {
  return (
    <button
      type="button"
      data-variant={variant}
      className={cn("ds-button", className)}
      {...props}
    />
  )
}
export function Panel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("ds-panel", className)} {...props} />
}
export function Label({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("ds-label", className)} {...props} />
}
export function TextArea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn("ds-field", className)} {...props} />
}
export function ScrollRegion({
  label,
  children,
  className,
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    // biome-ignore lint/a11y/noNoninteractiveTabindex: Scrollable content needs keyboard access (WCAG 2.1.1).
    <section aria-label={label} tabIndex={0} className={className}>
      {children}
    </section>
  )
}
export function Message({
  tone = "success",
  children,
}: {
  tone?: "success" | "error"
  children: ReactNode
}) {
  return (
    <output className="ds-message" data-tone={tone} aria-live="polite">
      {children}
    </output>
  )
}

export function Tabs<T extends string>({
  items,
  value,
  onChange,
  label,
  id,
}: {
  items: { id: T; label: string; icon: Icon }[]
  value: T
  onChange: (value: T) => void
  label: string
  id: string
}) {
  return (
    <div className="ds-tabs" role="tablist" aria-label={label}>
      {items.map((item, index) => (
        <button
          type="button"
          className="ds-tab"
          key={item.id}
          role="tab"
          id={`${id}-${item.id}`}
          aria-controls={`${id}-panel`}
          aria-selected={value === item.id}
          tabIndex={value === item.id ? 0 : -1}
          onClick={() => onChange(item.id)}
          onKeyDown={(event) => {
            const next =
              event.key === "ArrowRight"
                ? (index + 1) % items.length
                : event.key === "ArrowLeft"
                  ? (index + items.length - 1) % items.length
                  : event.key === "Home"
                    ? 0
                    : event.key === "End"
                      ? items.length - 1
                      : -1
            if (next < 0) return
            event.preventDefault()
            onChange(items[next]!.id)
            document.getElementById(`${id}-${items[next]!.id}`)?.focus()
          }}
        >
          <item.icon size={18} aria-hidden="true" />
          {item.label}
        </button>
      ))}
    </div>
  )
}

export function Dialog({
  title,
  closeLabel,
  onClose,
  children,
}: {
  title: string
  closeLabel: string
  onClose: () => void
  children: ReactNode
}) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  useDialogFocus(dialogRef, onClose)
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: Backdrop dismissal supplements the keyboard-accessible close button and Escape.
    <div
      className="ds-dialog-overlay"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="ds-dialog"
        tabIndex={-1}
      >
        <div className="ds-dialog-header">
          <h2 id={titleId}>{title}</h2>
          <Button className="ds-icon-button" onClick={onClose} aria-label={closeLabel}>
            <XIcon size={20} />
          </Button>
        </div>
        {children}
      </div>
    </div>
  )
}
