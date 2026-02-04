import { useState, useCallback, useRef } from "react"
import type { GameResult } from "@/types/games"
import { parseInput } from "@/parsers"
import { GameBadge } from "./GameBadge"

interface PasteInputProps {
  onResults: (results: GameResult[]) => { added: number; replaced: number }
  onDatesAffected?: (dates: string[]) => void
}

function uniqueDates(results: GameResult[]): string[] {
  return [...new Set(results.map((r) => r.date))].sort()
}

export function PasteInput({ onResults, onDatesAffected }: PasteInputProps) {
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
      if (added > 0) parts.push(`${added} game${added > 1 ? "s" : ""} added`)
      if (replaced > 0) parts.push(`${replaced} replaced`)
      showToast(parts.join(", ") + "!")
      onDatesAffected?.(uniqueDates(results))
      setValue("")
      setDetected([])
    },
    [onResults, onDatesAffected, showToast]
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
        showToast("No games detected in pasted text")
      }
    },
    [submitResults, showToast]
  )

  const handleSubmit = useCallback(() => {
    if (detected.length > 0) {
      submitResults(detected)
    }
  }, [detected, submitResults])

  return (
    <div className="space-y-3">
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onPaste={handlePaste}
          placeholder="Paste your game results here..."
          className="h-32 w-full resize-none rounded-xl border border-border bg-card/50 px-4 py-3 text-sm font-light text-foreground placeholder:font-extralight placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors"
        />
        {toast && (
          <div className="animate-fade-in absolute -bottom-1 left-0 translate-y-full rounded-lg bg-card border border-primary/30 px-3 py-1.5 text-xs font-bold text-primary shadow-lg">
            {toast}
          </div>
        )}
      </div>

      {detected.length > 0 && (
        <div className="animate-fade-in flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">Detected:</span>
          {detected.map((r, i) => (
            <GameBadge key={`${r.gameType}-${i}`} gameType={r.gameType} className="animate-pulse-once" />
          ))}
          <button
            onClick={handleSubmit}
            className="ml-auto rounded-lg bg-primary/20 px-3 py-1 text-xs font-bold text-primary hover:bg-primary/30 transition-colors border border-primary/30"
          >
            Add
          </button>
        </div>
      )}
    </div>
  )
}
