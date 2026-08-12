import { ChevronDown, DatabaseBackup, Moon, Sun } from "lucide-react"
import { useEffect, useRef, useState } from "react"
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
  const [languageOpen, setLanguageOpen] = useState(false)
  const languageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleDismiss(event: MouseEvent | KeyboardEvent) {
      if (event instanceof KeyboardEvent && event.key === "Escape") {
        setLanguageOpen(false)
        return
      }
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
        setLanguageOpen(false)
      }
    }

    document.addEventListener("mousedown", handleDismiss)
    document.addEventListener("keydown", handleDismiss)
    return () => {
      document.removeEventListener("mousedown", handleDismiss)
      document.removeEventListener("keydown", handleDismiss)
    }
  }, [])

  const language = locale === "en" ? { code: "EN", flag: "🇺🇸" } : { code: "PT", flag: "🇧🇷" }

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
          <div ref={languageRef} className="relative">
            <button
              type="button"
              onClick={() => setLanguageOpen((open) => !open)}
              aria-expanded={languageOpen}
              aria-controls="language-options"
              aria-haspopup="listbox"
              aria-label={t.language}
              title={t.language}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-primary-foreground/10 bg-primary-foreground/5 px-2 text-xs font-semibold text-primary-foreground transition-colors hover:border-primary-foreground/20 hover:bg-primary-foreground/10 hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span aria-hidden="true" className="text-sm leading-none">
                {language.flag}
              </span>
              <span>{language.code}</span>
              <ChevronDown
                aria-hidden="true"
                className={`h-3.5 w-3.5 text-primary-foreground/70 transition-transform ${languageOpen ? "rotate-180" : ""}`}
              />
            </button>

            {languageOpen && (
              <div
                id="language-options"
                role="listbox"
                aria-label={t.language}
                className="absolute right-0 top-full z-20 mt-1 min-w-36 rounded-lg border border-border bg-card p-1 shadow-lg animate-fade-in"
              >
                {supportedLocales.map((supportedLocale) => {
                  const option =
                    supportedLocale === "en"
                      ? { code: "EN", name: "English", flag: "🇺🇸" }
                      : { code: "PT", name: "Português", flag: "🇧🇷" }
                  const selected = supportedLocale === locale

                  return (
                    <button
                      type="button"
                      key={supportedLocale}
                      role="option"
                      aria-selected={selected}
                      onClick={() => {
                        setLocale(supportedLocale as Locale)
                        setLanguageOpen(false)
                      }}
                      className={`flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs transition-colors ${
                        selected
                          ? "bg-primary/10 font-semibold text-primary"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      <span aria-hidden="true" className="text-base leading-none">
                        {option.flag}
                      </span>
                      <span className="flex-1">{option.name}</span>
                      <span className="font-mono text-[0.65rem] opacity-60">{option.code}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
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
