import { describe, expect, test } from "bun:test"
import { ClipboardPaste } from "lucide-react"
import { SectionHeading } from "../SectionHeading"

describe("SectionHeading", () => {
  test("renders a decorative icon before the title", () => {
    const heading = SectionHeading({
      children: "Paste Results",
      help: "Help text",
      icon: ClipboardPaste,
    })
    const title = heading.props.children[0]

    expect(title.props.children[0].type).toBe(ClipboardPaste)
    expect(title.props.children[1]).toBe("Paste Results")
  })
})
