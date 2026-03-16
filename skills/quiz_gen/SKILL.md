---
name: quiz_gen
description: Generates a quiz based on the provided content, including questions, multiple-choice and correct answers. The output is a PDF file that can be manually imported to Microsoft Forms.
---

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
   - Run: `notebooklm create <notebook-temp-name>`
   - Capture the returned `notebook_id`
   - Run: `notebooklm use <notebook_id>`

5. **Add Source File(s)**
   - For each source file (use temp PDF if original was converted):
     - Run: `notebooklm source add <filename>`

6. **Generate Quiz**
   - Run: `notebooklm generate quiz --difficulty medium`
   - Capture the returned `artifact-id` from the output

7. **Download Quiz**
   - Run: `notebooklm download quiz -a <artifact-id>`
   - This creates a `quiz.json` file in the current directory

8. **Convert to PDF**
   - Read `quiz.json` and parse the questions, options, and answers
   - Map to the standard format:
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
   - Use Python (via Code Interpreter) to generate the PDF file from the parsed content

9. **Clean Up**
   - Delete the temp notebook: `notebooklm use <notebook_id>` then `echo "y" | notebooklm delete`
   - Delete any temp PDF files created during source conversion
   - Delete `quiz.json`

# Examples
## Usage Example
- User: "Generate a quiz on Clustering based on @file"
- Response: "I've created `clustering_quiz.pdf` in current folder