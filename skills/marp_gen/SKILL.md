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
   footer: "© {{YEAR}} SophiArch [lms.sophiarch.com](https://lms.sophiarch.com)"
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
   - A company PNG logo image centered below the title
   - The footer with the company name

   **Logo resolution (run these checks in order before writing the cover slide):**
   1. Check for `logo.png` in the **same directory** as the output `.md` file → use `./logo.png`
   2. Check for `logo.png` in the **`Images/` subdirectory** of that same directory → use `./Images/logo.png`
   3. If neither exists, copy `logo.png` from `/Users/jasonlau/.claude/skills/marp_gen/assets/logo.png` into the **same directory** as the `.md` file → use `./logo.png`

   Use whichever path was resolved — never hardcode `./logo.png` without first verifying the file exists at that path.

5a. **Theme Asset:** Do not copy `dracula.css` into the output directory. Compilation (via the `marp_gen` CLI script) and VS Code preview both reference the shared theme directly at `/Users/jasonlau/.claude/skills/marp_gen/assets/dracula.css` — a per-directory copy is unnecessary and should not be created.

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
   When a diagram would meaningfully aid understanding during presentation (e.g. flows, architectures, comparisons, timelines), use the **`diagrams` skill** to generate it. Follow all tool selection, colour palette, and workflow rules defined there.

   **When to create diagrams:**
   - Flows and pipelines (data flow, training loop, inference pipeline)
   - Architecture comparisons (e.g. RNN vs LSTM vs Transformer)
   - Step-by-step processes that are hard to grasp as bullet points
   - Before/after or cause/effect relationships
   - Do NOT create diagrams for simple lists, tables, or content that reads clearly as text

   **Marp-specific overrides** (these take precedence over `diagrams` skill defaults):

   - **File naming:** prefix all diagram files with `diag_` — e.g. `diag_training_loop.mmd`, `diag_training_loop.svg`
   - **Storage:** Marp decks are standalone — always use the `Images/` fallback from the `diagrams` skill storage resolution:
     - Search parent directories of the output `.md` file for an existing `Images/` folder; use it if found
     - If none exists, create `Images/` in the same directory as the `.md` file
   - **Slide reference syntax:** use Marp's centering alt-text:
     ```markdown
     ![center](../Images/diag_<name>.svg)
     ```
     Adjust the relative path to match the `.md` file's location.

7. **Speaker Scripts:**
   After all slide content is finalized, add speaker notes to every slide using Marp's `<!-- ... -->` comment syntax. Follow these rules:
   - **Timing (NEW):** Always start each speaker note block with an **approximate timing line** in the format `⏱️ Slide Timing: X min` where X is the estimated duration for that slide. This helps presenters pace their delivery. Example:
     ```
     <!--
     ⏱️ Slide Timing: 5 min
     
     - Key insight or elaboration
     - Supporting detail
     -->
     ```
     Timing guidelines:
     - Cover/intro slides: 1 min
     - Content-heavy slides (architecture, detailed explanations): 4–6 min
     - Quick reference/list slides: 2–3 min
     - Hands-on/demo slides: 3–5 min
     - Q&A slides: Allow 5–10 min depending on session length
     - Ensure all slide timings sum to approximately the total session duration
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
     ⏱️ Slide Timing: X min
     
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
       ⏱️ Slide Timing: X min
       
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
   - Output only the `.md` file (and any referenced assets) — do not compile to HTML/PDF/PPTX unless the user explicitly asks

# Cover Page Template

```markdown
# <br><br>{{TITLE}}

![bg right width:50%]({{LOGO_PATH}})
```

Where `{{LOGO_PATH}}` is resolved at generation time via the logo resolution steps in section 5 — either `./logo.png` or `./Images/logo.png` depending on where the file exists.

# Examples

## Usage Example
- User: "Generate a slide deck for our new API docs."
- Response: "I've created `api-presentation.md` with a cover page, title, and company logo using the marp_gen skill."