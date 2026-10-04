# 🏏 IPL Auction Quiz — Deployment Guide

A step-by-step guide to deploy and host the **Quiz for IPL Auction** app from zero to a live URL.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Option A — Deploy to Vercel (Recommended)](#2-option-a--deploy-to-vercel-recommended)
3. [Option B — Deploy to Railway](#3-option-b--deploy-to-railway)
4. [Option C — Self-Host on a VPS (Ubuntu/Debian)](#4-option-c--self-host-on-a-vps-ubuntudebian)
5. [Database Setup](#5-database-setup)
6. [Environment Variables Reference](#6-environment-variables-reference)
7. [Post-Deploy Verification Checklist](#7-post-deploy-verification-checklist)
8. [Event-Day Operations Guide](#8-event-day-operations-guide)
9. [Updating the App](#9-updating-the-app)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Prerequisites

Before you begin, ensure you have:

| Tool | Version | Install |
|---|---|---|
| Node.js | ≥ 18 | [nodejs.org](https://nodejs.org) |
| npm | ≥ 9 | Bundled with Node.js |
| Git | Any recent | [git-scm.com](https://git-scm.com) |
| A GitHub account | — | [github.com](https://github.com) |

You'll also need one of:
- A **Vercel** account (free tier works) → [vercel.com](https://vercel.com)
- A **Railway** account → [railway.app](https://railway.app)
- A VPS with SSH access (Ubuntu 22.04 recommended)

---

## 2. Option A — Deploy to Vercel (Recommended)

Vercel is the easiest option for Next.js apps. The free Hobby plan handles small events well.

### Step 1: Push your code to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/IPL_Auction_Quiz.git
git push -u origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select your `IPL_Auction_Quiz` repo
4. Click **Deploy** — Vercel auto-detects Next.js

### Step 3: Set up a database

Vercel works best with a serverless-compatible Postgres database.

**Option: Vercel Postgres (easiest)**
1. In your Vercel dashboard → **Storage** → **Create Database** → **Postgres**
2. Click **Connect** to link it to your project
3. Vercel automatically injects `DATABASE_URL`

**Option: Supabase (free tier)**
1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Settings → Database → Connection string → URI**
3. Copy the URI (use the `Transaction pooler` URL for serverless)

> ⚠️ **Update the Prisma provider!** The default schema uses SQLite.  
> For production Postgres, switch `prisma/schema.prisma`:
> ```prisma
> datasource db {
>   provider = "postgresql"
>   url      = env("DATABASE_URL")
> }
> ```
> Then run `npx prisma generate`.

### Step 4: Set environment variables in Vercel

In your Vercel project → **Settings → Environment Variables**, add:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Your Postgres connection string |
| `TOKEN_PEPPER` | A 48-char random string (see below) |
| `APP_URL` | `https://your-app.vercel.app` |
| `MAX_PARTICIPANTS` | `300` |
| `QUIZ_DURATION_SECONDS` | `7200` |
| `QUESTION_COUNT` | `25` |

**Generate a secure TOKEN_PEPPER:**
```bash
node -e "console.log(require('crypto').randomBytes(36).toString('base64url'))"
```

### Step 5: Apply schema & seed data

After your first deploy, run these commands locally (with `DATABASE_URL` pointing to production):

```bash
# Apply schema to production database
DATABASE_URL="<your-prod-url>" npx prisma db push

# Parse questions from Markdown to JSON
npm run questions:parse

# Seed 100 questions into the database
DATABASE_URL="<your-prod-url>" tsx prisma/seed.ts
```

### Step 6: Trigger a redeployment

```bash
git commit --allow-empty -m "Trigger redeploy"
git push
```

Your app is now live at `https://your-app.vercel.app` 🎉

---

## 3. Option B — Deploy to Railway

Railway auto-deploys from GitHub and includes a built-in Postgres service.

### Step 1: Create a Railway project

1. Go to [railway.app/new](https://railway.app/new)
2. Choose **"Deploy from GitHub repo"** → select your repo
3. Railway detects Next.js and starts building

### Step 2: Add a PostgreSQL service

1. In your Railway project → **"+ New"** → **"Database"** → **"Add PostgreSQL"**
2. Go to the Postgres service → **Variables** tab → copy `DATABASE_URL`

### Step 3: Configure environment variables

In your Next.js service → **Variables** tab, add:

```
DATABASE_URL    = <paste from Postgres service>
TOKEN_PEPPER    = <48-char random string>
APP_URL         = https://<your-app>.railway.app
MAX_PARTICIPANTS = 300
QUIZ_DURATION_SECONDS = 7200
QUESTION_COUNT  = 25
```

> Update `schema.prisma` to use `provider = "postgresql"` before deploying.

### Step 4: Set up the database

In Railway → your service → **Settings → Deploy** → add a **pre-deploy command**:

```
npx prisma db push && tsx prisma/seed.ts
```

Or run manually from your local machine with the Railway DATABASE_URL.

### Step 5: Set start command

Railway uses `npm run start` by default. Ensure your `package.json` has:
```json
"build": "next build",
"start": "next start"
```

Railway automatically runs `npm run build` then `npm run start`.

---

## 4. Option C — Self-Host on a VPS (Ubuntu/Debian)

### Step 1: Provision a server

- **Minimum specs:** 1 vCPU, 1 GB RAM, 10 GB SSD
- **Recommended for 300+ participants:** 2 vCPU, 2 GB RAM
- Providers: DigitalOcean, Hetzner, Linode, AWS EC2

### Step 2: Initial server setup

```bash
# SSH into your server
ssh root@YOUR_SERVER_IP

# Update packages
apt update && apt upgrade -y

# Install Node.js 20 (via NodeSource)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install PM2 (process manager)
npm install -g pm2

# Install nginx
apt install -y nginx

# Install PostgreSQL
apt install -y postgresql postgresql-contrib
```

### Step 3: Set up PostgreSQL

```bash
# Create database and user
sudo -u postgres psql <<EOF
CREATE USER quiz WITH PASSWORD 'STRONG_PASSWORD_HERE';
CREATE DATABASE quiz_db OWNER quiz;
GRANT ALL PRIVILEGES ON DATABASE quiz_db TO quiz;
EOF
```

### Step 4: Clone and configure the app

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/IPL_Auction_Quiz.git /var/www/quiz
cd /var/www/quiz

# Install dependencies
npm install --omit=dev

# Create .env.production
cat > .env.production << EOF
DATABASE_URL=postgresql://quiz:STRONG_PASSWORD_HERE@localhost:5432/quiz_db
TOKEN_PEPPER=$(node -e "console.log(require('crypto').randomBytes(36).toString('base64url'))")
APP_URL=https://yourdomain.com
MAX_PARTICIPANTS=300
QUIZ_DURATION_SECONDS=7200
QUESTION_COUNT=25
NODE_ENV=production
EOF
```

> Update `schema.prisma` to use `provider = "postgresql"`.

### Step 5: Set up the database

```bash
# Generate Prisma client
npx prisma generate

# Push schema to PostgreSQL
npx prisma db push

# Parse and seed questions
npm run questions:parse
tsx prisma/seed.ts
```

### Step 6: Build and start with PM2

```bash
# Build the app
npm run build

# Start with PM2
pm2 start npm --name "ipl-quiz" -- start
pm2 save
pm2 startup  # Follow the printed command to auto-start on reboot
```

### Step 7: Configure nginx as a reverse proxy

```bash
cat > /etc/nginx/sites-available/quiz << 'EOF'
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

ln -s /etc/nginx/sites-available/quiz /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

### Step 8: Enable HTTPS with Let's Encrypt

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Certbot automatically renews certificates. Your app is now live at `https://yourdomain.com` 🎉

---

## 5. Database Setup

After setting up any deployment target, run these once:

```bash
# 1. Generate Prisma client
npx prisma generate

# 2. Create all tables
npx prisma db push

# 3. Parse questions from Markdown
npm run questions:parse

# 4. Validate 100 questions are correctly formatted
npm run questions:validate

# 5. Seed questions into the database
tsx prisma/seed.ts
```

**Verify seeding worked:**
```bash
# Should output: 100 questions verified.
npm run questions:validate
```

---

## 6. Environment Variables Reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | ✅ | — | Full DB connection string |
| `TOKEN_PEPPER` | ✅ | — | Secret for token hashing (≥ 32 chars) |
| `APP_URL` | ✅ | `http://localhost:3000` | Public HTTPS URL (used in QR codes) |
| `MAX_PARTICIPANTS` | ❌ | `500` | Max participants per quiz |
| `QUIZ_DURATION_SECONDS` | ❌ | `7200` | Default quiz duration (host can override per quiz) |
| `QUESTION_COUNT` | ❌ | `25` | Questions per quiz |
| `LOG_LEVEL` | ❌ | `info` | `debug` / `info` / `warn` / `error` |
| `NODE_ENV` | ❌ | `development` | Set to `production` for prod deployments |

**Generate a secure TOKEN_PEPPER:**
```bash
node -e "console.log(require('crypto').randomBytes(36).toString('base64url'))"
```

---

## 7. Post-Deploy Verification Checklist

Run these checks after every new deployment:

```bash
# 1. Health check — should return { "status": "ok", "db": "ok" }
curl https://your-app.com/api/v1/health

# 2. Validate all 100 questions are in the DB
npm run questions:validate

# 3. Create a test quiz
curl -X POST https://your-app.com/api/v1/quizzes \
  -H "Content-Type: application/json" \
  -d '{"title": "Test", "durationSeconds": 300}'
```

Manual checks:
- [ ] Landing page loads at `https://your-app.com`
- [ ] `/host/new` — Create a quiz, set a custom duration
- [ ] `/join` — Join with a room code from a phone
- [ ] QR code scan works
- [ ] Start quiz → questions appear on phone
- [ ] Submit answers → leaderboard appears
- [ ] HTTPS padlock visible in browser

---

## 8. Event-Day Operations Guide

### One hour before the event

- [ ] Run health check: `curl https://your-app.com/api/v1/health`
- [ ] Create a **test quiz** (5-minute duration) and do a full dry run
- [ ] Test on the **actual event Wi-Fi** — not your laptop hotspot
- [ ] Ensure the MC/host has the link: `https://your-app.com/host/new`
- [ ] Have the join URL ready to display: `https://your-app.com/join`

### During the event

1. **Host** opens `https://your-app.com/host/new`
2. Optionally sets a quiz title and custom **duration** (e.g., 30 minutes)
3. Clicks **"Generate Quiz Room"** → a 6-letter room code appears (e.g., `MF4F2G`)
4. **Participants** go to `https://your-app.com/join` (or scan QR code)
5. They enter the room code and their display name
6. Host monitors the **participant count** in the lobby
7. When everyone is in, host clicks **"Start Quiz"** — the timer starts
8. Monitor the **live dashboard** to see progress
9. When done (or time is up), host clicks **"End Quiz"**
10. The **final leaderboard** appears for everyone instantly

### After the event

```bash
# Delete quizzes older than 7 days
tsx scripts/cleanup-old-quizzes.ts --days 7 --dry-run  # preview first
tsx scripts/cleanup-old-quizzes.ts --days 7             # then delete
```

---

## 9. Updating the App

### On Vercel / Railway

Simply push to `main`:
```bash
git add .
git commit -m "Update: description of changes"
git push
```

Vercel and Railway auto-redeploy on push.

### On VPS

```bash
cd /var/www/quiz
git pull origin main
npm install --omit=dev
npm run build
pm2 restart ipl-quiz
```

If the schema changed:
```bash
npx prisma db push   # or: npx prisma migrate deploy
```

---

## 10. Troubleshooting

### ❌ Health check returns `"db": "error"`

**Cause:** Database connection failed.

**Fix:**
- Verify `DATABASE_URL` in your env vars
- Ensure the database service is running: `systemctl status postgresql`
- Check firewall allows port 5432 (local only for security)

---

### ❌ "Cannot find module '@prisma/client'"

**Cause:** Prisma client not generated.

**Fix:**
```bash
npx prisma generate
```

---

### ❌ Questions not showing in quiz

**Cause:** Database not seeded.

**Fix:**
```bash
npm run questions:parse
tsx prisma/seed.ts
npm run questions:validate
```

---

### ❌ QR code doesn't work on phones

**Cause:** `APP_URL` is set to `localhost` or HTTP instead of HTTPS.

**Fix:** Set `APP_URL` to your public HTTPS URL in environment variables and redeploy.

---

### ❌ "Failed to create quiz" on host page

**Cause:** Rate limit (max 10 quiz creations per IP per minute) or DB error.

**Fix:** Wait 1 minute and try again. Check server logs for the real error.

---

### ❌ App crashes on Vercel with "Function timeout"

**Cause:** Database query taking too long.

**Fix:**
- Use a database in the same region as your Vercel deployment
- Use `pgbouncer` connection pooling for Postgres (add `?pgbouncer=true` to DATABASE_URL)

---

### Viewing logs

```bash
# PM2 (VPS)
pm2 logs ipl-quiz

# Vercel
vercel logs

# Railway
railway logs
```

---

*For more details see [`docs/PRD.md`](./PRD.md) and [`docs/Workflow.md`](./Workflow.md).*
