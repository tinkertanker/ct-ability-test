# CT Quest

This project now runs as a single Node.js app:

- `web/` contains the student quiz and teacher portal UI
- `backend/` serves the frontend, handles teacher login, creates join-code events, and stores student results in SQLite

## Local setup

1. Install Node.js 20 or newer.
2. From the repo root, install backend dependencies:

```bash
cd backend
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
