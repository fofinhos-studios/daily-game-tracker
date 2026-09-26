import { describe, expect, test } from "bun:test"
import { todayKey } from "@/lib/dates"
import { calculateGameStats, getWinRateForDate } from "@/lib/stats"
import type { AppData, SizeItUpResult } from "@/types/games"
import { createManualLoss } from "@/types/games"
import { parseInput } from "../index"

const example = `Size It Up
Overall Score 323
🟥🟥🟥🟥🟥 90
🟥🟥⬜⬜⬜ 46
🟥🟥🟥🟥🟥 100
⬜⬜⬜⬜⬜ 1
🟥🟥🟥🟥⬜ 86
https://magnitudle.com/size-it-up`

describe("Size It Up parser", () => {
  test("parses the five rounds and score from the shared example", () => {
    const results = parseInput(example)
    expect(results).toHaveLength(1)
    const result = results[0] as SizeItUpResult
    expect(result.gameType).toBe("sizeitup")
    expect(result.date).toBe(todayKey())
    expect(result.won).toBe(true)
    expect(result.overallScore).toBe(323)
    expect(result.roundScores).toEqual([90, 46, 100, 1, 86])
    expect(result.grid).toEqual(example.split("\n").slice(2, 7))
    expect(result.rawText).toBe(example)
  })

  test("accepts zero and maximum scores as completed games", () => {
    for (const [square, points, total] of [
      ["⬜", 0, 0],
      ["🟥", 100, 500],
    ] as const) {
      const rounds = Array.from({ length: 5 }, () => `${square.repeat(5)} ${points}`)
      const result = parseInput(["Size It Up", `Overall Score ${total}`, ...rounds].join("\n"))[0]
      expect(result?.gameType).toBe("sizeitup")
      expect(result?.won).toBe(true)
      expect((result as SizeItUpResult).overallScore).toBe(total)
    }
  })

  test("accepts an optional markdown link and CRLF input", () => {
    const input = example
      .replace(
        "https://magnitudle.com/size-it-up",
        "[https://magnitudle.com/size-it-up](https://magnitudle.com/size-it-up)",
      )
      .replaceAll("\n", "\r\n")
    expect(parseInput(input)).toHaveLength(1)
    expect(parseInput(example.split("\n").slice(0, -1).join("\n"))).toHaveLength(1)
  })

  test("parses alongside another game without consuming its header", () => {
    const text = `${example}\n\nJoguei conexo.ws 29/01/2026 e consegui em 4 tentativas.\n🟩🟩🟩🟩`
    expect(parseInput(text).map((result) => result.gameType)).toEqual(["sizeitup", "conexo"])
  })

  test("rejects incomplete, out-of-range, extra, and inconsistent rounds", () => {
    const withoutLink = example.split("\n").slice(0, -1).join("\n")
    const invalid = [
      withoutLink.split("\n").slice(0, -1).join("\n"),
      withoutLink.replace(" 90", " 101"),
      withoutLink.replace("Overall Score 323", "Overall Score 501"),
      withoutLink.replace("Overall Score 323", "Overall Score 324"),
      withoutLink.replace("🟥🟥⬜⬜⬜ 46", "🟥🟥⬜⬜ 46"),
      `${withoutLink}\n⬜⬜⬜⬜⬜ 0`,
    ]
    for (const input of invalid) expect(parseInput(input)).toEqual([])
  })

  test("counts a zero-point share as a win and a manual entry as a loss", () => {
    const date = "2026-09-26"
    const shared = parseInput(
      ["Size It Up", "Overall Score 0", ...Array(5).fill("⬜⬜⬜⬜⬜ 0")].join("\n"),
    )[0] as SizeItUpResult
    const data: AppData = {
      version: 1,
      entries: { [date]: { date, results: [{ ...shared, date }] } },
    }
    expect(calculateGameStats(data, "sizeitup").winRate).toBe(100)
    expect(getWinRateForDate(data, date, new Set(["sizeitup"]))).toBe(100)
    data.entries[date]!.results = [createManualLoss("sizeitup", date)]
    expect(calculateGameStats(data, "sizeitup").winRate).toBe(0)
  })
})
