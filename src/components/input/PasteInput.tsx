import { useCallback, useRef, useState } from "react"
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
      showToast(`${parts.join(", ")}!`)
      onDatesAffected?.(uniqueDates(results))
      setValue("")
      setDetected([])
    },
    [onResults, onDatesAffected, showToast],
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
    [submitResults, showToast],
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
          className="h-36 w-full resize-none glass rounded-2xl px-4 py-3 text-sm font-light text-foreground placeholder:font-extralight placeholder:text-muted-foreground/50 focus:animate-glow-pulse focus:outline-none transition-all"
        />
        {toast && (
          <div className="animate-fade-in absolute -bottom-1 left-0 translate-y-full glass glow-primary rounded-lg px-3 py-1.5 text-xs font-bold text-primary">
            {toast}
          </div>
        )}
      </div>

      {detected.length > 0 && (
        <div className="animate-fade-in flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">Detected:</span>
          {detected.map((r, i) => (
            <GameBadge
              key={`${r.gameType}-${i}`}
              gameType={r.gameType}
              className="animate-pulse-once"
            />
          ))}
          <button
            type="button"
            onClick={handleSubmit}
            className="ml-auto rounded-xl glass border-primary/20 px-4 py-1.5 text-xs font-bold text-primary hover:glow-primary transition-all"
          >
            Add
          </button>
        </div>
      )}
    </div>
  )
}
