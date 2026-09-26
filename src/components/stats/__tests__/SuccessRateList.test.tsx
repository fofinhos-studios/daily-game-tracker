import { describe, expect, test } from "bun:test"
import { renderToStaticMarkup } from "react-dom/server"
import { I18nProvider } from "@/i18n/I18nProvider"
import { type AppData, createManualLoss, type GameType } from "@/types/games"
import { SuccessRateList } from "../SuccessRateList"

const data: AppData = {
  version: 1,
  entries: {
    "2026-09-25": {
      date: "2026-09-25",
      results: [
        {
          gameType: "gamedle",
          date: "2026-09-25",
          won: true,
          grid: [],
          rawText: "Gamedle",
          modes: [
            { mode: "capa", emoji: "", gameNumber: 1, grid: "🟩⬜", won: true },
            { mode: "artwork", emoji: "", gameNumber: 2, grid: "🟥🟥", won: false },
          ],
        },
        createManualLoss("conexo", "2026-09-25"),
      ],
    },
    "2026-09-26": { date: "2026-09-26", results: [createManualLoss("gamedle", "2026-09-26")] },
  },
}
const render = (gameFilter?: Set<GameType>) =>
  renderToStaticMarkup(
    <I18nProvider persistent={false}>
      <SuccessRateList data={data} gameFilter={gameFilter} />
    </I18nProvider>,
  )

describe("hierarchical win rates", () => {
  test("keeps game totals, mode outcomes and manual losses distinct", () => {
    const before = JSON.stringify(data)
    const html = render()
    expect(html).toContain('class="rate-subgames" aria-label="Gamedle"')
    expect(html).toContain('aria-label="Taxa de vitória de Gamedle: 50%"')
    expect(html).toContain('aria-label="Taxa de vitória de Gamedle — Capa: 100%"')
    expect(html).toContain('aria-label="Taxa de vitória de Gamedle — Artwork: 0%"')
    expect(html.match(/role="progressbar"/g)?.length).toBe(4)
    expect(JSON.stringify(data)).toBe(before)
  })
  test("filters complete game groups and handles empty selections of recorded data", () => {
    const html = render(new Set(["conexo"]))
    expect(html).toContain("Conexo")
    expect(html).not.toContain("Gamedle")
    expect(html).not.toContain("rate-subgames")
    expect(render(new Set(["termo"]))).not.toContain('role="progressbar"')
  })
})
