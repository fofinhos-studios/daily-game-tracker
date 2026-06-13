import { describe, expect, test } from "bun:test"
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
})
