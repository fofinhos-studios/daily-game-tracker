import { describe, expect, test } from "bun:test"
import { parseInput } from "@/parsers"
import type { AppData } from "@/types/games"
import { createManualLoss } from "@/types/games"
import { exportBackup, importBackup, mergeAppData } from "../backup"

const current: AppData = {
  version: 1,
  entries: {
    "2026-06-12": {
      date: "2026-06-12",
      results: [createManualLoss("conexo", "2026-06-12")],
    },
  },
}

const imported: AppData = {
  version: 1,
  entries: {
    "2026-06-12": {
      date: "2026-06-12",
      results: [createManualLoss("expresso", "2026-06-12")],
    },
    "2026-06-13": {
      date: "2026-06-13",
      results: [createManualLoss("framed", "2026-06-13")],
    },
  },
}

describe("backup", () => {
  test("round trips app data through a portable string", () => {
    expect(importBackup(exportBackup(current))).toEqual(current)
  })

  test("rejects malformed or incompatible backup strings", () => {
    expect(() => importBackup("not-a-backup")).toThrow("Invalid backup")
    expect(() => importBackup(JSON.stringify({ version: 99, entries: {} }))).toThrow(
      "Unsupported backup version",
    )
  })

  test("merges by date and game, keeping imported conflicts", () => {
    const merged = mergeAppData(current, imported)
    expect(merged.entries["2026-06-12"]?.results.map((result) => result.gameType).sort()).toEqual([
      "conexo",
      "expresso",
    ])
    expect(merged.entries["2026-06-13"]).toEqual(imported.entries["2026-06-13"])
  })

  test("round trips completed and manually missed Krillion results", () => {
    const [result] = parseInput("Krillion #73 🦐\n345\n\n🦑🫧🦑🦑🏮🫧🦑")
    const data: AppData = {
      version: 1,
      entries: {
        "2026-09-26": { date: "2026-09-26", results: [result!] },
        "2026-09-27": {
          date: "2026-09-27",
          results: [createManualLoss("krillion", "2026-09-27")],
        },
      },
    }
    expect(importBackup(exportBackup(data))).toEqual(data)
  })

  test("rejects an inconsistent Krillion backup", () => {
    const [result] = parseInput("Krillion #73 🦐\n345\n\n🦑🫧🦑🦑🏮🫧🦑")
    const data: AppData = {
      version: 1,
      entries: { "2026-09-26": { date: "2026-09-26", results: [{ ...result!, score: 344 }] } },
    }
    expect(() => importBackup(exportBackup(data))).toThrow("Invalid backup")
  })

  test("round trips a scored Size It Up result and its manual loss", () => {
    const scored: AppData = {
      version: 1,
      entries: {
        "2026-09-26": {
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
              rawText: "Size It Up\nOverall Score 323",
            },
          ],
        },
        "2026-09-25": {
          date: "2026-09-25",
          results: [createManualLoss("sizeitup", "2026-09-25")],
        },
      },
    }
    expect(importBackup(exportBackup(scored))).toEqual(scored)

    const inconsistent = structuredClone(scored)
    const result = inconsistent.entries["2026-09-26"]!.results[0]!
    if (result.gameType === "sizeitup") result.overallScore = 324
    expect(() => importBackup(exportBackup(inconsistent))).toThrow("Invalid backup")
  })
})
