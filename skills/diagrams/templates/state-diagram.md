# stateDiagram-v2 — State Machines

```
%%{init: {'theme': 'base', 'themeVariables': {'background': '#282a36', 'primaryColor': '#44475a', 'primaryTextColor': '#f8f8f2', 'primaryBorderColor': '#6272a4', 'lineColor': '#f8f8f2'}}}%%
stateDiagram-v2
  [*] --> Idle
  Idle --> Running : start
  Running --> Paused : pause
  Paused --> Running : resume
  Running --> [*] : stop
```

Use `state "Label" as id` for long names. Nest states with `state Outer { inner }`.
