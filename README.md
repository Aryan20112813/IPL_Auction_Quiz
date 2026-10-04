# Quiz for IPL Auction

A fast, **mobile-first multiplayer quiz** built for IPL Auction events. Supports up to **300 simultaneous participants** with server-authoritative scoring and a live leaderboard.

---

## ✨ Features

| Feature | Details |
|---|---|
| **Server-authoritative scoring** | Answer key never leaves the server |
| **Adaptive polling** | 8 s in lobby, 30 s during quiz, 3× slower on hidden tab |
| **Offline answer queue** | Answers saved locally and retried on reconnect |
| **Live leaderboard** | Provisional during quiz, final on end |
| **QR join code** | One-tap join for participants |
| **Mobile-first** | Designed for 360 px phones; tested up to desktop |
| **Auto-submit on expiry** | Participants who don't submit are auto-graded |
| **Tie-breaking** | Score DESC → time-taken ASC |

---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18
- PostgreSQL 15+ (or use Docker below)
- `npm`

### 1. Clone & install

```bash
git clone <repo-url>
cd quiz-for-ipl-auction
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env — at minimum set DATABASE_URL and TOKEN_PEPPER
```

### 3. Start PostgreSQL (via Docker)

```bash
docker compose up -d
```

### 4. Apply the database schema

```bash
npx prisma db push
```

### 5. Seed questions into the database

```bash
npm run questions:parse   # parse Markdown → JSON
tsx prisma/seed.ts        # insert questions into DB
```

### 6. Run the dev server

```bash
npm run dev
# Open http://localhost:3000
```

---

## 🧑‍💻 Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run test` | Run unit tests (Vitest) |
| `npm run test:watch` | Vitest in watch mode |
| `npm run questions:parse` | Parse `data/questions/IPL_Quiz_Questions.md` → `questions.json` |
| `npm run questions:validate` | Validate 100 questions, 4 options, 1 answer |
| `npm run db:generate` | Re-generate Prisma client |
| `npm run db:push` | Push schema to DB (no migration file) |
| `npm run db:seed` | Seed questions from JSON into DB |
| `tsx scripts/cleanup-old-quizzes.ts --days 30` | Delete old ENDED/EXPIRED quizzes |
| `npx playwright test` | Run E2E tests |

---

## 📁 Project Structure

See [`docs/FILE_STRUCTURE.md`](docs/FILE_STRUCTURE.md) for a full annotated tree.

Key directories:

```
src/
  app/          # Next.js App Router (pages + API routes)
  components/   # Reusable React components
  hooks/        # Client-side hooks (polling, sync, session)
  lib/          # Shared client+server code (validation, types, config)
  server/       # Server-only code (DB, services, auth, ranking)
tests/
  unit/         # Vitest — pure logic, no DB required
  integration/  # Vitest + real Postgres
  e2e/          # Playwright
docs/
  PRD.md        # Product Requirements Document
  Workflow.md   # Technical + user workflow diagrams
  DEPLOYMENT.md # Hosting + event-day checklist
```

---

## 🌐 Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | ✅ | — | PostgreSQL connection string |
| `TOKEN_PEPPER` | ✅ | — | Random secret for token hashing (min 32 chars) |
| `APP_URL` | ✅ | — | Public URL of the app (e.g. `https://quiz.example.com`) |
| `MAX_PARTICIPANTS` | ❌ | `300` | Max participants per quiz |
| `QUIZ_DURATION_SECONDS` | ❌ | `7200` | Quiz duration (2 hours) |
| `QUESTION_COUNT` | ❌ | `25` | Questions per quiz |
| `LOG_LEVEL` | ❌ | `info` | `debug` / `info` / `warn` / `error` |

---

## 🧪 Testing

### Unit tests (no DB)
```bash
npm run test
```

### Integration tests (requires Postgres)
```bash
docker compose up -d
npx prisma db push && tsx prisma/seed.ts
DATABASE_URL=postgresql://quiz:quiz_dev_password@localhost:5432/quiz_db npm run test
```

### E2E tests (requires running app)
```bash
npm run dev &
npx playwright test
```

### Load test (requires k6 installed)
```bash
k6 run scripts/loadtest/quiz-flow.k6.js \
  -e BASE_URL=http://localhost:3000/api/v1 \
  -e QUIZ_CODE=XXXXXX
```

---

## 📋 Documentation

| Document | Purpose |
|---|---|
| [`docs/PRD.md`](docs/PRD.md) | Full product requirements & acceptance criteria |
| [`docs/Workflow.md`](docs/Workflow.md) | Host/participant flows, state machines, timer |
| [`docs/FILE_STRUCTURE.md`](docs/FILE_STRUCTURE.md) | Annotated directory tree |
| [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) | Step-by-step hosting + event-day checklist |

---

## ⚖️ Legal

This project uses generic cricket quiz content. It is **not affiliated with, endorsed by, or connected to the Board of Control for Cricket in India (BCCI), Indian Premier League (IPL), or any IPL franchise**. All team names mentioned are trademarks of their respective owners.
