import { describe, expect, test } from "bun:test"
import type { DayEntry } from "@/types/games"
import { createManualLoss } from "@/types/games"
import { generateShareMessage } from "../message"

const entry: DayEntry = {
  date: "2026-06-13",
  results: [
    {
      gameType: "expresso",
      date: "2026-06-13",
      won: true,
      attempts: 2,
      grid: ["⬛🟩 ⬛⬛", "🟩🟩 🟩🟩"],
      rawText: "Joguei expresso.ac 13/06/2026 e consegui em 2 tentativas.\n\n⬛🟩 ⬛⬛\n🟩🟩 🟩🟩",
    },
    createManualLoss("framed", "2026-06-13"),
  ],
}

describe("generateShareMessage", () => {
  test("uses canonical game names and grids in names-only mode", () => {
    expect(
      generateShareMessage(entry, { gameNamesOnly: true }),
    ).toBe(`ミニゲーム (Minigēmu) - 13/06/2026

Expresso
⬛🟩 ⬛⬛
🟩🟩 🟩🟩

Framed ❌`)
  })

  test("keeps original headers by default", () => {
    expect(generateShareMessage(entry)).toStartWith("ミニゲーム (Minigēmu) - 13/06/2026")
    expect(generateShareMessage(entry)).toContain("Joguei expresso.ac 13/06/2026")
  })
})
