# RepoLens: GitHub Repository Analytics Dashboard

Full-stack app to search public GitHub repositories, view details, and save favourites.

- **Frontend:** React (Vite) + Tailwind CSS + React Router
- **Backend:** Node.js + Express
- **Database:** MongoDB (Mongoose)
- **API:** GitHub REST API (all calls go through the backend)

```
Browser (React)  ->  Express API  ->  GitHub REST API
                          |
                       MongoDB (favourites)
```

## Setup

Requirements: Node 18+, a MongoDB instance (local or [Atlas](https://www.mongodb.com/atlas)).

### 1. Backend
```bash
cd server
npm install
cp .env.example .env     # then edit .env
npm run dev              # http://localhost:5000
```
`.env` values:

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string |
| `GITHUB_TOKEN` | Optional personal access token (no scopes needed). Raises the limit from 60 to 5,000 requests/hour |
| `CLIENT_ORIGIN` | Frontend URL allowed by CORS |
| `PORT` | API port (default 5000) |

### 2. Frontend
```bash
cd client
npm install
npm run dev              # http://localhost:5173
```
In development Vite proxies `/api` to `localhost:5000`, so no extra config is needed.
For production, set `VITE_API_URL` to the deployed API URL (see `client/.env.example`).

## API

| Method | Route | Description |
| --- | --- | --- |
| GET | `/api/repos/search?q=&sort=stars\|updated&page=` | Search repos (10 per page, cached 5 min) |
| GET | `/api/repos/:owner/:repo` | Details, latest 5 commits, top 5 contributors, open issues |
| GET | `/api/favorites` | List saved repos |
| POST | `/api/favorites` | Save a repo (409 if already saved) |
| DELETE | `/api/favorites/:githubId` | Remove a saved repo |

Errors always look like `{ "error": { "status": 429, "message": "...", "retryAfter": 42 } }`.

## How the mandatory challenges are handled

| Challenge | Solution |
| --- | --- |
| GitHub error or downtime | `github.js` maps failures to 502 with a clear message; the UI shows a banner with a retry button |
| Invalid or deleted repository | GitHub 404 becomes a 404; the UI shows a "Repository not found" state. Names are validated by regex first |
| Empty search results | UI shows a dedicated empty state; blank queries are rejected with 400 |
| Duplicate saves | Unique index on `githubId`; duplicate key error (11000) becomes a 409, and the UI shows a notice |
| Rate limits | Detected via `X-RateLimit-Remaining` / `Retry-After`, returned as 429 with `retryAfter`; the UI shows a countdown and never crashes |
| 5-minute search cache | In-memory TTL cache keyed by query + sort + page (`server/src/utils/cache.js`) |
| Secrets | `GITHUB_TOKEN` and `MONGODB_URI` only live in `.env` (git-ignored) |

Also: commits and contributors load with `Promise.allSettled`, so if one fails the rest of the details page still renders with a warning.

## Notes and trade-offs
- The cache is in memory, so it resets on restart and is not shared across multiple server instances. Redis would be the next step.
- GitHub only serves the first 1,000 search results, so pagination stops at page 100.
- Favourites are shared by everyone using the app (no login), as the assignment does not require authentication.
