import { Check, Copy, DatabaseBackup, Merge, Replace, X } from "lucide-react"
import { useRef, useState } from "react"
import { useDialogFocus } from "@/hooks/useDialogFocus"
import { useI18n } from "@/i18n/I18nProvider"
import { exportBackup, importBackup } from "@/lib/backup"
import type { AppData } from "@/types/games"

interface BackupModalProps {
  data: AppData
  onClose: () => void
  onMerge: (data: AppData) => void
  onReplace: (data: AppData) => void
}

export function BackupModal({ data, onClose, onMerge, onReplace }: BackupModalProps) {
  const { t } = useI18n()
  const overlayRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const [value, setValue] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useDialogFocus(dialogRef, onClose)

  const parseValue = (): AppData | null => {
    try {
      return importBackup(value)
    } catch (error) {
      setMessage(
        error instanceof Error && error.message === "Unsupported backup version"
          ? t.backup.unsupportedVersion
          : t.backup.invalid,
      )
      return null
    }
  }

  const handleCopy = async () => {
    const backup = exportBackup(data)
    try {
      await navigator.clipboard.writeText(backup)
    } catch {
      const textarea = document.createElement("textarea")
      textarea.value = backup
      textarea.style.position = "fixed"
      textarea.style.opacity = "0"
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
    }
    setCopied(true)
    setMessage(t.backup.copiedMessage)
  }

  const handleMerge = () => {
    const imported = parseValue()
    if (!imported) return
    onMerge(imported)
    setMessage(t.backup.mergedMessage)
  }

  const handleReplace = () => {
    const imported = parseValue()
    if (!imported) return
    if (!window.confirm(t.backup.replaceConfirmation)) return
    onReplace(imported)
    setMessage(t.backup.replacedMessage)
  }

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={t.backup.dialog}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={(event) => {
        if (event.target === overlayRef.current) onClose()
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") onClose()
      }}
    >
      <div
        ref={dialogRef}
        className="card-surface mx-4 w-full max-w-xl rounded-2xl p-6 shadow-xl animate-fade-in-up"
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="inline-flex items-center gap-2 text-sm font-bold text-foreground">
              <DatabaseBackup aria-hidden="true" className="h-4 w-4" />
              {t.backup.title}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">{t.backup.description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.backup.close}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-primary-foreground"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? t.backup.copied : t.backup.copy}
        </button>

        <textarea
          value={value}
          onChange={(event) => {
            setValue(event.target.value)
            setMessage(null)
          }}
          placeholder={t.backup.paste}
          className="h-40 w-full resize-none rounded-xl border border-border bg-muted/50 px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />

        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={handleMerge}
            disabled={!value.trim()}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-bold text-foreground transition-colors hover:border-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Merge aria-hidden="true" className="h-3.5 w-3.5" />
            {t.backup.merge}
          </button>
          <button
            type="button"
            onClick={handleReplace}
            disabled={!value.trim()}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-destructive/40 px-3 py-2 text-xs font-bold text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Replace aria-hidden="true" className="h-3.5 w-3.5" />
            {t.backup.replace}
          </button>
        </div>

        {message && <p className="mt-3 text-xs font-bold text-primary">{message}</p>}
      </div>
    </div>
  )
}
