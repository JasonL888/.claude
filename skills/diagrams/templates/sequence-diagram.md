# sequenceDiagram — API / Message Sequences

```
%%{init: {'theme': 'base', 'themeVariables': {'background': '#282a36', 'primaryColor': '#44475a', 'primaryTextColor': '#f8f8f2', 'primaryBorderColor': '#6272a4', 'lineColor': '#6272a4', 'edgeLabelBackground': '#282a36', 'fontFamily': 'Nunito, sans-serif', 'fontSize': '18px'}}}%%
sequenceDiagram
  participant C as Client
  participant A as API
  participant D as Database

  C->>A: POST /login
  A->>D: SELECT user WHERE email=?
  D-->>A: user row
  A-->>C: 200 OK + JWT
```

Arrow types: `->>` async, `-->>` dashed reply, `->>+` activate, `-->>-` deactivate.
