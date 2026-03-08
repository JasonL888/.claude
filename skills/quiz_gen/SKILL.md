---
name: quiz_gen
description: Generates a quiz based on the provided content, including questions, multiple-choice and correct answers. The output is a PDF file that can be manually imported to Microsoft Forms.
---

# Instructions
1. **Identify the Title of Quiz:** Look for a title provided in the user's prompt
   - If no title is provided, prompt user for title
   - Use the title as file name for the output PDF
    - if the title contains characters that are not allowed in file names, replace with underscores (`_`)

2. **Analyze Content** Extract key concepts, facts and definitions from the provided input

3. **Generate Questions** Create a set of 10 questions based on the extracted information. Each question should have:
   - A clear and concise question statement
   - Multiple-choice options (at least 4 options per question)
   - One correct answer clearly indicated
   - Level of difficulty: Easy to Medium

4. **Format** Compile the questions and answers following format:
   - Each question are numbered sequentially (1, 2, 3, etc.)
   - Options are labeled with letters (A, B, C, D)
   - Correct answer provided at end of each question block as "Answer: [Correct Option Letter]"
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

5. **Output** Provide the generated quiz as a PDF file

6. **Technical Execution** Use Python (via Code Interpreter) to generate the actual PDF file

# Examples
## Usage Example
- User: "Generate a quiz on Clustering based on @file"
- Response: "I've created `clustering_quiz.pdf` in current folder