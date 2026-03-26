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
| `export` | `export <input.excalidraw> [-o output.svg]` | `.svg` file (pure Node.js, no browser) |
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

1. **Generate** the `.excalidraw` source:
   ```bash
   node ~/.claude/skills/excalidraw-cli/scripts/excalidraw.mjs generate \
     "<description>" Images/my-diagram.excalidraw
   ```

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

If the source already exists as Mermaid, use `mermaid` instead of `generate` in step 1.

---

## Dracula colour palette

Always use these colours when calling `generate` or manually authoring `.excalidraw` JSON:

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

## ANTHROPIC_API_KEY

The `generate` command calls the Claude API (`claude-sonnet-4-6`). The key must be present in the environment:

```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

If the key is absent, fall back to the `mermaid` command or hand-author the `.excalidraw` JSON directly.

---

## File location convention

Store `.excalidraw` source files alongside their rendered `.svg` in an `Images/` directory relative to the document that references them — matching the pattern used by the `marp_gen` skill.
