---
name: diagrams
description: >
  Create diagrams and visualizations for embedding in MD/MDX files. Supports all Mermaid
  diagram types (flowchart, architecture, class, ER, state, sequence, gantt, timeline,
  mindmap, journey, pie, xychart, sankey, quadrant, block, packet, kanban) plus Excalidraw
  for spatial/conceptual visuals. Exports both as SVG with consistent storage resolution.
  Trigger phrases: "add a diagram", "draw a diagram", "create a visualization",
  "diagram this", "visualize", "illustrate", "add a chart", "create a mermaid diagram",
  "draw a network diagram", "draw an architecture diagram", "draw a class diagram",
  "draw an ER diagram", "draw a state diagram", "draw a sequence diagram",
  "draw a mind map", "draw a gantt chart", "draw a timeline", "draw a pie chart",
  "draw a user journey", "draw a block diagram", "draw a kanban board".
metadata:
  tags: diagrams, mermaid, excalidraw, mdx, visualization, architecture, flowchart, class, er, state, sequence, gantt, timeline, mindmap, journey, pie, xychart, sankey, quadrant, block, packet, kanban
---

# diagrams

A skill for creating, exporting, and embedding diagrams in MD/MDX files. All tools produce an SVG stored and referenced using a consistent storage resolution pattern.

---

## 1. Tool Decision

### Step 1 — Is it spatial/conceptual intuition?

- If the goal is to **build intuition** (metaphors, spatial reasoning, "why" explanations, hand-drawn feel) → **Excalidraw** (shapes/arrows only — no text labels)
- If spatial/conceptual but needs text labels or callouts → **Mermaid** (`flowchart` or best fit)
- Otherwise → **Mermaid** (pick the right type below)

> **Note:** If you initially chose Excalidraw but the diagram needs text labels, switch to Mermaid instead.

### Step 2 — Which Mermaid type?

| When user wants... | Use |
|---|---|
| Network topology, cloud infra, system architecture, service maps | `architecture-beta` |
| OOP class hierarchy, interfaces, inheritance | `classDiagram` |
| Database schema, entity relationships | `erDiagram` |
| State machines, lifecycle, transitions | `stateDiagram-v2` |
| API calls, message passing, protocols | `sequenceDiagram` |
| Project planning, sprints, task scheduling | `gantt` |
| Historical or chronological events | `timeline` |
| Brainstorming, topic hierarchies, mind maps | `mindmap` |
| User experience flows, task walkthroughs | `journey` |
| Distribution, proportions, composition | `pie` |
| Line/bar charts, trends, comparisons | `xychart-beta` |
| Flow volumes, energy/data/cost flows | `sankey-beta` |
| 2×2 priority/risk/effort matrices | `quadrantChart` |
| System block diagrams, hardware components | `block-beta` |
| Network packet structure, byte fields | `packet-beta` |
| Task boards, work items | `kanban` |
| Pipelines, workflows, decision trees, processes | `flowchart LR/TD` |
| Spatial intuition, metaphors, geometry, "why" (shapes/arrows only) | Excalidraw |

**If a concept needs both:** produce a *pair* — Excalidraw first (intuition), Mermaid second (structure). Never mix both tools into a single diagram.

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

> **Note:** Not all Mermaid diagram types support style overrides or the `%%{init}%%` block. See Section 3 for which types support theming.

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

Add this at the top of `.mmd` files for types that support it. **Omit it for types that don't.**

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

| Supports `%%{init}%%` | Does NOT support `%%{init}%%` |
|---|---|
| `flowchart`, `classDiagram`, `erDiagram`, `stateDiagram-v2`, `sequenceDiagram`, `gantt`, `journey`, `pie`, `quadrantChart` | `architecture-beta`, `mindmap`, `timeline`, `xychart-beta`, `sankey-beta`, `block-beta`, `packet-beta`, `kanban` |

For types that don't support theming, rely on `--backgroundColor "#282a36"` for the dark background only.

---

## 4. Mermaid Diagram Types — Syntax & Templates

Read the template file for the chosen diagram type before writing:

| Diagram type | Template file |
|---|---|
| `flowchart` | `~/.claude/skills/diagrams/templates/flowchart.md` |
| `architecture-beta` | `~/.claude/skills/diagrams/templates/architecture.md` |
| `classDiagram` | `~/.claude/skills/diagrams/templates/class-diagram.md` |
| `erDiagram` | `~/.claude/skills/diagrams/templates/er-diagram.md` |
| `stateDiagram-v2` | `~/.claude/skills/diagrams/templates/state-diagram.md` |
| `sequenceDiagram` | `~/.claude/skills/diagrams/templates/sequence-diagram.md` |
| `gantt` | `~/.claude/skills/diagrams/templates/gantt.md` |
| `timeline` | `~/.claude/skills/diagrams/templates/timeline.md` |
| `mindmap` | `~/.claude/skills/diagrams/templates/mindmap.md` |
| `journey` | `~/.claude/skills/diagrams/templates/journey.md` |
| `pie` | `~/.claude/skills/diagrams/templates/pie.md` |
| `xychart-beta` | `~/.claude/skills/diagrams/templates/xychart.md` |
| `sankey-beta` | `~/.claude/skills/diagrams/templates/sankey.md` |
| `quadrantChart` | `~/.claude/skills/diagrams/templates/quadrant.md` |
| `block-beta` | `~/.claude/skills/diagrams/templates/block.md` |
| `packet-beta` | `~/.claude/skills/diagrams/templates/packet.md` |
| `kanban` | `~/.claude/skills/diagrams/templates/kanban.md` |

---

## 5. Excalidraw Workflow

**Invoke the `excalidraw-cli` skill** for all Excalidraw diagrams.

Excalidraw is only suitable when the diagram contains **shapes and arrows with no text labels**. The `export` command cannot render text (jsdom cannot resolve Virgil font metrics — text elements render at `y="NaN"`).

If the diagram needs text labels or callouts, use Mermaid instead.

---

## 6. Storage Resolution

After producing the SVG (and source file), resolve the destination — check in order:

### 1. Remote CDN / S3

Check the project `.env` for `NEXT_PUBLIC_ASSETS_URL`, `CDN_URL`, `S3_IMAGES_URL`, or `PUBLIC_IMAGES_URL`.

If set and non-empty:

```bash
aws s3 cp /tmp/name.svg s3://{bucket}/images/courses/{slug}/name.svg
aws s3 cp /tmp/name.mmd s3://{bucket}/images/courses/{slug}/name.mmd   # or .excalidraw
```

Reference in MD/MDX:

```markdown
![description](${NEXT_PUBLIC_ASSETS_URL}/images/courses/{slug}/name.svg)
```

---

### 2. Next.js / web project public folder

Check for a `public/` or `frontend/public/` directory in the project root.

If found:

```bash
mkdir -p {public}/images/courses/{slug}
cp /tmp/name.svg {public}/images/courses/{slug}/name.svg
cp /tmp/name.mmd {public}/images/courses/{slug}/name.mmd   # or .excalidraw
```

Reference in MD/MDX:

```markdown
![description](/images/courses/{slug}/name.svg)
```

---

### 3. Standalone MD/MDX (fallback)

When neither a CDN config nor a `public/` folder is found:

```bash
mkdir -p Images
mv /tmp/name.svg Images/name.svg
mv /tmp/name.mmd Images/name.mmd   # or .excalidraw
```

Reference in MD/MDX:

```markdown
![description](Images/name.svg)
```

---

## 7. Quality Checklist

Before embedding a diagram, ask:

1. Is this diagram necessary — does it add something the text cannot?
2. Is it clear in under 5 seconds?
3. Did I pick the right tool and diagram type?
4. Are colors consistent with the semantic palette (where supported)?
5. Can it be simplified further (fewer nodes, shorter labels)?
6. Does the source file exist alongside the SVG for future editing?
7. Does the `<svg>` element have only `viewBox` — no `width` or `height` attributes? (Fixed dimensions prevent CSS from controlling the rendered size.)
