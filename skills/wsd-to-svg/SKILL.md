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

## Step 3.5 — Dark/Dracula theming (optional)

For decks that use a dark theme (e.g. Marp `theme: dracula`), add a
`skinparam` block inside `@startuml`/`@enduml`, before the diagram body, so
the rendered SVG matches the slide background instead of defaulting to
PlantUML's white canvas:

```
skinparam backgroundColor #282a36
skinparam defaultFontColor #f8f8f2

skinparam NoteBackgroundColor #ffb86c
skinparam NoteBorderColor #ffb86c
skinparam NoteFontColor #282a36

skinparam sequence {
    ParticipantBackgroundColor #bd93f9
    ParticipantBorderColor #bd93f9
    ParticipantFontColor #282a36
    ActorBackgroundColor #bd93f9
    ActorBorderColor #bd93f9
    ActorFontColor #282a36
    LifeLineBorderColor #6272a4
    LifeLineBackgroundColor #282a36
    ArrowColor #f8f8f2
    ArrowFontColor #f8f8f2
    DividerBackgroundColor #44475a
    DividerFontColor #f8f8f2
}
```

**`NoteBackgroundColor`/`NoteBorderColor`/`NoteFontColor` must be set as
top-level `skinparam` statements, not nested inside `skinparam sequence {
... }`.** PlantUML silently ignores note-color keys placed inside the
`sequence` block — the note then falls back to its default pale-yellow
background while `defaultFontColor` (set light, for the dark canvas) still
applies to its text, producing near-invisible light-text-on-light-note. This
is the most common mistake when adapting this block — verify by grepping the
rendered SVG for `fill="#ffb86c"` (or your chosen note color) after
rendering; if it's missing, the skinparam didn't take effect.

Swap the hex values for a different palette as needed; the structural rule
(note colors must be top-level) applies regardless of palette.

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
