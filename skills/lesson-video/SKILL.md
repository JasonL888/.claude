---
name: lesson-video
description: >
  This skill should be used when the user asks to "generate video scenes",
  "write video-scenes.json", "create scenes for a lesson", "convert a lesson
  to video", "make a Remotion video for this lesson", "update video scenes to
  match the MDX", or any similar request involving producing or revising a
  video-scenes.json file from lesson content.
version: 1.0.0
allowed-tools: [Read, Glob, Grep, Write, Edit]
---

# Lesson Video Scene Generator

Convert a `lesson.mdx` file into a `video-scenes.json` that drives a Remotion
in-browser animation. The output must satisfy the narration-animation sync
contract so that every `on_screen_text` item appears on screen at the exact
moment the narration names it.

See `references/scene-types.md` for the full per-type timing contract and
`references/schema.md` for the annotated JSON schema.

---

## Step 1 — Confirm the lesson qualifies for video

A lesson gets a video if it meets **≥ 2 of the 5 criteria** below.
Exception: `is_preview: true` qualifies on its own.

1. Introduces a concept family for the first time in the course
2. Requires spatial/visual reasoning (diagrams, data flow, sequences)
3. Is the free preview lesson (`is_preview: true`)
4. Contains a code walkthrough where execution order is the point
5. Already has a diagram or figure in the MDX

Record which criteria triggered. If the lesson does not qualify, say so and stop.

---

## Step 2 — Read the lesson

Read `lesson.mdx` in full. Identify:
- The MDX H2 sections — each section maps to **one scene**
- Any code blocks (→ `code_walkthrough`)
- Any enumerated processes or numbered steps (→ `diagram`)
- Any tabular comparisons or lists of tools/sources (→ `data_table`)
- The summary / key takeaways section (→ `recap`)
- The opening / title (→ `title_card`)

---

## Step 3 — Map sections to scene types

| Content shape | Scene type |
|---------------|------------|
| Lesson title / intro | `title_card` |
| Numbered workflow, process steps, pipeline | `diagram` |
| Tabular data, tool list, data sources, comparisons | `data_table` |
| Sequential code with operations that build on each other | `code_walkthrough` |
| Summary, key takeaways, learning outcomes | `recap` |
| Live demo, UI walkthrough (rare) | `screen_recording` |

One MDX section = one scene. Split a section only if it covers two distinct
content shapes (e.g., a process diagram followed immediately by a code example).

---

## Step 4 — Build `on_screen_text` for each scene

Break the section's content into discrete **beats** — one item per thing the
viewer needs to read and absorb. Rules:

- Each item is a complete, self-contained label (not a sentence fragment)
- Items appear in the order listed — order determines animation sequence
- Count the items; this directly sets the animation cadence
- `recap` convention: `[0]` = heading, `[1..n-1]` = bullets, `[n]` = forward pointer (optional)
- `data_table` convention: `[0]` = table header, `[1..n]` = rows
- `title_card` convention: `[0]` = course code, `[1]` = title, `[2]` = lesson subtitle

---

## Step 5 — Script narration in sync with animation

Write the exact spoken script. The narration **must name each `on_screen_text`
item during the time window when that item is active on screen**.

Quick timing rules (full detail in `references/scene-types.md`):

- **`diagram`** — item `i` is active for `duration / n` seconds. Name it in that window.
- **`data_table`** — row `i` appears at `i × (duration / row_count)` seconds. Name it as it appears.
- **`code_walkthrough`** — line `i` appears at `i × (duration / line_count)` seconds. Describe the operation as the line appears.
- **`recap`** — heading occupies first 15% of duration; each bullet/pointer occupies `(duration × 0.85) / item_count` seconds. Cover the heading first, then name each bullet in order.
- **`title_card` / `screen_recording`** — no sequential animation; narration runs freely.

Pace check: read the narration aloud. Target 130–150 wpm.

---

## Step 6 — Estimate `duration_seconds`

```
duration_seconds ≈ word_count / 140
```

Round to one decimal place. When `audio_src` is set, this value **must match
the actual audio file length** — Remotion uses it to allocate frames.

Verify: `sum(scene.duration_seconds)` should be within 10% of
`target_duration_seconds`. Aim for one scene per MDX section; a typical
15-min lesson produces 8–12 scenes and 160–220 s of video.

---

## Step 7 — Fill remaining fields and write the file

For each scene, set:
- `visual_description` — prose describing the Remotion layout for reviewers (self-contained; assume no code access)
- `notes` — per-item timing cue for audio production: `"N items × X s each"`
- `transition` — `"cut"` (default) or `"fade"` for intro/outro scenes
- `audio_src` — `/video-audio/{course-slug}/{lesson-slug}/scene_NN.mp3` (omit if silent)

Top-level metadata:
- `status: "draft"` on first pass
- `target_duration_seconds` — set to a round number close to the scene sum
- `author`, `course_slug`, `lesson_slug` — from MDX frontmatter

Write to `content/courses/{course-slug}/{lesson-folder}/video-scenes.json`.

---

## Output checklist

Before finishing, verify:
- [ ] Scene sum is within 10% of `target_duration_seconds`
- [ ] Narration reads naturally aloud at ~140 wpm
- [ ] For each animated scene type, narration names every `on_screen_text` item in the correct time window
- [ ] `visual_description` is self-contained (no code context needed)
- [ ] `notes` documents per-item timing for each scene
- [ ] Video orients and motivates; the MDX carries the depth — no word-for-word duplication
