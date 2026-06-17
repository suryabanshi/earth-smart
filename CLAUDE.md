# CLAUDE.md

Guidance for AI assistants (and humans) working in the **Earth Smart** repository.

Earth Smart is an early-stage MVP for an "all-in-one" platform (social feed, news,
learning, tools). It is a monorepo with a Next.js frontend and an Express/PostgreSQL
backend. The codebase is a scaffold: many endpoints return mock data and several
documented workflows are aspirational. Read the "Reality check / gotchas" section
before trusting the README or `docs/`.

## Repository layout

```
earth-smart/
├── package.json        # Root workspace; orchestrates frontend + backend via npm scripts
├── frontend/           # Next.js 14 (Pages Router) + TypeScript + Tailwind
│   ├── pages/          # Routes: index, feed, news, learn, tools, auth/{login,register}
│   ├── styles/         # globals.css (Tailwind + custom .btn/.card/.container classes)
│   ├── tailwind.config.js  # Custom `earth` green color palette
│   └── next.config.js
├── backend/            # Express API
│   ├── server.js       # App entry: mounts routes, Socket.io, /health
│   ├── routes/         # auth, posts, users, news, courses
│   ├── controllers/    # authController, postController (route handler logic)
│   ├── middleware/     # auth.js (JWT bearer-token verification)
│   ├── config/db.js    # pg Pool, reads DATABASE_URL
│   ├── Dockerfile, Procfile, .ebextensions/   # AWS Elastic Beanstalk deploy
├── database/
│   ├── schema.sql      # Full table definitions (source of truth for the data model)
│   └── seed.sql        # Sample data
├── docs/               # ARCHITECTURE, API_SPEC, ROADMAP, SETUP_GUIDE, CONTRIBUTING
└── .github/workflows/deploy.yml   # Backend → Elastic Beanstalk; frontend → Amplify
```

## Tech stack (as actually used in code)

- **Frontend:** Next.js 14 **Pages Router** (not App Router), TypeScript (strict),
  Tailwind CSS. Data fetching is the native `fetch` API against
  `process.env.NEXT_PUBLIC_API_URL`; state is local React hooks (`useState`/`useEffect`).
  `zustand`, `axios`, `socket.io-client`, and `react-hook-form` are listed as
  dependencies but are **not yet imported anywhere** — prefer the patterns already
  in `pages/` over adding new libraries.
- **Backend:** Node.js + Express 4, raw `pg` (parameterized SQL queries, no ORM),
  `bcryptjs` for password hashing, `jsonwebtoken` for auth, `helmet` + `cors`,
  `socket.io` (server is wired up but only logs connect/disconnect).
- **Database:** PostgreSQL, schema in `database/schema.sql`.

## Common commands

Run from the repo root unless noted. The root `package.json` uses npm workspaces
(`frontend`, `backend`).

```bash
npm run install:all     # Install root + frontend + backend deps
npm run dev             # Run frontend (:3000) and backend (:5000) together
npm run dev:frontend    # Next.js dev server only
npm run dev:backend     # nodemon server.js only
npm run build           # Build frontend then backend
npm run lint            # See gotcha #4 — backend has no lint script (will fail)
npm run test            # See gotcha #3 — no tests exist yet
```

Backend-local (`cd backend`): `npm start` (node), `npm run dev` (nodemon).
Frontend-local (`cd frontend`): `npm run dev`, `npm run build`, `npm run lint`.

### Database setup (the working path)

```bash
createdb earth_smart
psql -U postgres -d earth_smart -f database/schema.sql
psql -U postgres -d earth_smart -f database/seed.sql
```

Use this, **not** `npm run db:migrate` / `npm run db:seed` (see gotcha #1).

## Architecture & conventions

- **API shape:** REST under `/api/*`. Routes are thin and delegate to controllers
  (`routes/auth.js` → `controllers/authController.js`). `posts`, `news`, and
  `courses` keep logic inline in the route file or controller. When adding an
  endpoint, follow the existing route → controller split for auth/posts; smaller
  resources keep handlers in the route file.
- **Auth:** JWT in the `Authorization: Bearer <token>` header. `middleware/auth.js`
  verifies it and sets `req.userId` (and `req.user`). Protect a route by inserting
  `authMiddleware` before the handler (see `routes/posts.js`). Tokens are signed in
  `authController.generateToken`.
- **Database access:** Import the shared pool from `config/db.js` and call
  `pool.query('... $1 ...', [param])`. Always use parameterized queries — never
  string-interpolate user input.
- **Code style:** Backend JS uses **no semicolons** and `require`/CommonJS.
  Frontend uses ES modules, TypeScript, and 2-space indentation. Match the
  surrounding file.
- **Tailwind:** Use the custom `earth-*` green palette and the component classes
  defined in `styles/globals.css` (`.container`, `.card`, `.btn`, `.btn-primary`,
  `.btn-secondary`) rather than re-deriving them inline.
- **Env vars:** Copy `.env.example` to `.env.local` and edit. Key vars:
  `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRE`, `BCRYPT_ROUNDS`, `PORT`,
  `NEXT_PUBLIC_API_URL`. The backend falls back to insecure defaults (e.g.
  `'secret-key'`) when these are unset — fine for local dev, never for production.

## Data model (from `database/schema.sql`)

Tables: `users`, `posts`, `post_likes`, `follows`, `courses`,
`course_enrollments`, `news`, `tools`, `comments`. Relationships use
`REFERENCES ... ON DELETE CASCADE` and unique constraints on join tables
(e.g. `post_likes(post_id, user_id)`, `follows(follower_id, following_id)`).
Note `posts.likes_count` / `comments_count` are denormalized columns that the
current code does **not** keep updated.

## Reality check / gotchas

Treat these as the highest-value context — they are where the docs and `package.json`
diverge from what actually runs.

1. **`db:migrate` / `db:seed` scripts do not exist.** Root and backend scripts call
   `backend/scripts/migrate.js` and `seed.js`, but there is no `backend/scripts/`
   directory. These commands fail. Apply `database/schema.sql` / `seed.sql` with
   `psql` instead (see above). `docs/SETUP_GUIDE.md` also references a
   `database/migrations/` directory that does not exist.
2. **`schema.sql` starts with `CREATE DATABASE IF NOT EXISTS earth_smart;`** which is
   not valid PostgreSQL syntax (and can't run inside the target DB). Create the
   database separately (`createdb earth_smart`) before running the file, or expect
   that first line to error.
3. **No tests exist.** Both packages declare a `jest` test script, but there are no
   test files. `npm run test` will report no tests / fail. Add a test runner config
   before relying on it.
4. **`npm run lint` fails at the backend.** The root lint script runs frontend then
   backend lint, but `backend/package.json` has no `lint` script. Only
   `npm --prefix frontend run lint` works today.
5. **News and courses endpoints return hardcoded mock data**, not database rows,
   even though `news` and `courses` tables exist. `GET /api/news` and
   `GET /api/courses` ignore Postgres entirely; `POST /api/courses/:id/enroll`
   returns a static success without writing anything.
6. **README tech claims are partly inaccurate.** It lists Redux Toolkit and Redis;
   the code uses Zustand-as-dependency-only (actually plain React state) and has no
   Redis client. Trust the code and this file over the README marketing copy.
7. **No `frontend/public` or `frontend/components` directories exist** yet, though
   `frontend/Dockerfile` copies `./public` and `tailwind.config.js` globs
   `./components/**`. Create them as needed; the Docker build's `COPY ... ./public`
   will fail until `public/` exists.
8. **Socket.io is scaffolding only.** The server accepts connections and logs them
   but emits no real-time events; the frontend has no socket client wired up.

## Deployment

- **Backend → AWS Elastic Beanstalk** (Node 18, single instance, nginx proxy) via
  `.github/workflows/deploy.yml` on push to `main`. Config in
  `backend/.ebextensions/` and `backend/Procfile`. Requires
  `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` repo secrets; region `us-east-1`;
  app `earth-smart-backend`, env `earth-smart-backend-prod`.
- **Frontend → AWS Amplify**, auto-deploys on push to `main` using
  `frontend/amplify.yml` (build artifact: `.next`).
- Dockerfiles exist for both services for container-based/local deploys.

## Working in this repo

- The default branch is `main`. Do not commit secrets; `.env*` files are gitignored.
- After changing the data model, update `database/schema.sql` (and `seed.sql` if
  relevant) — there is no migration framework to fall back on.
- Keep `docs/API_SPEC.md` in mind as the intended contract, but verify against the
  actual route/controller code, which is the source of truth.
- When you fix one of the gotchas above (e.g. add real migrate scripts or tests),
  update this file so it stays accurate.
