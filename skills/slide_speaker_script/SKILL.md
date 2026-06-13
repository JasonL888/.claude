---
name: slide_speaker_script
description: Generate speaker scripts for slides. Use this skill when the user asks to: write speaker notes, create presenter scripts, add talking points to slides, or anything involving "speaker notes", "presenter script", "slide script", or "talking points for slides".
---

# PPT Speaker Script Skill

Generate concise, insightful speaker scripts for slides that complement — not repeat — what is already on the slide.

---

## Core Rules

1. **Never repeat slide content verbatim** — the speaker already sees the slide. Add context, insight, or examples instead.
2. **Each slide gets a unique script** — no copy-pasting or reusing phrasing across slides.
3. **Preserve existing notes** — if a slide already has speaker notes, leave them completely unchanged.
4. **Be concise** — each script should be short enough to deliver in the time allotted per slide. Avoid padding.
5. **Use bullet lists for key points** — list format makes it easy to glance at while presenting.
   - If a bullet point is too long to read at a glance, break it into a parent + indented sub-bullets:
     ```
     - Main point (short label or headline)
       - supporting detail or elaboration
       - second part of the thought
     ```
   - The parent line should be a short anchor phrase (≤10 words); the detail goes in the sub-bullets.
6. **Add value** — scripts should include: real-world examples, common misconceptions, transition cues, or deeper context not on the slide.

---

## Script Structure Per Slide

Each slide script follows this pattern:

```
## Slide [N]: [Slide Title]
⏱ Estimated: ~X min
[Optional 1-sentence transition from the previous slide]
- Key insight or elaboration on the main point
- Supporting detail, real-world example, or analogy
- [Additional point if needed]
[Optional cue: pause, demo, or question to audience]
```

Keep the total script to **3–5 bullet points** per slide unless the content demands more.

---

## What to Add (Not Repeat)

| Slide has... | Speaker script should add... |
|---|---|
| A definition | A real-world analogy or example |
| A diagram | Explanation of what to focus on and why it matters |
| A list of items | Prioritization, common pitfalls, or surprising nuance |
| A data chart | What the trend means in practice, outliers to note |
| A code snippet | What the code does conceptually, or where it's used |
| A title/transition slide | Bridge from previous topic, what's coming and why it matters |
| A comparison table | When to choose one vs. the other |

---

## Workflow

### Step 1 — Read the slides
Identify the slide content:
- If provided as text/markdown, parse each slide's title and body.
- If a file is given (`.pptx`, `.pdf`, `.md`, `.txt`), read its content.
- Note which slides already have speaker notes.

### Step 2 — Plan before writing
Before writing any script:
- List all slide titles.
- Flag slides with existing notes (skip these).
- Identify the narrative arc across the deck to avoid repetition.
- Note where transitions are needed between topic shifts.

### Step 3 — Write scripts
For each slide **without** existing notes:
- Write a concise bullet-point script.
- Ensure each script is meaningfully different from others.
- Focus on insight, not summary.
- Add a `⏱ Estimated: ~X min` line immediately after the slide heading using the table below:

| Slide type | Estimated time |
|---|---|
| Title / section divider | ~30 sec |
| Agenda / overview | ~1 min |
| Content slide, 1–2 bullets | ~1 min |
| Content slide, 3–4 bullets | ~2 min |
| Content slide, 5+ bullets | ~3 min |
| Step-by-step / demo walkthrough | ~3–4 min |

Express as `~30 sec`, `~1 min`, `~2 min`, etc. The estimate reflects *speaker delivery time* — it accounts for the audience absorbing the slide visually, not just reading time.

### Step 4 — Output format
Present the scripts in a clear, slide-by-slide format:

```
## Slide [N]: [Slide Title]

[EXISTING — kept as-is]  ← use this label if notes already existed

or

- Bullet point 1
- Bullet point 2
- Bullet point 3
```

For pptx format, write the script in the Powerpoint speaker notes section for each slide.
For other formats, output as markdown with clear slide demarcations.

### Auto-save for PDF inputs
When the source file is a `.pdf`:
- Save the complete speaker script as `<pdf_basename>_speaker_script.md` in the same folder as the PDF using the Write tool.
  - Example: `/path/to/FC6.pdf` → `/path/to/FC6_speaker_script.md`
- Use the same markdown content that is output to chat.
- Still output the script to chat as well.
- Do this automatically — do not wait for the user to request it.

---

## Engagement Questions

Occasionally include a question to pose to the audience — but only when it meaningfully enhances the slide. Use sparingly: aim for **1–2 questions across the entire deck**, not one per slide.

**When to use:**
- The slide reveals a counterintuitive fact or surprising comparison
- A key concept benefits from the audience reflecting on their own experience
- A pivot point in the narrative where audience buy-in matters

**When NOT to use:**
- Routine explanatory slides (definitions, step-by-step process)
- Slides with dense technical content where focus is needed
- Back-to-back with another question slide

**Format:** Add as the last line of the script, prefixed with `❓`:
```
❓ Ask: "Before we look at the answer — how many connections do you think a single 1080p image would need in a fully dense layer?"
```

The question should be thought-provoking and answerable from the audience's existing knowledge or intuition — not a quiz with a technical answer they couldn't know yet.

---

## Anti-Patterns to Avoid

- **Paraphrasing the slide** ("As you can see on this slide, X is Y") — this wastes the speaker's time.
- **Generic fillers** ("This is a very important topic") — every point should be substantive.
- **Identical structure** across all slides — vary the approach (example, question, contrast, story).
- **Overloading with text** — speaker notes should be glanceable, not read verbatim.
- **Modifying existing notes** — if notes already exist, leave them exactly as written.
- **Overusing questions** — a question on every slide loses impact; use them only at high-value moments.

---

## Example

**Slide content:**
> **What is Backpropagation?**
> - Algorithm for training neural networks
> - Computes gradients using the chain rule
> - Updates weights to minimize loss

**Bad script (repeats the slide):**
- Backpropagation is an algorithm for training neural networks
- It computes gradients using the chain rule
- It updates weights to minimize loss

**Good script (adds insight, with sub-bullets for longer points):**
- Think of it as blame assignment
  - the network figures out which weights contributed most to the error
- Chain rule flows gradients backwards through every layer
  - makes training arbitrarily deep networks mathematically tractable
- Without this, networks deeper than 2–3 layers were impractical before 1986
- Common confusion: backprop computes gradients only
  - a separate optimizer (SGD, Adam) decides how to update the weights
