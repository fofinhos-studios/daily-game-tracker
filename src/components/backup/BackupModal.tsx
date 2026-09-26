import {
  CheckIcon as Check,
  CopyIcon as Copy,
  GitMergeIcon as Merge,
  ArrowsClockwiseIcon as Replace,
} from "@phosphor-icons/react"
import { useState } from "react"
import { industrialCopy } from "@/design-system/copy"
import { Button, Dialog, Message, TextArea } from "@/design-system/primitives"
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
  const { t, locale } = useI18n()
  const [pendingReplacement, setPendingReplacement] = useState<AppData | null>(null)
  const [value, setValue] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

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
    setPendingReplacement(imported)
  }

  if (pendingReplacement)
    return (
      <Dialog
        title={t.backup.replace}
        closeLabel={t.backup.close}
        onClose={() => setPendingReplacement(null)}
      >
        <p className="mb-6 text-sm">{t.backup.replaceConfirmation}</p>
        <div className="flex flex-wrap justify-end gap-3">
          <Button onClick={() => setPendingReplacement(null)}>
            {industrialCopy[locale].cancel}
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              onReplace(pendingReplacement)
              setPendingReplacement(null)
              setMessage(t.backup.replacedMessage)
            }}
          >
            {t.backup.replace}
          </Button>
        </div>
      </Dialog>
    )
  const invalid = message === t.backup.invalid || message === t.backup.unsupportedVersion
  return (
    <Dialog title={t.backup.title} closeLabel={t.backup.close} onClose={onClose}>
      <p className="mb-5 text-sm text-muted-foreground">{t.backup.description}</p>
      <Button variant="primary" className="mb-5 w-full" onClick={handleCopy}>
        {copied ? <Check size={18} /> : <Copy size={18} />}
        {copied ? t.backup.copied : t.backup.copy}
      </Button>
      <TextArea
        aria-label={t.backup.paste}
        aria-invalid={invalid}
        value={value}
        onChange={(event) => {
          setValue(event.target.value)
          setMessage(null)
        }}
        placeholder={t.backup.paste}
      />
      <div className="my-4 flex flex-wrap gap-2">
        <Button className="flex-1" onClick={handleMerge} disabled={!value.trim()}>
          <Merge size={18} aria-hidden="true" />
          {t.backup.merge}
        </Button>
        <Button
          variant="danger"
          className="flex-1"
          onClick={handleReplace}
          disabled={!value.trim()}
        >
          <Replace size={18} aria-hidden="true" />
          {t.backup.replace}
        </Button>
      </div>
      {message && <Message tone={invalid ? "error" : "success"}>{message}</Message>}
    </Dialog>
  )
}
