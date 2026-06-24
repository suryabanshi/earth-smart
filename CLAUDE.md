# CLAUDE.md

Guidance for AI assistants (Claude Code) working in this repository.

## What this is

Earth Smart is an early-stage MVP scaffold for an all-in-one platform (social feed,
news, learning courses, tools marketplace). It's a small npm-workspaces monorepo:
a Next.js frontend and an Express/PostgreSQL backend, currently at the
"hardcoded demo data + basic auth" stage — most features are stubs, not
production logic. Treat this as a young codebase: there's no test suite, no
lint config, and several `package.json` scripts reference files that don't
exist yet (see Gotchas below).

## Repo layout

```
earth-smart/
├── frontend/           # Next.js 14 (Pages Router) + TypeScript + Tailwind
│   ├── pages/          # Route = file path (pages/feed.tsx -> /feed)
│   │   └── auth/       # login.tsx, register.tsx
│   └── styles/globals.css
├── backend/            # Express API, plain JS (no TypeScript)
│   ├── server.js       # Entry point: middleware, route mounting, Socket.io, listen
│   ├── routes/         # express.Router() per resource, mounted under /api/<resource>
│   ├── controllers/    # Route handlers for auth and posts only
│   ├── middleware/auth.js  # JWT verification, sets req.userId / req.user
│   └── config/db.js    # pg Pool, exported directly (no model layer)
├── database/
│   ├── schema.sql       # Full schema — run manually with psql, no migration tool
│   └── seed.sql         # Sample users/posts/courses/news/tools
├── docs/                # ARCHITECTURE.md, API_SPEC.md, ROADMAP.md, CONTRIBUTING.md, SETUP_GUIDE.md
├── .github/workflows/deploy.yml  # AWS deploy on push to main
└── package.json         # Root workspace orchestrator (workspaces: frontend, backend)
```

There are no `components/`, `lib/`, `utils/`, or `public/` directories in
`frontend/`, and no `models/` or `utils/` in `backend/`, even though
`docs/ARCHITECTURE.md` describes them — that doc is aspirational, not current
state. Don't assume those paths exist; check before importing from them.

## Commands

Run from repo root unless noted.

```bash
npm run install:all     # installs root + frontend + backend deps
npm run dev             # runs frontend (3000) and backend (5000) concurrently
npm run dev:frontend    # frontend only
npm run dev:backend     # backend only (nodemon)
npm run build           # builds both
npm run test            # runs `npm test` in frontend and backend
npm run lint            # runs `npm run lint` in frontend and backend
```

Database (manual, no migration framework — see Gotchas):
```bash
psql -U postgres -d earth_smart -f database/schema.sql
psql -U postgres -d earth_smart -f database/seed.sql
```

## Conventions actually used in this code

- **Backend is plain JS** (CommonJS `require`/`module.exports`), no semicolons,
  single quotes. **Frontend is TypeScript** with the same no-semicolon style.
- **Route → Controller pattern** for `auth` and `posts` only. `users`, `news`,
  and `courses` routes inline their logic directly in `routes/*.js` instead of
  using a controller — follow whichever pattern the file you're editing
  already uses rather than introducing a third style.
- **No ORM.** All DB access is raw SQL via the `pg` Pool exported from
  `backend/config/db.js`, always with parameterized queries (`$1, $2, ...`).
  Never string-interpolate values into SQL.
- **Error handling**: every controller/route wraps logic in `try/catch`,
  logs with `console.error`, and returns `res.status(xxx).json({ message: '...' })`.
  Match this shape for new endpoints.
- **Auth**: `backend/middleware/auth.js` reads `Authorization: Bearer <token>`,
  verifies with `jsonwebtoken`, and sets `req.userId` + `req.user`. Apply it as
  router-level middleware (`router.post('/', authMiddleware, controller.fn)`),
  not inside the handler body.
- **Frontend pages** are self-contained: state, data fetching, and JSX all live
  in the page file under `frontend/pages/`. There's no shared API client —
  each page calls `fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/...`)`
  directly and reads the JWT from `localStorage.getItem('token')`.
- **Styling** is Tailwind utility classes plus a few `@apply`-based component
  classes defined in `frontend/styles/globals.css` (`.card`, `.btn-primary`,
  `.btn-secondary`, `.container`). Reuse those classes instead of redefining
  similar styles inline.

## Gotchas / known gaps (verified against the actual filesystem)

- `backend/package.json` has `db:migrate` → `node scripts/migrate.js` and
  `db:seed` → `node scripts/seed.js`, but **no `backend/scripts/` directory
  exists**. Use the raw `psql -f database/schema.sql` / `seed.sql` commands
  above instead.
- `npm test` / `npm run lint` are wired up in both `frontend/package.json` and
  `backend/package.json` (jest, `next lint`), but **no test files, jest
  config, or ESLint config exist in the repo**. Don't assume CI-style checks
  will catch anything yet — verify changes manually.
- `routes/news.js` and `routes/courses.js` return **hardcoded mock arrays**
  despite importing the `pool` DB client (and despite `news`/`courses` tables
  existing in `schema.sql`). The frontend pages `learn.tsx`, `news.tsx`, and
  `tools.tsx` *also* hardcode their own separate copies of this same data
  instead of calling the API. If you wire these up to the real DB/API, update
  both sides and remove the duplicate hardcoded arrays.
- `feed.tsx` is the only frontend page that actually calls the backend API
  for its data; the rest are static placeholders gated by a client-side
  `localStorage` token check (not real route protection).
- JWT secret and DB credentials have insecure inline fallbacks (e.g.
  `process.env.JWT_SECRET || 'secret-key'` in both `authController.js` and
  `middleware/auth.js`). These are fine for local dev but must never ship in
  production — always require `JWT_SECRET` to be set rather than relying on
  the fallback when touching auth code.
- Frontend stores the JWT in `localStorage` (not an httpOnly cookie) — keep
  this in mind if asked to harden auth; it's an XSS-exposed token by design
  of the current scaffold, not an oversight to silently "fix" without raising it.
- `backend/Procfile` (Heroku-style) coexists with AWS Elastic
  Beanstalk config (`.ebextensions/`) and the GitHub Actions deploy workflow.
  The actual deploy target is AWS (EB for backend, Amplify for frontend, per
  `.github/workflows/deploy.yml`) — the Procfile appears unused by current CI.

## Database

- Single source of truth: `database/schema.sql` (run manually, no migration
  history/versioning tool in place — if you add tables, also add them here).
- Tables: `users`, `posts`, `post_likes`, `follows`, `courses`,
  `course_enrollments`, `news`, `tools`, `comments`.
- Foreign keys use `ON DELETE CASCADE` for child rows; `courses.instructor_id`
  uses `ON DELETE SET NULL`.
- `comments` and `tools` tables exist in the schema but have **no
  corresponding routes/controllers** — they're not yet exposed via the API.

## API shape

- All routes are mounted under `/api/<resource>` in `backend/server.js`
  (`/api/auth`, `/api/posts`, `/api/users`, `/api/news`, `/api/courses`).
  `GET /health` is unauthenticated and returns `{ status, timestamp }`.
  See `docs/API_SPEC.md` for the documented request/response shapes (kept
  reasonably in sync with the auth/posts/users endpoints; news/courses
  responses in the doc describe the intended DB-backed shape, not the current
  mock data).
- Errors are always `{ message: string }` with a 4xx/5xx status — match this
  when adding endpoints rather than inventing a new error envelope.

## Environment variables

See `.env.example` for the full list. The essentials for local dev:
`DATABASE_URL`, `PORT` (backend, default 5000), `JWT_SECRET`,
`NEXT_PUBLIC_API_URL` (frontend, default `http://localhost:5000`). Most others
(Redis, SMTP, AWS, OAuth) are optional/future and unused by current code.

## Docs

`docs/` contains forward-looking product/architecture docs
(`ARCHITECTURE.md`, `ROADMAP.md`) that describe where the project is headed,
not always where it is. `docs/API_SPEC.md` and `docs/SETUP_GUIDE.md` are
closer to ground truth for day-to-day work. When in doubt, trust the code
over the docs, and update this file if you notice it's drifted from reality.
