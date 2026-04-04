# erDiagram — Entity Relationships

```
%%{init: {'theme': 'base', 'themeVariables': {'background': '#282a36', 'primaryColor': '#44475a', 'primaryTextColor': '#f8f8f2', 'primaryBorderColor': '#6272a4', 'lineColor': '#f8f8f2'}}}%%
erDiagram
  USER {
    int id PK
    string email
    string name
  }
  ORDER {
    int id PK
    int user_id FK
    date created_at
  }
  PRODUCT {
    int id PK
    string name
    float price
  }
  USER ||--o{ ORDER : places
  ORDER }o--|{ PRODUCT : contains
```

Cardinality: `||--||` one-to-one, `||--o{` one-to-many, `}o--o{` many-to-many.
