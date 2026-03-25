# CT Quest

- `web/` — student quiz and teacher portal (static HTML/JS/CSS)
- `backend/` — Express API + SQLite, serves the frontend in production

## Local development (no Docker)

Requires Node.js 20+.

```bash
npm install       # installs backend + web deps via workspaces
npm run dev       # starts backend (nodemon :3000) + Vite dev server (:5173) concurrently
```

- Student app: http://localhost:5173/
- Teacher portal: http://localhost:5173/admin.html

Vite proxies all `/api/*` requests to the backend on port 3000. The backend does not serve the frontend in dev mode.

## Running with Docker

```bash
cp .env.example .env
# Set JWT_SECRET in .env

docker compose up --build
```

- Student app: http://localhost:3000/
- Teacher portal: http://localhost:3000/admin.html

SQLite data is persisted in a named Docker volume (`db_data`).

## Production without Docker

```bash
npm install
npm start         # starts backend only; it serves web/ as static files
```

## Seeded teacher login

- Email: `teacher@ctquest.local`
- Password: `changeme123`

## Seeded demo join code

- Join code: `DEMO123`

## Future: migrating to PostgreSQL

The database layer is in `backend/src/db.js`. When ready to switch:

1. Replace `better-sqlite3` with a Postgres driver (e.g. `postgres` or `pg`)
2. Set `DATABASE_URL` in the environment
3. Add a `db` service to `docker-compose.yml`
4. Update `docker-compose.yml` to split nginx + api + db (see architecture notes in repo)
