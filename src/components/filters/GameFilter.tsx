import { ChevronDown, SlidersHorizontal, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useI18n } from "@/i18n/I18nProvider"
import { GAME_LABELS, type GameType } from "@/types/games"
import { GameIcon } from "../input/GameIcon"

interface GameFilterProps {
  availableGames: GameType[]
  selected: Set<GameType>
  onChange: (selected: Set<GameType>) => void
}

export function GameFilter({ availableGames, selected, onChange }: GameFilterProps) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleDismiss(e: MouseEvent | KeyboardEvent) {
      if (e instanceof KeyboardEvent && e.key === "Escape") {
        setOpen(false)
        return
      }
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleDismiss)
    document.addEventListener("keydown", handleDismiss)
    return () => {
      document.removeEventListener("mousedown", handleDismiss)
      document.removeEventListener("keydown", handleDismiss)
    }
  }, [])

  const toggleGame = (game: GameType) => {
    const next = new Set(selected)
    if (next.has(game)) {
      next.delete(game)
    } else {
      next.add(game)
    }
    onChange(next)
  }

  const removeGame = (game: GameType) => {
    const next = new Set(selected)
    next.delete(game)
    onChange(next)
  }

  const sorted = [...availableGames].sort((a, b) => GAME_LABELS[a].localeCompare(GAME_LABELS[b]))

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="game-filter-options"
        aria-haspopup="listbox"
        title={t.filter.title}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs transition-colors hover:border-primary/30"
      >
        <SlidersHorizontal
          aria-hidden="true"
          className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
        />
        <span className="text-muted-foreground">
          {selected.size === 0 ? t.filter.allGames : t.filter.count(selected.size)}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {selected.size > 0 && (
        <fieldset className="mt-1 flex flex-wrap gap-1 border-0 p-0">
          <legend className="sr-only">{t.filter.selected}</legend>
          {[...selected]
            .sort((a, b) => GAME_LABELS[a].localeCompare(GAME_LABELS[b]))
            .map((game) => (
              <button
                type="button"
                key={game}
                onClick={() => removeGame(game)}
                aria-label={t.filter.remove(GAME_LABELS[game])}
                className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary hover:text-destructive"
              >
                <GameIcon gameType={game} className="h-3.5 w-3.5" />
                {GAME_LABELS[game]}
                <X className="h-3 w-3" />
              </button>
            ))}
        </fieldset>
      )}

      {open && (
        <div
          id="game-filter-options"
          role="listbox"
          aria-multiselectable="true"
          className="absolute left-0 right-0 top-full z-20 mt-1 rounded-lg border border-border bg-card p-1 shadow-lg animate-fade-in"
        >
          {sorted.map((game) => (
            <button
              type="button"
              key={game}
              onClick={() => toggleGame(game)}
              role="option"
              aria-selected={selected.has(game)}
              className={`flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-xs transition-colors ${
                selected.has(game)
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <GameIcon gameType={game} className="h-4 w-4" />
              {GAME_LABELS[game]}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
