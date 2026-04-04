# classDiagram — OOP Classes

```
%%{init: {'theme': 'base', 'themeVariables': {'background': '#282a36', 'primaryColor': '#44475a', 'primaryTextColor': '#f8f8f2', 'primaryBorderColor': '#6272a4', 'lineColor': '#f8f8f2'}}}%%
classDiagram
  class Animal {
    +String name
    +int age
    +speak() String
  }
  class Dog {
    +fetch() void
  }
  Animal <|-- Dog
```

Relationships: `<|--` inheritance, `*--` composition, `o--` aggregation, `-->` association, `..>` dependency.
