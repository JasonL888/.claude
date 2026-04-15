---
name: excalidraw-cli
description: >
  Use this skill to create, convert, export, or open Excalidraw diagrams.
  Trigger phrases: "create an excalidraw diagram", "draw a diagram of",
  "convert mermaid to excalidraw", "export excalidraw to svg",
  "generate diagram", "open excalidraw file", "make a hand-drawn diagram",
  "diagram this", "produce a .excalidraw file".
  For marp presentations needing an Excalidraw source + SVG pair, always run
  both `generate` (or `mermaid`) and then `export`.
metadata:
  tags: excalidraw, diagrams, svg, mermaid, ai-generate
---

# excalidraw-cli

A self-hosted Node.js CLI for creating, converting, exporting, and opening Excalidraw diagrams.

## CLI location

```
~/.claude/skills/excalidraw-cli/scripts/excalidraw.mjs
```

Invoke every command as:

```bash
node ~/.claude/skills/excalidraw-cli/scripts/excalidraw.mjs <command> [args]
```

## One-time setup

Run once after cloning or updating:

```bash
cd ~/.claude/skills/excalidraw-cli/scripts && npm install
```

The `canvas` package (needed by `export`) is a native addon — it builds automatically via `node-gyp`. On macOS it requires Xcode Command Line Tools (`xcode-select --install`).

---

## Command reference

| Command | Usage | Output |
|---------|-------|--------|
| `mermaid` | `mermaid <input.mmd> [output.excalidraw]` | `.excalidraw` JSON from Mermaid source |
| `export` | `export <input.excalidraw> [-o output.svg]` | `.svg` file with embedded fonts (pure Node.js, no browser) |
| `generate` | `generate "<description>" [output.excalidraw]` | AI-generated `.excalidraw` JSON |
| `open` | `open <input.excalidraw>` | Uploads to excalidraw.com and opens URL in browser |

### Examples

```bash
# Convert Mermaid → Excalidraw
node ~/.claude/skills/excalidraw-cli/scripts/excalidraw.mjs mermaid diagram.mmd diagram.excalidraw

# Export to SVG
node ~/.claude/skills/excalidraw-cli/scripts/excalidraw.mjs export diagram.excalidraw

# AI-generate from description (requires ANTHROPIC_API_KEY)
node ~/.claude/skills/excalidraw-cli/scripts/excalidraw.mjs generate \
  "data pipeline: raw CSV → cleaning → feature extraction → model training → deployment" \
  pipeline.excalidraw

# Open in browser
node ~/.claude/skills/excalidraw-cli/scripts/excalidraw.mjs open diagram.excalidraw
```

---

## Workflow: producing a diagram pair for Marp/MDX

When a Marp slide or MDX lesson needs both a source file and an embeddable SVG:

### Preferred: native Claude Code generation (no API key needed)

Because this skill runs inside Claude Code, use the Write tool to author the `.excalidraw` JSON directly — Claude Code IS the AI, so there is no need for a separate API call.

1. **Write** the `.excalidraw` JSON using the Write tool, following the element schema below
2. **Export** to SVG:
   ```bash
   node ~/.claude/skills/excalidraw-cli/scripts/excalidraw.mjs export \
     Images/my-diagram.excalidraw
   # → Images/my-diagram.svg
   ```
3. Reference in Marp/MDX:
   ```markdown
   ![diagram](Images/my-diagram.svg)
   ```

### Alternative: convert from existing Mermaid source

```bash
node ~/.claude/skills/excalidraw-cli/scripts/excalidraw.mjs mermaid \
  diagram.mmd Images/my-diagram.excalidraw
```

Then run `export` as above.

### Standalone CLI generation (requires ANTHROPIC_API_KEY)

Only use this when running the CLI outside of Claude Code:

```bash
node ~/.claude/skills/excalidraw-cli/scripts/excalidraw.mjs generate \
  "<description>" Images/my-diagram.excalidraw
```

---

## Element schema for native generation

Use this schema when authoring `.excalidraw` JSON with the Write tool.

### JSON envelope
```json
{
  "type": "excalidraw",
  "version": 2,
  "source": "claude-code",
  "elements": [],
  "appState": { "gridSize": null, "viewBackgroundColor": "#282a36" },
  "files": {}
}
```

### Required fields on every element
| Field | Values |
|-------|--------|
| `id` | unique string |
| `type` | `"rectangle"` \| `"ellipse"` \| `"diamond"` \| `"arrow"` \| `"line"` \| `"text"` |
| `x`, `y` | canvas coordinates (top-left corner) |
| `width`, `height` | numbers |
| `angle` | `0` |
| `strokeColor` | hex — use Dracula palette |
| `backgroundColor` | hex or `"transparent"` |
| `fillStyle` | `"solid"` \| `"hachure"` |
| `strokeWidth` | `1` \| `2` \| `4` |
| `roughness` | `0` (clean) for card layouts and most diagrams; `1` only when a hand-drawn feel is intentional |
| `opacity` | `100` |
| `groupIds` | `[]` |
| `seed` | any integer |

### Text elements — additional fields
- `text`: string (use `\n` for line breaks)
- `fontSize`: `16` \| `20` \| `28`
- `fontFamily`: `1` (Virgil, hand-drawn) \| `2` (Assistant, clean) \| `3` (Cascadia, code) \| `4` (Excalifont, hand-drawn) \| `5` (Nunito, clean) 
- `strokeColor`: **never `"transparent"`** — for text this is the fill colour; use `"#f8f8f2"` for standalone labels, `"#282a36"` for labels inside coloured shapes
- `lineHeight`: `1.25` — **always include this**; omitting it causes `y="NaN"` in the exported SVG
- `textAlign`: `"center"` \| `"left"`
- `verticalAlign`: `"middle"` \| `"top"`
- `containerId`: parent shape `id` to embed label inside a shape (or `null`)
- When `containerId` is set, the parent shape must have `"boundElements": [{"type": "text", "id": "<text-id>"}]`

### Arrow / Line elements — additional fields
- `points`: `[[0, 0], [dx, dy]]` — relative to element `x`/`y`
- `startArrowhead`: `null` \| `"arrow"`
- `endArrowhead`: `"triangle"` \| `null`
- `startBinding` / `endBinding`: `null` or `{ "elementId": "<id>", "focus": 0, "gap": 8 }`

### Layout guidelines
- Start shapes at x=100, y=100 with 100–150px gaps between nodes
- Rectangle nodes: 160w × 60h minimum
- Fit within roughly 1200w × 800h canvas
- Every visible shape should have a bound text label

#### Card layout
When the diagram shows 2–5 comparable concepts (comparisons, pipeline stages, step-by-step sequences), use the card layout template.
Read `~/.claude/skills/excalidraw-cli/templates/card-layout.md` before authoring.

---

## Dracula colour palette

Always use these colours when authoring `.excalidraw` JSON:

| Role | Hex |
|------|-----|
| Canvas background | `#282a36` |
| Text / foreground | `#f8f8f2` |
| Green accent | `#50fa7b` |
| Cyan accent | `#8be9fd` |
| Orange accent | `#ffb86c` |
| Pink accent | `#ff79c6` |
| Purple accent | `#bd93f9` |
| Red accent | `#ff5555` |
| Yellow accent | `#f1fa8c` |

Never hardcode other hex values. Map semantic roles (success, warning, info, error) to the palette above.

---

## File location convention

Store `.excalidraw` source files alongside their rendered `.svg` in an `Images/` directory relative to the document that references them — matching the pattern used by the `marp_gen` skill.
