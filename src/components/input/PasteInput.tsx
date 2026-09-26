import { PlusIcon as Plus } from "@phosphor-icons/react"
import { useCallback, useRef, useState } from "react"
import { Button, Message, TextArea } from "@/design-system/primitives"
import { useI18n } from "@/i18n/I18nProvider"
import { parseInput } from "@/parsers"
import type { GameResult } from "@/types/games"
import { GameBadge } from "./GameBadge"

interface PasteInputProps {
  onResults: (results: GameResult[]) => { added: number; replaced: number }
  onDatesAffected?: (dates: string[]) => void
}

function uniqueDates(results: GameResult[]): string[] {
  return [...new Set(results.map((r) => r.date))].sort()
}

export function PasteInput({ onResults, onDatesAffected }: PasteInputProps) {
  const { t } = useI18n()
  const [value, setValue] = useState("")
  const [detected, setDetected] = useState<GameResult[]>([])
  const [toast, setToast] = useState<string | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null)

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setToast(null), 3000)
  }, [])

  const handleChange = useCallback((text: string) => {
    setValue(text)
    if (text.trim()) {
      const results = parseInput(text)
      setDetected(results)
    } else {
      setDetected([])
    }
  }, [])

  const submitResults = useCallback(
    (results: GameResult[]) => {
      const { added, replaced } = onResults(results)
      const parts: string[] = []
      if (added > 0) parts.push(t.paste.added(added))
      if (replaced > 0) parts.push(t.paste.replaced(replaced))
      showToast(`${parts.join(", ")}!`)
      onDatesAffected?.(uniqueDates(results))
      setValue("")
      setDetected([])
    },
    [onResults, onDatesAffected, showToast, t],
  )

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      e.preventDefault()
      const text = e.clipboardData.getData("text")
      const results = parseInput(text)

      if (results.length > 0) {
        submitResults(results)
      } else {
        setValue(text)
        setDetected([])
        showToast(t.paste.noGamesDetected)
      }
    },
    [submitResults, showToast, t],
  )

  const handleSubmit = useCallback(() => {
    if (detected.length > 0) {
      submitResults(detected)
    }
  }, [detected, submitResults])

  return (
    <div className="space-y-3">
      <div className="relative">
        <TextArea
          id="game-results-input"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onPaste={handlePaste}
          aria-label={t.app.pasteResults}
          placeholder={t.paste.placeholder}
        />
        {toast && (
          <Message tone={toast === t.paste.noGamesDetected ? "error" : "success"}>{toast}</Message>
        )}
      </div>

      {detected.length > 0 && (
        <div className="animate-fade-in flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">{t.paste.detected}</span>
          {detected.map((r, i) => (
            <GameBadge
              key={`${r.gameType}-${i}`}
              gameType={r.gameType}
              className="animate-pulse-once"
            />
          ))}
          <Button
            variant="primary"
            type="button"
            onClick={handleSubmit}
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus aria-hidden="true" className="h-3.5 w-3.5" />
            {t.paste.add}
          </Button>
        </div>
      )}
    </div>
  )
}
