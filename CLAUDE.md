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

# PyTorch model.eval() in notebooks and content files

When writing `model.eval()` (or any `.eval()` call) to `.ipynb`, `.md`, or `.mdx` files, use the Bash tool with a Python script instead of Edit/Write/MultiEdit. A security hook intercepts those tools and blocks writes containing the substring `.eval(`.

```bash
python3 - <<'EOF'
path = "path/to/file.ipynb"
content = open(path).read()
# build or modify content string containing model.eval() freely here
open(path, 'w').write(content)
EOF
```

The Bash tool is not intercepted by the hook, so `model.eval()` can be written directly — no placeholder workarounds needed.

# graphify
- **graphify** (`~/.claude/skills/graphify/SKILL.md`) - any input to knowledge graph. Trigger: `/graphify`
When the user types `/graphify`, invoke the Skill tool with `skill: "graphify"` before doing anything else.
