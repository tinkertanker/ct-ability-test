# CT Quest

A web-based Computational Thinking ability test platform. Teachers create join-code events and track student results. Students join via a code, complete a timed quiz, and see their score.

---

## Architecture

```
ct_ability_test/
├── backend/          Express API server + SQLite database
│   ├── src/
│   │   ├── server.js     REST API routes, JWT auth, static file serving (production)
│   │   ├── db.js         Database layer — schema, seed, all queries
│   │   └── questionBank.js  Loads and filters the question set
│   └── data/
│       └── app.db        SQLite database (auto-created on first run, gitignored)
├── web/              Frontend — plain HTML/CSS/JS, no framework
│   ├── index.html    Student quiz UI
│   ├── app.js        Student quiz logic
│   ├── admin.html    Teacher portal UI
│   ├── admin.js      Teacher portal logic
│   ├── questions.js  Question rendering
│   ├── style.css     Shared styles (dark/light mode)
│   └── vite.config.js  Dev server config (proxy + multi-page build)
├── Dockerfile        Multi-stage production image
├── docker-compose.yml  Single-command deployment
└── nginx.conf        Reference config for future nginx + api split
```

### How it fits together

**Production:** The Express backend serves the `web/` directory as static files and handles all `/api/*` routes in a single process on port 3000.

**Development:** Vite runs a dev server on port 5173 with hot reload and proxies all `/api/*` requests to the Express backend on port 3000. The two processes run concurrently via `npm run dev`.

### Database schema

| Table | Purpose |
|---|---|
| `users` | Teacher accounts (email + scrypt password hash) |
| `events` | Join-code test sessions with optional time window and duration |
| `event_questions` | Snapshot of questions assigned to an event (frozen at creation time) |
| `attempts` | A student's attempt at an event — tracks start/submit time and score |
| `answers` | Per-question answer record for each attempt |

The database is created automatically on first run and seeded with a default teacher account and demo event.

### Authentication

JWT-based. The backend issues a 7-day token on login. Protected routes require an `Authorization: Bearer <token>` header. The secret is set via the `JWT_SECRET` environment variable.

---

## Local development (no Docker)

**Requirements:** Node.js 20+

```bash
npm install       # installs all workspace deps (backend + web)
npm run dev       # starts both servers concurrently
```

| Service | URL |
|---|---|
| Student app | http://localhost:5173/ |
| Teacher portal | http://localhost:5173/admin.html |
| API | http://localhost:3000/api/ |

The backend auto-restarts on file changes (nodemon). The frontend has hot reload (Vite).

### Default credentials

| | |
|---|---|
| Teacher email | `teacher@ctquest.local` |
| Teacher password | `changeme123` |
| Demo join code | `DEMO123` |

These are seeded automatically into a fresh database. Change them before deploying.

---

## Deployment with Docker

**Requirements:** Docker with the Compose plugin.

### 1. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and set a strong `JWT_SECRET`. This is required — `docker compose` will refuse to start without it.

### 2. Build and start

```bash
docker compose up --build -d
```

- Student app: http://localhost:3000/
- Teacher portal: http://localhost:3000/admin.html

### 3. View logs

```bash
docker compose logs -f
```

### 4. Stop

```bash
docker compose down          # stops containers, preserves data volume
docker compose down -v       # stops containers AND deletes the database
```

### Data persistence

SQLite is stored in a named Docker volume (`db_data`) mounted at `/app/backend/data`. The database survives container restarts and image rebuilds. Only `docker compose down -v` removes it.

### Environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `JWT_SECRET` | Yes | — | Secret used to sign JWTs. Use a long random string in production. |
| `PORT` | No | `3000` | Port the server listens on inside the container. |

---

## Production without Docker

```bash
npm install
NODE_ENV=production JWT_SECRET=your-secret npm start
```

The backend serves `web/` as static files on port 3000.

---

## Future: migrating to PostgreSQL

The entire database layer is isolated in `backend/src/db.js`. When ready to migrate:

1. Replace `better-sqlite3` with a Postgres driver (`pg` or `postgres`)
2. Rewrite `db.js` queries using parameterised Postgres syntax (`$1, $2` instead of `?`)
3. Set `DATABASE_URL=postgres://user:password@host/dbname` in the environment
4. Add a `db` service to `docker-compose.yml`:

```yaml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: ctquest
      POSTGRES_USER: ctquest
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pg_data:/var/lib/postgresql/data

  api:
    build: .
    environment:
      DATABASE_URL: postgres://ctquest:${DB_PASSWORD}@db/ctquest
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      db:
        condition: service_healthy

volumes:
  pg_data:
```

5. Add an nginx service in front to serve `web/` static files and proxy `/api/*` to the api container — the `nginx.conf` in this repo is a starting point.

Once the API container is stateless (no SQLite file), it can be scaled horizontally with `replicas`.
