import { describe, expect, test } from "bun:test"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import type {
  ConexoResult,
  FramedResult,
  GamedleResult,
  GuessTheGameResult,
  LetrosoResult,
  TermoResult,
} from "../../types/games"
import { parseInput } from "../index"
import { isEmojiLine } from "../utils"

const samplesDir = resolve(import.meta.dir, "../../../samples")

function readSample(name: string): string {
  return readFileSync(resolve(samplesDir, name), "utf-8")
}

/** Split a sample file by "---" separator into individual test blocks */
function splitBlocks(text: string): string[] {
  return text
    .split(/\n---\n/)
    .map((b) => b.trim())
    .filter(Boolean)
}

// ---------------------------------------------------------------------------
// Multi-game messages (the user's primary workflow)
// ---------------------------------------------------------------------------

describe("multi-game paste: mensagem.txt", () => {
  const results = parseInput(readSample("mensagem.txt"))

  test("detects all 4 games", () => {
    expect(results).toHaveLength(4)
    const types = results.map((r) => r.gameType).sort()
    expect(types).toEqual(["conexo", "gamedle", "guessthegame", "letroso"])
  })

  test("GuessTheGame #1356 parsed correctly", () => {
    const r = results.find((r) => r.gameType === "guessthegame") as GuessTheGameResult
    expect(r.gameNumber).toBe(1356)
    expect(r.won).toBe(true) // has 🟩
    expect(r.grid).toHaveLength(1)
  })

  test("Gamedle has 4 modes", () => {
    const r = results.find((r) => r.gameType === "gamedle") as GamedleResult
    expect(r.modes).toHaveLength(4)
    const modeNames = r.modes.map((m) => m.mode)
    expect(modeNames).toEqual(["Capa", "Artwork", "Personagem", "Palavras-chave"])
  })

  test("Gamedle modes have grids", () => {
    const r = results.find((r) => r.gameType === "gamedle") as GamedleResult
    for (const mode of r.modes) {
      expect(mode.grid.length).toBeGreaterThan(0)
    }
  })

  test("Conexo parsed with correct date and attempts", () => {
    const r = results.find((r) => r.gameType === "conexo") as ConexoResult
    expect(r.date).toBe("2026-01-29")
    expect(r.attempts).toBe(4)
    expect(r.hints).toBe(0)
    expect(r.won).toBe(true)
    expect(r.grid).toHaveLength(1)
  })

  test("Letroso parsed with grid and checkmark", () => {
    const r = results.find((r) => r.gameType === "letroso") as LetrosoResult
    expect(r.date).toBe("2026-01-29")
    expect(r.attempts).toBe(9)
    expect(r.won).toBe(true)
    expect(r.grid.length).toBeGreaterThan(1)
    expect(r.grid[r.grid.length - 1]).toBe("✅")
  })
})

describe("multi-game paste: mensagem2.txt", () => {
  const results = parseInput(readSample("mensagem2.txt"))

  test("detects all 4 games", () => {
    expect(results).toHaveLength(4)
    const types = results.map((r) => r.gameType).sort()
    expect(types).toEqual(["conexo", "gamedle", "guessthegame", "letroso"])
  })

  test("GuessTheGame #1354 is a loss", () => {
    const r = results.find((r) => r.gameType === "guessthegame") as GuessTheGameResult
    expect(r.gameNumber).toBe(1354)
    expect(r.won).toBe(false) // all 🟥
  })

  test("Gamedle has all 4 modes with grids", () => {
    const r = results.find((r) => r.gameType === "gamedle") as GamedleResult
    expect(r.modes).toHaveLength(4)
    for (const mode of r.modes) {
      expect(mode.grid.length).toBeGreaterThan(0)
    }
    // Artwork has a 🟩 → won
    expect(r.modes.find((m) => m.mode === "Artwork")!.won).toBe(true)
    // Personagem has a 🟩 → won
    expect(r.modes.find((m) => m.mode === "Personagem")!.won).toBe(true)
  })

  test("Conexo with 12 attempts and 2 hints", () => {
    const r = results.find((r) => r.gameType === "conexo") as ConexoResult
    expect(r.date).toBe("2026-01-27")
    expect(r.attempts).toBe(12)
    expect(r.hints).toBe(2)
    expect(r.grid).toHaveLength(2) // two rows of emoji
  })

  test("Letroso with 8 attempts, won", () => {
    const r = results.find((r) => r.gameType === "letroso") as LetrosoResult
    expect(r.date).toBe("2026-01-27")
    expect(r.attempts).toBe(8)
    expect(r.won).toBe(true)
    expect(r.grid[r.grid.length - 1]).toBe("✅")
  })
})

// ---------------------------------------------------------------------------
// Bug reproduction: the exact paste from the bug report
// ---------------------------------------------------------------------------

describe("bug report paste", () => {
  const input = `#GuessTheGame #1354

🎮 🟥 🟥 🟥 🟥 🟥 🟥

Gamedle
🕹️ (Capa) #1375:
🟥🟥🟥🟥🟥🟥

🎨 (Artwork) #1134:
🟥🟥🟩⬜⬜⬜

👤 (Personagem) #227:
🟩⬜⬜⬜

🔑 (Palavras-chave) #934:
🟥🟥🟥🟥🟥🟥

Joguei conexo.ws 27/01/2026 e consegui em 12 tentativas e 2 dicas.

❌🟩🟧❌❌❌💡💡❌❌
❌❌🟦🟪

Joguei letroso.com 27/01/2026 e consegui em 8 tentativas.

🟨⬛🟩⬛⬛⬛⬛⬛⬛🟩
🟩🟩⬛⬛🟨⬛
🟩🟩🟩⬛
🟩🟩🟩⬛⬛🟢
⬛🟩⬛🟩🟩⬛🟩⬛
🟢🟩⬛⬛🟩⬛🟢
🟢🟩⬛🟩🟩⬛🟢
✅`

  const results = parseInput(input)

  test("detects all 4 games", () => {
    expect(results).toHaveLength(4)
  })

  test("Gamedle has all 4 modes", () => {
    const r = results.find((r) => r.gameType === "gamedle") as GamedleResult
    expect(r.modes).toHaveLength(4)
    expect(r.modes.map((m) => m.mode)).toEqual(["Capa", "Artwork", "Personagem", "Palavras-chave"])
  })

  test("Gamedle grids containing ⬜ are captured", () => {
    const r = results.find((r) => r.gameType === "gamedle") as GamedleResult
    expect(r.modes.find((m) => m.mode === "Artwork")!.grid).toContain("🟩")
    expect(r.modes.find((m) => m.mode === "Artwork")!.grid).toContain("⬜")
    expect(r.modes.find((m) => m.mode === "Personagem")!.grid).toContain("🟩")
  })

  test("Conexo is detected", () => {
    const r = results.find((r) => r.gameType === "conexo") as ConexoResult
    expect(r).toBeDefined()
    expect(r.attempts).toBe(12)
    expect(r.hints).toBe(2)
  })

  test("Letroso grid contains ⬛ rows and ✅", () => {
    const r = results.find((r) => r.gameType === "letroso") as LetrosoResult
    expect(r).toBeDefined()
    expect(r.won).toBe(true)
    expect(r.grid.length).toBeGreaterThan(1)
    expect(r.grid[r.grid.length - 1]).toBe("✅")
  })
})

// ---------------------------------------------------------------------------
// Individual game parsers (per-sample-file)
// ---------------------------------------------------------------------------

describe("conexo parser", () => {
  const blocks = splitBlocks(readSample("conexo.txt"))

  test("parses all 3 examples", () => {
    for (const block of blocks) {
      const results = parseInput(block)
      expect(results).toHaveLength(1)
      expect(results[0]!.gameType).toBe("conexo")
    }
  })

  test("first example: 4 attempts, no hints", () => {
    const r = parseInput(blocks[0]!)[0] as ConexoResult
    expect(r.date).toBe("2026-01-29")
    expect(r.attempts).toBe(4)
    expect(r.hints).toBe(0)
    expect(r.grid).toHaveLength(1)
  })

  test("second example: 12 attempts, 2 hints", () => {
    const r = parseInput(blocks[1]!)[0] as ConexoResult
    expect(r.date).toBe("2026-01-27")
    expect(r.attempts).toBe(12)
    expect(r.hints).toBe(2)
    expect(r.grid).toHaveLength(2)
  })
})

describe("framed parser", () => {
  const results = parseInput(readSample("framed.txt"))

  test("parses Framed #818", () => {
    expect(results).toHaveLength(1)
    const r = results[0] as FramedResult
    expect(r.gameType).toBe("framed")
    expect(r.gameNumber).toBe(818)
    expect(r.won).toBe(false) // all 🟥
    expect(r.grid).toHaveLength(1)
  })
})

describe("gamedle parser", () => {
  const blocks = splitBlocks(readSample("gamedle.txt"))

  test("block format: first example has 4 modes", () => {
    const results = parseInput(blocks[0]!)
    expect(results).toHaveLength(1)
    const r = results[0] as GamedleResult
    expect(r.modes).toHaveLength(4)
  })

  test("block format: all modes have grids", () => {
    const results = parseInput(blocks[0]!)
    const r = results[0] as GamedleResult
    for (const mode of r.modes) {
      expect(mode.grid.length).toBeGreaterThan(0)
    }
  })

  test("block format: Capa has 🟩 → won", () => {
    const results = parseInput(blocks[0]!)
    const r = results[0] as GamedleResult
    expect(r.modes[0]!.won).toBe(true)
  })

  test("single-line format: parses 5 modes", () => {
    const results = parseInput(blocks[2]!)
    expect(results).toHaveLength(1)
    const r = results[0] as GamedleResult
    expect(r.modes).toHaveLength(5)
    expect(r.date).toBe("2024-06-06")
  })
})

describe("guessthegame parser", () => {
  const blocks = splitBlocks(readSample("guessthegame.txt"))

  test("parses all 3 examples", () => {
    for (const block of blocks) {
      const results = parseInput(block)
      expect(results).toHaveLength(1)
      expect(results[0]!.gameType).toBe("guessthegame")
    }
  })

  test("#754 with footer lines", () => {
    const r = parseInput(blocks[2]!)[0] as GuessTheGameResult
    expect(r.gameNumber).toBe(754)
    expect(r.won).toBe(false)
  })
})

describe("letroso parser", () => {
  const blocks = splitBlocks(readSample("letroso.txt"))

  test("parses all 3 examples", () => {
    for (const block of blocks) {
      const results = parseInput(block)
      expect(results).toHaveLength(1)
      expect(results[0]!.gameType).toBe("letroso")
    }
  })

  test("9 attempts, grid includes ⬛ and ✅", () => {
    const r = parseInput(blocks[0]!)[0] as LetrosoResult
    expect(r.attempts).toBe(9)
    expect(r.won).toBe(true)
    expect(r.grid[r.grid.length - 1]).toBe("✅")
  })

  test("2 attempts, minimal grid", () => {
    const r = parseInput(blocks[2]!)[0] as LetrosoResult
    expect(r.attempts).toBe(2)
    expect(r.won).toBe(true)
  })
})

describe("termo parser", () => {
  const text = readSample("termo.txt")
  const results = parseInput(text)

  test("detects 3 termo modes (normal, duet, quad)", () => {
    // All three headers are in one paste, the parser groups by mode
    expect(results.length).toBeGreaterThanOrEqual(1)
    const termoResults = results.filter((r) => r.gameType === "termo")
    expect(termoResults.length).toBeGreaterThanOrEqual(1)

    const allModes = termoResults.flatMap((r) => (r as TermoResult).modes)
    const modeNames = allModes.map((m) => m.mode)
    expect(modeNames).toContain("normal")
    expect(modeNames).toContain("duet")
    expect(modeNames).toContain("quad")
  })

  test("normal mode has 6-row grid", () => {
    const termoResults = results.filter((r) => r.gameType === "termo")
    const allModes = termoResults.flatMap((r) => (r as TermoResult).modes)
    const normal = allModes.find((m) => m.mode === "normal")!
    expect(normal.grid).toHaveLength(6)
    expect(normal.gameNumber).toBe(1302)
  })
})

// ---------------------------------------------------------------------------
// isEmojiLine edge cases (the root cause of the bug)
// ---------------------------------------------------------------------------

describe("emoji line detection", () => {
  test("⬛ (U+2B1B) is recognized", () => {
    expect(isEmojiLine("⬛⬛⬛⬛⬛")).toBe(true)
  })

  test("⬜ (U+2B1C) is recognized", () => {
    expect(isEmojiLine("⬜⬜⬜⬜")).toBe(true)
  })

  test("mixed 🟩⬜ line", () => {
    expect(isEmojiLine("🟩⬜⬜⬜")).toBe(true)
  })

  test("mixed 🟥🟩⬜ line", () => {
    expect(isEmojiLine("🟥🟥🟩⬜⬜⬜")).toBe(true)
  })

  test("letroso-style line with ⬛ and 🟢", () => {
    expect(isEmojiLine("🟨⬛🟩⬛⬛⬛⬛⬛⬛🟩")).toBe(true)
  })

  test("conexo grid with ❌ and 💡", () => {
    expect(isEmojiLine("❌🟩🟧❌❌❌💡💡❌❌")).toBe(true)
  })

  test("plain text is not emoji", () => {
    expect(isEmojiLine("Joguei conexo.ws")).toBe(false)
  })

  test("empty string is not emoji", () => {
    expect(isEmojiLine("")).toBe(false)
  })
})
