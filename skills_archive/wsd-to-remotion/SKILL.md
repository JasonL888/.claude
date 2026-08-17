---
name: wsd-to-remotion
description: >
  Convert a WebSequenceDiagram (.wsd) file into a self-contained Remotion
  animation project. Use when asked to "create a remotion video from a .wsd",
  "animate a sequence diagram", "turn this sequence diagram into a video",
  or any similar request involving a .wsd file and Remotion.
---

# WSD → Remotion Sequence Diagram Animator

Turns a `.wsd` (WebSequenceDiagram) file into a standalone Remotion project
that animates the diagram step by step: participants appear at the top, messages
animate in one at a time with a spring entrance, the active step is highlighted
while previous steps dim.

---

## Step 1 — Read and parse the .wsd file

Identify:
- **Participants** — `participant X` or `participant X as Label`
- **Request arrows** — `A->B: label\nsubtext` (solid line)
- **Response arrows** — `A-->B: label\nsubtext` (dashed line)
- **Self-calls** — `A->A: label\nsubtext` (self-loop rectangle)
- **Notes** — `note right of X` … `end note` (annotation box)
- **Section dividers** — `== Section Name ==`

Map `\n` in labels to a `label` + `sub` split (first part = label, rest = sub).

---

## Step 2 — Create the project directory

Place the Remotion project in a subdirectory next to the `.wsd` file, named
after the file (e.g. `mcp_call.wsd` → `mcp-video/`).

Structure:
```
<name>-video/
  .gitignore
  package.json
  tsconfig.json
  remotion.config.ts
  src/
    index.ts
    Root.tsx
    <Name>Flow.tsx     ← main animation component
```

---

## Step 3 — Write the files

### `.gitignore`
```
node_modules/
out/
```

### `package.json`
```json
{
  "name": "<name>-video",
  "version": "1.0.0",
  "scripts": {
    "studio": "npx remotion studio",
    "render": "npx remotion render <CompositionId> out/<name>.mp4"
  },
  "dependencies": {
    "@remotion/cli": "4.0.290",
    "remotion": "4.0.290",
    "react": "18.2.0",
    "react-dom": "18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "typescript": "^5.0.0"
  }
}
```

### `tsconfig.json`
```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "target": "es5"
  },
  "include": ["src", "remotion.config.ts"]
}
```

### `remotion.config.ts`
```ts
import { Config } from '@remotion/cli/config'
Config.setVideoImageFormat('jpeg')
Config.setOverwriteOutput(true)
```

### `src/index.ts`
```ts
import { registerRoot } from 'remotion'
import { RemotionRoot } from './Root'
registerRoot(RemotionRoot)
```

### `src/Root.tsx`
```tsx
import { Composition } from 'remotion'
import { MyFlow, TOTAL_FRAMES } from './MyFlow'

export const RemotionRoot = () => (
  <Composition
    id="MyFlow"
    component={MyFlow}
    durationInFrames={TOTAL_FRAMES}
    fps={30}
    width={1920}
    height={1080}
  />
)
```

---

## Step 4 — Write the main animation component

### Layout constants

```ts
const BOX_W        = 170
const BOX_H        = 48
const P_ROW_Y      = 28      // top of participant row
const LIFELINE_TOP = P_ROW_Y + BOX_H + 4   // = 80
const MSG_Y0       = 90      // y of first step
const STEP_H       = 47      // pixels per step (fits 21 steps in 1080p)

const INTRO_F  = 50          // frames before first step
const STEP_F   = 68          // frames per step (active highlight window)
const OUTRO_F  = 90

export const TOTAL_FRAMES = INTRO_F + STEPS.length * STEP_F + OUTRO_F
```

**Participant x positions** — distribute evenly across 1920px.
For N participants: `x[i] = leftMargin + i * spacing` where spacing keeps boxes
from overlapping and leaves equal margins at both edges. With 4 participants a
spacing of ~440px works well (x = 240, 680, 1120, 1560).

Assign one distinct color per participant from this palette:
```
User / actor    → #60A5FA  (blue)
Orchestrator    → #A78BFA  (violet)
LLM / AI model  → #FBBF24  (amber)
Tool / server   → #34D399  (emerald)
Database        → #F87171  (red)
API / external  → #FB923C  (orange)
```
For additional participants cycle through: `#38BDF8`, `#E879F9`, `#4ADE80`.

### Color scheme

```ts
const BG      = '#0F172A'   // canvas background
const SURFACE = '#1E293B'   // note box background
const BORDER_C = '#334155'  // section divider / inactive borders
const FG      = '#F1F5F9'   // active text
const MUTED   = '#94A3B8'   // inactive text
const DIM     = '#475569'   // very faded text
const FONT    = '"Inter", system-ui, sans-serif'
const MONO    = '"JetBrains Mono", "Fira Code", monospace'
```

### Step data shape

```ts
type MsgStep     = { type: 'message'; from: PId; to: PId; label: string; sub?: string; resp?: boolean }
type NoteStep    = { type: 'note';    near: PId; title: string; body?: string }
type SectionStep = { type: 'section'; label: string }
type Step = MsgStep | NoteStep | SectionStep
```

### Animation rules (MUST follow Remotion constraints)

- **All animation driven by `useCurrentFrame()`** — no CSS transitions or animations.
- Use `spring({ frame: entryFrame, fps, config: { damping: 200 } })` for element entrance.
- `entryFrame = currentFrame - stepStartFrame` where `stepStartFrame = INTRO_F + i * STEP_F`.
- Clamp spring output with a local helper: `clamp01(v) = Math.max(0, Math.min(1, v))`.

### Per-step opacity

```ts
const opacity = clamp01(entry) * (isActive ? 1 : 0.45)
```

### Arrow drawing (CSS only — no SVG)

**Request arrow (solid, left-to-right or right-to-left):**
- Animate width from 0 → full using `interpolate(clamp01(entry), [0,1], [0, lineWidth])`.
- Line: `<div style={{ height: 0, borderTop: '2px solid {color}' }} />`
- Arrowhead: unicode `▶` or `◀` at `top: arrowY - 5` (not -8, which sits too high).
- Show arrowhead only when `entry > 0.75`.

**Response arrow (dashed):**
- Same as request but `borderTop: '2px dashed {color}'` and use target participant's color.

**Self-loop (A→A):**
- Draw three divs: top horizontal, right vertical, bottom horizontal.
- Loop extends `130px` to the right of the participant's lifeline.
- Arrowhead `◀` at bottom-left of the loop, `top: loopBotY - 5`.

**Note box:**
- Positioned to the right of the participant's lifeline: `left = participantX + BOX_W/2 + 14`.
- Slide in from right: `transform: translateX(${interpolate(clamp01(entry), [0,1], [16, 0])}px)`.
- Title line: `fontSize: 12, fontWeight: 700`, colored with participant color when active.
- Body line: `fontSize: 10, fontFamily: MONO`.

**Section divider:**
- Full-width horizontal rule with centered label.
- `letterSpacing: '0.14em', textTransform: 'uppercase', fontSize: 11`.

### Active step indicator

A glowing dot on the source participant's lifeline at the current step's arrow y:
```tsx
<div style={{
  position: 'absolute',
  left: p.x - 4,
  top: MSG_Y0 + activeIdx * STEP_H + 30 - 4,
  width: 8, height: 8,
  borderRadius: '50%',
  background: p.color,
  boxShadow: `0 0 10px ${p.color}`,
}} />
```

### Title strip

Thin bar at `top: 0, height: P_ROW_Y`:
```tsx
background: `${SURFACE}cc`,
borderBottom: `1px solid ${BORDER_C}`,
fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: MUTED
```
Fade in with `intro` spring (same spring used for participant boxes and lifelines).

---

## Step 5 — Install and launch

```bash
cd <name>-video
npm install
npx remotion studio src/index.ts
```

Report the local URL (default: http://localhost:3000).

---

## Checklist before finishing

- [ ] All participants from the `.wsd` are represented with distinct colors
- [ ] `resp: true` set on `-->` (response) arrows
- [ ] Self-loops render as a rectangle, not a straight line
- [ ] Notes positioned to the right of their participant (check rightmost participant fits within 1920px)
- [ ] `TOTAL_FRAMES` exported from the main component and imported in `Root.tsx`
- [ ] `src/index.ts` calls `registerRoot`
- [ ] `.gitignore` excludes `node_modules/` and `out/`
- [ ] `npm install` run before handing back to user
