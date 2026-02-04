import { formatDateDisplay } from "@/lib/dates"

interface HeaderProps {
  today: string
}

export function Header({ today }: HeaderProps) {
  return (
    <header className="animate-fade-in-up delay-0 mb-8">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
        <span className="text-primary">Daily</span> Game Tracker
      </h1>
      <p className="mt-1 text-sm font-light text-muted-foreground">
        {formatDateDisplay(today)}
      </p>
    </header>
  )
}
