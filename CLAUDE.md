# Python Package Management

Use `uv` exclusively: `uv add`, `uv remove`, `uv run <script>`, `uv run pytest`, `uv run ruff`, `uv sync`.
Never use `pip install`, `python script.py`, or `python -m pytest` directly.

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
