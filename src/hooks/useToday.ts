import { useEffect, useState } from "react"
import { todayKey } from "@/lib/dates"

export function useToday(): string {
  const [today, setToday] = useState(todayKey)

  useEffect(() => {
    const check = () => {
      const current = todayKey()
      setToday((prev) => (prev !== current ? current : prev))
    }

    // Check every 30 seconds for date change
    const interval = setInterval(check, 30_000)
    return () => clearInterval(interval)
  }, [])

  return today
}
