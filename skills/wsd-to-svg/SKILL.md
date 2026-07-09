---
name: wsd-to-svg
description: >
  Convert a WebSequenceDiagram (.wsd) file into an SVG using PlantUML. Use
  when asked to "convert a .wsd to svg", "export a sequence diagram as svg",
  "render this .wsd file", or any similar request involving turning a `.wsd`
  file into an image.
---

# WSD → SVG (via PlantUML)

Renders a `.wsd` (WebSequenceDiagram-syntax) file to `.svg` using the local
`plantuml` CLI (installed via Homebrew, backed by `openjdk` + `graphviz`).

PlantUML's sequence-diagram syntax is a superset of/near-identical to
WebSequenceDiagrams syntax (`participant X`, `A->B: label`, `A-->B: label`,
`note right of X ... end note`, `== Section ==`), so most `.wsd` files render
correctly with no rewriting — the only structural requirement PlantUML adds
is wrapping the diagram body in `@startuml` / `@enduml`.

---

## Step 1 — Check `plantuml` is available

```bash
which plantuml || brew install plantuml
```

If `brew` itself is missing, tell the user to install Homebrew first — don't
attempt another install method silently.

---

## Step 2 — Prepare the source file

Read the `.wsd` file. If it does not already start with `@startuml` (and end
with `@enduml`), write a temporary copy that wraps the original content:

```
@startuml
<original .wsd content>
@enduml
```

Do not otherwise rewrite the diagram body — WebSequenceDiagrams and PlantUML
sequence syntax overlap enough that translation is rarely needed. Only patch
specific lines if `plantuml` reports a syntax error for them (see Step 4).

---

## Step 3 — Render to SVG

```bash
plantuml -tsvg path/to/diagram.wsd
```

- PlantUML writes the output next to the source as `diagram.svg` (same
  basename, `.svg` extension), regardless of the `.wsd` extension.
- If you had to create a wrapped temp copy in Step 2, render that copy, then
  move/rename the resulting `.svg` to sit next to the original `.wsd` file
  (same directory, same basename) and remove the temp copy.
- Pass `-o <dir>` to control output location if the file should not land
  next to the source (e.g. an `Images/diagrams/` folder used elsewhere in
  the repo).

---

## Step 4 — Handle errors

`plantuml` prints `Warning: no image in <file>` / `No diagram found` when
`@startuml`/`@enduml` markers are missing — confirms Step 2 is required.

For genuine syntax errors, PlantUML reports the offending line number
directly in stderr. Fix only that line (common WebSequenceDiagrams-isms that
need adjusting: `alt`/`else`/`end` blocks are supported as-is; `activate`/
`deactivate` are supported as-is; a bare title line without `title` keyword
is not supported and needs `title ` prefixed).

---

## Step 5 — Confirm and report

Open or check the resulting `.svg` exists and has non-trivial size
(`ls -la`), then report its path to the user.
