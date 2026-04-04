# block-beta — System Block Diagrams

```
block-beta
  columns 3
  A["Frontend"] B["API Gateway"] C["Backend"]
  space D["Cache"] space
  space E["Database"] space
  A --> B
  B --> C
  C --> D
  C --> E
```

Use `columns N` to set grid width. `space` = empty cell. No `%%{init}%%` support.
