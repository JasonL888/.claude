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

- If the goal is to **build intuition** (metaphors, spatial reasoning, "why" explanations, hand-drawn feel) → **Excalidraw**
- Otherwise → **Mermaid** (pick the right type below)

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
| Spatial intuition, metaphors, geometry, "why" | Excalidraw |

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

> **SVG sizing rule:** After rendering, remove the `width` and `height` attributes from the `<svg>` element — keep only `viewBox`. Fixed pixel dimensions override CSS and prevent the image from scaling to the container width. This applies to hand-crafted SVGs too.

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

### `architecture-beta` — Network / System Architecture

Built-in icons: `cloud`, `database`, `disk`, `internet`, `server`

```
architecture-beta
  group vpc(cloud)[AWS VPC]
    service db(database)[PostgreSQL] in vpc
    service api(server)[API Server] in vpc
    service store(disk)[S3] in vpc

  service client(internet)[Browser]

  client:R --> L:api
  api:R --> L:db
  api:B --> T:store
```

Edge syntax: `id1:R --> L:id2` where sides are `L` (left), `R` (right), `T` (top), `B` (bottom). Use `-->` for directed, `--` for undirected.

---

### `flowchart` — Pipelines, Workflows, Decision Trees

```
%%{init: {'theme': 'base', 'themeVariables': {'background': '#282a36', 'primaryColor': '#44475a', 'primaryTextColor': '#f8f8f2', 'primaryBorderColor': '#6272a4', 'lineColor': '#f8f8f2'}}}%%
flowchart LR
  D[Raw Data] --> P[Preprocess] --> M[Model] --> E[Evaluate]
  style D fill:#8be9fd,stroke:#6272a4,color:#282a36
  style P fill:#ffb86c,stroke:#6272a4,color:#282a36
  style M fill:#bd93f9,stroke:#6272a4,color:#282a36
  style E fill:#50fa7b,stroke:#6272a4,color:#282a36
```

Shape conventions: `[rect]` = process, `{diamond}` = decision, `[(cylinder)]` = storage, `((circle))` = terminal. Max 7±2 nodes.

---

### `classDiagram` — OOP Classes

```
%%{init: {'theme': 'base', 'themeVariables': {'background': '#282a36', 'primaryColor': '#44475a', 'primaryTextColor': '#f8f8f2', 'primaryBorderColor': '#6272a4', 'lineColor': '#f8f8f2'}}}%%
classDiagram
  class Animal {
    +String name
    +int age
    +speak() String
  }
  class Dog {
    +fetch() void
  }
  Animal <|-- Dog
```

Relationships: `<|--` inheritance, `*--` composition, `o--` aggregation, `-->` association, `..>` dependency.

---

### `erDiagram` — Entity Relationships

```
%%{init: {'theme': 'base', 'themeVariables': {'background': '#282a36', 'primaryColor': '#44475a', 'primaryTextColor': '#f8f8f2', 'primaryBorderColor': '#6272a4', 'lineColor': '#f8f8f2'}}}%%
erDiagram
  USER {
    int id PK
    string email
    string name
  }
  ORDER {
    int id PK
    int user_id FK
    date created_at
  }
  PRODUCT {
    int id PK
    string name
    float price
  }
  USER ||--o{ ORDER : places
  ORDER }o--|{ PRODUCT : contains
```

Cardinality: `||--||` one-to-one, `||--o{` one-to-many, `}o--o{` many-to-many.

---

### `stateDiagram-v2` — State Machines

```
%%{init: {'theme': 'base', 'themeVariables': {'background': '#282a36', 'primaryColor': '#44475a', 'primaryTextColor': '#f8f8f2', 'primaryBorderColor': '#6272a4', 'lineColor': '#f8f8f2'}}}%%
stateDiagram-v2
  [*] --> Idle
  Idle --> Running : start
  Running --> Paused : pause
  Paused --> Running : resume
  Running --> [*] : stop
```

Use `state "Label" as id` for long names. Nest states with `state Outer { inner }`.

---

### `sequenceDiagram` — API / Message Sequences

```
%%{init: {'theme': 'base', 'themeVariables': {'background': '#282a36', 'primaryColor': '#44475a', 'primaryTextColor': '#f8f8f2', 'primaryBorderColor': '#6272a4', 'lineColor': '#f8f8f2'}}}%%
sequenceDiagram
  participant C as Client
  participant A as API
  participant D as Database

  C->>A: POST /login
  A->>D: SELECT user WHERE email=?
  D-->>A: user row
  A-->>C: 200 OK + JWT
```

Arrow types: `->>` async, `-->>` dashed reply, `->>+` activate, `-->>-` deactivate.

---

### `gantt` — Project / Sprint Planning

```
%%{init: {'theme': 'base', 'themeVariables': {'background': '#282a36', 'primaryColor': '#44475a', 'primaryTextColor': '#f8f8f2', 'primaryBorderColor': '#6272a4', 'lineColor': '#f8f8f2'}}}%%
gantt
  title Sprint 1
  dateFormat YYYY-MM-DD
  section Backend
    Auth API       : done,    b1, 2024-01-01, 3d
    Data models    : active,  b2, after b1, 2d
    REST endpoints :          b3, after b2, 4d
  section Frontend
    Login UI       :          f1, 2024-01-03, 3d
    Dashboard      :          f2, after f1, 5d
```

---

### `timeline` — Chronological Events

```
timeline
  title History of AI
  1950 : Turing Test proposed
  1956 : Dartmouth Conference
       : Term "AI" coined
  1997 : Deep Blue beats Kasparov
  2012 : AlexNet ImageNet breakthrough
  2022 : ChatGPT released
```

No `%%{init}%%` support. Use `--backgroundColor` only.

---

### `mindmap` — Topic Hierarchies

```
mindmap
  root((Machine Learning))
    Supervised
      Classification
      Regression
    Unsupervised
      Clustering
      Dimensionality Reduction
    Reinforcement
      Q-Learning
      Policy Gradient
```

Indent = hierarchy level. `root((...))` = circle, `root[...]` = rect, `root(((...)))` = double circle.

---

### `journey` — User Experience Flows

```
%%{init: {'theme': 'base', 'themeVariables': {'background': '#282a36', 'primaryColor': '#44475a', 'primaryTextColor': '#f8f8f2', 'primaryBorderColor': '#6272a4', 'lineColor': '#f8f8f2'}}}%%
journey
  title User Checkout Flow
  section Browse
    Search product: 5: User
    View details: 4: User
  section Purchase
    Add to cart: 5: User
    Enter payment: 3: User, System
    Confirm order: 5: User, System
  section Post-purchase
    Receive email: 4: System
```

Score 1–5 = satisfaction level. Multiple actors per step.

---

### `pie` — Distribution / Proportions

```
%%{init: {'theme': 'base', 'themeVariables': {'background': '#282a36', 'primaryTextColor': '#f8f8f2'}}}%%
pie title Traffic Sources
  "Organic Search" : 42
  "Direct" : 28
  "Social" : 18
  "Referral" : 12
```

---

### `xychart-beta` — Line / Bar Charts

```
xychart-beta
  title "Monthly Revenue ($k)"
  x-axis [Jan, Feb, Mar, Apr, May, Jun]
  y-axis "Revenue" 0 --> 100
  bar [40, 55, 48, 72, 65, 90]
  line [40, 55, 48, 72, 65, 90]
```

No `%%{init}%%` support. Can combine `bar` and `line` series.

---

### `sankey-beta` — Flow Volumes

```
sankey-beta
  Energy Source,Electricity,120
  Energy Source,Heat,80
  Electricity,Data Centers,60
  Electricity,Homes,60
  Heat,Industry,80
```

Format: `Source,Target,Value` (one per line, no headers).

---

### `quadrantChart` — 2×2 Matrix

```
%%{init: {'theme': 'base', 'themeVariables': {'background': '#282a36', 'primaryTextColor': '#f8f8f2', 'primaryBorderColor': '#6272a4'}}}%%
quadrantChart
  title Feature Prioritization
  x-axis Low Effort --> High Effort
  y-axis Low Impact --> High Impact
  quadrant-1 Do First
  quadrant-2 Plan
  quadrant-3 Deprioritize
  quadrant-4 Delegate
  Auth Revamp: [0.3, 0.8]
  New Dashboard: [0.7, 0.9]
  Bug Fixes: [0.2, 0.5]
  Dark Mode: [0.6, 0.3]
```

---

### `block-beta` — System Block Diagrams

```
block-beta
  columns 3
  A["Frontend"] B["API Gateway"] C["Backend"]
  space D["Cache"] space
  space E["Database"] space
  A --> B
  B --> C
  C --> D
  C --> E
```

Use `columns N` to set grid width. `space` = empty cell.

---

### `packet-beta` — Network Packet Structure

```
packet-beta
  0-7: "Version"
  8-15: "IHL"
  16-31: "Total Length"
  32-63: "Identification"
  64-79: "Flags + Fragment Offset"
  80-95: "TTL + Protocol"
  96-127: "Header Checksum"
  128-159: "Source IP"
  160-191: "Destination IP"
```

Format: `start-end: "Field Name"`. Bit ranges are inclusive.

---

### `kanban` — Task Boards

```
kanban
  column Todo
    task1["Write tests"]
    task2["Update docs"]
  column "In Progress"
    task3["Implement auth"]
  column Done
    task4["Setup CI/CD"]
```

---

## 5. Excalidraw Workflow

### Choosing the right output path

| Diagram contains | Use |
|-----------------|-----|
| Shapes + arrows only (no text labels) | Write `.excalidraw` JSON → `export` → SVG |
| Text labels / callouts / annotations | Write raw SVG directly (see below) |

> **Known limitation:** The `export` command renders text elements with `y="NaN"` because jsdom cannot resolve Virgil font metrics at export time. Any diagram with text labels will produce invisible text in the SVG. Use raw SVG for text-heavy diagrams.

### Path A — shapes/arrows only: Write `.excalidraw` → export

Because this skill runs inside Claude Code, write the `.excalidraw` JSON directly — **no API key needed**:

1. **Write** the JSON to `/tmp/name.excalidraw` using the Write tool (schema in `excalidraw-cli/SKILL.md`)
2. **Export** to SVG:
   ```bash
   node ~/.claude/skills/excalidraw-cli/scripts/excalidraw.mjs export \
     /tmp/name.excalidraw
   # → /tmp/name.svg
   ```
3. Store and embed per Section 6.

The `generate "<description>"` CLI command also works but requires `ANTHROPIC_API_KEY` in the environment — only use it when running the CLI outside of Claude Code.

### Path B — text-heavy diagrams: Write raw SVG directly

Write an SVG file directly with the Write tool. Use the Dracula palette and `"Segoe UI", Arial, sans-serif` as the font stack (reliable across all platforms):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 500">
  <defs>
    <style>text { font-family: "Segoe UI", Arial, sans-serif; }</style>
  </defs>
  <rect width="900" height="500" fill="#282a36"/>
  <!-- shapes and text here -->
</svg>
```

SVG style rules:
- `viewBox` only — no `width` or `height` on the `<svg>` element
- Dracula palette for all colours
- `text-anchor="middle"` + explicit `x`/`y` for centred labels
- `rx`/`ry` on `<rect>` for rounded corners
- Dashed lines: `stroke-dasharray="5,4"`
- Arrow markers: define a `<marker>` in `<defs>` and reference with `marker-end`

### Step B — store and embed

See **Section 6: Storage Resolution** below.

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
