# Python Package Management

Use `uv` exclusively for Python package management in this project.

## Commands
- Install dependencies: `uv add <package>`
- Remove dependencies: `uv remove <package>`
- Run scripts: `uv run <script.py>`
- Run tools: `uv run pytest`, `uv run ruff`
- Sync dependencies: `uv sync`

## Rules
- Never use `pip install` — use `uv add` instead
- Never use `python script.py` directly — use `uv run script.py`
- Never use `python -m pytest` — use `uv run pytest`
# graphify
- **graphify** (`~/.claude/skills/graphify/SKILL.md`) - any input to knowledge graph. Trigger: `/graphify`
When the user types `/graphify`, invoke the Skill tool with `skill: "graphify"` before doing anything else.
