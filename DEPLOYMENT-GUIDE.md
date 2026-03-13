# Deployment Guide: Vercel + MongoDB Atlas

Complete step-by-step guide to deploy your portfolio to Vercel with MongoDB Atlas as the database.

**Total time: ~20 minutes | Cost: Free**

---

## Step 1: Set Up MongoDB Atlas (Free Tier)

### 1.1 Create an account
1. Go to **https://www.mongodb.com/cloud/atlas**
2. Click **"Try Free"** and sign up (Google/GitHub login works)

### 1.2 Create a free cluster
1. Choose **M0 Free Tier**
2. Select provider: **AWS**
3. Select region: **Frankfurt (eu-central-1)** (closest to Munich)
4. Cluster name: `hamdi-portfolio`
5. Click **"Create Deployment"**

### 1.3 Create a database user
1. Go to **Database Access** (left sidebar)
2. Click **"Add New Database User"**
3. Authentication: **Password**
4. Username: `hamdi-portfolio-user`
5. Password: Click **"Autogenerate Secure Password"** → **copy this password!**
6. Database User Privileges: **Read and write to any database**
7. Click **"Add User"**

### 1.4 Allow network access
1. Go to **Network Access** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - This is required for Vercel's serverless functions
4. Click **"Confirm"**

### 1.5 Get your connection string
1. Go to **Database** (left sidebar)
2. Click **"Connect"** on your cluster
3. Choose **"Drivers"**
4. Copy the connection string — it looks like:
```
mongodb+srv://hamdi-portfolio-user:<password>@hamdi-portfolio.xxxxx.mongodb.net/?retryWrites=true&w=majority
```
5. Replace `<password>` with the password from step 1.3
6. Add the database name before the `?`:
```
mongodb+srv://hamdi-portfolio-user:YOUR_PASSWORD@hamdi-portfolio.xxxxx.mongodb.net/hamdi-portfolio?retryWrites=true&w=majority
```

**Save this connection string — you'll need it in Step 3.**

---

## Step 2: Prepare Your Next.js Project

### 2.1 Project structure
Your project should look like this:

```
hamdi-portfolio/
├── .env.local                 ← MongoDB connection string (local only)
├── .gitignore
├── next.config.js
├── package.json
├── vercel.json
├── lib/
│   ├── mongodb.js             ← DB connection utility
│   └── api.js                 ← Client-side API helpers
├── models/
│   ├── Article.js             ← Article schema
│   └── Project.js             ← Project schema
├── pages/
│   ├── index.js               ← Your 3D portfolio page
│   └── api/
│       ├── articles/
│       │   ├── index.js       ← GET list, POST create
│       │   └── [slug].js      ← GET, PUT, DELETE
│       └── projects/
│           ├── index.js       ← GET list, POST create
│           └── [slug].js      ← GET, PUT, DELETE
├── public/
│   └── profile.jpg            ← Your photo
└── scripts/
    └── seed.js                ← Database seeder
```

### 2.2 Set up locally first
```bash
# Create the project
npx create-next-app@latest hamdi-portfolio
cd hamdi-portfolio

# Install dependencies
npm install mongoose three
npm install -D dotenv

# Create your .env.local file
echo 'MONGODB_URI=mongodb+srv://hamdi-portfolio-user:YOUR_PASSWORD@hamdi-portfolio.xxxxx.mongodb.net/hamdi-portfolio?retryWrites=true&w=majority' > .env.local
```

### 2.3 Copy the files from the database zip
Extract `portfolio-mongodb-setup.zip` into your project root. The files will go into `lib/`, `models/`, `pages/api/`, and `scripts/`.

### 2.4 Add the portfolio page
Copy `portfolio.jsx` as your main page:
```bash
# If using Pages Router:
cp portfolio.jsx pages/index.jsx

# If using App Router:
mkdir -p app
# Rename the export and add "use client" at the top
```

### 2.5 Make sure .gitignore includes:
```
node_modules
.next
.env.local
.env*.local
```

### 2.6 Seed your database locally
```bash
node --experimental-modules scripts/seed.js
```
You should see:
```
✅ Connected to MongoDB
🗑️  Cleared existing articles and projects
📝 Inserted 4 articles
📦 Inserted 6 projects
🎉 Database seeded successfully!
```

### 2.7 Test locally
```bash
npm run dev
```
Visit http://localhost:3000 — your portfolio should load with data from MongoDB.

---

## Step 3: Deploy to Vercel

### 3.1 Push to GitHub
```bash
# Initialize git
git init
git add .
git commit -m "Initial portfolio with MongoDB backend"

# Create a repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/hamdi-portfolio.git
git branch -M main
git push -u origin main
```

### 3.2 Connect to Vercel
1. Go to **https://vercel.com** and sign up with GitHub
2. Click **"Add New Project"**
3. Import your `hamdi-portfolio` repository
4. Vercel auto-detects Next.js — leave the defaults

### 3.3 Add environment variables (critical!)
Before clicking Deploy:
1. Expand **"Environment Variables"**
2. Add your MongoDB connection string:

| Name          | Value                                              |
|---------------|---------------------------------------------------|
| `MONGODB_URI` | `mongodb+srv://hamdi-portfolio-user:YOUR_PASSWORD@hamdi-portfolio.xxxxx.mongodb.net/hamdi-portfolio?retryWrites=true&w=majority` |

3. Make sure it's enabled for **Production**, **Preview**, and **Development**

### 3.4 Deploy!
Click **"Deploy"** — Vercel will:
1. Clone your repo
2. Install dependencies
3. Build the Next.js app
4. Deploy to their global CDN

In ~60 seconds you'll get a URL like: **https://hamdi-portfolio.vercel.app**

### 3.5 Add custom domain (optional)
1. In Vercel dashboard → your project → **Settings** → **Domains**
2. Add `hamdisevketbeyoglu.com`
3. Vercel gives you DNS records to add at your domain registrar:
   - **Type:** CNAME
   - **Name:** www
   - **Value:** cname.vercel-dns.com
   - **Type:** A
   - **Name:** @
   - **Value:** 76.76.21.21

---

## Step 4: Seed Production Database

After your first deploy, seed the production database:

```bash
# Option A: Run seed with production URI
MONGODB_URI="mongodb+srv://hamdi-portfolio-user:YOUR_PASSWORD@hamdi-portfolio.xxxxx.mongodb.net/hamdi-portfolio?retryWrites=true&w=majority" node --experimental-modules scripts/seed.js

# Option B: Use Vercel CLI
npx vercel env pull .env.local
node --experimental-modules scripts/seed.js
```

---

## Step 5: Verify Everything Works

### Test the API endpoints:
```bash
# Replace with your actual Vercel URL
BASE_URL="https://hamdi-portfolio.vercel.app"

# List articles
curl "$BASE_URL/api/articles" | jq

# List projects
curl "$BASE_URL/api/projects" | jq

# Get single article
curl "$BASE_URL/api/articles/extending-d365-fo-chain-of-command" | jq

# Create a new article
curl -X POST "$BASE_URL/api/articles" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Cloud Article",
    "excerpt": "Written and stored in MongoDB Atlas!",
    "tags": ["D365", "Cloud"],
    "status": "published"
  }' | jq
```

---

## Architecture Overview

```
┌─────────────┐     ┌──────────────────┐     ┌────────────────┐
│   Browser    │────▶│  Vercel (Edge)   │────▶│ MongoDB Atlas  │
│             │     │                  │     │  (Frankfurt)   │
│  3D Portfolio│◀────│  Next.js SSR     │◀────│  Free M0 Tier  │
│  + React    │     │  + API Routes    │     │                │
└─────────────┘     └──────────────────┘     └────────────────┘
                           │
                    Vercel CDN (Global)
                    - Static assets cached
                    - API responses cached 60s
                    - Automatic HTTPS
```

**How it works:**
1. User visits your site → Vercel serves the static 3D portfolio instantly from CDN
2. Portfolio loads → calls `/api/articles` and `/api/projects`
3. API routes connect to MongoDB Atlas → return JSON data
4. React renders articles & projects dynamically
5. Subsequent visits use cached responses (60s TTL)

---

## Automatic Deployments

Every time you push to GitHub, Vercel automatically:
1. Builds your project
2. Runs the Next.js build
3. Deploys to production (for `main` branch)
4. Creates preview URLs (for other branches/PRs)

```bash
# Make a change and deploy
git add .
git commit -m "Updated portfolio content"
git push
# → Vercel auto-deploys in ~60 seconds
```

---

## Cost Summary

| Service        | Tier    | Cost       | Limits                              |
|---------------|---------|------------|-------------------------------------|
| Vercel        | Hobby   | **Free**   | 100GB bandwidth, serverless functions |
| MongoDB Atlas | M0      | **Free**   | 512MB storage, shared cluster       |
| Custom Domain | —       | ~$10/year  | Optional                            |

**Free tier is more than enough for a portfolio site.** You'd need to upgrade only if you get 100k+ monthly visitors or store more than 512MB of data.

---

## Troubleshooting

### "MongoServerError: bad auth"
→ Check your password in the connection string. Make sure there are no special characters that need URL encoding.

### "MongoNetworkError: connection timed out"
→ Check MongoDB Atlas Network Access — make sure 0.0.0.0/0 is allowed.

### API returns 500 on Vercel but works locally
→ Check Vercel dashboard → Functions → Logs for the actual error. Usually a missing environment variable.

### Build fails on Vercel
→ Check Vercel build logs. Common issue: `mongoose` import error — make sure it's in `dependencies`, not `devDependencies`.

### Slow API responses
→ Make sure your Atlas cluster region matches Vercel's region (both in Frankfurt/eu-central-1 for lowest latency).

---

## Next Steps

After deployment, consider adding:

1. **Authentication** — Protect write endpoints with NextAuth.js
2. **Admin panel** — Build a `/admin` page to manage content from a UI
3. **GitHub auto-sync** — Cron job to update project stars/forks from GitHub API
4. **Image uploads** — Use Cloudinary (free tier) for article cover images
5. **Analytics** — Add Vercel Analytics (free) to track visitors
6. **SEO** — Add Open Graph meta tags for social sharing
