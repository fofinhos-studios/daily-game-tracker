import { useEffect } from "react"
import { useLocalStorage } from "./useLocalStorage"

export type Theme = "light" | "dark"

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>("theme", "dark")

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
  }, [theme])

  const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"))

  return { theme, toggle }
}
