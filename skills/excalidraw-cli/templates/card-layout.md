# Card Layout Template

## When to use

Use the card layout for diagrams showing **2–5 concepts side by side**: comparisons, pipeline stages, feature breakdowns, sequential steps with descriptions. Each card has a labelled coloured header and a dark body listing key points.

---

## Card anatomy

Each card is a group of 5 elements sharing a `groupId` (e.g. `"cardA"`):

| id suffix | type | key style |
|---|---|---|
| `-outer` | rectangle | 2px colored stroke · `#282a36` fill · `roundness {type:3, value:10}` |
| `-header` | rectangle | accent color fill · `transparent` stroke · `roundness {type:3, value:6}` |
| `-header-text` | text | `#282a36` strokeColor (dark text) · centered · `fontFamily:2` · `fontSize:16` · `lineHeight:1.25` |
| `-body` | rectangle | `#44475a` fill · `transparent` stroke · `roundness {type:3, value:6}` |
| `-body-text` | text | `#f8f8f2` strokeColor (light text) · centered · `fontFamily:2` · `fontSize:16` · `lineHeight:1.25` |

---

## Standard dimensions

All positions are relative to the card's top-left corner `(cx, cy)`.

```
outer:       x=cx,    y=cy,    w=260, h=190
header:      x=cx+12, y=cy+10, w=236, h=80
body:        x=cx+10, y=cy+92, w=240, h=80
header-text: x=cx+12, y=cy+10, w=236, h=80   (containerId → header id)
body-text:   x=cx+10, y=cy+92, w=240, h=80   (containerId → body id)
```

Use `containerId` on text elements so labels are bound to their parent shape. The parent shape must include `"boundElements": [{"type": "text", "id": "<text-id>"}]`.

**Horizontal layout spacing:**
- Gap between cards: 80px
- Stride (card + gap): 340px
- First card starts at: `cx=100, cy=100`

So for N cards: card k starts at `cx = 100 + (k * 340)`.

---

## Color assignment

Assign one Dracula accent per card. Match semantic role where possible:

| Priority | Color | Hex | Semantic role |
|---|---|---|---|
| 1 | Purple | `#bd93f9` | Model / Component / Concept |
| 2 | Orange | `#ffb86c` | Process / Transformation / Gap |
| 3 | Cyan | `#8be9fd` | Data / Input / Output |
| 4 | Green | `#50fa7b` | Result / Success |
| 5 | Red | `#ff5555` | Error / Problem |
| 6 | Yellow | `#f1fa8c` | Annotation / Note |

---

## Arrows between cards

Connect card bodies horizontally with a plain arrow:

```json
{
  "type": "arrow",
  "strokeColor": "#f8f8f2",
  "strokeWidth": 2,
  "roughness": 0,
  "startArrowhead": null,
  "endArrowhead": "triangle",
  "points": [[0, 0], [80, 0]]
}
```

Place arrow `x` at the right edge of the source card body, `y` at the body vertical midpoint (`cy + 92 + 40 = cy + 132`). Add a `text` label (`strokeColor: "#f8f8f2"`, `fontSize: 16`, `fontFamily: 2`, `lineHeight: 1.25`) centered above the arrow.

Use `startBinding` / `endBinding` to attach to the source and target body rectangle ids.

---

## Naming convention

Use short lowercase slugs for the concept prefix: `input`, `process`, `output` — or domain-specific nouns like `raw`, `clean`, `model`.

Full element ids for a 3-card layout:
```
input-outer      input-header      input-header-text      input-body      input-body-text
process-outer    process-header    process-header-text    process-body    process-body-text
output-outer     output-header     output-header-text     output-body     output-body-text
arrow-input-process    label-input-process
arrow-process-output   label-process-output
```

---

## Full JSON example — 3-card horizontal layout

Replace the placeholder text and colors; keep all structural properties as-is.

```json
{
  "type": "excalidraw",
  "version": 2,
  "source": "claude-code",
  "elements": [
    {
      "id": "input-outer", "type": "rectangle",
      "x": 100, "y": 100, "width": 260, "height": 190,
      "angle": 0, "strokeColor": "#bd93f9", "backgroundColor": "#282a36",
      "fillStyle": "solid", "strokeWidth": 2, "strokeStyle": "solid",
      "roughness": 0, "opacity": 100, "groupIds": ["cardA"],
      "roundness": {"type": 3, "value": 10}, "seed": 1001,
      "boundElements": [{"id": "arr-1", "type": "arrow"}]
    },
    {
      "id": "input-header", "type": "rectangle",
      "x": 112, "y": 110, "width": 236, "height": 80,
      "angle": 0, "strokeColor": "transparent", "backgroundColor": "#bd93f9",
      "fillStyle": "solid", "strokeWidth": 1, "strokeStyle": "solid",
      "roughness": 0, "opacity": 100, "groupIds": ["cardA"],
      "roundness": {"type": 3, "value": 6}, "seed": 1002,
      "boundElements": [{"type": "text", "id": "input-header-text"}]
    },
    {
      "id": "input-header-text", "type": "text",
      "x": 112, "y": 110, "width": 236, "height": 80,
      "angle": 0, "strokeColor": "#282a36", "backgroundColor": "transparent",
      "fillStyle": "solid", "strokeWidth": 1, "strokeStyle": "solid",
      "roughness": 0, "opacity": 100, "groupIds": ["cardA"],
      "containerId": "input-header",
      "text": "Card A Title", "fontSize": 16, "fontFamily": 2,
      "textAlign": "center", "verticalAlign": "middle",
      "lineHeight": 1.25, "seed": 1003
    },
    {
      "id": "input-body", "type": "rectangle",
      "x": 110, "y": 192, "width": 240, "height": 80,
      "angle": 0, "strokeColor": "transparent", "backgroundColor": "#44475a",
      "fillStyle": "solid", "strokeWidth": 1, "strokeStyle": "solid",
      "roughness": 0, "opacity": 100, "groupIds": ["cardA"],
      "roundness": {"type": 3, "value": 6}, "seed": 1004,
      "boundElements": [{"type": "text", "id": "input-body-text"}, {"id": "arr-1", "type": "arrow"}]
    },
    {
      "id": "input-body-text", "type": "text",
      "x": 110, "y": 192, "width": 240, "height": 80,
      "angle": 0, "strokeColor": "#f8f8f2", "backgroundColor": "transparent",
      "fillStyle": "solid", "strokeWidth": 1, "strokeStyle": "solid",
      "roughness": 0, "opacity": 100, "groupIds": ["cardA"],
      "containerId": "input-body",
      "text": "Bullet one\nBullet two\nBullet three", "fontSize": 16, "fontFamily": 2,
      "textAlign": "center", "verticalAlign": "middle",
      "lineHeight": 1.25, "seed": 1005
    },

    {
      "id": "process-outer", "type": "rectangle",
      "x": 440, "y": 100, "width": 260, "height": 190,
      "angle": 0, "strokeColor": "#ffb86c", "backgroundColor": "#282a36",
      "fillStyle": "solid", "strokeWidth": 2, "strokeStyle": "solid",
      "roughness": 0, "opacity": 100, "groupIds": ["cardB"],
      "roundness": {"type": 3, "value": 10}, "seed": 2001,
      "boundElements": []
    },
    {
      "id": "process-header", "type": "rectangle",
      "x": 452, "y": 110, "width": 236, "height": 80,
      "angle": 0, "strokeColor": "transparent", "backgroundColor": "#ffb86c",
      "fillStyle": "solid", "strokeWidth": 1, "strokeStyle": "solid",
      "roughness": 0, "opacity": 100, "groupIds": ["cardB"],
      "roundness": {"type": 3, "value": 6}, "seed": 2002,
      "boundElements": [{"type": "text", "id": "process-header-text"}]
    },
    {
      "id": "process-header-text", "type": "text",
      "x": 452, "y": 110, "width": 236, "height": 80,
      "angle": 0, "strokeColor": "#282a36", "backgroundColor": "transparent",
      "fillStyle": "solid", "strokeWidth": 1, "strokeStyle": "solid",
      "roughness": 0, "opacity": 100, "groupIds": ["cardB"],
      "containerId": "process-header",
      "text": "Card B Title", "fontSize": 16, "fontFamily": 2,
      "textAlign": "center", "verticalAlign": "middle",
      "lineHeight": 1.25, "seed": 2003
    },
    {
      "id": "process-body", "type": "rectangle",
      "x": 450, "y": 192, "width": 240, "height": 80,
      "angle": 0, "strokeColor": "transparent", "backgroundColor": "#44475a",
      "fillStyle": "solid", "strokeWidth": 1, "strokeStyle": "solid",
      "roughness": 0, "opacity": 100, "groupIds": ["cardB"],
      "roundness": {"type": 3, "value": 6}, "seed": 2004,
      "boundElements": [{"type": "text", "id": "process-body-text"}, {"id": "arr-1", "type": "arrow"}, {"id": "arr-2", "type": "arrow"}]
    },
    {
      "id": "process-body-text", "type": "text",
      "x": 450, "y": 192, "width": 240, "height": 80,
      "angle": 0, "strokeColor": "#f8f8f2", "backgroundColor": "transparent",
      "fillStyle": "solid", "strokeWidth": 1, "strokeStyle": "solid",
      "roughness": 0, "opacity": 100, "groupIds": ["cardB"],
      "containerId": "process-body",
      "text": "Bullet one\nBullet two\nBullet three", "fontSize": 16, "fontFamily": 2,
      "textAlign": "center", "verticalAlign": "middle",
      "lineHeight": 1.25, "seed": 2005
    },

    {
      "id": "output-outer", "type": "rectangle",
      "x": 780, "y": 100, "width": 260, "height": 190,
      "angle": 0, "strokeColor": "#8be9fd", "backgroundColor": "#282a36",
      "fillStyle": "solid", "strokeWidth": 2, "strokeStyle": "solid",
      "roughness": 0, "opacity": 100, "groupIds": ["cardC"],
      "roundness": {"type": 3, "value": 10}, "seed": 3001,
      "boundElements": []
    },
    {
      "id": "output-header", "type": "rectangle",
      "x": 792, "y": 110, "width": 236, "height": 80,
      "angle": 0, "strokeColor": "transparent", "backgroundColor": "#8be9fd",
      "fillStyle": "solid", "strokeWidth": 1, "strokeStyle": "solid",
      "roughness": 0, "opacity": 100, "groupIds": ["cardC"],
      "roundness": {"type": 3, "value": 6}, "seed": 3002,
      "boundElements": [{"type": "text", "id": "output-header-text"}]
    },
    {
      "id": "output-header-text", "type": "text",
      "x": 792, "y": 110, "width": 236, "height": 80,
      "angle": 0, "strokeColor": "#282a36", "backgroundColor": "transparent",
      "fillStyle": "solid", "strokeWidth": 1, "strokeStyle": "solid",
      "roughness": 0, "opacity": 100, "groupIds": ["cardC"],
      "containerId": "output-header",
      "text": "Card C Title", "fontSize": 16, "fontFamily": 2,
      "textAlign": "center", "verticalAlign": "middle",
      "lineHeight": 1.25, "seed": 3003
    },
    {
      "id": "output-body", "type": "rectangle",
      "x": 790, "y": 192, "width": 240, "height": 80,
      "angle": 0, "strokeColor": "transparent", "backgroundColor": "#44475a",
      "fillStyle": "solid", "strokeWidth": 1, "strokeStyle": "solid",
      "roughness": 0, "opacity": 100, "groupIds": ["cardC"],
      "roundness": {"type": 3, "value": 6}, "seed": 3004,
      "boundElements": [{"type": "text", "id": "output-body-text"}, {"id": "arr-2", "type": "arrow"}]
    },
    {
      "id": "output-body-text", "type": "text",
      "x": 790, "y": 192, "width": 240, "height": 80,
      "angle": 0, "strokeColor": "#f8f8f2", "backgroundColor": "transparent",
      "fillStyle": "solid", "strokeWidth": 1, "strokeStyle": "solid",
      "roughness": 0, "opacity": 100, "groupIds": ["cardC"],
      "containerId": "output-body",
      "text": "Bullet one\nBullet two\nBullet three", "fontSize": 16, "fontFamily": 2,
      "textAlign": "center", "verticalAlign": "middle",
      "lineHeight": 1.25, "seed": 3005
    },

    {
      "id": "arr-1", "type": "arrow",
      "x": 350, "y": 232, "width": 100, "height": 0,
      "angle": 0, "strokeColor": "#f8f8f2", "backgroundColor": "transparent",
      "fillStyle": "solid", "strokeWidth": 2, "strokeStyle": "solid",
      "roughness": 0, "opacity": 100, "groupIds": [],
      "points": [[0, 0], [100, 0]],
      "startArrowhead": null, "endArrowhead": "triangle",
      "startBinding": {"elementId": "input-body", "focus": 0, "gap": 8},
      "endBinding": {"elementId": "process-body", "focus": 0, "gap": 8},
      "seed": 4001, "boundElements": []
    },
    {
      "id": "label-arr-1", "type": "text",
      "x": 350, "y": 207, "width": 100, "height": 20,
      "angle": 0, "strokeColor": "#f8f8f2", "backgroundColor": "transparent",
      "fillStyle": "solid", "strokeWidth": 1, "strokeStyle": "solid",
      "roughness": 0, "opacity": 100, "groupIds": [],
      "containerId": null,
      "text": "arrow label", "fontSize": 16, "fontFamily": 2,
      "textAlign": "center", "verticalAlign": "top",
      "lineHeight": 1.25, "seed": 4002
    },

    {
      "id": "arr-2", "type": "arrow",
      "x": 690, "y": 232, "width": 100, "height": 0,
      "angle": 0, "strokeColor": "#f8f8f2", "backgroundColor": "transparent",
      "fillStyle": "solid", "strokeWidth": 2, "strokeStyle": "solid",
      "roughness": 0, "opacity": 100, "groupIds": [],
      "points": [[0, 0], [100, 0]],
      "startArrowhead": null, "endArrowhead": "triangle",
      "startBinding": {"elementId": "process-body", "focus": 0, "gap": 8},
      "endBinding": {"elementId": "output-body", "focus": 0, "gap": 8},
      "seed": 5001, "boundElements": []
    },
    {
      "id": "label-arr-2", "type": "text",
      "x": 690, "y": 207, "width": 100, "height": 20,
      "angle": 0, "strokeColor": "#f8f8f2", "backgroundColor": "transparent",
      "fillStyle": "solid", "strokeWidth": 1, "strokeStyle": "solid",
      "roughness": 0, "opacity": 100, "groupIds": [],
      "containerId": null,
      "text": "arrow label", "fontSize": 16, "fontFamily": 2,
      "textAlign": "center", "verticalAlign": "top",
      "lineHeight": 1.25, "seed": 5002
    }
  ],
  "appState": {"gridSize": null, "viewBackgroundColor": "#282a36"},
  "files": {}
}
```

> **Note:** When cards have no directed flow (pure comparison, no sequence), omit the arrows entirely and place cards with the same 80px gap.
