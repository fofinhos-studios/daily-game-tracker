import { useI18n } from "@/i18n/I18nProvider"

export function Wordmark() {
  const { t } = useI18n()

  return (
    <span className="wordmark">
      <img className="brand-symbol" src="/favicon.svg" width="48" height="48" alt="" />
      <span className="wordmark-name">minigēmu</span>
      <span className="wordmark-subtitle">{t.app.brandSubtitle}</span>
    </span>
  )
}
