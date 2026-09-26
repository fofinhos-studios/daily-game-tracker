export const KRILLION_TIERS = {
  miss: { emoji: "⬛", label: "Miss", points: 0 },
  plankton: { emoji: "🫧", label: "Plankton", points: 10 },
  tooClever: { emoji: "🤡", label: "Too Clever", points: 15 },
  schooler: { emoji: "🐟", label: "Schooler", points: 30 },
  rare: { emoji: "🦑", label: "Rare", points: 60 },
  deepCut: { emoji: "🏮", label: "Deep Cut", points: 85 },
  krillion: { emoji: "🌟", label: "One in a Krillion", points: 100 },
} as const

export type KrillionTier = keyof typeof KRILLION_TIERS

const TIER_BY_EMOJI = Object.fromEntries(
  Object.entries(KRILLION_TIERS).map(([tier, value]) => [value.emoji, tier]),
) as Record<string, KrillionTier>

const SCORE_BANDS = [
  { min: 0, range: "0–150", label: "Plankton" },
  { min: 151, range: "151–250", label: "Schooler" },
  { min: 251, range: "251–350", label: "Rare" },
  { min: 351, range: "351–449", label: "Deep cut" },
  { min: 450, range: "450+", label: "One in a krillion" },
] as const

export function krillionTierFromEmoji(emoji: string): KrillionTier | undefined {
  return TIER_BY_EMOJI[emoji]
}

export function isKrillionTier(value: unknown): value is KrillionTier {
  return typeof value === "string" && Object.hasOwn(KRILLION_TIERS, value)
}

export function krillionScore(tiers: readonly KrillionTier[]): number {
  return tiers.reduce((score, tier) => score + KRILLION_TIERS[tier].points, 0)
}

export function krillionDate(gameNumber: number): string | null {
  if (!Number.isSafeInteger(gameNumber) || gameNumber < 1) return null
  const timestamp = Date.UTC(2026, 6, 16 + gameNumber - 1)
  if (!Number.isFinite(timestamp)) return null
  const date = new Date(timestamp)
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10)
}

export function krillionBand(score: number): (typeof SCORE_BANDS)[number] {
  return [...SCORE_BANDS].reverse().find(({ min }) => score >= min) ?? SCORE_BANDS[0]
}

export function formatKrillionGrid(tiers: readonly KrillionTier[]): string[] {
  const lines = tiers.map((tier, index) => {
    const { emoji, label, points } = KRILLION_TIERS[tier]
    return `${index + 1}. ${emoji} ${label} — ${points} pts`
  })
  const score = krillionScore(tiers)
  const band = krillionBand(score)
  lines.push(`Total: ${score} pts — ${band.label} (${band.range})`)
  return lines
}
