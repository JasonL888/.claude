---
name: quiz_for_ms_forms
description: Uses NotebookLM to generate a quiz from provided source files and exports it as a PDF formatted for manual import into Microsoft Forms. Use ONLY when the user explicitly wants a quiz PDF for Microsoft Forms (e.g. "generate a quiz for Microsoft Forms", "create a quiz PDF I can import to Forms"). Do NOT use for project-specific quiz generation, in-code quiz logic, or any quiz output other than Microsoft Forms import.
---

# When to Use This Skill

**Use this skill when the user explicitly asks to:**
- Generate a quiz PDF for Microsoft Forms import
- Create a quiz from source files using NotebookLM
- Produce a quiz that can be manually imported into Microsoft Forms

**Do NOT use this skill when:**
- The project has its own quiz generation logic or scripts
- The user wants quiz output in a format other than PDF for Microsoft Forms
- The request is about building quiz functionality in code
- There is a project-specific `quiz_gen` command or script available

# Instructions

1. **Identify the Title of Quiz:** Look for a title provided in the user's prompt
   - If no title is provided, prompt user for title
   - Use the title as file name for the output PDF
   - If the title contains characters that are not allowed in file names, replace with underscores (`_`)

2. **Authenticate with NotebookLM**
   - Check if the user is already authenticated by running: `notebooklm status`
   - If not authenticated, run `notebooklm login` and wait for the user to complete any browser-based actions

3. **Prepare Source File(s)**
   - Identify the source file(s) provided by the user
   - If any source file is in an unsupported format (e.g., `.pptx`, `.docx`), convert it to a temporary PDF:
     - Use Python (via Code Interpreter) to convert: `uv run python convert_to_pdf.py <filename>`
     - Keep track of any temp PDF files created for clean-up later

4. **Create a Temporary Notebook**
   - Generate a unique temp notebook name (e.g., `quiz-gen-temp-<timestamp>`)
   - Run: `notebooklm create <notebook-temp-name> --json` and capture the `id` as `notebook_id`
   - Use explicit `--notebook <notebook_id>` flag on all subsequent commands (do not rely on `notebooklm use`)

5. **Add Source File(s)**
   - For each source file (use temp PDF if original was converted):
     - Run: `notebooklm source add <filename> --notebook <notebook_id> --json`
     - Capture each `source_id` returned
   - Wait for all sources to be ready:
     - Run: `notebooklm source wait <source_id> -n <notebook_id> --timeout 120` for each source

6. **Generate Quiz**
   - Run: `notebooklm generate quiz --difficulty medium --notebook <notebook_id> --json`
   - Capture the returned `task_id` as `artifact_id`
   - Wait for completion: `notebooklm artifact wait <artifact_id> -n <notebook_id> --timeout 900`

7. **Download Quiz**
   - Run: `notebooklm download quiz quiz.json -a <artifact_id> -n <notebook_id>`
   - This creates a `quiz.json` file in the current directory

8. **Convert to PDF for Microsoft Forms Import**
   - Read `quiz.json` and parse the questions, options, and answers
   - Map to the Microsoft Forms import format:
     - Each question numbered sequentially (1, 2, 3, etc.)
     - Options labeled with letters (A, B, C, D)
     - Correct answer at end of each question block as "Answer: [Correct Option Letter]"
   - Sample format:
     ```text
     1. What is the output of this Python code?
     A) 2
     B) 3
     C) 4
     D) Error
     Answer: C

     2. Which of the following is a valid variable name in Python?
     A) 1variable
     B) variable_name
     C) variable-name
     D) variable name
     Answer: B
     ```
   - Use Python (via `uv run`) to generate the PDF file from the parsed content

9. **Clean Up**
   - Delete the temp notebook: `notebooklm notebook delete <notebook_id>`
   - Delete any temp PDF files created during source conversion
   - Delete `quiz.json`

# Examples
## Usage Example
- User: "Generate a quiz on Clustering based on @file for Microsoft Forms"
- Response: "I've created `clustering_quiz.pdf` in current folder