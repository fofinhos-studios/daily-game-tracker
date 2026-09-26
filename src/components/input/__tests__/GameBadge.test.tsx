import { describe, expect, test } from "bun:test"
import { GameBadge } from "../GameBadge"

describe("GameBadge", () => {
  test("keeps game identity and a custom subgame label", () => {
    const badge = GameBadge({ gameType: "termo", label: "Termo - Dueto" })

    expect(badge.props.className).toContain("game-badge")
    expect(badge.props.style["--game-color"]).toBe("var(--game-termo)")
    expect(badge.props.children).toContain("Termo - Dueto")
  })
})
