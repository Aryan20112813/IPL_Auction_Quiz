# Deployment Guide — Quiz for IPL Auction

## Table of Contents
1. [Hosting options](#1-hosting-options)
2. [Pre-deployment checklist](#2-pre-deployment-checklist)
3. [Environment variables](#3-environment-variables)
4. [Database setup](#4-database-setup)
5. [First deploy](#5-first-deploy)
6. [Event-day checklist](#6-event-day-checklist)
7. [Post-event cleanup](#7-post-event-cleanup)
8. [Rollback procedure](#8-rollback-procedure)

---

## 1. Hosting Options

| Platform | Notes |
|---|---|
| **Vercel** (recommended) | Zero-config Next.js; free hobby tier handles small events; use Vercel Postgres or Supabase |
| **Railway** | Auto-deploys from GitHub; includes Postgres add-on |
| **Render** | Free tier with sleep; upgrade to paid for events |
| **Self-hosted VPS** | Full control; run `npm run build && npm run start` behind nginx |

The app is a standard Next.js monolith — any platform that can run `node` will work.

---

## 2. Pre-deployment Checklist

- [ ] `TOKEN_PEPPER` is a cryptographically random string of ≥ 32 characters
- [ ] `DATABASE_URL` points to a **production** database, not the dev one
- [ ] `APP_URL` is set to the public HTTPS URL (used in QR codes)
- [ ] SSL/TLS is enforced end-to-end
- [ ] The `questions` table is seeded (see §4)
- [ ] `npm run questions:validate` passes (100 questions, 4 options, 1 answer each)
- [ ] `npm run build` succeeds with no type errors
- [ ] Health check endpoint `GET /api/v1/health` returns `{ "ok": true }`

---

## 3. Environment Variables

Create a `.env.production` (or set vars in your hosting dashboard):

```env
# Required
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DBNAME?sslmode=require
TOKEN_PEPPER=replace-with-64-random-chars-from-openssl-rand-base64-48
APP_URL=https://quiz.yourdomain.com

# Optional (defaults shown)
MAX_PARTICIPANTS=300
QUIZ_DURATION_SECONDS=7200
QUESTION_COUNT=25
LOG_LEVEL=info
```

> ⚠️ **Never commit `.env.production`** — add it to `.gitignore`.

---

## 4. Database Setup

### 4.1 Apply schema

```bash
# For first deploy (creates all tables)
npx prisma db push

# For subsequent deploys with schema changes
npx prisma migrate deploy
```

### 4.2 Seed questions

```bash
# Parse the Markdown source (already committed as questions.json)
npm run questions:parse

# Upsert into database
tsx prisma/seed.ts
```

### 4.3 Verify

```bash
# Should print: 100 questions verified.
npm run questions:validate
```

---

## 5. First Deploy

### Vercel

```bash
npm install -g vercel
vercel login
vercel --prod
# Set env vars in Vercel dashboard → Settings → Environment Variables
```

### Railway

1. Create a new project → Deploy from GitHub
2. Add a PostgreSQL service → copy `DATABASE_URL`
3. Set all env vars in Railway dashboard
4. Railway auto-runs `npm run build && npm run start`

### VPS (nginx + pm2)

```bash
# On the server
git clone <repo> /var/www/quiz
cd /var/www/quiz
npm install --omit=dev
cp .env.example .env.production  # fill in values
npm run build
pm2 start npm --name quiz -- start
pm2 save && pm2 startup

# nginx site config (put behind SSL with Certbot)
# proxy_pass http://localhost:3000;
```

---

## 6. Event-Day Checklist

Run through this **1 hour before** the event:

- [ ] `GET /api/v1/health` → `{ "ok": true }`
- [ ] Database has 100 questions: run `npm run questions:validate`
- [ ] Open the host page in an incognito window → create a test quiz
- [ ] Join the test quiz from a phone → confirm QR code works
- [ ] Start the test quiz → verify questions appear on phone
- [ ] Submit answers → verify leaderboard appears
- [ ] Delete the test quiz or note the code (it will expire)
- [ ] Share the `APP_URL` with the event MC
- [ ] Test on the actual event Wi-Fi (not your laptop hotspot)
- [ ] Have the host URL bookmarked: `{APP_URL}/host/new`

**During the event:**
- Host creates quiz → reads out room code + shows QR
- Participants join from phones
- Host clicks **Start Quiz** when everyone is in
- Monitor the host dashboard for participant count
- After 2 hours (or all submitted) → click **End Quiz**
- The final leaderboard is immediately visible

---

## 7. Post-Event Cleanup

Run the cleanup script to purge old quizzes and free up DB space:

```bash
# Dry run first to see what would be deleted
tsx scripts/cleanup-old-quizzes.ts --days 7 --dry-run

# Actually delete
tsx scripts/cleanup-old-quizzes.ts --days 7
```

Or set up a daily cron (e.g. on Railway or via Vercel Cron):

```
0 3 * * *  tsx /var/www/quiz/scripts/cleanup-old-quizzes.ts --days 30
```

---

## 8. Rollback Procedure

1. In Vercel: go to Deployments → select previous deployment → **Promote to Production**
2. In Railway: Deployments → roll back
3. On VPS:
   ```bash
   cd /var/www/quiz
   git log --oneline -10  # find previous commit
   git checkout <commit-sha>
   npm install && npm run build
   pm2 restart quiz
   ```

> If the schema changed, restore a DB backup before rolling back the code.

---

## Contacts & Support

For issues during an event, check:
- App logs in your hosting dashboard
- `GET /api/v1/health` — if this fails, the DB connection is down
- Run `docker compose logs postgres` for local DB issues
