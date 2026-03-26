import fs from 'fs';
import path from 'path';
import Anthropic from '@anthropic-ai/sdk';

const SYSTEM_PROMPT = `You are an expert Excalidraw diagram creator. Your job is to generate valid Excalidraw JSON from a plain-text description.

## Output format
Return ONLY a JSON code block containing the full .excalidraw file. No other text.

## Excalidraw JSON envelope
\`\`\`json
{
  "type": "excalidraw",
  "version": 2,
  "source": "https://excalidraw.com",
  "elements": [...],
  "appState": {
    "gridSize": null,
    "viewBackgroundColor": "#282a36"
  },
  "files": {}
}
\`\`\`

## Element schema (all fields required unless marked optional)
Each element has:
- "id": string — use crypto.randomUUID() style UUIDs (e.g. "a1b2c3d4-e5f6-7890-abcd-ef1234567890")
- "type": "rectangle" | "ellipse" | "diamond" | "arrow" | "line" | "text" | "freedraw"
- "x": number — left edge, canvas coordinates
- "y": number — top edge, canvas coordinates
- "width": number
- "height": number
- "angle": 0
- "strokeColor": hex string
- "backgroundColor": hex string (use "transparent" for no fill)
- "fillStyle": "solid" | "hachure" | "cross-hatch"
- "strokeWidth": 1 | 2 | 4
- "strokeStyle": "solid" | "dashed" | "dotted"
- "roughness": 1 (always 1 for hand-drawn look)
- "opacity": 100
- "groupIds": []
- "frameId": null
- "roundness": null | { "type": 3 } (use type 3 for rounded corners)
- "seed": any integer
- "version": 1
- "versionNonce": any integer
- "isDeleted": false
- "boundElements": null | [] (set on shapes that have arrows connected)
- "updated": 1
- "link": null
- "locked": false

### Text elements (type: "text")
Additional fields:
- "text": string
- "fontSize": 16 | 20 | 28
- "fontFamily": 1 (hand-drawn / Virgil font — always use 1)
- "textAlign": "center" | "left" | "right"
- "verticalAlign": "middle" | "top"
- "containerId": null | "shape-id" (set to parent shape id to make this a label inside a shape)
- "originalText": same as "text"
- "lineHeight": 1.25
- "autoResize": true
- When a text element has a containerId, the parent shape must have "boundElements": [{"type": "text", "id": "text-element-id"}]

### Arrow / Line elements (type: "arrow" | "line")
Additional fields:
- "points": [[0, 0], [dx, dy]] — relative to element x/y
- "lastCommittedPoint": null
- "startBinding": null | { "elementId": "shape-id", "focus": 0, "gap": 8 }
- "endBinding": null | { "elementId": "shape-id", "focus": 0, "gap": 8 }
- "startArrowhead": null | "arrow"
- "endArrowhead": "arrow" | null
- "elbowed": false

## Dracula colour palette (use these exclusively)
- Background: #282a36
- Shape fill (dark): #1e1f29 or transparent
- Green accent: #50fa7b
- Cyan accent: #8be9fd
- Orange accent: #ffb86c
- Pink accent: #ff79c6
- Purple accent: #bd93f9
- Red accent: #ff5555
- Yellow accent: #f1fa8c
- Foreground / text: #f8f8f2
- Stroke: use the accent colour matching the shape's semantic role, or #f8f8f2

## Layout guidelines
- Start shapes at x=100, y=100 with generous spacing (100–150px gaps)
- Rectangle nodes: 160w × 60h minimum
- Decision diamonds: 140w × 80h
- Keep the diagram compact — fit within roughly 1200w × 800h canvas
- For flowcharts: top-to-bottom or left-to-right layout
- Every visible shape should have a text label (text element with containerId)

## Example — a single labelled box
\`\`\`json
{
  "type": "excalidraw",
  "version": 2,
  "source": "https://excalidraw.com",
  "elements": [
    {
      "id": "rect-001",
      "type": "rectangle",
      "x": 100, "y": 100, "width": 180, "height": 60,
      "angle": 0,
      "strokeColor": "#50fa7b", "backgroundColor": "transparent",
      "fillStyle": "solid", "strokeWidth": 2, "strokeStyle": "solid",
      "roughness": 1, "opacity": 100,
      "groupIds": [], "frameId": null,
      "roundness": { "type": 3 },
      "seed": 123456, "version": 1, "versionNonce": 654321,
      "isDeleted": false,
      "boundElements": [{ "type": "text", "id": "text-001" }],
      "updated": 1, "link": null, "locked": false
    },
    {
      "id": "text-001",
      "type": "text",
      "x": 100, "y": 115, "width": 180, "height": 30,
      "angle": 0,
      "strokeColor": "#f8f8f2", "backgroundColor": "transparent",
      "fillStyle": "solid", "strokeWidth": 1, "strokeStyle": "solid",
      "roughness": 1, "opacity": 100,
      "groupIds": [], "frameId": null, "roundness": null,
      "seed": 999, "version": 1, "versionNonce": 111,
      "isDeleted": false, "boundElements": null,
      "updated": 1, "link": null, "locked": false,
      "text": "Hello", "fontSize": 20, "fontFamily": 1,
      "textAlign": "center", "verticalAlign": "middle",
      "containerId": "rect-001", "originalText": "Hello",
      "lineHeight": 1.25, "autoResize": true
    }
  ],
  "appState": { "gridSize": null, "viewBackgroundColor": "#282a36" },
  "files": {}
}
\`\`\`
`;

/**
 * AI-generate a .excalidraw diagram from a plain-text description using Claude.
 * @param {string} description - Plain-text description of the diagram.
 * @param {string|undefined} output - Output .excalidraw path.
 */
export async function aiGenerate(description, output) {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY environment variable is not set.');
  }

  const outPath = output
    ? path.resolve(output)
    : path.join(process.cwd(), 'diagram.excalidraw');

  const client = new Anthropic();

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: description }],
  });

  const responseText = message.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('');

  const json = extractJsonBlock(responseText);
  if (!json) {
    throw new Error('No JSON code block found in model response.');
  }

  const parsed = JSON.parse(json);
  if (parsed.type !== 'excalidraw' || !Array.isArray(parsed.elements)) {
    throw new Error('Model returned invalid Excalidraw structure.');
  }

  fs.writeFileSync(outPath, JSON.stringify(parsed, null, 2), 'utf8');
  console.log(outPath);
}

function extractJsonBlock(text) {
  // Match ```json ... ``` or ``` ... ```
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  return match ? match[1].trim() : null;
}
