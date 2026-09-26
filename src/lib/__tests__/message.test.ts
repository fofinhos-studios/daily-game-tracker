import { describe, expect, test } from "bun:test"
import { parseInput } from "@/parsers"
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

  test("details Krillion rounds and total in both sharing modes", () => {
    const [result] = parseInput("Krillion #73 🦐\n345\n\n🦑🫧🦑🦑🏮🫧🦑")
    const krillionEntry: DayEntry = { date: "2026-09-26", results: [result!] }
    const rounds = [
      "1. 🦑 Rare — 60 pts",
      "2. 🫧 Plankton — 10 pts",
      "3. 🦑 Rare — 60 pts",
      "4. 🦑 Rare — 60 pts",
      "5. 🏮 Deep Cut — 85 pts",
      "6. 🫧 Plankton — 10 pts",
      "7. 🦑 Rare — 60 pts",
      "Total: 345 pts — Rare (251–350)",
    ].join("\n")
    expect(generateShareMessage(krillionEntry)).toBe(
      `ミニゲーム (Minigēmu) - 26/09/2026\n\nKrillion #73 🦐\n${rounds}`,
    )
    expect(generateShareMessage(krillionEntry, { gameNamesOnly: true })).toBe(
      `ミニゲーム (Minigēmu) - 26/09/2026\n\nKrillion\n${rounds}`,
    )
  })

  test("keeps a manually marked Krillion loss compact", () => {
    const krillionEntry: DayEntry = {
      date: "2026-09-26",
      results: [createManualLoss("krillion", "2026-09-26")],
    }
    expect(generateShareMessage(krillionEntry)).toContain("Krillion ❌")
    expect(generateShareMessage(krillionEntry, { gameNamesOnly: true })).toContain("Krillion ❌")
  })

  test("preserves Size It Up total in names-only mode and removes its URL by default", () => {
    const sizeEntry: DayEntry = {
      date: "2026-09-26",
      results: [
        {
          gameType: "sizeitup",
          date: "2026-09-26",
          won: true,
          overallScore: 323,
          roundScores: [90, 46, 100, 1, 86],
          grid: [
            "🟥🟥🟥🟥🟥 90",
            "🟥🟥⬜⬜⬜ 46",
            "🟥🟥🟥🟥🟥 100",
            "⬜⬜⬜⬜⬜ 1",
            "🟥🟥🟥🟥⬜ 86",
          ],
          rawText:
            "Size It Up\nOverall Score 323\n🟥🟥🟥🟥🟥 90\n🟥🟥⬜⬜⬜ 46\n🟥🟥🟥🟥🟥 100\n⬜⬜⬜⬜⬜ 1\n🟥🟥🟥🟥⬜ 86\nhttps://magnitudle.com/size-it-up",
        },
      ],
    }
    const namesOnly = generateShareMessage(sizeEntry, { gameNamesOnly: true })
    expect(namesOnly).toContain("Size It Up\nOverall Score 323\n🟥🟥🟥🟥🟥 90")
    const original = generateShareMessage(sizeEntry)
    expect(original).toContain("Overall Score 323")
    expect(original).not.toContain("magnitudle.com")
  })
})
