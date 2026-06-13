import { ChevronDown, SlidersHorizontal, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { GAME_LABELS, type GameType } from "@/types/games"
import { GameIcon } from "../input/GameIcon"

interface GameFilterProps {
  availableGames: GameType[]
  selected: Set<GameType>
  onChange: (selected: Set<GameType>) => void
}

export function GameFilter({ availableGames, selected, onChange }: GameFilterProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
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
        title="Filter results, activity, accuracy, and win rates by game"
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs transition-colors hover:border-primary/30"
      >
        <SlidersHorizontal
          aria-hidden="true"
          className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
        />
        {selected.size === 0 ? (
          <span className="text-muted-foreground">All games</span>
        ) : (
          <div className="flex flex-wrap gap-1">
            {[...selected]
              .sort((a, b) => GAME_LABELS[a].localeCompare(GAME_LABELS[b]))
              .map((game) => (
                <span
                  key={game}
                  className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                >
                  <GameIcon gameType={game} className="h-3.5 w-3.5" />
                  {GAME_LABELS[game]}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeGame(game)
                    }}
                    aria-label={`Remove ${GAME_LABELS[game]} filter`}
                    title={`Remove ${GAME_LABELS[game]} filter`}
                    className="rounded-sm hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
          </div>
        )}
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-20 mt-1 rounded-lg border border-border bg-card p-1 shadow-lg animate-fade-in">
          {sorted.map((game) => (
            <button
              type="button"
              key={game}
              onClick={() => toggleGame(game)}
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
