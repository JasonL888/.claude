---
name: reveal-answers
description: 'Add collapsible <details>/<summary> answer cells to SophiArch debug lab notebooks. Use when asked to "add answers to a notebook", "add reveal answers", "add hidden answers", or "add answer cells to a lab". Takes a path to a lab.ipynb file and inserts model-answer cells after each student placeholder, visible in Google Colab via click-to-expand.'
---

# Reveal Answers Skill

Inserts collapsible answer cells into a SophiArch debug lab notebook. Each answer is hidden inside a `<details>/<summary>` HTML block that students can expand in Google Colab (or any Jupyter viewer that renders HTML in markdown cells).

## When to Use

- User says "add reveal answers to [notebook]"
- User says "add hidden answers to the lab"
- User says "add answer cells" to a `.ipynb` file
- Applying the pattern to a new debug lab notebook for the first time

## Trigger

`/reveal-answers [path-to-lab.ipynb]`

If no path is given, ask the user which notebook to target.

---

## Workflow

### Step 1 — Read the notebook

Load the notebook JSON and map its cell structure:

```python
import json
nb = json.load(open(path))
cells = nb["cells"]
for i, c in enumerate(cells):
    print(i, c["id"], c["cell_type"], repr(c["source"][:80]))
```

Identify:
- **Section header cells** — markdown cells whose source starts with `## Bug N:`
- **Prompt cells** — markdown cells that contain `**Explain the bug:**`
- **Student placeholder cells** — markdown cells whose source is exactly (or contains) `*(Write your explanation here.)*`
- **Fix code cells** — code cells whose source starts with `# Fix for Bug N:`
- **Summary placeholder** — the final markdown cell that contains a numbered list template for students to complete

### Step 2 — Check for existing answer cells

Skip any section that already has an `answer-bugN` or `answer-summary` cell (idempotent). Check cell `id` fields.

### Step 3 — Generate answer content

For each bug section, read:
- The `## Bug N:` description cell (explains what the bug category is)
- The `**Explain the bug:**` prompt cell (the question the student must answer)
- The buggy code cell (marked `# --- BUGGY CODE (Bug N) ---`)
- The fix code cell (marked `# Fix for Bug N:`)

Use these four cells as context to write a concise model answer covering:
1. **What** the bug is (the incorrect code)
2. **Why** it causes wrong behaviour
3. **How** to fix it (what the correct version does differently)

Keep answers to 3–5 sentences or short bullet points. Write for adult professionals — direct, no hand-holding.

For the **summary cell**, produce a single tight sentence per bug (matching the format of the student task: "one sentence summarising what went wrong and how to prevent it").

### Step 4 — Construct answer cells

Each answer cell is a markdown cell with this structure:

```json
{
  "cell_type": "markdown",
  "metadata": {},
  "id": "answer-bugN",
  "source": "<details>\n<summary>🔑 Reveal answer — Bug N</summary>\n\n[answer content here]\n\n</details>"
}
```

For the summary:

```json
{
  "cell_type": "markdown",
  "metadata": {},
  "id": "answer-summary",
  "source": "<details>\n<summary>🔑 Reveal summary answers</summary>\n\n1. **Bug 1 — [label]:** [one sentence]\n\n2. **Bug 2 — [label]:** [one sentence]\n\n3. **Bug 3 — [label]:** [one sentence]\n\n</details>"
}
```

Use IDs: `answer-bug1`, `answer-bug2`, `answer-bug3`, `answer-summary`.

**Answer content format inside `<details>`:**

```markdown
**[Short restatement of the question, e.g. "Why the order matters:" or "What `nn.BCELoss` expects:"]** [explanation]

**Correct approach:** [what should be done instead]
```

### Step 5 — Insert cells via Python script

Insert each answer cell immediately after the corresponding student placeholder cell. Use a Python script via Bash (not Edit/Write on the .ipynb directly, as the file is JSON and positional insertion requires script logic):

```python
import json

path = "path/to/lab.ipynb"
nb = json.load(open(path))
cells = nb["cells"]

def md_cell(cell_id, source):
    return {"cell_type": "markdown", "metadata": {}, "source": source, "id": cell_id}

# Build answer cells (content generated in Step 3/4)
ans1 = md_cell("answer-bug1", "...")
ans2 = md_cell("answer-bug2", "...")
ans3 = md_cell("answer-bug3", "...")
ans_summary = md_cell("answer-summary", "...")

# Find insertion indices BEFORE modifying the list
idx_placeholder1 = next(i for i, c in enumerate(cells) if c["id"] == "cell-7")  # adjust ID
idx_placeholder2 = next(i for i, c in enumerate(cells) if c["id"] == "cell-12")
idx_placeholder3 = next(i for i, c in enumerate(cells) if c["id"] == "cell-17")
idx_summary      = next(i for i, c in enumerate(cells) if "Summary" in "".join(c["source"] if isinstance(c["source"], list) else [c["source"]]))

# Insert in REVERSE index order so earlier insertions don't shift later indices
cells.insert(idx_summary + 1, ans_summary)
cells.insert(idx_placeholder3 + 1, ans3)
cells.insert(idx_placeholder2 + 1, ans2)
cells.insert(idx_placeholder1 + 1, ans1)

nb["cells"] = cells
open(path, "w").write(json.dumps(nb, indent=2, ensure_ascii=False))
print("Done.", len(nb["cells"]), "cells total")
```

> **Important:** Always insert in **reverse index order** (largest index first) so earlier insertions don't shift the indices of later ones.

### Step 6 — Verify

After writing, re-read the notebook and print the cell list with IDs to confirm answer cells are in the right positions. Check:
- `answer-bug1` follows the Bug 1 student placeholder
- `answer-bug2` follows the Bug 2 student placeholder
- `answer-bug3` follows the Bug 3 student placeholder
- `answer-summary` follows the summary placeholder

---

## Notebook Conventions (SophiArch debug labs)

| Cell role | Typical `id` | Identifier pattern |
|---|---|---|
| Lab header | `cell-0` | `` ```\n# Lab type: debug `` |
| Bug section header | `cell-4`, `cell-9`, `cell-14` | `## Bug N:` |
| Buggy code | `cell-5`, `cell-10`, `cell-15` | `# --- BUGGY CODE (Bug N) ---` |
| Explain prompt | `cell-6`, `cell-11`, `cell-16` | `**Explain the bug:**` |
| Student placeholder | `cell-7`, `cell-12`, `cell-17` | `*(Write your explanation here.)*` |
| Fix code | `cell-8`, `cell-13`, `cell-18` | `# Fix for Bug N:` |
| Summary | last cell | `## Summary` |

Cell IDs vary by notebook — always derive positions by scanning `id` / `source`, not by hardcoding indices.

---

## Answer Cell Format Reference

```html
<details>
<summary>🔑 Reveal answer — Bug N</summary>

**[Question restatement]:** [explanation of what the bug is and why it's wrong]

**Correct approach:** [what should be done instead and why]

</details>
```

```html
<details>
<summary>🔑 Reveal summary answers</summary>

1. **Bug 1 — [short label]:** [one sentence fix summary]

2. **Bug 2 — [short label]:** [one sentence fix summary]

3. **Bug 3 — [short label]:** [one sentence fix summary]

</details>
```

---

## Compatibility Notes

- `<details>/<summary>` renders collapsed by default in **Google Colab**, JupyterLab, VS Code notebooks, and standard Jupyter Notebook.
- Do **not** use `"hide": true` cell metadata — it is a project convention not consumed by Colab or the SophiArchSite frontend.
- Notebooks are served via Google Colab links from the SophiArchSite lesson page.
