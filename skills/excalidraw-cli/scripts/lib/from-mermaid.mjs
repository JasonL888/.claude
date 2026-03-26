import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

/**
 * Convert a Mermaid flowchart (.mmd file or inline string) to .excalidraw JSON.
 * Supports: graph TD/LR/BT/RL, flowchart TD/LR; rectangle, diamond, circle nodes.
 * @param {string} input - Path to .mmd file, or inline Mermaid diagram string.
 * @param {string|undefined} output - Output .excalidraw path.
 */
export async function fromMermaid(input, output) {
  let mermaidSrc;
  if (fs.existsSync(input)) {
    mermaidSrc = fs.readFileSync(input, 'utf8');
  } else {
    mermaidSrc = input;
  }

  const outPath = output
    ? path.resolve(output)
    : (() => {
        if (fs.existsSync(input)) {
          const { dir, name } = path.parse(path.resolve(input));
          return path.join(dir, name + '.excalidraw');
        }
        return path.join(process.cwd(), 'diagram.excalidraw');
      })();

  const { elements } = parseMermaidFlowchart(mermaidSrc);
  const excalidrawData = buildEnvelope(elements);

  fs.writeFileSync(outPath, JSON.stringify(excalidrawData, null, 2), 'utf8');
  console.log(outPath);
}

// ─── Mermaid Flowchart Parser ────────────────────────────────────────────────

const DRACULA = {
  bg: '#282a36',
  text: '#f8f8f2',
  green: '#50fa7b',
  cyan: '#8be9fd',
  orange: '#ffb86c',
  pink: '#ff79c6',
  purple: '#bd93f9',
};

const NODE_W = 180;
const NODE_H = 60;
const H_GAP = 80;
const V_GAP = 80;
const ORIGIN_X = 100;
const ORIGIN_Y = 100;

function parseMermaidFlowchart(src) {
  // Split on newlines or semicolons (both are valid Mermaid statement separators)
  const lines = src.split(/[\n;]/).map((l) => l.trim()).filter(Boolean);

  // Determine direction: TD (top-down) or LR (left-right)
  let direction = 'TD';
  const headerMatch = lines[0]?.match(/^(?:graph|flowchart)\s+(TD|TB|LR|RL|BT)/i);
  if (headerMatch) direction = headerMatch[1].toUpperCase();
  const isHorizontal = direction === 'LR' || direction === 'RL';

  const vertices = new Map(); // id → { label, shape }
  const edges = [];           // { from, to, label }

  for (const line of lines.slice(1)) {
    if (/^(subgraph|end|style|classDef|class|click|%%)/.test(line)) continue;

    // Detect edge lines: must contain --> or --- (with optional label)
    // Handles: A --> B, A --- B, A -- text --> B, A -->|text| B
    const edgeMatch = parseEdge(line);
    if (edgeMatch) {
      edges.push(edgeMatch);
      extractVerticesFromLine(line, vertices);
    } else {
      extractVerticesFromLine(line, vertices);
    }
  }

  // Ensure all edge endpoints have vertex entries
  for (const { from, to } of edges) {
    if (!vertices.has(from)) vertices.set(from, { label: from, shape: 'rectangle' });
    if (!vertices.has(to)) vertices.set(to, { label: to, shape: 'rectangle' });
  }

  if (vertices.size === 0) {
    throw new Error('No vertices found. Is this a supported Mermaid flowchart (graph TD/LR)?');
  }

  const adjacency = buildAdjacency(edges, vertices);
  const levels = assignLevels(vertices, adjacency);
  const positions = computePositions(levels, isHorizontal);

  const elements = [];
  const vertexShapeIds = new Map();

  for (const [vid, vdata] of vertices) {
    const pos = positions.get(vid) ?? { x: ORIGIN_X, y: ORIGIN_Y };
    const shapeId = randomUUID();
    const textId = randomUUID();
    vertexShapeIds.set(vid, shapeId);
    elements.push(makeShape(shapeId, textId, vdata.shape, pos.x, pos.y, vdata.label));
    elements.push(makeLabel(textId, shapeId, pos.x, pos.y, vdata.label));
  }

  for (const { from, to } of edges) {
    const fromId = vertexShapeIds.get(from);
    const toId = vertexShapeIds.get(to);
    if (fromId && toId) {
      const fromPos = positions.get(from) ?? { x: 0, y: 0 };
      const toPos = positions.get(to) ?? { x: 0, y: 0 };
      elements.push(makeArrow(fromId, toId, fromPos, toPos));
    }
  }

  return { elements };
}

/**
 * Parse a single Mermaid edge line.
 * Handles: A --> B, A --- B, A -- text --> B, A -->|text| B, A --text--> B
 * Returns { from, to, label } or null if not an edge line.
 */
function parseEdge(line) {
  // Pattern: <node-with-optional-shape> <arrow-with-optional-label> <node-with-optional-shape>
  // Arrow forms: -->, --->, --text-->, -- text -->, -->|text|, ---
  const m = line.match(
    /^(\w+)(?:\[[^\]]*\]|\{[^}]*\}|\(\([^)]*\)\)|\([^)]*\)|>[^\]]*\])?\s*(-{2,}(?:>|\|[^|]*\|>|[^>-]*->)?)\s*(\w+)/
  );
  if (!m) return null;

  const from = m[1];
  const arrowStr = m[2];
  const to = m[3];

  // Extract label from pipes: -->|text| or from dashes: -- text -->
  let label = '';
  const pipeLabel = arrowStr.match(/\|([^|]*)\|/);
  if (pipeLabel) {
    label = pipeLabel[1].trim();
  } else {
    // -- text --> style: text between the first -- and the last --/->
    const dashLabel = arrowStr.match(/^--([^->].+?)(?:-->|->|--)?$/);
    if (dashLabel) label = dashLabel[1].trim();
  }

  return { from, to, label };
}

function extractVerticesFromLine(line, vertices) {
  // Use matchAll to find all vertex references with optional shape syntax
  const pattern = /(\w+)(\[([^\]]*)\]|\{([^}]*)\}|\(\(([^)]*)\)\)|\(([^)]*)\))?/g;
  for (const m of line.matchAll(pattern)) {
    const id = m[1];
    if (['graph', 'flowchart', 'TD', 'LR', 'TB', 'RL', 'BT', 'end'].includes(id)) continue;
    if (!vertices.has(id)) {
      const label = (m[3] ?? m[4] ?? m[5] ?? m[6] ?? id).trim();
      const shape = m[2]
        ? m[2].startsWith('{') ? 'diamond'
          : m[2].startsWith('((') ? 'ellipse'
          : 'rectangle'
        : 'rectangle';
      vertices.set(id, { label, shape });
    }
  }
}

function buildAdjacency(edges, vertices) {
  const adj = new Map();
  for (const id of vertices.keys()) adj.set(id, []);
  for (const { from, to } of edges) {
    if (!adj.has(from)) adj.set(from, []);
    adj.get(from).push(to);
  }
  return adj;
}

function assignLevels(vertices, adjacency) {
  const incoming = new Map();
  for (const id of vertices.keys()) incoming.set(id, 0);
  for (const [, children] of adjacency) {
    for (const c of children) incoming.set(c, (incoming.get(c) ?? 0) + 1);
  }
  const roots = [...vertices.keys()].filter((id) => !incoming.get(id));
  if (roots.length === 0) roots.push(vertices.keys().next().value);

  const level = new Map();
  const queue = roots.map((r) => [r, 0]);
  while (queue.length > 0) {
    const [id, d] = queue.shift();
    if (level.has(id)) continue;
    level.set(id, d);
    for (const child of adjacency.get(id) ?? []) {
      if (!level.has(child)) queue.push([child, d + 1]);
    }
  }
  for (const id of vertices.keys()) {
    if (!level.has(id)) level.set(id, 0);
  }
  return level;
}

function computePositions(levels, isHorizontal) {
  const byLevel = new Map();
  for (const [id, lvl] of levels) {
    if (!byLevel.has(lvl)) byLevel.set(lvl, []);
    byLevel.get(lvl).push(id);
  }

  const maxPerLevel = Math.max(...[...byLevel.values()].map((a) => a.length));
  const positions = new Map();

  for (const [lvl, ids] of byLevel) {
    ids.forEach((id, i) => {
      if (isHorizontal) {
        positions.set(id, {
          x: ORIGIN_X + lvl * (NODE_W + H_GAP),
          y: ORIGIN_Y + i * (NODE_H + V_GAP),
        });
      } else {
        const totalWidth = ids.length * NODE_W + (ids.length - 1) * H_GAP;
        const maxWidth = maxPerLevel * NODE_W + (maxPerLevel - 1) * H_GAP;
        const offsetX = Math.floor((maxWidth - totalWidth) / 2);
        positions.set(id, {
          x: ORIGIN_X + offsetX + i * (NODE_W + H_GAP),
          y: ORIGIN_Y + lvl * (NODE_H + V_GAP),
        });
      }
    });
  }
  return positions;
}

// ─── Element Factories ───────────────────────────────────────────────────────

function makeShape(id, textId, shape, x, y) {
  const strokeColor =
    shape === 'diamond' ? DRACULA.orange
    : shape === 'ellipse' ? DRACULA.green
    : DRACULA.cyan;

  return {
    id,
    type: shape === 'ellipse' ? 'ellipse' : shape === 'diamond' ? 'diamond' : 'rectangle',
    x, y,
    width: NODE_W,
    height: NODE_H,
    angle: 0,
    strokeColor,
    backgroundColor: 'transparent',
    fillStyle: 'solid',
    strokeWidth: 2,
    strokeStyle: 'solid',
    roughness: 1,
    opacity: 100,
    groupIds: [],
    frameId: null,
    roundness: shape === 'rectangle' ? { type: 3 } : null,
    seed: Math.floor(Math.random() * 1e9),
    version: 1,
    versionNonce: Math.floor(Math.random() * 1e9),
    isDeleted: false,
    boundElements: [{ type: 'text', id: textId }],
    updated: 1,
    link: null,
    locked: false,
  };
}

function makeLabel(id, containerId, x, y, text) {
  return {
    id,
    type: 'text',
    x,
    y: y + NODE_H / 2 - 10,
    width: NODE_W,
    height: 20,
    angle: 0,
    strokeColor: DRACULA.text,
    backgroundColor: 'transparent',
    fillStyle: 'solid',
    strokeWidth: 1,
    strokeStyle: 'solid',
    roughness: 1,
    opacity: 100,
    groupIds: [],
    frameId: null,
    roundness: null,
    seed: Math.floor(Math.random() * 1e9),
    version: 1,
    versionNonce: Math.floor(Math.random() * 1e9),
    isDeleted: false,
    boundElements: null,
    updated: 1,
    link: null,
    locked: false,
    text,
    fontSize: 16,
    fontFamily: 1,
    textAlign: 'center',
    verticalAlign: 'middle',
    containerId,
    originalText: text,
    lineHeight: 1.25,
    autoResize: true,
  };
}

function makeArrow(fromId, toId, fromPos, toPos) {
  const sx = fromPos.x + NODE_W / 2;
  const sy = fromPos.y + NODE_H / 2;
  const ex = toPos.x + NODE_W / 2;
  const ey = toPos.y + NODE_H / 2;

  return {
    id: randomUUID(),
    type: 'arrow',
    x: sx,
    y: sy,
    width: Math.abs(ex - sx),
    height: Math.abs(ey - sy),
    angle: 0,
    strokeColor: DRACULA.purple,
    backgroundColor: 'transparent',
    fillStyle: 'solid',
    strokeWidth: 2,
    strokeStyle: 'solid',
    roughness: 1,
    opacity: 100,
    groupIds: [],
    frameId: null,
    roundness: { type: 2 },
    seed: Math.floor(Math.random() * 1e9),
    version: 1,
    versionNonce: Math.floor(Math.random() * 1e9),
    isDeleted: false,
    boundElements: null,
    updated: 1,
    link: null,
    locked: false,
    points: [[0, 0], [ex - sx, ey - sy]],
    lastCommittedPoint: null,
    startBinding: { elementId: fromId, focus: 0, gap: 8 },
    endBinding: { elementId: toId, focus: 0, gap: 8 },
    startArrowhead: null,
    endArrowhead: 'arrow',
    elbowed: false,
  };
}

// ─── Envelope ────────────────────────────────────────────────────────────────

export function buildEnvelope(elements, files = {}) {
  return {
    type: 'excalidraw',
    version: 2,
    source: 'https://excalidraw.com',
    elements,
    appState: {
      gridSize: null,
      viewBackgroundColor: '#282a36',
    },
    files,
  };
}
