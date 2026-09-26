import { CheckIcon as Check, CopyIcon as Copy } from "@phosphor-icons/react"
import { useCallback, useRef, useState } from "react"
import { Button } from "@/design-system/primitives"
import { useI18n } from "@/i18n/I18nProvider"

interface CopyButtonProps {
  text: string
}

export function CopyButton({ text }: CopyButtonProps) {
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea")
      textarea.value = text
      textarea.style.position = "fixed"
      textarea.style.opacity = "0"
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      setCopied(true)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => setCopied(false), 2000)
    }
  }, [text])

  return (
    <Button
      variant="primary"
      type="button"
      onClick={handleCopy}
      title={t.share.copyHint}
      className="w-full"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 animate-pulse-once" />
          {t.share.copied}
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          {t.share.copy}
        </>
      )}
    </Button>
  )
}
