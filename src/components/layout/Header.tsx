import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/hooks/useTheme"
import { formatDateDisplay } from "@/lib/dates"

interface HeaderProps {
  today: string
}

export function Header({ today }: HeaderProps) {
  const { theme, toggle } = useTheme()

  return (
    <header className="sticky top-0 z-50 bg-header border-b-2 border-header-accent">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <h1 className="font-serif italic text-lg tracking-tight text-primary-foreground">
          Score Journal
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-primary-foreground/70">
            {formatDateDisplay(today)}
          </span>
          <button
            type="button"
            onClick={toggle}
            className="rounded-md p-1.5 text-primary-foreground/70 transition-colors hover:text-primary-foreground hover:bg-primary-foreground/10"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  )
}
