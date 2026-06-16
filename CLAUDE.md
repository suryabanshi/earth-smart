# CLAUDE.md

Guidance for AI assistants (Claude Code) working in this repository.

## Project Overview

Earth Smart is an early-stage MVP scaffold for an all-in-one platform combining a social
feed, learning courses, news aggregation, and a tools marketplace. Created by Suman
Suryabanshi. The codebase is intentionally minimal — most of what `docs/ARCHITECTURE.md`
and `docs/ROADMAP.md` describe is **target-state**, not current code. When a doc and the
actual code disagree, the code wins.

## Repository Structure

```
earth-smart/
├── frontend/             Next.js 14 (Pages Router) + TypeScript + Tailwind CSS
│   ├── pages/             index, feed, learn, news, tools, auth/login, auth/register, _app
│   └── styles/            globals.css (Tailwind + shared utility classes)
├── backend/              Express.js API (plain JavaScript, CommonJS)
│   ├── server.js          Entry point — mounts routes, sets up Socket.io + Helmet/CORS
│   ├── routes/             auth.js, posts.js, users.js, news.js, courses.js
│   ├── controllers/        authController.js, postController.js
│   ├── middleware/auth.js  JWT verification middleware
│   └── config/db.js        pg Pool (PostgreSQL connection)
├── database/
│   ├── schema.sql          Source of truth for the data model
│   └── seed.sql            Sample data (matches schema)
├── docs/                 ARCHITECTURE.md, API_SPEC.md, CONTRIBUTING.md, ROADMAP.md, SETUP_GUIDE.md
└── .github/workflows/    deploy.yml (AWS deploy on push to main)
```

npm workspaces (`frontend`, `backend`) are wired together via the root `package.json`.

## Development Workflow

Run from the repo root:
- `npm run install:all` — installs root, frontend, and backend dependencies
- `npm run dev` — runs `dev:frontend` and `dev:backend` together (frontend on `:3000`, backend on `:5000`)
- `npm run dev:frontend` / `npm run dev:backend` — run one side only
- `npm run build` / `npm run build:frontend` / `npm run build:backend`
- `npm run test` — runs the frontend then backend jest suites
- `npm run lint` — lints both workspaces

Environment variables: each workspace reads env files from its **own** directory — a root `.env.local` is not picked up by either app.
- `backend/server.js` calls `dotenv.config()` with no path, so it loads `backend/.env` (cwd when run via `npm --prefix backend`).
- Next.js loads `frontend/.env.local` (or `frontend/.env`) from its own directory.

Copy the relevant sections of `.env.example` to the right place:
```bash
cp .env.example backend/.env      # edit: DATABASE_URL, JWT_SECRET, JWT_EXPIRE, BCRYPT_ROUNDS, PORT
cp .env.example frontend/.env.local  # edit: NEXT_PUBLIC_API_URL
```
Key vars:
- Backend (`backend/.env`): `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRE` (default `7d`), `BCRYPT_ROUNDS` (default `10`), `PORT` (default `5000`)
- Frontend (`frontend/.env.local`): `NEXT_PUBLIC_API_URL` (also defaulted in `next.config.js`)

### Database

There is **no migration tooling yet** — `npm run db:migrate` / `db:seed` call
`backend/scripts/migrate.js` / `seed.js`, which do not exist. To stand up a local DB,
apply the SQL files directly:

```bash
psql -U postgres -d earth_smart -f database/schema.sql
psql -U postgres -d earth_smart -f database/seed.sql
```

Tables: `users`, `posts`, `post_likes`, `follows`, `courses`, `course_enrollments`,
`news`, `tools`, `comments`.

## Backend Conventions (`backend/`)

- CommonJS (`require`/`module.exports`), Express 4, plain JS — no TypeScript.
- Pattern: `routes/*.js` map HTTP verb+path to a handler in `controllers/*.js`; controllers
  query Postgres directly through the shared `pool` (`backend/config/db.js`) using
  parameterized queries (`$1, $2, ...`). Simpler routes (`news.js`, `courses.js`) currently
  inline mock data and queries directly in the route file rather than using a controller —
  match the pattern already used in the file you're editing rather than introducing a new
  layer.
- Auth: `middleware/auth.js` reads `Authorization: Bearer <token>`, verifies the JWT, and
  sets `req.userId` / `req.user`. Protect routes with
  `router.post('/path', authMiddleware, controller.fn)`.
- Error handling: every handler wraps its body in try/catch, logs with
  `console.error('<Action> error:', err)`, and responds with a generic
  `{ message: '...' }` JSON payload and an appropriate status code (400/401/404/500). Don't
  leak internal error details to clients.
- Style: no semicolons, single quotes, 2-space indentation, `const` + arrow functions.
- `server.js` is the single entry point — new route modules must be `require`d and mounted
  under `/api/<resource>` there. Socket.io is initialized but currently only logs
  connect/disconnect; no events are emitted yet.

## Frontend Conventions (`frontend/`)

- Next.js 14 **Pages Router** (`pages/`) — new pages go in `pages/`, not `app/`.
- TypeScript with `strict: true`. The `@/*` path alias (→ repo root) is configured in
  `tsconfig.json` but not used by any page yet.
- Auth state: the JWT is stored in `localStorage` under `token`. Pages guard themselves
  with a `useEffect` that redirects to `/auth/login` if no token is present (see
  `pages/feed.tsx`, `pages/learn.tsx`, `pages/news.tsx`, `pages/tools.tsx`). There's no
  shared auth context/hook — follow this per-page pattern unless asked to refactor.
- API calls use the browser `fetch` directly against
  `${process.env.NEXT_PUBLIC_API_URL}/api/...` with a manual
  `Authorization: Bearer <token>` header. There's no shared API client (`frontend/lib`
  doesn't exist yet).
- Styling: Tailwind utility classes plus shared component classes defined in
  `styles/globals.css` (`.container`, `.card`, `.btn`, `.btn-primary`, `.btn-secondary`).
  Reuse these instead of redefining button/card styles inline.
- Brand color is the `earth` palette in `tailwind.config.js`. Only `50/500/600/700` are
  currently defined, but `pages/learn.tsx` references `earth-100` (undefined) — if you need
  another shade, add it to the config rather than reaching for an arbitrary Tailwind color.
- `frontend/components/` does not exist yet — every page is a single self-contained file.
  If you extract shared UI, create that directory.

## Known Gaps (don't assume these exist)

- No test files anywhere, despite `jest` being declared as the `test` script in both
  `frontend/package.json` and `backend/package.json`, and no Jest config present.
- No `postcss.config.js` in `frontend/` — required for Tailwind directives in
  `globals.css` to be processed by Next.js; add it if working on frontend styling/build
  issues.
- No `backend/scripts/`, `backend/models/`, `backend/utils/`, `frontend/lib/`,
  `frontend/utils/` — all referenced by docs/scripts but not present.
- No ESLint/Prettier config files, despite `lint` scripts existing.

## Deployment

- **Backend**: `.github/workflows/deploy.yml` deploys to AWS Elastic Beanstalk on push to
  `main` (zips `backend/`, uses `einaregilsson/beanstalk-deploy`). `.ebextensions/`
  configures the Node command/env; there's also a Heroku-style `Procfile` and a standalone
  `Dockerfile`.
- **Frontend**: AWS Amplify auto-deploys on push to `main` (`frontend/amplify.yml`); also
  has its own multi-stage `Dockerfile`.
- Both Dockerfiles assume a build context rooted at that package's own directory
  (`backend/` or `frontend/`), not the repo root.

## Documentation Map

- `docs/ARCHITECTURE.md` — target system design, including a project structure more
  elaborate than what exists today.
- `docs/API_SPEC.md` — REST API reference; some documented behavior (pagination headers,
  course/news filters, WebSocket events) isn't implemented in `backend/routes/*` yet.
- `docs/ROADMAP.md` — long-term phased feature roadmap (Phase 1 MVP is the current focus).
- `docs/CONTRIBUTING.md` — Conventional Commits (`feat:`, `fix:`, `docs:`, ...) and PR title
  format `[Type] Brief description`.
- `docs/SETUP_GUIDE.md` — detailed local/production setup steps.

## General Guidance

Keep changes consistent with the existing minimal style — no semicolons in backend JS,
direct SQL in controllers (no ORM), no shared frontend API/auth layer — unless the user
explicitly asks for a refactor or new abstraction.
