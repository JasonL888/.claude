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
    - copy the logo from the skill's assets folder to the same directory as the generated Markdown file
   - The footer with the company name

6. **Structure:**
   - Use `---` to separate slides
   - Ensure every slide has a Heading 1

# Cover Page Template

```markdown
# <br><br>{{TITLE}}

![bg right width:50%](./logo.png)
```

# Examples

## Usage Example
- User: "Generate a slide deck for our new API docs."
- Response: "I've created `api-presentation.md` with a cover page, title, and company logo using the marp_gen skill."