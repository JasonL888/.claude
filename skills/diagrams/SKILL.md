---
name: diagrams
description: >
  Create diagrams and visualizations for embedding in MD/MDX files. Exports both as SVG with consistent storage resolution.
  Trigger phrases: "add a diagram", "draw a diagram", "create a visualization", "diagram this", "visualize", "illustrate", "add a chart"
metadata:
  tags: diagrams, visualization
---

# diagrams

A skill for creating, exporting, and embedding diagrams in MD/MDX files. All tools produce an SVG stored and referenced using a consistent storage resolution pattern.

---

## 1. Tool Decision
 Use **Mermaid** only for the following cases:

| When user wants... | Use mermaid type |
|---|---|
| message sequence chart | `sequenceDiagram` |
| Project planning, sprints, task scheduling | `gantt` |
| Complex (> 10 nodes) flow charts ,decision trees, workflows | `flowchart LR/TD` |
| 2×2 priority/risk/effort matrices | `quadrantChart` |

Otherwise, use **Excalidraw** as default.

---

## 2. Semantic Color Palette (Dracula)

Use the same palette across all tools. Never use other hex values.

| Role | Semantic meaning | Hex |
|------|-----------------|-----|
| Data | Inputs, datasets, outputs | `#8be9fd` (cyan) |
| Model / Component | Algorithms, services, classes | `#bd93f9` (purple) |
| Process | Operations, transformation, actions | `#ffb86c` (orange) |
| Result | Outputs, success, metrics | `#50fa7b` (green) |
| Error / Loss | Errors, warnings, problems | `#ff5555` (red) |
| Annotation | Callouts, labels, key ideas | `#f1fa8c` (yellow) |
| Canvas background | — | `#282a36` |
| Text / foreground | — | `#f8f8f2` |

---

## 3. Mermaid Workflow

### Render command (all types)

```bash
mmdc -i /tmp/name.mmd -o /tmp/name.svg --backgroundColor "#282a36"
# If mmdc is not in PATH, use:
# npx -p @mermaid-js/mermaid-cli mmdc -i /tmp/name.mmd -o /tmp/name.svg --backgroundColor "#282a36"
```

> **SVG sizing rule:** After rendering, remove the `width` and `height` attributes from the `<svg>` element — keep only `viewBox`. Fixed pixel dimensions override CSS and prevent the image from scaling to the container width.

### Dracula theme init block

Add this at the top of `.mmd` files to set the background and colors:

```
%%{init: {'theme': 'base', 'themeVariables': {
  'background': '#282a36',
  'primaryColor': '#44475a',
  'primaryTextColor': '#f8f8f2',
  'primaryBorderColor': '#6272a4',
  'lineColor': '#f8f8f2',
  'secondaryColor': '#44475a',
  'tertiaryColor': '#282a36'
}}}%%
```
---

### Mermaid Diagram Types — Syntax & Templates

Read the template file for the chosen diagram type before writing:

| Diagram type | Template file |
|---|---|
| `sequenceDiagram` | `~/.claude/skills/diagrams/templates/sequence-diagram.md` |
| `gantt` | `~/.claude/skills/diagrams/templates/gantt.md` |
| `flowchart LR/TD` | `~/.claude/skills/diagrams/templates/flowchart.md` |
| `quadrantChart` | `~/.claude/skills/diagrams/templates/quadrant-chart.md` |

For text lines that exceed the width of a node, use the `<br>` to break them into multiple lines.

---

## 5. Excalidraw Workflow

**Invoke the `excalidraw-cli` skill** for all Excalidraw diagrams.

For diagrams comparing 2–5 concepts side by side (comparisons, pipeline stages, sequential steps), use the **card layout** pattern — read `~/.claude/skills/excalidraw-cli/templates/card-layout.md` before authoring.

---

## 6. Storage Resolution

After producing the SVG, resolve the destination — check in order (keep both the source SVG and the original source file, whether .mmd or .excalidraw):

### A. Remote CDN / S3

Check the project `.env` for `NEXT_PUBLIC_ASSETS_URL`, `CDN_URL`, `S3_IMAGES_URL`, or `PUBLIC_IMAGES_URL`.

If set and non-empty:

```bash
aws s3 cp /tmp/name.svg s3://{bucket}/images/courses/{slug}/name.svg
aws s3 cp /tmp/name.excalidraw s3://{bucket}/images/courses/{slug}/name.excalidraw   # or .mmd
```

Reference in MD/MDX:

```markdown
![description](${NEXT_PUBLIC_ASSETS_URL}/images/courses/{slug}/name.svg)
```

---

### B. Next.js / web project public folder

Check for a `public/` or `frontend/public/` directory in the project root.

If found:

```bash
mkdir -p {public}/images/courses/{slug}
cp /tmp/name.svg {public}/images/courses/{slug}/name.svg
cp /tmp/name.excalidraw {public}/images/courses/{slug}/name.excalidraw   # or .mmd
```

Reference in MD/MDX:

```markdown
![description](/images/courses/{slug}/name.svg)
```

---

### C. Standalone MD/MDX (fallback)

When neither a CDN config nor a `public/` folder is found:

```bash
mkdir -p Images
mv /tmp/name.svg Images/name.svg
mv /tmp/name.excalidraw Images/name.excalidraw   # or .mmd
```

Reference in MD/MDX:

```markdown
![description](Images/name.svg)
```

