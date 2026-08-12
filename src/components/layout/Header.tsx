import { DatabaseBackup, Globe2, Moon, Sun } from "lucide-react"
import { useTheme } from "@/hooks/useTheme"
import { useI18n } from "@/i18n/I18nProvider"
import { type Locale, supportedLocales } from "@/i18n/strings"
import { formatDateDisplay } from "@/lib/dates"

interface HeaderProps {
  today: string
  onOpenBackup: () => void
}

export function Header({ today, onOpenBackup }: HeaderProps) {
  const { theme, toggle } = useTheme()
  const { locale, setLocale, t } = useI18n()

  return (
    <header className="sticky top-0 z-50 bg-header border-b-2 border-header-accent">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <h1 className="min-w-0 truncate font-serif italic text-lg tracking-tight text-primary-foreground">
          <span className="title-shimmer">
            <span className="title-shimmer-word title-shimmer-word-first">ミニゲーム</span>
            <span className="title-shimmer-word title-shimmer-word-second hidden text-sm not-italic opacity-70 sm:inline">
              (Minigēmu)
            </span>
          </span>
        </h1>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs font-medium text-primary-foreground/70 md:inline">
            {formatDateDisplay(today, locale)}
          </span>
          <button
            type="button"
            onClick={onOpenBackup}
            className="rounded-md p-1.5 text-primary-foreground/70 transition-colors hover:text-primary-foreground hover:bg-primary-foreground/10"
            aria-label={t.backup.open}
            title={t.backup.open}
          >
            <DatabaseBackup className="h-4 w-4" />
          </button>
          <label className="relative flex items-center rounded-md text-primary-foreground/70 transition-colors hover:text-primary-foreground hover:bg-primary-foreground/10">
            <Globe2 aria-hidden="true" className="pointer-events-none ml-1.5 h-4 w-4" />
            <select
              value={locale}
              onChange={(event) => setLocale(event.target.value as Locale)}
              aria-label={t.language}
              title={t.language}
              className="h-7 cursor-pointer appearance-none bg-transparent pl-1 pr-5 text-xs font-medium outline-none"
            >
              {supportedLocales.map((supportedLocale) => (
                <option key={supportedLocale} value={supportedLocale} className="text-foreground">
                  {supportedLocale === "en" ? "EN" : "PT"}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={toggle}
            className="rounded-md p-1.5 text-primary-foreground/70 transition-colors hover:text-primary-foreground hover:bg-primary-foreground/10"
            aria-label={t.switchTheme(theme === "light" ? "dark" : "light")}
            title={t.switchTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  )
}
