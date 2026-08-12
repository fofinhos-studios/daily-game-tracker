# AGENTS.md — Daily Game Tracker

## Overview

A single-page React app for tracking daily word/puzzle game results. Users paste share-text from games (Conexo, Framed, Gamedle, GuessTheGame, Letroso, Termo) and the app parses, stores, and visualises them.

## Tech Stack

- **Runtime / Package manager:** Bun
- **Framework:** React 19 + TypeScript 5.9
- **Bundler:** Vite 7 (with `@vitejs/plugin-react`)
- **CSS:** Tailwind CSS 4 (via `@tailwindcss/vite` plugin, no `tailwind.config` — uses CSS-first `@theme` config)
- **Utilities:** clsx + tailwind-merge (`cn()` helper in `src/lib/utils.ts`), date-fns, lucide-react icons
- **Testing:** Bun's built-in test runner (`bun test`)
- **Linting / Formatting:** Biome
- **Task runner:** Just (`justfile`)
- **Deployment:** Vercel (static SPA)

## Commands

| Command | Description |
|---------|-------------|
| `just dev` | Start Vite dev server |
| `just build` | Typecheck + production build |
| `just test` | Run tests (`bun test`) |
| `just lint` | Run Biome linter |
| `just lint-fix` | Biome lint with auto-fix |
| `just format` | Format code with Biome |
| `just typecheck` | TypeScript type checking only |
| `just ci` | Full CI: lint + typecheck + test + build |
| `just clean` | Remove `dist/`, `node_modules/`, `.vite/` |

## Directory Structure

```
src/
├── main.tsx                    # Entry point, renders <App>
├── App.tsx                     # Root component: layout, tabs, state
├── index.css                   # Tailwind imports + @theme + animations
├── types/
│   └── games.ts                # GameType, GameResult unions, GAME_INFO, GAME_ORDER
├── parsers/
│   ├── types.ts                # GameParser interface (detect + parse)
│   ├── index.ts                # parseInput() — iterates parsers over pasted text
│   ├── utils.ts                # Shared parser helpers
│   ├── conexo.ts               # Conexo parser
│   ├── framed.ts               # Framed parser
│   ├── gamedle.ts              # Gamedle parser
│   ├── guessthegame.ts         # GuessTheGame parser
│   ├── letroso.ts              # Letroso parser
│   ├── termo.ts                # Termo parser
│   └── __tests__/
│       └── parsers.test.ts     # Parser tests with fixture files
├── hooks/
│   ├── useGameStore.ts         # localStorage-backed game data store
│   ├── useLocalStorage.ts      # Generic localStorage hook
│   └── useToday.ts             # Current date key, re-checks at midnight
├── lib/
│   ├── dates.ts                # Date formatting/key helpers (date-fns)
│   ├── message.ts              # Toast/notification message builder
│   ├── stats.ts                # Win-rate calculation
│   └── utils.ts                # cn() helper (clsx + twMerge)
└── components/
    ├── layout/
    │   ├── PageShell.tsx        # Full-page wrapper with bg gradients
    │   ├── Header.tsx           # App title + today's date
    │   └── SupportedGames.tsx   # Horizontal row of game link cards
    ├── input/
    │   ├── PasteInput.tsx       # Textarea for pasting game results
    │   └── GameBadge.tsx        # Colored pill badge per game type
    ├── summary/
    │   ├── DailySummary.tsx     # List of results for a given day
    │   ├── GameResultCard.tsx   # Individual result card with grid
    │   └── EmptyState.tsx       # Shown when no results for the day
    ├── share/
    │   ├── SharePreview.tsx     # Shareable text preview of day results
    │   └── CopyButton.tsx       # Copy-to-clipboard button
    └── stats/
        ├── CalendarHeatmap.tsx  # GitHub-style activity heatmap
        ├── CalendarDay.tsx      # Single day cell in heatmap
        ├── SuccessRateList.tsx  # Per-game win rate bars
        └── SuccessRateBar.tsx   # Individual win rate bar
```

## Design System

- **Light and dark themes** defined via `@theme` and `[data-theme="dark"]` in `src/index.css` using OKLCH colors
- **Key colors:** `primary` (warm amber), `accent` (teal-ish), `card` (dark slate)
- **Font:** Bricolage Grotesque (loaded via Google Fonts in `index.html`)
- **Animations:** `animate-fade-in-up`, `animate-fade-in`, `animate-pulse-once` with `delay-0` through `delay-4` classes (0.1s increments)
- **Per-game colors** defined in `GameBadge.tsx` (`GAME_COLORS`) and `SupportedGames.tsx` (`GAME_NAME_COLORS`): blue (Conexo), red (Framed), purple (Gamedle), emerald (GuessTheGame), yellow (Letroso), orange (Termo)

## Visual QA Requirements

- Check text, icon, border, hover, active, and focus-state contrast against their actual surfaces in both light and dark themes before marking a UI task complete.
- Verify both themes in the running app, including responsive layouts and interactive states such as dropdowns, menus, dialogs, and buttons. Do not rely on a single static screenshot or on color tokens alone.
- When a theme-specific issue is found, fix the component or shared theme token at the source and re-check the opposite theme for regressions.
- Run the relevant build, typecheck, lint, and tests after visual verification when those checks are available.
- After completing a task, commit the intended changes and push them to the configured remote branch. When unrelated work is present, stage only the files changed for the task and leave the unrelated changes untouched.

## Parser Architecture

Each game has a parser implementing the `GameParser` interface:

```typescript
interface GameParser {
  gameType: GameType
  detect(lines: string[]): boolean       // Quick check if this parser can handle the text
  parse(lines: string[], fallbackDate: string): ParseResult | null
}

interface ParseResult {
  result: GameResult        // Parsed game result
  consumedLines: number     // How many lines this parser consumed
}
```

`parseInput()` in `src/parsers/index.ts` iterates through lines, tries each parser via `detect()`, then `parse()`. Parsers consume a specific number of lines and the cursor advances.

## Data Model

- All data persisted in `localStorage` under key `"daily-game-tracker"`
- Shape: `AppData { version: number; entries: Record<string, DayEntry> }`
- Date keys are `YYYY-MM-DD` strings
- Each `DayEntry` has an array of `GameResult` (discriminated union on `gameType`)

## Conventions

- **Path aliases:** `@/*` maps to `src/*` (configured in both `tsconfig.json` and `vite.config.ts`)
- **Component pattern:** Named exports, one component per file, props interface co-located
- **No state management library** — `useGameStore` hook wraps `useLocalStorage`
- **Tailwind only** — no CSS modules or styled-components; use `cn()` for conditional classes
- **Section headings:** `text-xs font-bold uppercase tracking-widest text-muted-foreground`
