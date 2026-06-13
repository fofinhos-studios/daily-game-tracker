import { describe, expect, test } from "bun:test"
import { GameBadge } from "../GameBadge"

describe("GameBadge", () => {
  test("keeps pill design with a custom subgame label", () => {
    const badge = GameBadge({ gameType: "termo", label: "Termo - Dueto" })

    expect(badge.props.className).toContain("rounded-full")
    expect(badge.props.children).toContain("Termo - Dueto")
  })
})
