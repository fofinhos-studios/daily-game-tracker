import { industrialCopy } from "@/design-system/copy"
import { Dialog } from "@/design-system/primitives"
import { useI18n } from "@/i18n/I18nProvider"
import { SupportedGames } from "./SupportedGames"

export function SupportedGamesModal({ onClose }: { onClose: () => void }) {
  const { t, locale } = useI18n()
  return (
    <Dialog
      title={t.app.supportedGamesTitle}
      closeLabel={industrialCopy[locale].close}
      onClose={onClose}
    >
      <SupportedGames />
    </Dialog>
  )
}
