import { formatDateDisplay } from "@/lib/dates"

interface HeaderProps {
  today: string
}

export function Header({ today }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-header border-b-2 border-header-accent">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <h1 className="font-serif italic text-lg tracking-tight text-primary-foreground">
          Score Journal
        </h1>
        <span className="text-xs font-medium text-primary-foreground/70">
          {formatDateDisplay(today)}
        </span>
      </div>
    </header>
  )
}
