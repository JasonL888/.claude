---
name: lesson-audio
description: >
  This skill should be used when the user asks to "generate audio", "generate
  narration audio", "run TTS", "create MP3s for a lesson", "generate audio for
  video scenes", "regenerate audio", or any similar request involving producing
  or refreshing audio files from a video-scenes.json narration field.
version: 1.0.0
allowed-tools: [Read, Bash, Glob]
---

# Lesson Audio Generator

Generate MP3 narration files from `video-scenes.json` using the generic TTS
script bundled with this skill. The script uses **Kokoro-82M** (local model,
no API key required) and writes `audio_src` and the real `duration_seconds`
back into each `video-scenes.json` automatically.

---

## Prerequisites (one-time, per machine)

```bash
brew install espeak-ng ffmpeg
```

---

## Step 1 — Infer project paths

Before running, identify two paths in the current project:

| Argument | What it points to | How to find it |
|----------|-------------------|----------------|
| `--content-root` | Directory containing course folders with `video-scenes.json` files | Look for `*/*/video-scenes.json` — the root is two levels up |
| `--output-root` | Directory where MP3 files should be written | Look for a `public/` or `static/` directory; MP3s go in a `video-audio/` subfolder there |

**Common patterns:**

| Framework | `--content-root` | `--output-root` |
|-----------|-----------------|-----------------|
| Next.js (SophiArch) | `content/courses` | `frontend/public/video-audio` |
| Next.js (simple) | `content/courses` | `public/video-audio` |
| SvelteKit | `src/content/courses` | `static/video-audio` |
| Astro | `src/content/courses` | `public/video-audio` |

The audio URL prefix written to `audio_src` is derived automatically from
`--output-root` by stripping the path up to and including the `public` or
`static` component.

---

## Step 2 — Run the script

The generic script lives at `~/.claude/skills/lesson-audio/scripts/generate_audio.py`.
Run it with `uv run` from the project root:

```bash
# All lessons
uv run ~/.claude/skills/lesson-audio/scripts/generate_audio.py \
  --content-root content/courses \
  --output-root frontend/public/video-audio

# One course only
uv run ~/.claude/skills/lesson-audio/scripts/generate_audio.py \
  --content-root content/courses \
  --output-root frontend/public/video-audio \
  --course intro-to-data-science

# Force-regenerate even if MP3s already exist
uv run ~/.claude/skills/lesson-audio/scripts/generate_audio.py \
  --content-root content/courses \
  --output-root frontend/public/video-audio \
  --force
```

---

## Step 3 — Review the diff

The script updates `audio_src` and `duration_seconds` in each
`video-scenes.json`. Check the diff:

- `audio_src` should point to the correct public path
- `duration_seconds` values will have changed from word-count estimates to
  exact measured durations

If any `duration_seconds` changed by more than 10% from the estimate, the
narration-animation sync may be off for that scene — review the pacing and
re-run with `--force` after editing the narration.

Commit the updated JSON files alongside the MP3s.

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `espeak-ng: not found` | `brew install espeak-ng` |
| `ffmpeg: not found` | `brew install ffmpeg` |
| Silent / zero-length MP3 | First run downloads the Kokoro model — check network |
| Wrong `audio_src` URL | Verify `--output-root` contains a `public` path component; or check `derive_audio_url_prefix` in the script |
