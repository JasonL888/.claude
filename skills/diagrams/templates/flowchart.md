# flowchart — Pipelines, Workflows, Decision Trees

```
%%{init: {'theme': 'base', 'themeVariables': {'background': '#282a36', 'primaryColor': '#44475a', 'primaryTextColor': '#f8f8f2', 'primaryBorderColor': '#6272a4', 'lineColor': '#f8f8f2'}}}%%
flowchart LR
  D[Raw Data] --> P[Preprocess] --> M[Model] --> E[Evaluate]
  style D fill:#8be9fd,stroke:#6272a4,color:#282a36
  style P fill:#ffb86c,stroke:#6272a4,color:#282a36
  style M fill:#bd93f9,stroke:#6272a4,color:#282a36
  style E fill:#50fa7b,stroke:#6272a4,color:#282a36
```

Shape conventions: `[rect]` = process, `{diamond}` = decision, `[(cylinder)]` = storage, `((circle))` = terminal. Max 7±2 nodes.
