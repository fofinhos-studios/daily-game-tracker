import type { LucideIcon } from "lucide-react"
import { InfoTip } from "./InfoTip"

interface SectionHeadingProps {
  children: string
  help: string
  icon?: LucideIcon
  className?: string
}

export function SectionHeading({
  children,
  help,
  icon: Icon,
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <h2 className="section-heading inline-flex items-center gap-1.5">
        {Icon && <Icon aria-hidden="true" className="h-3.5 w-3.5" />}
        {children}
      </h2>
      <InfoTip label={children} text={help} />
    </div>
  )
}
