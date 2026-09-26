import { describe, expect, test } from "bun:test"
import { formatKrillionGrid, krillionBand, krillionDate, krillionScore } from "../krillion"

describe("Krillion scoring", () => {
  test("maps all seven outcomes to their official points", () => {
    const tiers = [
      "miss",
      "plankton",
      "tooClever",
      "schooler",
      "rare",
      "deepCut",
      "krillion",
    ] as const
    expect(krillionScore(tiers)).toBe(300)
    expect(formatKrillionGrid(tiers)).toEqual([
      "1. ⬛ Miss — 0 pts",
      "2. 🫧 Plankton — 10 pts",
      "3. 🤡 Too Clever — 15 pts",
      "4. 🐟 Schooler — 30 pts",
      "5. 🦑 Rare — 60 pts",
      "6. 🏮 Deep Cut — 85 pts",
      "7. 🌟 One in a Krillion — 100 pts",
      "Total: 300 pts — Rare (251–350)",
    ])
  })

  test("uses the published boundaries for total-score bands", () => {
    const cases = [
      [0, "Plankton"],
      [150, "Plankton"],
      [151, "Schooler"],
      [250, "Schooler"],
      [251, "Rare"],
      [350, "Rare"],
      [351, "Deep cut"],
      [449, "Deep cut"],
      [450, "One in a krillion"],
      [700, "One in a krillion"],
    ] as const
    for (const [score, label] of cases) expect(krillionBand(score).label).toBe(label)
  })

  test("derives dates from daily edition numbers", () => {
    expect(krillionDate(1)).toBe("2026-07-16")
    expect(krillionDate(73)).toBe("2026-09-26")
    expect(krillionDate(0)).toBeNull()
  })
})
