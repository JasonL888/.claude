---
name: reveal-answers
description: 'Add collapsible <details>/<summary> answer cells to SophiArch lab notebooks (debug, review, and prompt types). Use when asked to "add answers to a notebook", "add reveal answers", "add hidden answers", or "add answer cells to a lab". Takes a path to a lab.ipynb file and inserts model-answer cells after each student placeholder, visible in Google Colab via click-to-expand.'
---

# Reveal Answers Skill

Inserts collapsible answer cells into a SophiArch lab notebook. Each answer is hidden inside a `<details>/<summary>` HTML block that students can expand in Google Colab (or any Jupyter viewer that renders HTML in markdown cells).

Supports all three SophiArch lab types: **debug**, **review**, and **prompt**.

## When to Use

- User says "add reveal answers to [notebook]"
- User says "add hidden answers to the lab"
- User says "add answer cells" to a `.ipynb` file
- Applying the pattern to a new lab notebook for the first time

## Trigger

`/reveal-answers [path-to-lab.ipynb]`

If no path is given, ask the user which notebook to target.

---

## Workflow

### Step 1 — Read the notebook and detect lab type

Load the notebook JSON and map its cell structure:

```python
import json
nb = json.load(open(path))
cells = nb["cells"]
for i, c in enumerate(cells):
    src = "".join(c["source"]) if isinstance(c["source"], list) else c["source"]
    print(i, c.get("id", ""), c["cell_type"], repr(src[:80]))
```

Find the lab header cell (cell 0) and read the `# Lab type:` line. The rest of the workflow branches by type:

| `lab type:` value | Student task | Answer content |
|---|---|---|
| `debug` | Find and explain bugs in broken code | Explain what the bug is, why it causes wrong behaviour, how the fix resolves it |
| `review` | Answer conceptual judgment questions | Direct model answer to each question (3–5 sentences) |
| `prompt` | Write prompts for AI tools; audit generated code | Model strong prompt; extracted and reformatted instructor notes |

If no cell IDs are present, assign `cell-0`, `cell-1`, … to all cells before proceeding.

### Step 2 — Check for existing answer cells (idempotent)

Skip any section that already has an answer cell. Check `id` fields for:
- Debug: `answer-bug1`, `answer-bug2`, `answer-bug3`
- Review: `answer-q1` … `answer-qN`
- Prompt: `answer-task1-prompt`, `answer-task2-prompt`, `answer-task3`
- All: `answer-summary`

### Step 3 — Generate answer content

#### Debug labs

For each bug section, read:
- The `## Bug N:` description cell
- The `**Explain the bug:**` prompt cell
- The buggy code cell (`# --- BUGGY CODE (Bug N) ---`)
- The fix code cell (`# Fix for Bug N:`)

Write a concise model answer covering: **what** the bug is, **why** it causes wrong behaviour, **how** the fix resolves it. 3–5 sentences or short bullet points.

For the summary: one tight sentence per bug matching the student task format.

#### Review labs

For each question cell (`**Question N:**`), read:
- The question text
- Any supporting code cell immediately above it (the code the question asks about)

Write a direct model answer (3–5 sentences). Write for adult professionals — direct, no hand-holding.

For the summary: one sentence per bullet matching the summary task format.

#### Prompt labs

- **Prompt-writing tasks** (`## Task N:` with `*(Your prompt here)*`): produce a model strong prompt that satisfies all the requirements listed in the task cell. Include a brief note on why it's strong.
- **Audit tasks** (student identifies errors in pre-written code): check whether an instructor-note HTML comment (`<!-- INSTRUCTOR NOTE ... -->`) already exists in the notebook. If so, extract its content and reformat as a `<details>` block (see Step 5). Do **not** invent errors — use only what the comment describes.
- **Audit checklists** (cells with `[ ]` checkboxes): these are already prescriptive self-checks — no reveal cell needed.

For the summary: one sentence per bullet.

### Step 4 — Construct answer cells

**Debug:**
```json
{
  "cell_type": "markdown",
  "metadata": {},
  "id": "answer-bugN",
  "source": "<details>\n<summary>🔑 Reveal answer — Bug N</summary>\n\n**[Question restatement]:** [explanation]\n\n**Correct approach:** [fix]\n\n</details>"
}
```

**Review:**
```json
{
  "cell_type": "markdown",
  "metadata": {},
  "id": "answer-qN",
  "source": "<details>\n<summary>🔑 Reveal answer — Q1</summary>\n\n[model answer]\n\n</details>"
}
```

**Prompt — model prompt:**
```json
{
  "cell_type": "markdown",
  "metadata": {},
  "id": "answer-task1-prompt",
  "source": "<details>\n<summary>🔑 Model prompt — Task 1</summary>\n\n**Example strong prompt:**\n\n> [prompt text]\n\n**Why it's strong:** [explanation]\n\n</details>"
}
```

**Prompt — audit reveal:**
```json
{
  "cell_type": "markdown",
  "metadata": {},
  "id": "answer-task3",
  "source": "<details>\n<summary>🔑 Reveal errors — Task 3</summary>\n\n**Error 1 — [label]:** [explanation]\n\n**Error 2 — [label]:** [explanation]\n\n**Error 3 — [label]:** [explanation]\n\n</details>"
}
```

**Summary (all types):**
```json
{
  "cell_type": "markdown",
  "metadata": {},
  "id": "answer-summary",
  "source": "<details>\n<summary>🔑 Reveal summary answers</summary>\n\n1. **[label]:** [one sentence]\n\n2. **[label]:** [one sentence]\n\n</details>"
}
```

### Step 5 — Insert cells via Python script

Insert each answer cell immediately after the corresponding student placeholder cell. Use a Python script via Bash (not Edit/Write on the `.ipynb` directly):

```python
import json

path = "path/to/lab.ipynb"
nb = json.load(open(path))
cells = nb["cells"]

def md_cell(cell_id, source):
    return {"cell_type": "markdown", "metadata": {}, "source": source, "id": cell_id}

# Build answer cells
ans1 = md_cell("answer-q1", "...")
# ... etc

# Find insertion indices by cell ID or source content — never hardcode indices
idx1 = next(i for i, c in enumerate(cells) if c.get("id") == "cell-4")
# ...

# Insert in REVERSE index order so earlier insertions don't shift later indices
cells.insert(idx_sum + 1, ans_summary)
cells.insert(idx1 + 1, ans1)

nb["cells"] = cells
open(path, "w").write(json.dumps(nb, indent=2, ensure_ascii=False))
print("Done.", len(nb["cells"]), "cells total")
```

> **Important:** Always insert in **reverse index order** (largest index first).

**Prompt lab — instructor-note HTML comment:** If a cell contains `<!-- INSTRUCTOR NOTE ... -->`, rewrite that cell's `source` in-place to a `<details>` block using the same content. Assign it an ID (`reveal-taskN-instructor`) if it lacks one. Do not insert a separate cell for this — the in-place rewrite is sufficient (a separate `answer-task3` cell is still inserted after the student audit cell).

### Step 6 — Verify

After writing, re-read the notebook and print the cell list with IDs to confirm each answer cell is in the right position. Spot-check one answer cell per type by printing its full source.

---

## Notebook Conventions (SophiArch labs)

### Debug labs

| Cell role | Typical `id` | Identifier pattern |
|---|---|---|
| Lab header | `cell-0` | `# Lab type: debug` |
| Bug section header | varies | `## Bug N:` |
| Buggy code | varies | `# --- BUGGY CODE (Bug N) ---` |
| Explain prompt + placeholder | varies | `**Explain the bug:**` + `*(Write your answer here.)*` |
| Fix code | varies | `# Fix for Bug N:` |
| Summary | last cell | `## Summary` |

### Review labs

| Cell role | Typical `id` | Identifier pattern |
|---|---|---|
| Lab header | `cell-0` | `# Lab type: review` |
| Section header | varies | `## Part N:` |
| Supporting code | varies | code cell before the question |
| Question + placeholder | varies | `**Question N:**` + `*(Write your answer here.)*` |
| Summary | last cell | `## Summary` |

### Prompt labs

| Cell role | Typical `id` | Identifier pattern |
|---|---|---|
| Lab header | `cell-0` | `# Lab type: prompt` |
| Task header | varies | `## Task N:` |
| Prompt placeholder | varies | `*(Your prompt here)*` |
| AI output placeholder | varies | code cell with paste instruction |
| Audit checklist | varies | `[ ]` checkboxes — **no reveal needed** |
| Pre-written code (Task 3) | varies | `# AI-generated code` comment |
| Student audit placeholder | varies | `*(Write here)*` per error |
| Instructor notes | varies | `<!-- INSTRUCTOR NOTE ... -->` HTML comment |
| Summary | last cell | `## Summary` |

Cell IDs vary by notebook — always derive positions by scanning `id` / `source`, not by hardcoding indices.

---

## Answer Cell Format Reference

```html
<!-- Debug -->
<details>
<summary>🔑 Reveal answer — Bug N</summary>

**[Question restatement]:** [explanation]

**Correct approach:** [fix]

</details>
```

```html
<!-- Review -->
<details>
<summary>🔑 Reveal answer — Q1</summary>

**[Key point]:** [explanation]

**[Key point 2]:** [explanation]

</details>
```

```html
<!-- Prompt — model prompt -->
<details>
<summary>🔑 Model prompt — Task N</summary>

**Example strong prompt:**

> [prompt text]

**Why it's strong:** [explanation]

</details>
```

```html
<!-- Prompt — audit errors -->
<details>
<summary>🔑 Reveal errors — Task 3</summary>

**Error 1 — [label]:** [explanation]

**Error 2 — [label]:** [explanation]

**Error 3 — [label]:** [explanation]

</details>
```

```html
<!-- Summary (all types) -->
<details>
<summary>🔑 Reveal summary answers</summary>

1. **[label]:** [one sentence]

2. **[label]:** [one sentence]

</details>
```

---

## Compatibility Notes

- `<details>/<summary>` renders collapsed by default in **Google Colab**, JupyterLab, VS Code notebooks, and standard Jupyter Notebook.
- Do **not** use `"hide": true` cell metadata — it is a project convention not consumed by Colab or the SophiArchSite frontend.
- Notebooks are served via Google Colab links from the SophiArchSite lesson page.
