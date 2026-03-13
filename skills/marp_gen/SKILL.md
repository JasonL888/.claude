---
name: marp_gen
description: Converts project notes, features, or architectural plans into a Marp-compatible Markdown slide deck using a custom corporate template.
---

# Instructions

1. **Identify the Title:** Look for a title provided in the user's prompt.
   - If no title is provided, prompt user for title
   - Use the title in the first slide's `#` header and the Marp `header` field in the YAML frontmatter.

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

7. **Speaker Scripts:**
   After all slide content is finalized, add speaker notes to every slide using Marp's `<!-- ... -->` comment syntax. Follow these rules:
   - **Never repeat slide content verbatim** — add insight, context, analogies, or real-world examples instead.
   - **Each slide gets a unique script** — no reused phrasing across slides.
   - **Be concise** — 3–5 bullet points per slide, glanceable while presenting.
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

8. **Review**:
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