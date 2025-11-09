# Demo Service

## Prerequisites

- Node.js ≥ 20.19 (22.x LTS recommended)
- npm

## For NestJS

create .env from .env.example
you can use this env below

```bash
# .env
NODE_ENV=development
PORT=3000
# JWT
JWT_SECRET=abcdefghijklmnopqrstuvwxyz
JWT_EXPIRES_IN=3600
# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=db
DB_SSL=false
```

```bash
docker compose up -d # for db
npm install
npm run start:dev
```

Open http://localhost:3000

## For NextJS

```bash
npm install
npm run dev
```

Open http://localhost:3001

## Design

Both are using Vertical Slice(Feature based)
# ticket-interface-demo
