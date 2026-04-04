# architecture-beta — Network / System Architecture

Built-in icons: `cloud`, `database`, `disk`, `internet`, `server`

```
architecture-beta
  group vpc(cloud)[AWS VPC]
    service db(database)[PostgreSQL] in vpc
    service api(server)[API Server] in vpc
    service store(disk)[S3] in vpc

  service client(internet)[Browser]

  client:R --> L:api
  api:R --> L:db
  api:B --> T:store
```

Edge syntax: `id1:R --> L:id2` where sides are `L` (left), `R` (right), `T` (top), `B` (bottom). Use `-->` for directed, `--` for undirected.
