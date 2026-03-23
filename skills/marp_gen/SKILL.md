---
name: marp_gen
description: Converts project notes, features, or architectural plans into a Marp-compatible Markdown slide deck using a custom corporate template.
---

# Instructions

1. **Identify the Title:** Look for a title provided in the user's prompt.
   - If no title is provided, prompt user for title
   - Use the title in the first slide's `#` header and the Marp `header` field in the YAML frontmatter.
    - check the title is vertically centered on the cover slide. If not, adjust the content or styling to ensure it is.

2. **Extract Metadata:**
   - **Year:** Always use the current year (2026).

3. **Format:** Output the response as a single Markdown file with `.md` extension.

4. **Marp Header:** Always start with the YAML frontmatter:
   ```markdown
   ---
   marp: true
   author: Jason Lau
   size: 16:9
   theme: dracula
   paginate: true
   transition: fade
   class:
   - lead
   header: "{{TITLE}}"
   footer: "© {{YEAR}} SophiArch"
   style: |
       .columns {
           display: grid;
           grid-template-columns: repeat(2, minmax(0, 1fr));
           gap: 1rem;
       }
       section.lead h1 {
           text-align: center;
       }
       table {
           width: 100%;
       }
       theader {
           font-size: 0.7em;
           text-align: center;
       }
       tbody {
           font-size: 0.6em;
           text-align: left;
       }
       h1 {
           font-size: 1.35em;
       }
       li > strong {
           color: var(--dracula-orange);
       }
       li {
         font-size: 0.9em;
       }
       strong {
           color: var(--dracula-orange);
       }
       blockquote {
           font-size: 0.8em;
           font-style: italic;
       }
       img[alt~="center"] {
           display: block;
           margin: 0 auto;
       }
       .fa-twitter { color: aqua; }
       .fa-mastodon { color: purple; }
       .fa-linkedin { color: blue; }
       .fa-triangle-exclamation
       .fa-window-maximize { color: skyblue; }
       .fa-arrow-alt-circle-right {color: #8be9fd }
       @import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css'
   ---
   ```

5. **Cover Page:** Always include a cover page as the first slide with:
   - A large `#` header for the title
   - A company PNG logo image centered below the title using `![bg right width:50%](./logo.png)`
    - check if the logo exists in current workspace. 
        - If exist, reuse the same logo
        - otherwise, copy the logo from the skill's assets folder to the same directory as the generated Markdown file
   - The footer with the company name

6. **Structure:**
   - Use `---` to separate slides
   - Ensure every slide has a Heading 1
   - Use bullet points for lists and ensure they are concise
     - preferably each bullet point should be one line without overflowing
   - Include images where relevant using `![alt text](image_url)`
   - Use blockquotes for important notes or quotes

6b. **Writing Style:**
   - **No filler openers** — drop unnecessary articles and weak openers at the start of sentences and headings:
     - ❌ "The most robust production systems..." → ✅ "Most robust production systems..."
     - ❌ "This is the key insight..." → ✅ "Key insight..."
     - ❌ "There are three main reasons..." → ✅ "Three main reasons..."
   - **No trailing full stops on isolated text** — omit the period when a sentence stands alone with no follow-on sentence (card body text, bullet points, highlight-box lines, slide subtitles):
     - ❌ "CLU models can run without a live API endpoint." *(sole sentence in a card)*
     - ✅ "CLU models can run without a live API endpoint"
     - Keep periods only when two or more sentences appear in the same block

6a. **Diagrams:**
   When a diagram would meaningfully aid understanding during presentation (e.g. flows, architectures, comparisons, timelines), create it as a diagram. Use **Mermaid** as the default choice; use **Excalidraw** only when a hand-drawn/sketchy aesthetic is explicitly needed.

   **Finding the Images directory:**
   - Search parent directories of the output `.md` file for an existing `Images/` folder
   - If one exists anywhere up the directory tree, use it — do not create a duplicate
   - If none exists, create `Images/` in the same directory as the `.md` file

   ---

   ### Option A — Mermaid (default)

   **Creating the diagram:**
   - Write the diagram as a `.mmd` file (Mermaid source) in the `Images/` directory
   - Use the Dracula colour palette via Mermaid's `%%{init: ...}%%` config block:
     ```
     %%{init: {'theme': 'base', 'themeVariables': {
       'primaryColor': '#1e3a5f', 'primaryTextColor': '#f8f8f2',
       'primaryBorderColor': '#4a9eed', 'lineColor': '#8be9fd',
       'secondaryColor': '#1a4d2e', 'tertiaryColor': '#282a36',
       'background': '#282a36', 'mainBkg': '#282a36',
       'nodeBorder': '#4a9eed', 'clusterBkg': '#282a36',
       'titleColor': '#f8f8f2', 'edgeLabelBackground': '#282a36',
       'fontFamily': 'monospace'
     }}}%%
     ```

   **Generating the SVG:**
   - After writing the `.mmd` file, run `mmdc` to render it to SVG:
     ```bash
     uv run mmdc -i Images/diag_<name>.mmd -o Images/diag_<name>.svg --backgroundColor "#282a36"
     ```
   - The `.mmd` is the editable source; the `.svg` is the render artifact used by Marp

   **File placement:**
   - Save `diag_<name>.mmd` and `diag_<name>.svg` into the `Images/` directory
   - Reference in the slide as `![center](../Images/diag_<name>.svg)` (adjust relative path to match `.md` file location)

   ---

   ### Option B — Excalidraw (hand-drawn/sketch style only)

   Use **only** when a hand-drawn or informal sketch aesthetic is explicitly requested.

   **Creating the diagram:**
   - Write a Python script (using `uv run python`) that generates a proper `.excalidraw` JSON file
   - Use the **native Excalidraw element format** — never use the `"label"` shorthand on rectangles:
     - Every text label must be a separate `"text"` element with `"containerId"` pointing to its parent shape
     - The parent shape must have `"boundElements": [{"id": "txt_xxx", "type": "text"}]`
     - Standalone captions (no container) use `"containerId": null`
   - Use the Dracula colour palette to match the slide theme:
     - Background fill: `#282a36`, node fills: `#1e3a5f` / `#1a4d2e` / `#5c1a1a`
     - Strokes: `#4a9eed` (blue), `#22c55e` (green), `#ef4444` (red), `#8be9fd` (cyan), `#ffb86c` (orange)
     - Text: `#f8f8f2` (light), `#ff5555` (red labels), `#6272a4` (muted)
   - Set `"roughness": 1` or higher for the hand-drawn look
   - Use `fontFamily: 1` (hand-written) for labels

   **Generating the SVG:**
   - After writing the `.excalidraw` file, also write a matching hand-crafted `.svg` file that faithfully reproduces the diagram
   - The SVG is the render artifact used by Marp — the `.excalidraw` is the editable source
   - SVG background should use `fill="#282a36"` with `rx="8"` on the outer rect to match the dark theme

   **File placement:**
   - Save both `diag_<name>.excalidraw` and `diag_<name>.svg` into the `Images/` directory
   - Reference in the slide as `![center](../Images/diag_<name>.svg)` (adjust relative path to match `.md` file location)

   ---

   **When to create diagrams:**
   - Flows and pipelines (data flow, training loop, inference pipeline)
   - Architecture comparisons (e.g. RNN vs LSTM vs Transformer)
   - Step-by-step processes that are hard to grasp as bullet points
   - Before/after or cause/effect relationships
   - Do NOT create diagrams for simple lists, tables, or content that reads clearly as text

7. **Speaker Scripts:**
   After all slide content is finalized, add speaker notes to every slide using Marp's `<!-- ... -->` comment syntax. Follow these rules:
   - **Never repeat slide content verbatim** — add insight, context, analogies, or real-world examples instead.
   - **Each slide gets a unique script** — no reused phrasing across slides.
   - **Be concise** — 3–5 bullet points per slide, glanceable while presenting.
   - **Break long bullets into sub-lists** — if a point is too long to read at a glance, split it into a short parent line and indented sub-bullets:
     ```
     - Main point (short anchor phrase, ≤10 words)
       - supporting detail or elaboration
       - second part of the thought
     ```
   - **Add value** based on slide type:
     - Definition slide → real-world analogy or example
     - Diagram slide → what to focus on and why it matters
     - List slide → prioritization, common pitfalls, or surprising nuance
     - Code slide → what it does conceptually, where it's used
     - Title/transition slide → bridge from previous topic, what's coming and why
   - **Format** each note block placed at the end of its slide content, before the next `---`:
     ```
     <!--
     - Key insight or elaboration
     - Supporting detail, example, or analogy
     - [Additional point if needed]
     -->
     ```
   - **Engagement questions:** Occasionally add a question to pose to the audience — use sparingly, **1–2 per deck**, only when it meaningfully enhances the slide:
     - Use when: the slide reveals a counterintuitive fact, benefits from audience reflection, or is a narrative pivot point
     - Do not use on: routine explanatory slides, dense technical content, or back-to-back with another question
     - Format as the last line inside the comment block, prefixed with `❓`:
       ```
       <!--
       - Key insight
       - Supporting detail
       ❓ Ask: "Your question here?"
       -->
       ```

8. **References Slide:**
   After the last content slide and before the final/closing slide, add one or more **References** slides for further reading. Follow these rules:

   **When to include:**
   - Always include if the source material contains URLs, citations, or links
   - Always include if the content covers tools, services, or standards that have official documentation
   - Always include for technical decks where audience members may want to dig deeper

   **Split into separate slides by category** when there are more than ~6 references total:
   - **Deprecation & Retirement Notices** — official announcements, GitHub archived repos, retirement dashboards
   - **Official Documentation** — product docs, quickstarts, API references on learn.microsoft.com or equivalent
   - **Further Reading** — blog posts, research papers, community resources

   **Format each references slide as a table:**
   ```markdown
   # References — [Category Name]

   | Topic | Source |
   |-------|--------|
   | **Tool or concept name** | [short link label](full URL) |
   | **Tool or concept name** | [short link label](full URL) |

   > Always verify currency at [authoritative domain] — this space moves fast
   ```

   **Rules:**
   - Use descriptive link labels, not raw URLs — e.g. `[learn.microsoft.com — Agent Framework overview](url)` not `[https://...]`
   - Group retirement/deprecation announcements first (most time-sensitive)
   - Add a speaker note pointing out which links are highest priority to bookmark
   - If the source material had no URLs but tools/concepts can be looked up, generate the canonical documentation URLs from your knowledge

9. **Review**:
   - Ensure that the content is clear and visually appealing when rendered in Marp
   - Review the HTML output to ensure formatting is within the page limits and not overflowing

# Cover Page Template

```markdown
# <br><br>{{TITLE}}

![bg right width:50%](./logo.png)
```

# Examples

## Usage Example
- User: "Generate a slide deck for our new API docs."
- Response: "I've created `api-presentation.md` with a cover page, title, and company logo using the marp_gen skill."