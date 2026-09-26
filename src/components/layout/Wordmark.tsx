import { AsteriskSimpleIcon } from "@phosphor-icons/react"
import { useState } from "react"

function WordmarkGlyphs() {
  return (
    <>
      <AsteriskSimpleIcon className="brand-symbol" weight="bold" aria-hidden="true" />
      <span>
        <span className="wordmark-jp" lang="ja">
          ミニゲーム
        </span>
        <span className="wordmark-latin">(MINIGĒMU)</span>
      </span>
    </>
  )
}

export function Wordmark() {
  const [sweep, setSweep] = useState(0)
  return (
    <span
      className="wordmark"
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch") setSweep((current) => current + 1)
      }}
    >
      <WordmarkGlyphs />
      <span key={sweep} className="wordmark-glow" aria-hidden="true">
        <WordmarkGlyphs />
      </span>
    </span>
  )
}
