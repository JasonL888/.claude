---
name: excalidraw-to-svg
description: >
  Export Excalidraw diagrams to SVG.
  Trigger phrases: "export excalidraw to svg", "convert excalidraw to svg",
  "export diagram to svg", "produce svg from excalidraw".
metadata:
  tags: excalidraw, diagrams, svg, export
---

# excalidraw-to-svg

A self-hosted Node.js CLI for exporting Excalidraw diagrams to SVG.

## CLI location

```
~/.claude/skills/excalidraw-to-svg/scripts/excalidraw.mjs
```

Invoke the export command as:

```bash
node ~/.claude/skills/excalidraw-to-svg/scripts/excalidraw.mjs export <input.excalidraw> [-o output.svg]
```

## One-time setup

Run once after cloning or updating:

```bash
cd ~/.claude/skills/excalidraw-to-svg/scripts && npm install
```

The `canvas` package (needed by `export`) is a native addon — it builds automatically via `node-gyp`. On macOS it requires Xcode Command Line Tools (`xcode-select --install`).

---

## Command reference

| Command | Usage | Output |
|---------|-------|--------|
| `export` | `export <input.excalidraw> [-o output.svg]` | `.svg` file with embedded fonts (pure Node.js, no browser) |

### Example

```bash
# Export to SVG
node ~/.claude/skills/excalidraw-to-svg/scripts/excalidraw.mjs export diagram.excalidraw
# → diagram.svg (in same directory)
```

---

## Using this skill

To export an Excalidraw diagram to SVG, Claude Code will call this skill. You provide a `.excalidraw` file (either created or modified), and the skill exports it to `.svg` for embedding in Marp/MDX presentations or other documents.

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
