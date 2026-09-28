import {
  CaretDownIcon as ChevronDown,
  DatabaseIcon as DatabaseBackup,
  MoonIcon as Moon,
  SunIcon as Sun,
  TranslateIcon,
} from "@phosphor-icons/react"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/design-system/primitives"
import { useTheme } from "@/hooks/useTheme"
import { useI18n } from "@/i18n/I18nProvider"
import { type Locale, supportedLocales } from "@/i18n/strings"
import { formatDateDisplay } from "@/lib/dates"
import { Wordmark } from "./Wordmark"

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

  return (
    <header className="app-header">
      <div className="header-inner">
        <h1>
          <Wordmark />
        </h1>
        <div className="header-controls flex items-center gap-2">
          <time dateTime={today} className="mr-3 hidden font-mono text-xs lg:block">
            {formatDateDisplay(today, locale)}
          </time>
          <Button
            onClick={onOpenBackup}
            className="ds-icon-button header-action"
            aria-label={t.backup.open}
            title={t.backup.open}
          >
            <DatabaseBackup size={20} />
          </Button>
          <div ref={languageRef} className="relative">
            <Button
              className="header-action px-2"
              aria-expanded={languageOpen}
              aria-controls="language-options"
              aria-label={t.language}
              onClick={() => setLanguageOpen(!languageOpen)}
            >
              <TranslateIcon className="hidden sm:block" size={18} aria-hidden="true" />
              {locale === "en" ? "EN" : "PT"}
              <ChevronDown size={14} aria-hidden="true" />
            </Button>
            {languageOpen && (
              <div
                id="language-options"
                className="absolute right-0 top-full z-50 mt-2 min-w-44 border border-border bg-card p-1 text-foreground shadow-lg"
              >
                {supportedLocales.map((option) => (
                  <button
                    type="button"
                    key={option}
                    aria-pressed={locale === option}
                    className={`flex w-full items-center justify-between px-3 py-2 text-sm ${locale === option ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                    onClick={() => {
                      setLocale(option as Locale)
                      setLanguageOpen(false)
                    }}
                  >
                    {option === "en" ? "English" : "Português"}
                    <span className="font-mono text-xs">{option === "en" ? "EN" : "PT"}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <Button
            className="ds-icon-button header-action"
            onClick={toggle}
            aria-label={t.switchTheme(theme === "light" ? "dark" : "light")}
            title={t.switchTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </Button>
        </div>
      </div>
    </header>
  )
}
