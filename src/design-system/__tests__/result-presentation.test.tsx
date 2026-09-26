import { describe, expect, test } from "bun:test"
import { readFileSync } from "node:fs"
import { renderToStaticMarkup } from "react-dom/server"
import { GameResultCard } from "@/components/summary/GameResultCard"
import { ResultGrid } from "@/components/summary/ResultGrid"
import { I18nProvider } from "@/i18n/I18nProvider"
import { generateShareMessage } from "@/lib/message"
import { parseInput } from "@/parsers"
import { createManualLoss, GAME_ORDER, type GameResult } from "@/types/games"
import { resultMetric, tokenizeGrid } from "../result-presentation"

const fixture = (name: string) =>
  readFileSync(new URL(`../../../samples/${name}.txt`, import.meta.url), "utf8")
const samples = [
  "conexo",
  "expresso",
  "framed",
  "gamedle",
  "guessthegame",
  "letroso",
  "termo",
].flatMap((name) => parseInput(fixture(name)).slice(0, 1))
samples.push(...parseInput("Krillion #4 🦐\n300\n⬛🫧🤡🐟🦑🏮🌟"))
samples.push(
  ...parseInput(
    "Size It Up\nOverall Score 350\n🟥🟥🟥🟥🟥 100\n🟥🟥🟥🟥⬜ 80\n🟥🟥🟥⬜⬜ 70\n🟥🟥🟥⬜⬜ 60\n🟥🟥⬜⬜⬜ 40",
  ),
)
const render = (result: GameResult) =>
  renderToStaticMarkup(
    <I18nProvider persistent={false}>
      <GameResultCard result={result} onRemove={() => {}} />
    </I18nProvider>,
  )

describe("graphical results preserve gameplay information", () => {
  test("keeps complete graphemes, keycaps, unknown symbols and exact spaces", () => {
    const row = "🟩⬛  🟢 4️⃣6️⃣ 👨‍👩‍👧‍👦 Çãé ❔ ✅️"
    const tokens = tokenizeGrid(row)
    expect(tokens.map((token) => token.text).join("")).toBe(row)
    expect(tokens[0]?.color).toBe("green")
    expect(tokens.find((token) => token.text === "🟢")?.shape).toBe("circle")
    expect(tokens.at(-1)?.symbol).toBe("check")
  })
  test("renders all nine games without modifying stored results or shared text", () => {
    expect(new Set(samples.map((result) => result.gameType)).size).toBe(9)
    for (const result of samples) {
      const before = JSON.stringify(result)
      const entry = { date: result.date, results: [result] }
      const message = generateShareMessage(entry)
      const html = render(result)
      expect(html).toContain("ticket-stub")
      expect(html).toContain(result.date)
      expect(JSON.stringify(result)).toBe(before)
      expect(generateShareMessage(entry)).toBe(message)
    }
  })
  test("does not display sentinel editions or scores for any manual loss", () => {
    for (const game of GAME_ORDER) {
      const result = createManualLoss(game, "2026-09-26")
      expect(resultMetric(result)).toEqual({ value: "—", label: "manual" })
      expect(render(result)).toContain("Derrota manual")
    }
  })
  test("retains zero-point completed games as a real score", () => {
    const result = parseInput("Krillion #4 🦐\n0\n⬛⬛⬛⬛⬛⬛⬛")[0]!
    expect(resultMetric(result)).toEqual({ value: 0, label: "points" })
    expect(render(result)).toContain("Concluído")
  })
  test("keeps all modes and side-by-side Termo boards", () => {
    const result: GameResult = {
      ...createManualLoss("termo", "2026-09-26"),
      gameType: "termo",
      won: true,
      rawText: "term.ooo/2",
      modes: [
        {
          mode: "duet",
          gameNumber: 1251,
          streak: 1,
          attempts: "4/7",
          grid: ["4️⃣6️⃣", "🟩🟩🟩🟩🟩  ⬛🟨⬛⬛🟩"],
        },
      ],
    }
    const html = renderToStaticMarkup(
      <I18nProvider persistent={false}>
        <ResultGrid result={result} />
      </I18nProvider>,
    )
    expect(html).toContain("duet")
    expect(html).toContain("#1251")
    expect(html).toContain("4️⃣6️⃣")
    expect(html.match(/class="result-cell"/g)?.length).toBe(10)
    expect(html).toContain("<span>  </span>")
  })
  test("renders all Gamedle modes and seven Krillion tiers", () => {
    const gamedle = samples.find((result) => result.gameType === "gamedle")!
    if (gamedle.gameType !== "gamedle") throw new Error("fixture")
    const html = render(gamedle)
    for (const mode of gamedle.modes) expect(html).toContain(mode.mode)
    expect(
      render(samples.find((result) => result.gameType === "krillion")!).match(
        /class="result-round"/g,
      )?.length,
    ).toBe(7)
    expect(
      render(samples.find((result) => result.gameType === "sizeitup")!).match(
        /class="result-round"/g,
      )?.length,
    ).toBe(5)
  })
})
