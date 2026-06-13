import { describe, expect, test } from "bun:test"
import { createManualLoss, GAME_INFO, GAME_ORDER, getSubGameEntries } from "../games"

test("every game has a local favicon path", () => {
  for (const game of GAME_ORDER) {
    expect(GAME_INFO[game].favicon).toBe(`/favicons/${game}.ico`)
  }
})

describe("createManualLoss", () => {
  test("creates compact share result for selected game and date", () => {
    expect(createManualLoss("expresso", "2026-06-13")).toEqual({
      gameType: "expresso",
      date: "2026-06-13",
      won: false,
      grid: ["❌"],
      rawText: "Expresso ❌",
      attempts: 0,
    })
  })

  test("tracks mode-based games as losses without mode data", () => {
    expect(getSubGameEntries(createManualLoss("gamedle", "2026-06-13"))).toEqual([
      { key: "gamedle", won: false },
    ])
    expect(getSubGameEntries(createManualLoss("termo", "2026-06-13"))).toEqual([
      { key: "termo", won: false },
    ])
  })
})
