# CT Quest

- `web/` — student quiz and teacher portal UI (static files)
- `backend/` — Express server that serves the frontend, handles teacher login, creates join-code events, and stores student results in SQLite

The backend serves the frontend directly — there is only one process to run.

## Local setup

1. Install Node.js 20 or newer.
2. Install dependencies:

```bash
npm install
```

3. Start the app:

```bash
npm start
```

4. Open:

- Student app: `http://localhost:3000/`
- Teacher portal: `http://localhost:3000/admin.html`

## Seeded teacher login

- Email: `teacher@ctquest.local`
- Password: `changeme123`

## Seeded demo join code

- Join code: `DEMO123`

The SQLite database is created automatically at `backend/data/app.db`.
