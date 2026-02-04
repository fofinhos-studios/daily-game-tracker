export function isEmojiLine(line: string): boolean {
  const trimmed = line.trim()
  if (trimmed.length === 0) return false
  // Check if the line is primarily composed of emoji/special characters
  // Remove known emoji sequences and whitespace, see if anything alphanumeric remains
  const stripped = trimmed
    .replace(/[\u{1F300}-\u{1FAFF}]/gu, "")
    .replace(/[\u{2600}-\u{27BF}]/gu, "")
    .replace(/[\u{FE00}-\u{FE0F}]/gu, "") // variation selectors
    .replace(/\u{200D}/gu, "") // zero-width joiner
    .replace(/\u{20E3}/gu, "") // combining enclosing keycap
    .replace(/[\u{E0020}-\u{E007F}]/gu, "") // tags
    .replace(/[0-9]/g, "") // keycap base digits
    .replace(/\s/g, "")
  return stripped.length === 0 || stripped.length < trimmed.length * 0.3
}

export function collectEmojiLines(lines: string[], startIndex: number): { grid: string[]; count: number } {
  const grid: string[] = []
  let i = startIndex
  while (i < lines.length) {
    const line = lines[i]!
    const trimmed = line.trim()
    if (trimmed.length === 0) {
      // blank line — peek ahead to see if more emoji lines follow
      if (i + 1 < lines.length && isEmojiLine(lines[i + 1]!)) {
        i++
        continue
      }
      break
    }
    if (isEmojiLine(trimmed) || trimmed === "✅") {
      grid.push(trimmed)
      i++
    } else {
      break
    }
  }
  return { grid, count: i - startIndex }
}

export function hasGreenSquare(grid: string[]): boolean {
  return grid.some((row) => row.includes("🟩"))
}
