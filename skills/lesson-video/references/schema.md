# `video-scenes.json` Schema Reference

**File location:** `content/courses/{course-slug}/{lesson-folder}/video-scenes.json`

Auto-picked up by `sync_content` — no MDX frontmatter changes required.

---

## Top-level fields

```jsonc
{
  "schema_version": "1.0",           // bump minor on additive changes, major on breaking
  "course_slug": "intro-to-data-science",   // must match folder name
  "lesson_slug": "what-is-data-science",    // must match MDX frontmatter slug
  "title": "What Is Data Science? — DS101 Lesson 1",  // human label only
  "target_duration_seconds": 180,    // round number; scene sum must be within 10%
  "author": "github-username",
  "status": "draft",                 // lifecycle: draft → review → approved
  "reviewed_by": null,               // set by reviewer on approval
  "notes": null,                     // top-level production notes (optional)
  "scenes": [ ... ]
}
```

---

## Scene object fields

```jsonc
{
  "id": "scene_01",                  // unique, zero-padded, sequential
  "type": "diagram",                 // see enum below
  "duration_seconds": 22.0,          // MUST match audio file length when audio_src is set
  "narration": "...",                // exact spoken script — paced to animation timing
  "visual_description": "...",       // self-contained prose describing the Remotion output
  "on_screen_text": ["..."],         // text labels rendered verbatim; order drives animation
  "images": [                        // optional; parallel to on_screen_text; diagram scenes only
    "/images/courses/{course-slug}/chart-histogram.svg",  // public path; null to skip an item
    null,                            // null = show badge only for this step
    "/images/courses/{course-slug}/chart-bar.svg"
  ],
  "notes": "N items × X s each.",    // per-item timing cue for audio production
  "transition": {                    // null = no transition specified
    "type": "cut",                   // cut | fade | dissolve | wipe
    "duration_seconds": 0            // 0 for cut; 0.5 for fade
  },
  "audio_src": "/video-audio/{course-slug}/{lesson-slug}/scene_01.mp3"  // omit if silent
}
```

### `cue_times` (optional, all animated scene types)

Overrides equal-division timing. Array of seconds from scene start at which each `on_screen_text` item becomes active:

```json
"cue_times": [0, 8.5, 14.5, 19.5]
```

Use when the narration has an intro sentence before the first item, or when items vary significantly in length. Tune by scrubbing in Remotion Studio against the audio. Components fall back to equal-division when `cue_times` is absent. `title_card` and `screen_recording` scenes do not use this field.

### `visualization` (optional, `diagram` scenes only)

Identifies the custom Remotion component to render inside the `Diagram` scene wrapper. When present, the diagram renders the named component instead of the default badge+flow layout:

```json
"visualization": "context_window_slots"
```

| Known values | Lesson |
|---|---|
| `context_window_slots` | ai-applications-with-llms / 03-context-window-architecture |
| `rag_pipeline` | ai-applications-with-llms / 03-context-window-architecture |
| `probability_distribution` | ai-applications-with-llms / 01-probabilistic-contract |
| `temperature_comparison` | ai-applications-with-llms / 01-probabilistic-contract |
| `validation_layers_stack` | ai-applications-with-llms / 04-output-validation-layers |

Omit the field when the default badge+flow layout is sufficient.

### `highlight_rows` (optional, `data_table` scenes only)

Array of 0-indexed row indices (excluding the header at `on_screen_text[0]`) that should receive the danger/emphasis style (red background):

```json
"highlight_rows": [0]
```

Use to draw attention to a row representing a mistake, anti-pattern, or a "Never" case.

### `images` field (optional, `diagram` scenes only)

Parallel array to `on_screen_text`. Each entry is either a public path string or `null` (renders badge+label only for that step). Omit the field entirely when no images are available — the component falls back gracefully to badge+label for all steps.

**`image_layout`** (optional, `diagram` scenes only) — controls how images and steps are presented:

| Value | Behaviour |
|-------|-----------|
| `"flow"` (default) | Horizontal badge strip; image thumbnail (140×94) above each badge |
| `"spotlight"` | One step at a time; large image (560×350) fills the top half, badge + label below, progress dots at the bottom |

Use `"spotlight"` when the images need to be large enough to read (histogram shapes, algorithm diagrams, annotated charts). Use `"flow"` for simple icon-style thumbnails (chart type pickers, tool logos).

---

**When images exist in** `frontend/public/images/courses/{course-slug}/`:
- Glob that folder before writing any `diagram` scene
- If a thumbnail matches one of the `on_screen_text` items (chart type, algorithm, workflow stage), add its path at the corresponding index
- Use `null` for items with no matching image
- If no items have matching images, omit the `images` field

**Naming convention for chart thumbnails:**
`chart-{type}.svg` — e.g. `chart-histogram.svg`, `chart-scatter.svg`, `chart-bar.svg`, `chart-boxplot.svg`

### `type` enum

| Value | Component | `on_screen_text` role |
|-------|-----------|----------------------|
| `title_card` | TitleCard | `[0]` course code, `[1]` title, `[2]` subtitle |
| `diagram` | Diagram | sequential step labels, highlighted one at a time |
| `data_table` | DataTable | `[0]` header, `[1..n]` rows revealed sequentially |
| `code_walkthrough` | CodeWalkthrough | code lines revealed sequentially |
| `recap` | Recap | `[0]` heading, `[1..n-1]` bullets, `[n]` forward pointer |
| `screen_recording` | ScreenRecording | unused |

### `transition.type` enum

| Value | Behaviour |
|-------|-----------|
| `cut` | Immediate frame cut (use `duration_seconds: 0`) |
| `fade` | Fade to/from background colour |
| `dissolve` | Cross-dissolve between scenes |
| `wipe` | Directional wipe |

Default to `cut` between content scenes. Use `fade` with `duration_seconds: 0.5` for the first and last scenes.

---

## Audio files

MP3s stored in Object Storage:
```
/video-audio/{course-slug}/{lesson-slug}/scene_01.mp3
/video-audio/{course-slug}/{lesson-slug}/scene_02.mp3
...
```

**Critical constraint:** `duration_seconds` must equal the actual audio file
length. Remotion allocates frames based on this value. If the audio is longer,
it is cut off; if shorter, there is silence at the end.

Generate audio from the `narration` field via TTS. Name files `scene_NN.mp3`
matching the scene `id`.

---

## Status lifecycle

| Status | Meaning |
|--------|---------|
| `draft` | Author writing; not ready for review |
| `review` | Ready for peer review; `reviewed_by` is still null |
| `approved` | Reviewer has signed off; `reviewed_by` set to reviewer's GitHub username |

Never merge with `status: "review"` without a reviewer setting `approved`.

---

## Reference example

Live example with all six scene types:
`content/courses/intro-to-data-science/01-what-is-data-science/video-scenes.json`

9 scenes, 166 s total: title card → overview recap → one scene per step (diagram, data_table, code_walkthrough, diagram, diagram) → tools table → recap with forward pointer.
