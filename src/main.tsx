import { IconContext } from "@phosphor-icons/react"
import { lazy, StrictMode, Suspense } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import { I18nProvider } from "./i18n/I18nProvider.tsx"

const isCatalog =
  import.meta.env.DEV && new URLSearchParams(window.location.search).has("design-system")
const Catalog = import.meta.env.DEV ? lazy(() => import("./design-system/Catalog")) : null
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <IconContext.Provider value={{ weight: "bold", color: "currentColor", size: 20 }}>
      <I18nProvider persistent={!isCatalog}>
        {isCatalog && Catalog ? (
          <Suspense fallback={<p className="workspace">Minigēmu…</p>}>
            <Catalog />
          </Suspense>
        ) : (
          <App />
        )}
      </I18nProvider>
    </IconContext.Provider>
  </StrictMode>,
)
