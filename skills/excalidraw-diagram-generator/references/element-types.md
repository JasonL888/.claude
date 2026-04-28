# Excalidraw Element Types Guide

Detailed specifications for each Excalidraw element type with visual examples and use cases.

## Element Type Overview

| Type | Visual | Primary Use | Text Support |
|------|--------|-------------|--------------|
| `rectangle` | □ | Boxes, containers, process steps | ✅ Yes |
| `ellipse` | ○ | Emphasis, terminals, states | ✅ Yes |
| `diamond` | ◇ | Decision points, choices | ✅ Yes |
| `arrow` | → | Directional flow, relationships | ❌ No (use separate text) |
| `line` | — | Connections, dividers | ❌ No |
| `text` | A | Labels, annotations, titles | ✅ (Its purpose) |

---

## Rectangle

**Best for:** Process steps, entities, data stores, components

### Properties

```typescript
{
  type: "rectangle",
  roundness: { type: 3 },  // Rounded corners
  text: "Step Name",       // Optional embedded text
  fontSize: 20,
  textAlign: "center",
  verticalAlign: "middle"
}
```

### Use Cases

| Scenario | Configuration |
|----------|---------------|
| **Process step** | Green background (`#b2f2bb`), centered text |
| **Entity/Object** | Blue background (`#a5d8ff`), medium size |
| **System component** | Light color, descriptive text |
| **Data store** | Gray/white, database-like label |

### Size Guidelines

| Content | Width | Height |
|---------|-------|--------|
| Single word | 120-150px | 60-80px |
| Short phrase (2-4 words) | 180-220px | 80-100px |
| Sentence | 250-300px | 100-120px |

### Example

```json
[
  {
    "id": "step1",
    "type": "rectangle",
    "x": 100, "y": 100, "width": 200, "height": 80,
    "backgroundColor": "#50fa7b", "strokeColor": "#6272a4",
    "fillStyle": "solid", "strokeWidth": 2, "strokeStyle": "solid",
    "roughness": 1, "opacity": 100, "groupIds": [], "frameId": null,
    "index": "a0", "roundness": {"type": 3},
    "seed": 1234567890, "version": 3, "versionNonce": 159823848,
    "isDeleted": false,
    "boundElements": [{"id": "step1-label", "type": "text"}],
    "updated": 1706659200000, "link": null, "locked": false
  },
  {
    "id": "step1-label",
    "type": "text",
    "x": 110, "y": 128, "width": 180, "height": 25,
    "angle": 0, "strokeColor": "#282a36", "backgroundColor": "transparent",
    "fillStyle": "solid", "strokeWidth": 1, "strokeStyle": "solid",
    "roughness": 1, "opacity": 100, "groupIds": [], "frameId": null,
    "index": "a0L", "roundness": null,
    "seed": 1234567891, "version": 1, "versionNonce": 987654322,
    "isDeleted": false, "boundElements": [], "updated": 1706659200000,
    "link": null, "locked": false,
    "text": "Validate Input", "fontSize": 20, "fontFamily": 1,
    "textAlign": "center", "verticalAlign": "middle",
    "containerId": "step1", "originalText": "Validate Input",
    "lineHeight": 1.25, "baseline": 18
  }
]
```

---

## Ellipse

**Best for:** Start/end points, states, emphasis circles

### Properties

```typescript
{
  type: "ellipse",
  text: "Start",
  fontSize: 18,
  textAlign: "center",
  verticalAlign: "middle"
}
```

### Use Cases

| Scenario | Configuration |
|----------|---------------|
| **Flow start** | Light green, "Start" text |
| **Flow end** | Light red, "End" text |
| **State** | Soft color, state name |
| **Highlight** | Bright color, emphasis text |

### Size Guidelines

For circular shapes, use `width === height`:

| Content | Diameter |
|---------|----------|
| Icon/Symbol | 60-80px |
| Short text | 100-120px |
| Longer text | 150-180px |

### Example

```json
{
  "type": "ellipse",
  "x": 100,
  "y": 100,
  "width": 120,
  "height": 120,
  "backgroundColor": "#d0f0c0",
  "text": "Start",
  "fontSize": 18,
  "textAlign": "center",
  "verticalAlign": "middle"
}
```

---

## Diamond

**Best for:** Decision points, conditional branches

### Properties

```typescript
{
  type: "diamond",
  text: "Valid?",
  fontSize: 18,
  textAlign: "center",
  verticalAlign": "middle"
}
```

### Use Cases

| Scenario | Text Example |
|----------|--------------|
| **Yes/No decision** | "Is Valid?", "Exists?" |
| **Multiple choice** | "Type?", "Status?" |
| **Conditional** | "Score > 50?" |

### Size Guidelines

Diamonds need more space than rectangles for the same text:

| Content | Width | Height |
|---------|-------|--------|
| Yes/No | 120-140px | 120-140px |
| Short question | 160-180px | 160-180px |
| Longer question | 200-220px | 200-220px |

### Example

```json
{
  "type": "diamond",
  "x": 100,
  "y": 100,
  "width": 150,
  "height": 150,
  "backgroundColor": "#ffe4a3",
  "text": "Valid?",
  "fontSize": 18,
  "textAlign": "center",
  "verticalAlign": "middle"
}
```

---

## Arrow

**Best for:** Flow direction, relationships, dependencies

### Properties

```typescript
{
  type: "arrow",
  points: [[0, 0], [endX, endY]],  // Relative coordinates
  elbowed: true,                   // Right-angle elbow routing
  roundness: null,                 // null required for elbowed arrows
  startBinding: null,              // Or { elementId, focus, gap }
  endBinding: null
}
```

### Arrow Directions

#### Horizontal (Left to Right)

```json
{
  "x": 100,
  "y": 150,
  "width": 200,
  "height": 0,
  "points": [[0, 0], [200, 0]]
}
```

#### Vertical (Top to Bottom)

```json
{
  "x": 200,
  "y": 100,
  "width": 0,
  "height": 150,
  "points": [[0, 0], [0, 150]]
}
```

#### Diagonal

```json
{
  "x": 100,
  "y": 100,
  "width": 200,
  "height": 150,
  "points": [[0, 0], [200, 150]]
}
```

### Arrow Styles

| Style | `strokeStyle` | `strokeWidth` | Use Case |
|-------|---------------|---------------|----------|
| **Normal flow** | `"solid"` | 2 | Standard connections |
| **Optional/Weak** | `"dashed"` | 2 | Optional paths |
| **Important** | `"solid"` | 3-4 | Emphasized flow |
| **Dotted** | `"dotted"` | 2 | Indirect relationships |

### Adding Arrow Labels

Use separate text elements positioned near arrow midpoint:

```json
[
  {
    "type": "arrow",
    "id": "arrow1",
    "x": 100,
    "y": 150,
    "points": [[0, 0], [200, 0]]
  },
  {
    "type": "text",
    "x": 180,      // Near midpoint
    "y": 130,      // Above arrow
    "text": "sends",
    "fontSize": 14
  }
]
```

---

## Line

**Best for:** Non-directional connections, dividers, borders

### Properties

```typescript
{
  type: "line",
  points: [[0, 0], [x2, y2], [x3, y3], ...],
  roundness: null  // Or { type: 2 } for curved
}
```

### Use Cases

| Scenario | Configuration |
|----------|---------------|
| **Divider** | Horizontal, thin stroke |
| **Border** | Closed path (polygon) |
| **Connection** | Multi-point path |
| **Underline** | Short horizontal line |

### Multi-Point Line Example

```json
{
  "type": "line",
  "x": 100,
  "y": 100,
  "points": [
    [0, 0],
    [100, 50],
    [200, 0]
  ]
}
```

---

## Text

**Best for:** Labels, titles, annotations, standalone text

### Properties

```typescript
{
  type: "text",
  text: "Label text",
  fontSize: 20,
  fontFamily: 1,        // 1=Virgil, 2=Helvetica, 3=Cascadia
  textAlign: "left",
  verticalAlign: "top"
}
```

### Font Sizes by Purpose

| Purpose | Font Size |
|---------|-----------|
| **Main title** | 28-36 |
| **Section header** | 24-28 |
| **Element label** | 18-22 |
| **Annotation** | 14-16 |
| **Small note** | 12-14 |

### Width/Height Calculation

```javascript
// Approximate width
const width = text.length * fontSize * 0.6;

// Approximate height (single line)
const height = fontSize * 1.2;

// Multi-line
const lines = text.split('\n').length;
const height = fontSize * 1.2 * lines;
```

### Text Positioning

| Position | textAlign | verticalAlign | Use Case |
|----------|-----------|---------------|----------|
| **Top-left** | `"left"` | `"top"` | Default labels |
| **Centered** | `"center"` | `"middle"` | Titles |
| **Bottom-right** | `"right"` | `"bottom"` | Footnotes |

### Example: Title

```json
{
  "type": "text",
  "x": 100,
  "y": 50,
  "width": 400,
  "height": 40,
  "text": "System Architecture",
  "fontSize": 32,
  "fontFamily": 2,
  "textAlign": "center",
  "verticalAlign": "top"
}
```

### Example: Annotation

```json
{
  "type": "text",
  "x": 150,
  "y": 200,
  "width": 100,
  "height": 20,
  "text": "User input",
  "fontSize": 14,
  "fontFamily": 1,
  "textAlign": "left",
  "verticalAlign": "top"
}
```

---

## Combining Elements

### Pattern: Labeled Box

```json
[
  {
    "id": "box1",
    "type": "rectangle",
    "x": 100, "y": 100, "width": 200, "height": 100,
    "strokeColor": "#6272a4", "backgroundColor": "#50fa7b",
    "fillStyle": "solid", "strokeWidth": 2, "strokeStyle": "solid",
    "roughness": 1, "opacity": 100, "groupIds": [], "frameId": null,
    "index": "a0", "roundness": {"type": 3},
    "seed": 1234567890, "version": 3, "versionNonce": 159823848,
    "isDeleted": false,
    "boundElements": [{"id": "box1-label", "type": "text"}],
    "updated": 1706659200000, "link": null, "locked": false
  },
  {
    "id": "box1-label",
    "type": "text",
    "x": 110, "y": 138, "width": 180, "height": 25,
    "angle": 0, "strokeColor": "#282a36", "backgroundColor": "transparent",
    "fillStyle": "solid", "strokeWidth": 1, "strokeStyle": "solid",
    "roughness": 1, "opacity": 100, "groupIds": [], "frameId": null,
    "index": "a0L", "roundness": null,
    "seed": 1234567891, "version": 1, "versionNonce": 987654322,
    "isDeleted": false, "boundElements": [], "updated": 1706659200000,
    "link": null, "locked": false,
    "text": "Component", "fontSize": 20, "fontFamily": 1,
    "textAlign": "center", "verticalAlign": "middle",
    "containerId": "box1", "originalText": "Component",
    "lineHeight": 1.25, "baseline": 18
  }
]
```

### Pattern: Connected Boxes

```json
[
  {
    "id": "box1", "type": "rectangle",
    "x": 100, "y": 100, "width": 150, "height": 80,
    "strokeColor": "#6272a4", "backgroundColor": "#50fa7b",
    "fillStyle": "solid", "strokeWidth": 2, "strokeStyle": "solid",
    "roughness": 1, "opacity": 100, "groupIds": [], "frameId": null,
    "index": "a0", "roundness": {"type": 3},
    "seed": 1000000001, "version": 3, "versionNonce": 100000001,
    "isDeleted": false,
    "boundElements": [{"id": "box1-label", "type": "text"}],
    "updated": 1706659200000, "link": null, "locked": false
  },
  {
    "id": "box1-label", "type": "text",
    "x": 110, "y": 128, "width": 130, "height": 25,
    "angle": 0, "strokeColor": "#282a36", "backgroundColor": "transparent",
    "fillStyle": "solid", "strokeWidth": 1, "strokeStyle": "solid",
    "roughness": 1, "opacity": 100, "groupIds": [], "frameId": null,
    "index": "a0L", "roundness": null,
    "seed": 1000000002, "version": 1, "versionNonce": 100000002,
    "isDeleted": false, "boundElements": [], "updated": 1706659200000,
    "link": null, "locked": false,
    "text": "Step 1", "fontSize": 16, "fontFamily": 1,
    "textAlign": "center", "verticalAlign": "middle",
    "containerId": "box1", "originalText": "Step 1",
    "lineHeight": 1.25, "baseline": 14
  },
  {
    "id": "arrow1", "type": "arrow",
    "x": 250, "y": 140, "width": 100, "height": 0,
    "strokeColor": "#f8f8f2", "backgroundColor": "transparent",
    "fillStyle": "solid", "strokeWidth": 2, "strokeStyle": "solid",
    "roughness": 1, "opacity": 100, "groupIds": [], "frameId": null,
    "index": "a1", "roundness": {"type": 2},
    "seed": 1000000003, "version": 2, "versionNonce": 100000003,
    "isDeleted": false, "boundElements": [], "updated": 1706659200000,
    "link": null, "locked": false,
    "points": [[0, 0], [100, 0]],
    "startBinding": null, "endBinding": null,
    "lastCommittedPoint": null, "startArrowhead": null, "endArrowhead": "arrow"
  },
  {
    "id": "box2", "type": "rectangle",
    "x": 350, "y": 100, "width": 150, "height": 80,
    "strokeColor": "#6272a4", "backgroundColor": "#50fa7b",
    "fillStyle": "solid", "strokeWidth": 2, "strokeStyle": "solid",
    "roughness": 1, "opacity": 100, "groupIds": [], "frameId": null,
    "index": "a2", "roundness": {"type": 3},
    "seed": 1000000004, "version": 3, "versionNonce": 100000004,
    "isDeleted": false,
    "boundElements": [{"id": "box2-label", "type": "text"}],
    "updated": 1706659200000, "link": null, "locked": false
  },
  {
    "id": "box2-label", "type": "text",
    "x": 360, "y": 128, "width": 130, "height": 25,
    "angle": 0, "strokeColor": "#282a36", "backgroundColor": "transparent",
    "fillStyle": "solid", "strokeWidth": 1, "strokeStyle": "solid",
    "roughness": 1, "opacity": 100, "groupIds": [], "frameId": null,
    "index": "a2L", "roundness": null,
    "seed": 1000000005, "version": 1, "versionNonce": 100000005,
    "isDeleted": false, "boundElements": [], "updated": 1706659200000,
    "link": null, "locked": false,
    "text": "Step 2", "fontSize": 16, "fontFamily": 1,
    "textAlign": "center", "verticalAlign": "middle",
    "containerId": "box2", "originalText": "Step 2",
    "lineHeight": 1.25, "baseline": 14
  }
]
```

### Pattern: Decision Tree

```json
[
  {
    "id": "decision", "type": "diamond",
    "x": 100, "y": 100, "width": 140, "height": 140,
    "strokeColor": "#6272a4", "backgroundColor": "#ffb86c",
    "fillStyle": "solid", "strokeWidth": 2, "strokeStyle": "solid",
    "roughness": 1, "opacity": 100, "groupIds": [], "frameId": null,
    "index": "a0", "roundness": {"type": 3},
    "seed": 2000000001, "version": 3, "versionNonce": 200000001,
    "isDeleted": false,
    "boundElements": [{"id": "decision-label", "type": "text"}],
    "updated": 1706659200000, "link": null, "locked": false
  },
  {
    "id": "decision-label", "type": "text",
    "x": 110, "y": 158, "width": 120, "height": 25,
    "angle": 0, "strokeColor": "#282a36", "backgroundColor": "transparent",
    "fillStyle": "solid", "strokeWidth": 1, "strokeStyle": "solid",
    "roughness": 1, "opacity": 100, "groupIds": [], "frameId": null,
    "index": "a0L", "roundness": null,
    "seed": 2000000002, "version": 1, "versionNonce": 200000002,
    "isDeleted": false, "boundElements": [], "updated": 1706659200000,
    "link": null, "locked": false,
    "text": "Valid?", "fontSize": 16, "fontFamily": 1,
    "textAlign": "center", "verticalAlign": "middle",
    "containerId": "decision", "originalText": "Valid?",
    "lineHeight": 1.25, "baseline": 14
  },
  {
    "id": "yes-arrow", "type": "arrow",
    "x": 240, "y": 170, "width": 60, "height": 0,
    "strokeColor": "#f8f8f2", "backgroundColor": "transparent",
    "fillStyle": "solid", "strokeWidth": 2, "strokeStyle": "solid",
    "roughness": 1, "opacity": 100, "groupIds": [], "frameId": null,
    "index": "a1", "roundness": {"type": 2},
    "seed": 2000000003, "version": 2, "versionNonce": 200000003,
    "isDeleted": false, "boundElements": [], "updated": 1706659200000,
    "link": null, "locked": false,
    "points": [[0, 0], [60, 0]],
    "startBinding": null, "endBinding": null,
    "lastCommittedPoint": null, "startArrowhead": null, "endArrowhead": "arrow"
  },
  {
    "id": "yes-label", "type": "text",
    "x": 250, "y": 150, "width": 30, "height": 20,
    "angle": 0, "strokeColor": "#f8f8f2", "backgroundColor": "transparent",
    "fillStyle": "solid", "strokeWidth": 1, "strokeStyle": "solid",
    "roughness": 1, "opacity": 100, "groupIds": [], "frameId": null,
    "index": "a1L", "roundness": null,
    "seed": 2000000004, "version": 1, "versionNonce": 200000004,
    "isDeleted": false, "boundElements": [], "updated": 1706659200000,
    "link": null, "locked": false,
    "text": "Yes", "fontSize": 14, "fontFamily": 1,
    "textAlign": "left", "verticalAlign": "top",
    "containerId": null, "originalText": "Yes", "lineHeight": 1.25, "baseline": 12
  },
  {
    "id": "yes-box", "type": "rectangle",
    "x": 300, "y": 140, "width": 120, "height": 60,
    "strokeColor": "#6272a4", "backgroundColor": "#50fa7b",
    "fillStyle": "solid", "strokeWidth": 2, "strokeStyle": "solid",
    "roughness": 1, "opacity": 100, "groupIds": [], "frameId": null,
    "index": "a2", "roundness": {"type": 3},
    "seed": 2000000005, "version": 3, "versionNonce": 200000005,
    "isDeleted": false,
    "boundElements": [{"id": "yes-box-label", "type": "text"}],
    "updated": 1706659200000, "link": null, "locked": false
  },
  {
    "id": "yes-box-label", "type": "text",
    "x": 310, "y": 158, "width": 100, "height": 25,
    "angle": 0, "strokeColor": "#282a36", "backgroundColor": "transparent",
    "fillStyle": "solid", "strokeWidth": 1, "strokeStyle": "solid",
    "roughness": 1, "opacity": 100, "groupIds": [], "frameId": null,
    "index": "a2L", "roundness": null,
    "seed": 2000000006, "version": 1, "versionNonce": 200000006,
    "isDeleted": false, "boundElements": [], "updated": 1706659200000,
    "link": null, "locked": false,
    "text": "Process", "fontSize": 16, "fontFamily": 1,
    "textAlign": "center", "verticalAlign": "middle",
    "containerId": "yes-box", "originalText": "Process",
    "lineHeight": 1.25, "baseline": 14
  }
]
```

---

## Summary

| When you need... | Use this element |
|------------------|------------------|
| Process box | `rectangle` with text |
| Decision point | `diamond` with question |
| Flow direction | `arrow` |
| Start/End | `ellipse` |
| Title/Header | `text` (large font) |
| Annotation | `text` (small font) |
| Non-directional link | `line` |
| Divider | `line` (horizontal) |
