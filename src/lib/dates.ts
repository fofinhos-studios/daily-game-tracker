import { format, parse } from "date-fns"

export function todayKey(): string {
  return format(new Date(), "yyyy-MM-dd")
}

export function formatDateBR(dateKey: string): string {
  const date = parse(dateKey, "yyyy-MM-dd", new Date())
  return format(date, "dd/MM/yyyy")
}

export function formatDateDisplay(dateKey: string): string {
  const date = parse(dateKey, "yyyy-MM-dd", new Date())
  return format(date, "MMMM d, yyyy")
}

export function parseBrazilianDate(dateStr: string): string {
  const parts = dateStr.split("/")
  if (parts.length === 3) {
    const [day, month, year] = parts
    return `${year}-${month!.padStart(2, "0")}-${day!.padStart(2, "0")}`
  }
  return todayKey()
}
