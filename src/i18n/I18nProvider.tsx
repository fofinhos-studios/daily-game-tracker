import { createContext, type ReactNode, useContext, useEffect, useState } from "react"
import { type Locale, strings, supportedLocales } from "./strings"

const LANGUAGE_STORAGE_KEY = "language"

function detectLocale(): Locale {
  const languages =
    typeof navigator === "undefined"
      ? []
      : navigator.languages?.length
        ? navigator.languages
        : [navigator.language]
  return languages.some((language) => language.toLowerCase().startsWith("pt")) ? "pt-BR" : "en"
}

function getInitialLocale(): Locale {
  if (typeof window === "undefined") return "en"
  const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
  return supportedLocales.includes(saved as Locale) ? (saved as Locale) : detectLocale()
}

interface I18nContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (typeof strings)[Locale]
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale)

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const setLocale = (nextLocale: Locale) => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLocale)
    setLocaleState(nextLocale)
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t: strings[locale] }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext)
  if (!context) throw new Error("useI18n must be used within I18nProvider")
  return context
}
