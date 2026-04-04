# gantt — Project / Sprint Planning

```
%%{init: {'theme': 'base', 'themeVariables': {'background': '#282a36', 'primaryColor': '#44475a', 'primaryTextColor': '#f8f8f2', 'primaryBorderColor': '#6272a4', 'lineColor': '#f8f8f2'}}}%%
gantt
  title Sprint 1
  dateFormat YYYY-MM-DD
  section Backend
    Auth API       : done,    b1, 2024-01-01, 3d
    Data models    : active,  b2, after b1, 2d
    REST endpoints :          b3, after b2, 4d
  section Frontend
    Login UI       :          f1, 2024-01-03, 3d
    Dashboard      :          f2, after f1, 5d
```
