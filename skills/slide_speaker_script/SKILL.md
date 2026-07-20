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
   - Default to breaking multi-clause bullets into a parent + indented sub-bullets, not just when a line is too long. Split at natural clause boundaries (colons, semicolons, dashes, "but", "and", "because") so each line on screen is a single short thought:
     ```
     - Main point (short label or headline)
         - supporting detail or elaboration
             - further nuance, if the thought has three parts
         - second part of the thought
     ```
   - The parent line should be a short anchor phrase (≤10 words); each clause of the elaboration gets its own indented line. Nesting 2-3 levels deep is normal for compound thoughts — don't flatten a multi-part sentence onto one line just because it would technically fit.
   - Only keep a bullet as a single flat line if it's already a short, single-clause thought.
6. **Add value** — scripts should include: real-world examples, common misconceptions, transition cues, or deeper context not on the slide.
7. **Emphasize with bold, not italics** — use `**bold**` for key terms the speaker should vocally stress. Italics are too subtle to register at a glance during live delivery.
8. **Write the actual words the speaker says, not a description of what to say.** Every bullet must be spoken-aloud script the presenter can read directly — first/second person, natural spoken phrasing. Never write meta-instructions like "explain X," "point out Y," "highlight that Z," "note the contrast between A and B," or "flag this connection." Those tell the speaker what to do, not what to say. If a bullet describes an action (explain/highlight/note/flag/contrast/mention) instead of containing the words themselves, rewrite it as the sentence the speaker would actually utter.

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

Occasionally include a question to pose to the audience — but only when it meaningfully enhances the slide. Use sparingly: aim for **2–4 questions across the entire deck**, not one per slide.

**When to use:**
- The slide reveals a counterintuitive fact or surprising comparison
- A key concept benefits from the audience reflecting on their own experience
- A pivot point in the narrative where audience buy-in matters

**Format:** Add as the last lines of the script, prefixed with `❓`, separated from the preceding bullet by a blank line so it doesn't render as a continuation of that bullet. Follow it with the expected answer as its own flush (non-indented) bullet, not an indented sub-bullet of the `❓` line — the `❓` line is a plain paragraph, not a list item, so an indented `-` under it renders as a code block in most markdown viewers:
```
- Last bullet point of the script

❓ Ask: "Before we look at the answer — how many connections do you think a single 1080p image would need in a fully dense layer?"
- expected answer: ...
```

The question should be thought-provoking and answerable from the audience's existing knowledge or intuition — not a quiz with a technical answer they couldn't know yet.
Provide expected answers for each engagement question, formatted as shown above.

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

**Also bad (describes what to say instead of saying it):**
- Explain that backprop is like blame assignment
- Point out that the chain rule makes deep networks tractable
- Mention the common confusion that backprop only computes gradients

**Good script (the actual words to speak, nested at clause boundaries, bold for emphasis):**
- Think of this as blame assignment
    - the network is figuring out which weights contributed most to the error
- The chain rule flows gradients backwards through every layer
    - that's what makes training arbitrarily deep networks **mathematically tractable**
- Without this
    - networks deeper than 2–3 layers were impractical before 1986
- Here's a common mix-up: backprop only computes the gradients
    - a separate optimizer, like SGD or Adam, decides **how** to actually update the weights
