import { describe, expect, test } from "bun:test"
import { HELP_TEXT } from "../helpContent"

describe("HELP_TEXT", () => {
  test("documents every primary UI section", () => {
    expect(Object.keys(HELP_TEXT).sort()).toEqual([
      "accuracy",
      "activity",
      "pasteResults",
      "share",
      "winRates",
    ])

    for (const text of Object.values(HELP_TEXT)) {
      expect(text.length).toBeGreaterThan(20)
    }
  })
})
