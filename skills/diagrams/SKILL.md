---
name: diagrams
description: >
  Create diagrams and visualizations for embedding in MD/MDX files. Decides between
  Mermaid (structure, logic, pipelines) and Excalidraw (intuition, concepts, metaphors),
  exports both as SVG, and stores them using the correct project location.
  Trigger phrases: "add a diagram", "draw a diagram", "create a visualization",
  "diagram this concept", "visualize the pipeline", "illustrate this", "add a chart",
  "diagram for the lesson", "show this as a diagram", "create a mermaid diagram".
metadata:
  tags: diagrams, mermaid, excalidraw, mdx, visualization, ml-course
---

# diagrams

A skill for creating, exporting, and embedding diagrams in MD/MDX files. Both tools produce an SVG that is stored and referenced using a consistent storage resolution pattern.

---

## 1. Tool Decision

**One question:** *"After seeing this diagram, would a student do something or understand something?"*

- **Do something** (follow steps, implement, trace a flow) → **Mermaid**
- **Understand something** (grasp a concept, build intuition, see a metaphor) → **Excalidraw**

---

### Use Mermaid for:

- Pipelines, workflows, sequences, lifecycles, decision trees
- Anything with discrete inputs → outputs → next step
- Keywords: "pipeline", "workflow", "steps", "architecture", "sequence", "flow", "process", "lifecycle", "decision"

### Use Excalidraw for:

- Intuitions, spatial concepts, visual metaphors, geometry, "why" explanations
- Anything where shape, position, or annotation carries the meaning
- Keywords: "intuition", "concept", "explain", "space", "gradient", "curve", "manifold", "why", "visualize"

**If a concept needs both:** produce a *pair* — Excalidraw first (intuition), Mermaid second (structure). Never mix both tools into a single diagram.

### Reference table

| Scenario | Tool |
|---|---|
| ML training pipeline | Mermaid |
| Gradient descent "rolling downhill" | Excalidraw |
| Data preprocessing steps | Mermaid |
| Overfitting vs underfitting curves | Excalidraw |
| API sequence (model server ↔ app) | Mermaid |
| Attention mechanism explanation | Excalidraw |
| Feature engineering steps | Mermaid |
| Embedding space / clusters | Excalidraw |
| Training vs inference split | Mermaid |
| Loss landscape | Excalidraw |

---

## 2. Semantic Color Palette (Dracula)

Use the same palette for both tools. Never use other hex values.

| Role | Semantic meaning | Hex |
|------|-----------------|-----|
| Data | Inputs, datasets, outputs | `#8be9fd` (cyan) |
| Model | Algorithms, networks | `#bd93f9` (purple) |
| Process | Training, preprocessing, transformation | `#ffb86c` (orange) |
| Result | Predictions, metrics, outputs | `#50fa7b` (green) |
| Error / Loss | Loss, errors, problems | `#ff5555` (red) |
| Annotation | Callouts, labels, key ideas | `#f1fa8c` (yellow) |
| Canvas background | — | `#282a36` |
| Text / foreground | — | `#f8f8f2` |

---

## 3. Mermaid Workflow

### Step A — write source

1. Choose diagram direction: `flowchart LR` for pipelines, `flowchart TD` for hierarchies.
2. Keep node labels in Title Case, ≤3 words. Max 7±2 nodes; split into multiple diagrams if larger.
3. Shape conventions: rectangles = processes, diamonds = decisions, cylinders = data storage.
4. Write the `.mmd` file to a temp path first:

```bash
# Write to /tmp/<name>.mmd
```

Every `.mmd` file must start with the Dracula theme override:

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

Then color-code nodes with `style` directives matching the semantic palette:

```
style NodeName fill:#8be9fd,stroke:#6272a4,color:#282a36
```

### Step B — export to SVG

```bash
mmdc -i /tmp/name.mmd -o /tmp/name.svg --backgroundColor "#282a36"
```

### Step C — store and embed

See **Section 5: Storage Resolution** below.

---

## 4. Excalidraw Workflow

### Step A — generate and export

Use the `excalidraw-cli` skill:

```bash
# Generate from description (requires ANTHROPIC_API_KEY)
node ~/.claude/skills/excalidraw-cli/scripts/excalidraw.mjs generate \
  "<description>" /tmp/name.excalidraw

# Export to SVG
node ~/.claude/skills/excalidraw-cli/scripts/excalidraw.mjs export \
  /tmp/name.excalidraw
# → /tmp/name.svg
```

Excalidraw style rules:
- Use Dracula palette (canvas `#282a36`, text `#f8f8f2`) — enforced by `excalidraw-cli`
- Hand-drawn style; arrows with short annotation labels near them
- Highlight the key idea with a thicker stroke
- Keep it "whiteboard-like" — embrace rough lines and minimal geometry

### Step B — store and embed

See **Section 5: Storage Resolution** below.

---

## 5. Storage Resolution

After producing the SVG (and source file), resolve the destination — check in order:

### 1. Remote CDN / S3

Check the project `.env` for `NEXT_PUBLIC_ASSETS_URL`, `CDN_URL`, `S3_IMAGES_URL`, or `PUBLIC_IMAGES_URL`.

If set and non-empty:

```bash
# Upload SVG (and source) to S3-compatible storage
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

Reference in MD/MDX (absolute path from public root):

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

Reference in MD/MDX (relative path):

```markdown
![description](Images/name.svg)
```

---

## 6. Standard Templates

Use these as starting descriptions or `.mmd` starters for common patterns.

### ML Pipeline (Mermaid)

```
flowchart LR
  D[Raw Data] --> P[Preprocessing] --> F[Feature Engineering] --> M[Model] --> E[Evaluation]
  style D fill:#8be9fd,stroke:#6272a4,color:#282a36
  style P fill:#ffb86c,stroke:#6272a4,color:#282a36
  style F fill:#ffb86c,stroke:#6272a4,color:#282a36
  style M fill:#bd93f9,stroke:#6272a4,color:#282a36
  style E fill:#50fa7b,stroke:#6272a4,color:#282a36
```

### Training Loop (Mermaid)

```
flowchart LR
  D[Data] --> M[Model] --> P[Predictions] --> L[Loss] --> O[Optimizer] --> M
  style D fill:#8be9fd,stroke:#6272a4,color:#282a36
  style M fill:#bd93f9,stroke:#6272a4,color:#282a36
  style P fill:#50fa7b,stroke:#6272a4,color:#282a36
  style L fill:#ff5555,stroke:#6272a4,color:#282a36
  style O fill:#ffb86c,stroke:#6272a4,color:#282a36
```

### Gradient Descent Intuition (Excalidraw description)

```
generate "Gradient descent intuition: a ball rolling down a curved loss landscape.
X-axis = model weights, Y-axis = loss. Show a parabola-shaped curve in red (#ff5555),
a ball (circle) at a high point, an arrow pointing downhill labeled 'gradient direction',
and the minimum labeled 'optimal weights' in green (#50fa7b).
Annotations: 'learning rate = step size', 'loss decreases each step'.
Dracula dark background."
```

### Overfitting vs Underfitting (Excalidraw description)

```
generate "Three side-by-side scatter plots on a dark Dracula background.
Left: underfitting — a straight line through curved data, labeled 'too simple'.
Center: good fit — a smooth curve through data, labeled 'just right' in green (#50fa7b).
Right: overfitting — a jagged line hitting every point, labeled 'too complex' in red (#ff5555).
Data points in cyan (#8be9fd). Hand-drawn style with annotations."
```

---

## 7. Quality Checklist

Before embedding a diagram, ask:

1. Is this diagram necessary — does it add something the text cannot?
2. Is it clear in under 5 seconds?
3. Did I pick the right tool (Mermaid = do, Excalidraw = understand)?
4. Are colors consistent with the semantic palette?
5. Can it be simplified further (fewer nodes, shorter labels)?
