# Scene Type Timing Contract

Each scene type has a strict contract between `on_screen_text` item count,
`duration_seconds`, and the narration pacing required for sync.

Remotion calculates: `framesPerItem = durationInFrames / on_screen_text.length`

Item `i` becomes active at frame `i × framesPerItem`. Narration must name item
`i` while it is on screen — misalignment means viewers see text before (or
after) hearing its explanation.

---

## `diagram`

**Rendering:** Horizontal flow of numbered badges with labels. One badge is
highlighted (accent colour) at a time; completed badges show a checkmark.

**`on_screen_text` layout:**
```
["Step label 1", "Step label 2", "Step label 3", ...]
```

**Timing:**
```
time_per_item = duration_seconds / n
item_i active during: [i × time_per_item, (i+1) × time_per_item]
```

**Narration rule:** Name/describe item `i` within its active window.

**Example:** 4 items, 22 s → 5.5 s per item.
- 0–5.5 s: narration covers item 1
- 5.5–11 s: narration covers item 2
- 11–16.5 s: narration covers item 3
- 16.5–22 s: narration covers item 4

**Authoring tip:** Use short, scan-able labels (3–6 words). The badge number
is auto-generated — don't include numbering in the label text.

---

## `data_table`

**Rendering:** A single-column table. Header row always visible. Data rows
reveal one at a time.

**`on_screen_text` layout:**
```
[
  "Table header text",   // index 0 — always visible
  "Row 1 content",       // index 1
  "Row 2 content",       // index 2
  ...
]
```

**Timing:**
```
time_per_row = duration_seconds / row_count   (row_count = on_screen_text.length - 1)
row_i visible from: i × time_per_row  (where i starts at 1)
```

**Narration rule:** Introduce the table header, then name each row as it appears.

**Example:** Header + 4 rows, 17 s → each row reveals at ~4.25 s intervals.

**Authoring tip:** Use `→` to separate source / format / description in a single
row when columns would feel cramped: `"Database → SQL → customer orders"`.

---

## `code_walkthrough`

**Rendering:** Dark editor background. Code lines appear top-to-bottom, one at
a time. Each line stays visible after it appears.

**`on_screen_text` layout:**
```
["line 1 code", "line 2 code", "line 3 code", ...]
```

**Timing:**
```
time_per_line = duration_seconds / line_count
line_i appears at: i × time_per_line
```

**Narration rule:** Describe what each line does as it appears.

**Example:** 6 lines, 18.3 s → ~3.05 s per line.

**Authoring tips:**
- Include only lines that are worth narrating — omit boilerplate
- Each line should do one thing; split multi-operation lines if they need separate explanation
- Use real variable names from the lesson context, not `foo`/`bar`

---

## `recap`

**Rendering:** Heading in accent colour fades in first. Bullet items appear
one at a time beneath it. Last item renders as a forward pointer (bottom, cyan,
separated by a border).

**`on_screen_text` layout:**
```
[
  "Heading text",           // index 0 — heading
  "Bullet 1",               // index 1
  "Bullet 2",               // index 2
  ...
  "Next: forward pointer"   // last index — forward pointer (optional)
]
```

**Timing:**
```
heading_duration  = duration_seconds × 0.15
remaining         = duration_seconds × 0.85
items             = bullets + (1 if forward_pointer else 0)
time_per_item     = remaining / items

heading active:   0 → heading_duration
bullet_i active:  heading_duration + (i × time_per_item)
```

**Narration rule:** Cover the heading concept during the first 15%, then name
each bullet in order at its reveal moment. Name the forward pointer last.

**Example:** 23.65 s, 5 bullets + 1 pointer → heading 3.5 s; each of 6 items ~3.35 s.

**Authoring tips:**
- Heading should be a section label: "Key Takeaways", "Lesson 1 Recap"
- Bullets should be short action phrases, not sentences: "Define the question precisely"
- Forward pointer conventionally starts with "Next:": "Next: set up Python and meet the pandas DataFrame"
- Omit the forward pointer on the last lesson of a course

---

## `title_card`

**Rendering:** Three elements centred on a dark background:
- Course code (top-left, monospace, accent colour)
- Lesson title (centre, large sans-serif)
- Subtitle / lesson number (below title, muted colour)

**`on_screen_text` layout:**
```
["COURSE_CODE", "Lesson Title", "Lesson N of M"]
```

**Timing:** All three elements animate in together using spring easing over the
full scene duration. No sequential item reveal.

**Narration rule:** Runs freely — no item-by-item timing constraint. Use this
scene for the opening hook from the "Why this matters" section.

---

## `screen_recording`

**Rendering:** Placeholder in development; intended for looped or static
screen capture.

**`on_screen_text`:** Unused by the component. Include for documentation
purposes if needed.

**Timing:** No sequential animation. Narration runs freely.

**Usage:** Rare — only when a live demo or interactive tool is essential and
cannot be conveyed by `diagram` or `code_walkthrough`. Requires a real
recording asset before the scene is playable.
